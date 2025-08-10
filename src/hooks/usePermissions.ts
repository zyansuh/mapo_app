import { useState, useEffect } from "react";
import { Platform, Alert, Linking } from "react-native";
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  openSettings,
  requestMultiple,
} from "react-native-permissions";

export interface PermissionStatus {
  callPhone: boolean;
  readCallLog: boolean;
  readPhoneState: boolean;
  allGranted: boolean;
}

export const usePermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
    callPhone: false,
    readCallLog: false,
    readPhoneState: false,
    allGranted: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Android 권한 정의
  const androidPermissions = {
    callPhone:
      Platform.OS === "android" ? PERMISSIONS.ANDROID.CALL_PHONE : null,
    readCallLog:
      Platform.OS === "android" ? PERMISSIONS.ANDROID.READ_CALL_LOG : null,
    readPhoneState:
      Platform.OS === "android" ? PERMISSIONS.ANDROID.READ_PHONE_STATE : null,
  };

  // 권한 상태 확인
  const checkPermissions = async () => {
    if (Platform.OS !== "android") {
      // iOS의 경우 기본적으로 허용
      setPermissionStatus({
        callPhone: true,
        readCallLog: true,
        readPhoneState: true,
        allGranted: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      if (
        !androidPermissions.callPhone ||
        !androidPermissions.readCallLog ||
        !androidPermissions.readPhoneState
      ) {
        throw new Error("Android permissions not available");
      }

      const results = await Promise.all([
        check(androidPermissions.callPhone),
        check(androidPermissions.readCallLog),
        check(androidPermissions.readPhoneState),
      ]);

      const [callPhoneResult, readCallLogResult, readPhoneStateResult] =
        results;

      const status = {
        callPhone: callPhoneResult === RESULTS.GRANTED,
        readCallLog: readCallLogResult === RESULTS.GRANTED,
        readPhoneState: readPhoneStateResult === RESULTS.GRANTED,
        allGranted: false,
      };

      status.allGranted =
        status.callPhone && status.readCallLog && status.readPhoneState;

      setPermissionStatus(status);
      return status;
    } catch (error) {
      console.error("권한 확인 오류:", error);
      return permissionStatus;
    } finally {
      setIsLoading(false);
    }
  };

  // 개별 권한 요청
  const requestPermission = async (
    permission: keyof typeof androidPermissions
  ) => {
    if (Platform.OS !== "android") return true;

    try {
      const permissionValue = androidPermissions[permission];
      if (!permissionValue) {
        throw new Error(`Permission ${permission} not available`);
      }
      const result = await request(permissionValue);
      return result === RESULTS.GRANTED;
    } catch (error) {
      console.error(`${permission} 권한 요청 오류:`, error);
      return false;
    }
  };

  // 모든 권한 요청
  const requestAllPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      setIsLoading(true);

      if (
        !androidPermissions.callPhone ||
        !androidPermissions.readCallLog ||
        !androidPermissions.readPhoneState
      ) {
        throw new Error("Android permissions not available");
      }

      const results = await requestMultiple([
        androidPermissions.callPhone,
        androidPermissions.readCallLog,
        androidPermissions.readPhoneState,
      ]);

      const status = {
        callPhone: results[androidPermissions.callPhone] === RESULTS.GRANTED,
        readCallLog:
          results[androidPermissions.readCallLog] === RESULTS.GRANTED,
        readPhoneState:
          results[androidPermissions.readPhoneState] === RESULTS.GRANTED,
        allGranted: false,
      };

      status.allGranted =
        status.callPhone && status.readCallLog && status.readPhoneState;

      setPermissionStatus(status);

      // 권한이 거부된 경우 알림 표시
      if (!status.allGranted) {
        const deniedPermissions = [];
        if (!status.callPhone) deniedPermissions.push("전화 걸기");
        if (!status.readCallLog) deniedPermissions.push("통화 기록 읽기");
        if (!status.readPhoneState) deniedPermissions.push("전화 상태 읽기");

        Alert.alert(
          "권한 필요",
          `다음 권한이 필요합니다:\n${deniedPermissions.join(
            ", "
          )}\n\n설정에서 권한을 허용해주세요.`,
          [
            { text: "취소", style: "cancel" },
            {
              text: "설정으로 이동",
              onPress: () => openSettings(),
            },
          ]
        );
      }

      return status.allGranted;
    } catch (error) {
      console.error("권한 요청 오류:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 권한 설정 화면으로 이동
  const openPermissionSettings = () => {
    Alert.alert("권한 설정", "앱 설정에서 필요한 권한을 허용해주세요.", [
      { text: "취소", style: "cancel" },
      {
        text: "설정으로 이동",
        onPress: () => openSettings(),
      },
    ]);
  };

  // 권한 상태에 따른 기능 제한 안내
  const getPermissionMessage = () => {
    if (permissionStatus.allGranted) {
      return "모든 권한이 허용되었습니다.";
    }

    const messages = [];
    if (!permissionStatus.callPhone) {
      messages.push("• 전화 걸기 권한이 필요합니다.");
    }
    if (!permissionStatus.readCallLog) {
      messages.push("• 통화 기록 읽기 권한이 필요합니다.");
    }
    if (!permissionStatus.readPhoneState) {
      messages.push("• 전화 상태 읽기 권한이 필요합니다.");
    }

    return messages.join("\n");
  };

  // 앱 초기화 시 권한 확인
  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissionStatus,
    isLoading,
    checkPermissions,
    requestPermission,
    requestAllPermissions,
    openPermissionSettings,
    getPermissionMessage,
  };
};
