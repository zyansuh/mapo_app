import { useState, useEffect } from "react";
import { Platform } from "react-native";

interface UnknownNumber {
  id: string;
  phoneNumber: string;
  timestamp: Date;
}

export const useCallDetection = () => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [unknownNumbers, setUnknownNumbers] = useState<UnknownNumber[]>([]);
  const [isAndroidSupported] = useState(Platform.OS === "android");

  // 전화 감지 시작 (단순화된 버전)
  const startDetection = () => {
    if (!isAndroidSupported) {
      console.log("Call detection is only supported on Android");
      return;
    }

    setIsDetectionActive(true);
    console.log("Call detection started (simplified version)");
  };

  // 전화 감지 중지
  const stopDetection = () => {
    setIsDetectionActive(false);
    console.log("Call detection stopped");
  };

  // 테스트용 미지의 번호 추가
  const addTestUnknownNumber = (phoneNumber: string) => {
    const unknownNumber: UnknownNumber = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
    };

    setUnknownNumbers((prev) => [unknownNumber, ...prev]);
  };

  // 미지의 번호 제거
  const removeUnknownNumber = (id: string) => {
    setUnknownNumbers((prev) => prev.filter((num) => num.id !== id));
  };

  // 모든 미지의 번호 제거
  const clearUnknownNumbers = () => {
    setUnknownNumbers([]);
  };

  // 미지의 번호 개수
  const unknownNumberCount = unknownNumbers.length;

  return {
    isDetectionActive,
    unknownNumbers,
    unknownNumberCount,
    isAndroidSupported,
    startDetection,
    stopDetection,
    addTestUnknownNumber,
    removeUnknownNumber,
    clearUnknownNumbers,
  };
};

export default useCallDetection;
