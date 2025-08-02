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

  // Phone detection 시작 (단순화된 버전)
  const startDetection = () => {
    if (!isAndroidSupported) {
      console.log("Call detection is only supported on Android");
      return;
    }

    setIsDetectionActive(true);
    console.log("Call detection started (simplified version)");
  };

  // Phone detection 중지
  const stopDetection = () => {
    setIsDetectionActive(false);
    console.log("Call detection stopped");
  };

  // Add unknown number for testing
  const addTestUnknownNumber = (phoneNumber: string) => {
    const unknownNumber: UnknownNumber = {
      id: Date.now().toString(),
      phoneNumber,
      timestamp: new Date(),
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

  // Count of unknown numbers
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
