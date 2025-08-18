import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/colors";
import { useCall } from "../providers/CallProvider";

const CallDetectionTestScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [testPhoneNumber, setTestPhoneNumber] = useState("010-9999-8888");

  const {
    isDetectionActive,
    startDetection,
    stopDetection,
    unknownNumbers,
    currentCall,
    getCallDetectionStats,
    permissionStatus,
    requestPermissions,
    addTestUnknownNumber,
    clearUnknownNumbers,
  } = useCall();

  const stats = getCallDetectionStats();

  // 전화 감지 토글
  const handleToggleDetection = async () => {
    if (isDetectionActive) {
      stopDetection();
    } else {
      if (!permissionStatus.allGranted) {
        const granted = await requestPermissions();
        if (!granted) return;
      }
      await startDetection();
    }
  };

  // 테스트 전화 시뮬레이션
  const handleSimulateCall = () => {
    if (!testPhoneNumber.trim()) {
      Alert.alert("오류", "전화번호를 입력해주세요.");
      return;
    }

    addTestUnknownNumber(testPhoneNumber);
    Alert.alert(
      "테스트 전화 시뮬레이션",
      `${testPhoneNumber}에서 전화가 온 것으로 시뮬레이션했습니다.`,
      [{ text: "확인" }]
    );
  };

  // 모든 기록 삭제
  const handleClearAll = () => {
    Alert.alert("기록 삭제", "모든 알 수 없는 번호 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: clearUnknownNumbers,
      },
    ]);
  };

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            전화 감지 테스트
          </Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.content}>
          {/* 전화 감지 상태 */}
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: isDetectionActive ? "#d1fae5" : "#fee2e2",
                borderColor: isDetectionActive ? "#059669" : "#dc2626",
              },
            ]}
          >
            <View style={styles.statusHeader}>
              <Ionicons
                name={isDetectionActive ? "radio" : "radio-outline"}
                size={24}
                color={isDetectionActive ? "#059669" : "#dc2626"}
              />
              <Text
                style={[
                  styles.statusTitle,
                  {
                    color: isDetectionActive ? "#059669" : "#dc2626",
                  },
                ]}
              >
                전화 감지 {isDetectionActive ? "활성" : "비활성"}
              </Text>
            </View>

            {currentCall && (
              <View style={styles.currentCallInfo}>
                <Text style={[styles.currentCallText, { color: "#059669" }]}>
                  📞 현재 통화: {currentCall.phoneNumber}
                </Text>
                <Text style={[styles.currentCallState, { color: "#6b7280" }]}>
                  상태: {currentCall.state}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.toggleButton,
                {
                  backgroundColor: isDetectionActive ? "#dc2626" : "#059669",
                },
              ]}
              onPress={handleToggleDetection}
            >
              <Text style={[styles.toggleButtonText, { color: COLORS.white }]}>
                {isDetectionActive ? "감지 중지" : "감지 시작"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 권한 상태 */}
          {!permissionStatus.allGranted && (
            <View
              style={[styles.permissionCard, { backgroundColor: "#fff3cd" }]}
            >
              <Ionicons name="warning-outline" size={20} color="#856404" />
              <Text style={[styles.permissionText, { color: "#856404" }]}>
                전화 감지를 위해서는 다음 권한이 필요합니다:
                {!permissionStatus.callPhone && "\n• 전화 걸기"}
                {!permissionStatus.readCallLog && "\n• 통화 기록 읽기"}
                {!permissionStatus.readPhoneState && "\n• 전화 상태 읽기"}
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermissions}
              >
                <Text
                  style={[
                    styles.permissionButtonText,
                    { color: COLORS.primary },
                  ]}
                >
                  권한 허용
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 통계 */}
          <View style={[styles.statsCard, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.cardTitle, { color: COLORS.text }]}>
              전화 감지 통계
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                  {stats.totalUnknownNumbers}
                </Text>
                <Text
                  style={[styles.statLabel, { color: COLORS.textSecondary }]}
                >
                  총 알 수 없는 번호
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: "#f59e0b" }]}>
                  {stats.todayUnknownNumbers}
                </Text>
                <Text
                  style={[styles.statLabel, { color: COLORS.textSecondary }]}
                >
                  오늘 감지된 번호
                </Text>
              </View>
            </View>
          </View>

          {/* 테스트 섹션 */}
          <View style={[styles.testCard, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.cardTitle, { color: COLORS.text }]}>
              전화 감지 테스트
            </Text>
            <Text
              style={[styles.testDescription, { color: COLORS.textSecondary }]}
            >
              실제 전화 없이 전화 감지 기능을 테스트할 수 있습니다.
            </Text>

            <View style={styles.testInputContainer}>
              <TextInput
                style={[styles.testInput, { color: COLORS.text }]}
                value={testPhoneNumber}
                onChangeText={setTestPhoneNumber}
                placeholder="테스트할 전화번호"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
              <TouchableOpacity
                style={[styles.testButton, { backgroundColor: COLORS.primary }]}
                onPress={handleSimulateCall}
              >
                <Text style={[styles.testButtonText, { color: COLORS.white }]}>
                  테스트
                </Text>
              </TouchableOpacity>
            </View>

            {unknownNumbers.length > 0 && (
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: COLORS.error }]}
                onPress={handleClearAll}
              >
                <Ionicons name="trash-outline" size={16} color={COLORS.white} />
                <Text style={[styles.clearButtonText, { color: COLORS.white }]}>
                  기록 삭제
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 알 수 없는 번호 목록 */}
          {unknownNumbers.length > 0 && (
            <View
              style={[styles.unknownCard, { backgroundColor: COLORS.white }]}
            >
              <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                알 수 없는 번호 ({unknownNumbers.length})
              </Text>
              {unknownNumbers.slice(0, 5).map((number, index) => (
                <View key={number.id} style={styles.unknownItem}>
                  <View style={styles.unknownInfo}>
                    <Text
                      style={[styles.unknownNumber, { color: COLORS.text }]}
                    >
                      {number.phoneNumber}
                    </Text>
                    <Text
                      style={[
                        styles.unknownTime,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {number.timestamp.toLocaleString("ko-KR")}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.unknownBadge,
                      { backgroundColor: "#f59e0b20" },
                    ]}
                  >
                    <Text
                      style={[styles.unknownBadgeText, { color: "#f59e0b" }]}
                    >
                      {number.callState}
                    </Text>
                  </View>
                </View>
              ))}
              {unknownNumbers.length > 5 && (
                <Text
                  style={[styles.moreText, { color: COLORS.textSecondary }]}
                >
                  +{unknownNumbers.length - 5}개 더
                </Text>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  currentCallInfo: {
    marginBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#059669",
  },
  currentCallText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  currentCallState: {
    fontSize: 14,
  },
  toggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  permissionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textAlign: "center",
  },
  testCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  testInputContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  testInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  testButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  unknownCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unknownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unknownInfo: {
    flex: 1,
  },
  unknownNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  unknownTime: {
    fontSize: 12,
  },
  unknownBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unknownBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreText: {
    fontSize: 14,
    textAlign: "center",
    paddingTop: 12,
    fontStyle: "italic",
  },
});

export default CallDetectionTestScreen;
