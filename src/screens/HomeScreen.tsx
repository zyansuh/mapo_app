import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCompany } from "../hooks/useCompany";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { useCallDetection } from "../hooks/useCallDetection";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { companies, getStats } = useCompany();
  const { callHistory, addSampleCallHistory } = usePhoneCall();
  const {
    isDetectionActive,
    unknownNumberCount,
    isAndroidSupported,
    startDetection,
    stopDetection,
    addTestUnknownNumber,
  } = useCallDetection();

  const stats = getStats();

  // 전화 감지 토글
  const toggleCallDetection = () => {
    if (isDetectionActive) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  // 거래처 등록 화면으로 이동
  const handleAddCompany = () => {
    navigation.navigate("CompanyEdit", {});
  };

  // 비즈니스 인사이트 제공
  const showBusinessInsights = () => {
    const favoriteCompanies = companies.filter((c) => c.isFavorite).length;
    const clientCompanies = stats.byType.고객사;
    const supplierCompanies = stats.byType.공급업체 + stats.byType.협력업체;

    Alert.alert(
      "비즈니스 인사이트",
      `📊 현재 현황 분석
      
💼 총 거래처: ${stats.total}개
• 고객사: ${clientCompanies}개
• 공급업체/협력업체: ${supplierCompanies}개
• 즐겨찾기: ${favoriteCompanies}개

📞 통화 활동
• 총 통화: ${callHistory.length}건
• 미처리 번호: ${unknownNumberCount}개

💡 추천 사항:
${clientCompanies === 0 ? "• 고객사 정보를 추가해보세요" : ""}
${callHistory.length < 10 ? "• 통화 기록이 부족합니다" : ""}
${unknownNumberCount > 0 ? "• 미지의 번호를 처리해주세요" : ""}`,
      [{ text: "확인" }]
    );
  };

  // 빠른 연락처 관리
  const quickContactActions = () => {
    Alert.alert("빠른 연락처 관리", "어떤 작업을 수행하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "즐겨찾기 연락처",
        onPress: () => {
          const favorites = companies.filter((c) => c.isFavorite);
          if (favorites.length === 0) {
            Alert.alert("알림", "즐겨찾기한 연락처가 없습니다.");
          } else {
            const list = favorites
              .map((c) => `• ${c.name} (${c.type})`)
              .join("\n");
            Alert.alert("즐겨찾기 연락처", list);
          }
        },
      },
      {
        text: "최근 통화 내역",
        onPress: () => {
          if (callHistory.length === 0) {
            Alert.alert("알림", "통화 기록이 없습니다.");
          } else {
            const recent = callHistory
              .slice(0, 5)
              .map((c) => `• ${c.companyName || "알 수 없음"} (${c.type})`)
              .join("\n");
            Alert.alert("최근 통화 내역", recent);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <LinearGradient
          colors={["#525252", "#404040"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.header, { paddingTop: 20 + insets.top }]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>비즈니스 관리</Text>
            <Text style={styles.appTitle}>Mapo</Text>
            <Text style={styles.subtitle}>스마트 연락처 및 통화 관리</Text>
          </View>
        </LinearGradient>

        {/* 비즈니스 대시보드 */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.sectionTitle}>오늘의 현황</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={showBusinessInsights}
            >
              <Ionicons name="business" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>총 거래처</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={quickContactActions}
            >
              <Ionicons name="call" size={24} color="#06b6d4" />
              <Text style={styles.statNumber}>{callHistory.length}</Text>
              <Text style={styles.statLabel}>통화 기록</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>
                {companies.filter((c) => c.isFavorite).length}
              </Text>
              <Text style={styles.statLabel}>즐겨찾기</Text>
            </View>
          </View>
        </View>

        {/* 거래처 유형별 현황 */}
        <View style={styles.businessTypeContainer}>
          <Text style={styles.sectionTitle}>거래처 유형별 현황</Text>
          <View style={styles.businessTypeGrid}>
            <View style={styles.businessTypeCard}>
              <View style={styles.businessTypeHeader}>
                <Ionicons name="people" size={20} color="#10b981" />
                <Text style={styles.businessTypeTitle}>고객사</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.고객사}
              </Text>
              <Text style={styles.businessTypeDesc}>매출 창출 고객</Text>
            </View>

            <View style={styles.businessTypeCard}>
              <View style={styles.businessTypeHeader}>
                <Ionicons name="people" size={20} color="#3b82f6" />
                <Text style={styles.businessTypeTitle}>협력업체</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.협력업체}
              </Text>
              <Text style={styles.businessTypeDesc}>파트너 업체</Text>
            </View>

            <View style={styles.businessTypeCard}>
              <View style={styles.businessTypeHeader}>
                <Ionicons name="cube" size={20} color="#f59e0b" />
                <Text style={styles.businessTypeTitle}>공급업체</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.공급업체}
              </Text>
              <Text style={styles.businessTypeDesc}>자재/서비스</Text>
            </View>
          </View>
        </View>

        {/* 비즈니스 도구 */}
        <View style={styles.toolsContainer}>
          <Text style={styles.sectionTitle}>비즈니스 도구</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={styles.toolCard}
              onPress={showBusinessInsights}
            >
              <Ionicons name="analytics" size={28} color="#8b5cf6" />
              <Text style={styles.toolTitle}>비즈니스 분석</Text>
              <Text style={styles.toolDesc}>거래처 현황 및 인사이트</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={quickContactActions}
            >
              <Ionicons name="person" size={28} color="#06b6d4" />
              <Text style={styles.toolTitle}>연락처 관리</Text>
              <Text style={styles.toolDesc}>즐겨찾기 및 통화 내역</Text>
            </TouchableOpacity>
          </View>

          {/* 거래처 등록 버튼 */}
          <TouchableOpacity
            style={styles.addCompanyButton}
            onPress={handleAddCompany}
          >
            <Ionicons name="add-circle" size={24} color="#ffffff" />
            <Text style={styles.addCompanyButtonText}>새 거래처 등록</Text>
          </TouchableOpacity>
        </View>

        {/* 통화 감지 설정 */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>통화 감지 설정</Text>
          <View
            style={[
              styles.settingsCard,
              isDetectionActive && styles.settingsCardActive,
            ]}
          >
            <View style={styles.settingsContent}>
              <View style={styles.settingsInfo}>
                <Ionicons
                  name={isDetectionActive ? "call" : "call-outline"}
                  size={24}
                  color={isDetectionActive ? "#10b981" : "#6b7280"}
                />
                <View style={styles.settingsText}>
                  <Text style={styles.settingsTitle}>자동 통화 감지</Text>
                  <Text style={styles.settingsSubtitle}>
                    {isAndroidSupported
                      ? isDetectionActive
                        ? "활성화됨"
                        : "비활성화됨"
                      : "Android에서만 지원"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.settingsToggle,
                  isDetectionActive && styles.settingsToggleActive,
                  !isAndroidSupported && styles.settingsToggleDisabled,
                ]}
                onPress={toggleCallDetection}
                disabled={!isAndroidSupported}
              >
                <Text
                  style={[
                    styles.settingsToggleText,
                    isDetectionActive && styles.settingsToggleTextActive,
                  ]}
                >
                  {isDetectionActive ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>
            </View>

            {unknownNumberCount > 0 && (
              <View style={styles.alertBanner}>
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text style={styles.alertText}>
                  {unknownNumberCount}개의 미등록 번호가 있습니다
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.bottomSpacer, { height: 80 + insets.bottom }]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // NEUTRAL_50
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // paddingTop은 동적으로 설정됨
  },
  headerContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
  },
  dashboardContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F5F5F5", // NEUTRAL_100
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#737373", // NEUTRAL_500
    textAlign: "center",
  },
  businessTypeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  businessTypeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  businessTypeCard: {
    flex: 1,
    backgroundColor: "#F5F5F5", // NEUTRAL_100
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  businessTypeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#404040", // NEUTRAL_700
    marginLeft: 6,
  },
  businessTypeNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginBottom: 4,
  },
  businessTypeDesc: {
    fontSize: 10,
    color: "#737373", // NEUTRAL_500
  },
  toolsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  toolCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  toolDesc: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  settingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsCardActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#10b981",
    borderWidth: 1,
  },
  settingsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsText: {
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  settingsToggle: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  settingsToggleActive: {
    backgroundColor: "#10b981",
  },
  settingsToggleDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.5,
  },
  settingsToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  settingsToggleTextActive: {
    color: "#ffffff",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  alertText: {
    fontSize: 12,
    color: "#f59e0b",
    marginLeft: 6,
    fontWeight: "500",
  },
  bottomSpacer: {
    // height는 동적으로 설정됨
  },
  addCompanyButton: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  addCompanyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
