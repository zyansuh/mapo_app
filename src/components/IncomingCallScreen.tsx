import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { IncomingCallData } from "../types";
import { COLORS, SIZES } from "../constants";

interface IncomingCallScreenProps {
  callData: IncomingCallData;
  onAccept: () => void;
  onReject: () => void;
}

const { width, height } = Dimensions.get("window");

export const IncomingCallScreen: React.FC<IncomingCallScreenProps> = ({
  callData,
  onAccept,
  onReject,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 화면 등장 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 펄스 애니메이션
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  const formatPhoneNumber = (phoneNumber: string) => {
    // 전화번호 포맷팅 (예: 010-1234-5678)
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
        7
      )}`;
    }
    return phoneNumber;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* 배경 오버레이 */}
      <View style={styles.overlay} />

      {/* 전화 정보 */}
      <View style={styles.callInfo}>
        <Text style={styles.incomingText}>수신 전화</Text>

        {/* 연락처 아바타 */}
        <Animated.View
          style={[
            styles.avatar,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.avatarText}>
            {callData.phoneNumber.charAt(0)}
          </Text>
        </Animated.View>

        {/* 전화번호 */}
        <Text style={styles.phoneNumber}>
          {formatPhoneNumber(callData.phoneNumber)}
        </Text>

        {/* 상태 */}
        <Text style={styles.status}>모바일</Text>
      </View>

      {/* 액션 버튼들 */}
      <View style={styles.actions}>
        {/* 거절 버튼 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
          activeOpacity={0.8}
        >
          <Text style={styles.rejectIcon}>✕</Text>
        </TouchableOpacity>

        {/* 수락 버튼 */}
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      {/* 추가 옵션 */}
      <View style={styles.additionalOptions}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>메시지</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>알림</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  callInfo: {
    alignItems: "center",
    zIndex: 1001,
  },
  incomingText: {
    fontSize: 18,
    color: COLORS.WHITE,
    marginBottom: 20,
    opacity: 0.8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: COLORS.WHITE,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.WHITE,
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    color: COLORS.WHITE,
    opacity: 0.7,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 60,
    zIndex: 1001,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  rejectButton: {
    backgroundColor: COLORS.ERROR,
  },
  acceptButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  rejectIcon: {
    fontSize: 30,
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  acceptIcon: {
    fontSize: 30,
  },
  additionalOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    zIndex: 1001,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  optionText: {
    color: COLORS.WHITE,
    fontSize: 14,
  },
});

export default IncomingCallScreen;
