import { useState } from "react";
import { Alert, Linking } from "react-native";
import { CallHistoryItem } from "../types";

export const usePhoneCall = () => {
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [isCallInProgress, setIsCallInProgress] = useState(false);

  // Linking API를 사용한 전화 걸기
  const makeCall = async (phoneNumber: string, companyName?: string) => {
    try {
      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

      if (!cleanPhoneNumber) {
        Alert.alert("오류", "올바른 전화번호가 아닙니다.");
        return;
      }

      const url = `tel:${cleanPhoneNumber}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // 통화 기록 추가
        const callRecord: CallHistoryItem = {
          id: Date.now().toString(),
          phoneNumber: cleanPhoneNumber,
          companyName,
          timestamp: new Date(),
          type: "outgoing",
        };

        setCallHistory((prev) => [callRecord, ...prev].slice(0, 50));
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "이 기기에서는 전화를 걸 수 없습니다.");
      }
    } catch (error) {
      console.error("전화 걸기 오류:", error);
      Alert.alert("오류", "전화를 걸 수 없습니다.");
    }
  };

  // 통화 기록 삭제
  const clearCallHistory = () => {
    Alert.alert("통화 기록 삭제", "모든 통화 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => setCallHistory([]),
      },
    ]);
  };

  // 특정 통화 기록 삭제
  const deleteCallRecord = (id: string) => {
    setCallHistory((prev) => prev.filter((record) => record.id !== id));
  };

  // 전화번호 형식 정리
  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/[^0-9]/g, "");

    if (cleaned.length === 11 && cleaned.startsWith("010")) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;
    } else if (cleaned.length === 8) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }

    return phoneNumber;
  };

  // 통화 기록 필터링
  const getFilteredCallHistory = (
    type?: "outgoing" | "incoming" | "missed"
  ) => {
    if (!type) return callHistory;
    return callHistory.filter((record) => record.type === type);
  };

  // 테스트용 샘플 통화 기록 추가
  const addSampleCallHistory = () => {
    const sampleCalls: CallHistoryItem[] = [
      {
        id: "1",
        phoneNumber: "02-1234-5678",
        companyName: "(주)삼성전자",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        type: "outgoing",
      },
      {
        id: "2",
        phoneNumber: "031-987-6543",
        companyName: "엘지디스플레이",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        type: "incoming",
      },
      {
        id: "3",
        phoneNumber: "010-1234-5678",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        type: "missed",
      },
    ];

    setCallHistory(sampleCalls);
  };

  return {
    callHistory,
    isCallInProgress,
    makeCall,
    clearCallHistory,
    deleteCallRecord,
    formatPhoneNumber,
    getFilteredCallHistory,
    addSampleCallHistory,
  };
};

export default usePhoneCall;
