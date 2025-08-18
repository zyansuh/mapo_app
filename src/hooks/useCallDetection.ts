import { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
// @ts-ignore
import CallDetectorManager from "react-native-call-detection";

interface UnknownNumber {
  id: string;
  phoneNumber: string;
  timestamp: Date;
  callState: "incoming" | "outgoing" | "disconnected" | "connected";
}

interface CallState {
  state: "incoming" | "outgoing" | "disconnected" | "connected";
  phoneNumber: string;
  timestamp: Date;
}

export const useCallDetection = () => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [unknownNumbers, setUnknownNumbers] = useState<UnknownNumber[]>([]);
  const [currentCall, setCurrentCall] = useState<CallState | null>(null);
  const [isAndroidSupported] = useState(Platform.OS === "android");
  const callDetectorRef = useRef<any>(null);

  // 전화 상태 변경 핸들러
  const handleCallStateChange = (state: string, phoneNumber: string) => {
    console.log("📞 Call state changed:", state, phoneNumber);

    const now = new Date();
    const callState: CallState = {
      state: state as any,
      phoneNumber: phoneNumber || "알 수 없음",
      timestamp: now,
    };

    setCurrentCall(callState);

    // 전화 감지 시 알 수 없는 번호를 목록에 추가
    if (state === "incoming" && phoneNumber) {
      const isUnknownNumber = !isKnownNumber(phoneNumber);

      if (isUnknownNumber) {
        const unknownNumber: UnknownNumber = {
          id: Date.now().toString(),
          phoneNumber,
          timestamp: now,
          callState: state as any,
        };

        setUnknownNumbers((prev) => {
          // 중복 방지
          const exists = prev.some((num) => num.phoneNumber === phoneNumber);
          if (exists) return prev;
          return [unknownNumber, ...prev];
        });

        // 사용자에게 알림 (옵션)
        Alert.alert("알 수 없는 번호", `${phoneNumber}에서 전화가 왔습니다.`, [
          { text: "확인", style: "default" },
          {
            text: "무시",
            style: "cancel",
            onPress: () => removeUnknownNumber(unknownNumber.id),
          },
        ]);
      }
    }

    // 통화 종료 시 상태 초기화
    if (state === "disconnected") {
      setCurrentCall(null);
    }
  };

  // 거래처 번호 목록을 저장하는 ref
  const companiesRef = useRef<any[]>([]);

  // 알려진 번호인지 확인 (거래처 번호와 비교)
  const isKnownNumber = (phoneNumber: string): boolean => {
    const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    // 기본 테스트 번호들
    const testKnownNumbers = ["010-1234-5678", "02-123-4567"];

    // 테스트 번호 체크
    const isTestKnown = testKnownNumbers.some(
      (known) => cleanPhoneNumber === known.replace(/[^0-9]/g, "")
    );

    if (isTestKnown) return true;

    // 거래처 번호 체크
    return companiesRef.current.some((company) => {
      const companyPhone = company.phoneNumber?.replace(/[^0-9]/g, "") || "";
      return companyPhone === cleanPhoneNumber;
    });
  };

  // Phone detection 시작
  const startDetection = async () => {
    if (!isAndroidSupported) {
      console.log("Call detection is only supported on Android");
      Alert.alert(
        "지원되지 않음",
        "전화 감지 기능은 Android에서만 지원됩니다.",
        [{ text: "확인" }]
      );
      return false;
    }

    try {
      if (callDetectorRef.current) {
        // 이미 실행 중이면 중지 후 재시작
        callDetectorRef.current.dispose();
      }

      // CallDetectorManager 초기화
      callDetectorRef.current = new CallDetectorManager(
        handleCallStateChange,
        false, // readPhoneNumber: false (권한 필요)
        () => {
          console.log("📞 CallDetectorManager initialized successfully");
          setIsDetectionActive(true);
        },
        (error: any) => {
          console.error("📞 CallDetectorManager error:", error);
          setIsDetectionActive(false);
          Alert.alert(
            "전화 감지 오류",
            "전화 감지 기능을 시작할 수 없습니다. 권한을 확인해주세요.",
            [{ text: "확인" }]
          );
        }
      );

      return true;
    } catch (error) {
      console.error("전화 감지 시작 오류:", error);
      setIsDetectionActive(false);
      Alert.alert("오류", "전화 감지 기능을 시작하는데 실패했습니다.", [
        { text: "확인" },
      ]);
      return false;
    }
  };

  // Phone detection 중지
  const stopDetection = () => {
    try {
      if (callDetectorRef.current) {
        callDetectorRef.current.dispose();
        callDetectorRef.current = null;
      }
      setIsDetectionActive(false);
      setCurrentCall(null);
      console.log("📞 Call detection stopped");
    } catch (error) {
      console.error("전화 감지 중지 오류:", error);
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Add unknown number for testing
  const addTestUnknownNumber = (phoneNumber: string) => {
    const unknownNumber: UnknownNumber = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
      callState: "incoming",
    };

    setUnknownNumbers((prev) => [unknownNumber, ...prev]);
  };

  // Remove unknown number
  const removeUnknownNumber = (id: string) => {
    setUnknownNumbers((prev) => prev.filter((num) => num.id !== id));
  };

  // Remove all unknown numbers
  const clearUnknownNumbers = () => {
    setUnknownNumbers([]);
  };

  // 거래처 번호와 비교하여 알려진 번호 체크 (향상된 버전)
  const checkAgainstCompanyNumbers = (companies: any[]) => {
    // 거래처 데이터 저장
    companiesRef.current = companies;

    // 거래처 데이터와 알 수 없는 번호들을 비교하여 일치하는 것들을 제거
    setUnknownNumbers((prev) =>
      prev.filter((unknown) => {
        const isKnown = companies.some((company) => {
          const companyPhone =
            company.phoneNumber?.replace(/[^0-9]/g, "") || "";
          const unknownPhone = unknown.phoneNumber.replace(/[^0-9]/g, "");
          return companyPhone === unknownPhone;
        });
        return !isKnown;
      })
    );
  };

  // 통계 정보
  const getCallDetectionStats = () => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayUnknown = unknownNumbers.filter(
      (call) => call.timestamp >= todayStart
    ).length;

    return {
      totalUnknownNumbers: unknownNumbers.length,
      todayUnknownNumbers: todayUnknown,
      isCurrentlyInCall: currentCall !== null,
      currentCallState: currentCall?.state || null,
    };
  };

  // Count of unknown numbers
  const unknownNumberCount = unknownNumbers.length;

  return {
    isDetectionActive,
    unknownNumbers,
    unknownNumberCount,
    currentCall,
    isAndroidSupported,
    startDetection,
    stopDetection,
    addTestUnknownNumber,
    removeUnknownNumber,
    clearUnknownNumbers,
    checkAgainstCompanyNumbers,
    getCallDetectionStats,
    isKnownNumber,
  };
};

export default useCallDetection;
