import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { useCallDetection } from "../hooks/useCallDetection";
import { useCallAnalytics } from "../hooks/useCallAnalytics";
import { useCompany } from "../hooks/useCompany";
import { CallHistoryItem } from "../types";

interface CallContextType {
  // Make phone call
  makeCall: (phoneNumber: string, companyName?: string) => Promise<void>;

  // Call history
  callHistory: CallHistoryItem[];
  clearCallHistory: () => void;
  deleteCallRecord: (id: string) => void;
  formatPhoneNumber: (phoneNumber: string) => string;

  // Phone detection
  isDetectionActive: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  unknownNumbers: any[];
  unknownNumberCount: number;

  // Analytics data
  analytics: any;

  // Settings
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

  // Settings 상태
  const [enableAutoDetection, setEnableAutoDetection] = useState(false);

  // Initialize on app start
  useEffect(() => {
    initializeCallFeatures();
  }, []);

  // Action based on auto detection settings
  useEffect(() => {
    if (enableAutoDetection && !isDetectionActive) {
      startDetection();
    } else if (!enableAutoDetection && isDetectionActive) {
      stopDetection();
    }
  }, [enableAutoDetection, isDetectionActive, startDetection, stopDetection]);

  const initializeCallFeatures = () => {
    // Add sample call history in development environment
    if (__DEV__ && callHistory.length === 0) {
      addSampleCallHistory();
    }

    // Permission check and setup
    checkPermissions();
  };

  const checkPermissions = async () => {
    if (Platform.OS === "android") {
      // Permissions required for Android
      // Use react-native-permissions library in actual implementation
      console.log("Checking call detection permissions...");
    }
  };

  // Enhanced phone calling
  const enhancedMakeCall = async (
    phoneNumber: string,
    companyName?: string
  ) => {
    try {
      await makeCall(phoneNumber, companyName);

      if (enableAutoDetection) {
        // Post-call processing
        setTimeout(() => {
          Alert.alert(
            "통화 완료",
            `${companyName || phoneNumber}와의 통화가 기록되었습니다.`,
            [
              { text: "확인" },
              {
                text: "메모 추가",
                onPress: () => {
                  // Actually should open memo add modal
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

  // Unknown number detection simulation
  const simulateIncomingCall = (phoneNumber: string) => {
    if (isDetectionActive) {
      const isKnownNumber = companies.some(
        (company) =>
          company.phoneNumber.replace(/[^0-9]/g, "") ===
          phoneNumber.replace(/[^0-9]/g, "")
      );

      if (!isKnownNumber) {
        addTestUnknownNumber(phoneNumber);

        if (enableAutoDetection) {
          Alert.alert(
            "미지의 번호",
            `${phoneNumber}에서 전화가 왔습니다.\n거래처로 등록하시겠습니까?`,
            [
              { text: "무시" },
              { text: "나중에" },
              {
                text: "등록",
                onPress: () => {
                  // Actually should navigate to company registration screen
                  Alert.alert("등록", "거래처 등록 화면으로 이동합니다.");
                },
              },
            ]
          );
        }
      }
    }
  };

  // Test functions (development environment only)
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
    // Make phone call
    makeCall: enhancedMakeCall,

    // Call history
    callHistory,
    clearCallHistory,
    deleteCallRecord,
    formatPhoneNumber,

    // Phone detection
    isDetectionActive,
    startDetection,
    stopDetection,
    unknownNumbers,
    unknownNumberCount,

    // Analytics data
    analytics,

    // Settings
    enableAutoDetection,
    setEnableAutoDetection,

    // Test functionality (development only)
    ...testFeatures,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
