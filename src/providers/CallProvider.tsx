import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { useCallDetection } from "../hooks/useCallDetection";
import { useCallAnalytics } from "../hooks/useCallAnalytics";
import { useCompany } from "../hooks/useCompany";
import { CallHistoryItem } from "../types";

interface CallContextType {
  // 전화 걸기
  makeCall: (phoneNumber: string, companyName?: string) => Promise<void>;

  // 통화 기록
  callHistory: CallHistoryItem[];
  clearCallHistory: () => void;
  deleteCallRecord: (id: string) => void;
  formatPhoneNumber: (phoneNumber: string) => string;

  // 전화 감지
  isDetectionActive: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  unknownNumbers: any[];
  unknownNumberCount: number;

  // 분석 데이터
  analytics: any;

  // 설정
  enableNotifications: boolean;
  setEnableNotifications: (enabled: boolean) => void;
  enableAutoDetection: boolean;
  setEnableAutoDetection: (enabled: boolean) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

interface CallProviderProps {
  children: React.ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const { companies } = useCompany();
  const {
    callHistory,
    makeCall,
    clearCallHistory,
    deleteCallRecord,
    formatPhoneNumber,
    addSampleCallHistory,
  } = usePhoneCall();

  const {
    isDetectionActive,
    startDetection,
    stopDetection,
    unknownNumbers,
    unknownNumberCount,
    addTestUnknownNumber,
  } = useCallDetection();

  const { analytics } = useCallAnalytics(callHistory, companies);

  // 설정 상태
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAutoDetection, setEnableAutoDetection] = useState(false);

  // 앱 시작 시 초기화
  useEffect(() => {
    initializeCallFeatures();
  }, []);

  // 자동 감지 설정에 따른 동작
  useEffect(() => {
    if (enableAutoDetection && !isDetectionActive) {
      startDetection();
    } else if (!enableAutoDetection && isDetectionActive) {
      stopDetection();
    }
  }, [enableAutoDetection, isDetectionActive, startDetection, stopDetection]);

  const initializeCallFeatures = () => {
    // 개발 환경에서 샘플 통화 기록 추가
    if (__DEV__ && callHistory.length === 0) {
      addSampleCallHistory();
    }

    // 권한 확인 및 설정
    checkPermissions();
  };

  const checkPermissions = async () => {
    if (Platform.OS === "android") {
      // Android에서 필요한 권한들
      // 실제 구현시에는 react-native-permissions 라이브러리 사용
      console.log("Checking call detection permissions...");
    }
  };

  // 향상된 전화 걸기 (알림 포함)
  const enhancedMakeCall = async (
    phoneNumber: string,
    companyName?: string
  ) => {
    try {
      await makeCall(phoneNumber, companyName);

      if (enableNotifications) {
        // 통화 후 알림 표시
        setTimeout(() => {
          Alert.alert(
            "통화 완료",
            `${companyName || phoneNumber}와의 통화가 기록되었습니다.`,
            [
              { text: "확인" },
              {
                text: "메모 추가",
                onPress: () => {
                  // 실제로는 메모 추가 모달을 열어야 함
                  Alert.alert("메모", "통화 메모 기능은 곧 추가될 예정입니다.");
                },
              },
            ]
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Enhanced call failed:", error);
    }
  };

  // 미지의 번호 감지 시뮬레이션
  const simulateIncomingCall = (phoneNumber: string) => {
    if (isDetectionActive) {
      const isKnownNumber = companies.some(
        (company) =>
          company.phoneNumber.replace(/[^0-9]/g, "") ===
          phoneNumber.replace(/[^0-9]/g, "")
      );

      if (!isKnownNumber) {
        addTestUnknownNumber(phoneNumber);

        if (enableNotifications) {
          Alert.alert(
            "미지의 번호",
            `${phoneNumber}에서 전화가 왔습니다.\n거래처로 등록하시겠습니까?`,
            [
              { text: "무시" },
              { text: "나중에" },
              {
                text: "등록",
                onPress: () => {
                  // 실제로는 거래처 등록 화면으로 이동
                  Alert.alert("등록", "거래처 등록 화면으로 이동합니다.");
                },
              },
            ]
          );
        }
      }
    }
  };

  // 테스트용 함수들 (개발 환경에서만 사용)
  const testFeatures = __DEV__
    ? {
        simulateIncomingCall,
        addTestCall: () => {
          const testNumbers = ["02-1234-5678", "010-9876-5432", "031-555-0123"];
          const randomNumber =
            testNumbers[Math.floor(Math.random() * testNumbers.length)];
          simulateIncomingCall(randomNumber);
        },
      }
    : {};

  const value: CallContextType = {
    // 전화 걸기
    makeCall: enhancedMakeCall,

    // 통화 기록
    callHistory,
    clearCallHistory,
    deleteCallRecord,
    formatPhoneNumber,

    // 전화 감지
    isDetectionActive,
    startDetection,
    stopDetection,
    unknownNumbers,
    unknownNumberCount,

    // 분석 데이터
    analytics,

    // 설정
    enableNotifications,
    setEnableNotifications,
    enableAutoDetection,
    setEnableAutoDetection,

    // 테스트 기능 (개발 환경에서만)
    ...testFeatures,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
