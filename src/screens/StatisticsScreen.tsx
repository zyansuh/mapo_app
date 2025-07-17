import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCompany } from "../hooks/useCompany";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { useCallAnalytics } from "../hooks/useCallAnalytics";
import { Company } from "../types";
import { StatisticsCharts } from "../components/charts/BusinessChart";
import { useCall } from "../providers/CallProvider";

const StatisticsScreen = () => {
  const insets = useSafeAreaInsets();
  const { companies, toggleFavorite } = useCompany();
  const { callHistory, analytics } = useCall();

  const [refreshing, setRefreshing] = useState(false);

  // 새로고침 핸들러
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // 즐겨찾기 토글 핸들러
  const handleToggleFavorite = (company: Company) => {
    toggleFavorite(company.id);
  };

  // 비즈니스 성과 계산
  const getBusinessPerformance = () => {
    const totalCompanies = companies.length;
    const activeClients = companies.filter((c) => c.type === "고객사").length;
    const suppliers = companies.filter((c) => c.type === "공급업체").length;
    const partners = companies.filter((c) => c.type === "협력업체").length;

    return {
      totalCompanies,
      activeClients,
      suppliers,
      partners,
      networkScore: Math.round((totalCompanies / 10) * 100), // 간단한 네트워크 점수
    };
  };

  const businessPerformance = getBusinessPerformance();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 헤더 */}
        <LinearGradient
          colors={["#525252", "#404040"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.header, { paddingTop: 20 + insets.top }]}
        >
          <Text style={styles.headerTitle}>비즈니스 분석</Text>
          <Text style={styles.headerSubtitle}>거래처 및 통화 현황 리포트</Text>
        </LinearGradient>

        {/* 핵심 지표 요약 */}
        <View style={styles.kpiContainer}>
          <Text style={styles.sectionTitle}>핵심 지표</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Ionicons name="trending-up" size={20} color="#10b981" />
                <Text style={styles.kpiValue}>
                  {businessPerformance.networkScore}%
                </Text>
              </View>
              <Text style={styles.kpiLabel}>네트워크 점수</Text>
              <Text style={styles.kpiDesc}>비즈니스 네트워크 강도</Text>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiHeader}>
                <Ionicons name="call" size={20} color="#3b82f6" />
                <Text style={styles.kpiValue}>{analytics.totalCalls}</Text>
              </View>
              <Text style={styles.kpiLabel}>총 통화</Text>
              <Text style={styles.kpiDesc}>전체 통화 활동</Text>
            </View>
          </View>
        </View>

        {/* 통화 활동 요약 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>통화 활동 현황</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="call-outline" size={18} color="#10b981" />
                </View>
                <Text style={styles.summaryNumber}>
                  {analytics.outgoingCalls}
                </Text>
                <Text style={styles.summaryLabel}>발신</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="call" size={18} color="#3b82f6" />
                </View>
                <Text style={styles.summaryNumber}>
                  {analytics.incomingCalls}
                </Text>
                <Text style={styles.summaryLabel}>수신</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={styles.summaryIconContainer}>
                  <Ionicons name="call-sharp" size={18} color="#f59e0b" />
                </View>
                <Text style={styles.summaryNumber}>
                  {analytics.missedCalls}
                </Text>
                <Text style={styles.summaryLabel}>부재중</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 거래처 유형별 분석 */}
        <View style={styles.businessAnalysisContainer}>
          <Text style={styles.sectionTitle}>거래처 포트폴리오</Text>
          <View style={styles.businessAnalysisGrid}>
            <View
              style={[
                styles.businessAnalysisCard,
                { borderLeftColor: "#10b981" },
              ]}
            >
              <Text style={styles.businessNumber}>
                {businessPerformance.activeClients}
              </Text>
              <Text style={styles.businessLabel}>고객사</Text>
              <Text style={styles.businessDesc}>💰 매출 기여</Text>
            </View>

            <View
              style={[
                styles.businessAnalysisCard,
                { borderLeftColor: "#f59e0b" },
              ]}
            >
              <Text style={styles.businessNumber}>
                {businessPerformance.suppliers}
              </Text>
              <Text style={styles.businessLabel}>공급업체</Text>
              <Text style={styles.businessDesc}>📦 자재/서비스</Text>
            </View>

            <View
              style={[
                styles.businessAnalysisCard,
                { borderLeftColor: "#3b82f6" },
              ]}
            >
              <Text style={styles.businessNumber}>
                {businessPerformance.partners}
              </Text>
              <Text style={styles.businessLabel}>협력업체</Text>
              <Text style={styles.businessDesc}>🤝 파트너십</Text>
            </View>
          </View>
        </View>

        {/* 통화 유형별 분포 */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>통화 유형별 분포</Text>
          <View style={styles.pieContainer}>
            <View style={styles.pieItem}>
              <View
                style={[styles.pieIndicator, { backgroundColor: "#10b981" }]}
              />
              <Text style={styles.pieLabel}>
                발신 통화: {analytics.outgoingCalls}건
              </Text>
              <Text style={styles.piePercentage}>
                {analytics.totalCalls > 0
                  ? `(${Math.round(
                      (analytics.outgoingCalls / analytics.totalCalls) * 100
                    )}%)`
                  : "(0%)"}
              </Text>
            </View>
            <View style={styles.pieItem}>
              <View
                style={[styles.pieIndicator, { backgroundColor: "#3b82f6" }]}
              />
              <Text style={styles.pieLabel}>
                수신 통화: {analytics.incomingCalls}건
              </Text>
              <Text style={styles.piePercentage}>
                {analytics.totalCalls > 0
                  ? `(${Math.round(
                      (analytics.incomingCalls / analytics.totalCalls) * 100
                    )}%)`
                  : "(0%)"}
              </Text>
            </View>
            <View style={styles.pieItem}>
              <View
                style={[styles.pieIndicator, { backgroundColor: "#f59e0b" }]}
              />
              <Text style={styles.pieLabel}>
                부재중 통화: {analytics.missedCalls}건
              </Text>
              <Text style={styles.piePercentage}>
                {analytics.totalCalls > 0
                  ? `(${Math.round(
                      (analytics.missedCalls / analytics.totalCalls) * 100
                    )}%)`
                  : "(0%)"}
              </Text>
            </View>
          </View>
        </View>

        {/* 즐겨찾기 거래처 */}
        <View style={styles.favoritesContainer}>
          <View style={styles.favoritesHeader}>
            <Text style={styles.sectionTitle}>핵심 거래처</Text>
            <Text style={styles.favoritesCount}>
              {analytics.favoriteCompanies.length}개
            </Text>
          </View>
          {analytics.favoriteCompanies.length > 0 ? (
            analytics.favoriteCompanies.map((company: any) => (
              <View key={company.id} style={styles.favoriteItem}>
                <View style={styles.favoriteInfo}>
                  <Text style={styles.favoriteCompanyName}>{company.name}</Text>
                  <View style={styles.favoriteDetails}>
                    <Text style={styles.favoriteCompanyType}>
                      {company.type}
                    </Text>
                    {company.contactPerson && (
                      <Text style={styles.favoriteContact}>
                        • {company.contactPerson}
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => handleToggleFavorite(company)}
                >
                  <Ionicons name="star" size={24} color="#f59e0b" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noFavoritesContainer}>
              <Ionicons name="star-outline" size={32} color="#9ca3af" />
              <Text style={styles.noFavoritesText}>
                핵심 거래처를 설정해보세요
              </Text>
              <Text style={styles.noFavoritesDesc}>
                자주 연락하는 중요한 거래처를{"\n"}즐겨찾기로 관리하세요
              </Text>
            </View>
          )}
        </View>

        {/* 통화 활발도 순위 */}
        <View style={styles.topCompaniesContainer}>
          <Text style={styles.sectionTitle}>통화 활발도 순위</Text>
          {analytics.mostContactedCompanies.length > 0 ? (
            analytics.mostContactedCompanies
              .slice(0, 5)
              .map((item: any, index: number) => (
                <View key={item.company.id} style={styles.topCompanyItem}>
                  <View
                    style={[
                      styles.rankBadge,
                      { backgroundColor: index < 3 ? "#f59e0b" : "#6b7280" },
                    ]}
                  >
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.topCompanyInfo}>
                    <Text style={styles.topCompanyName}>
                      {item.company.name}
                    </Text>
                    <Text style={styles.topCompanyType}>
                      {item.company.type}
                    </Text>
                  </View>
                  <View style={styles.callCountContainer}>
                    <Text style={styles.callCount}>{item.callCount}</Text>
                    <Text style={styles.callCountLabel}>통화</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteIconButton}
                    onPress={() => handleToggleFavorite(item.company)}
                  >
                    <Ionicons
                      name={item.company.isFavorite ? "star" : "star-outline"}
                      size={20}
                      color={item.company.isFavorite ? "#f59e0b" : "#9ca3af"}
                    />
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={32} color="#9ca3af" />
              <Text style={styles.noDataText}>통화 기록이 없습니다</Text>
              <Text style={styles.noDataDesc}>
                거래처와 통화를 시작하면{"\n"}활발도 분석을 확인할 수 있습니다
              </Text>
            </View>
          )}
        </View>

        {/* 월별 통화 추이 */}
        <View style={styles.monthlyContainer}>
          <Text style={styles.sectionTitle}>월별 통화 추이</Text>
          <View style={styles.monthlyStats}>
            {Object.entries(analytics.callsByMonth)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 6)
              .map(([month, count]: any) => (
                <View key={month} style={styles.monthlyItem}>
                  <Text style={styles.monthlyLabel}>
                    {month.split("-")[1]}월
                  </Text>
                  <Text style={styles.monthlyCount}>{String(count)}</Text>
                  <Text style={styles.monthlyUnit}>건</Text>
                </View>
              ))}
          </View>
          {Object.keys(analytics.callsByMonth).length === 0 && (
            <View style={styles.noDataContainer}>
              <Ionicons name="calendar-outline" size={32} color="#9ca3af" />
              <Text style={styles.noDataText}>월별 데이터가 없습니다</Text>
            </View>
          )}
        </View>

        {/* 시각화 차트 */}
        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>데이터 시각화</Text>
          <StatisticsCharts companies={companies} callHistory={callHistory} />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    textAlign: "center",
  },
  kpiContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginBottom: 12,
  },
  kpiGrid: {
    flexDirection: "row",
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  kpiLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  kpiDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  businessAnalysisContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  businessAnalysisGrid: {
    gap: 8,
  },
  businessAnalysisCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  businessLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  businessDesc: {
    fontSize: 12,
    color: "#6b7280",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  pieContainer: {
    gap: 8,
  },
  pieItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pieIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  pieLabel: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  piePercentage: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  favoritesContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoritesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  favoritesCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteCompanyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  favoriteDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteCompanyType: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  favoriteContact: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  noFavoritesContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noFavoritesText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 4,
  },
  noFavoritesDesc: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
  topCompaniesContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topCompanyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff",
  },
  topCompanyInfo: {
    flex: 1,
  },
  topCompanyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  topCompanyType: {
    fontSize: 12,
    color: "#6b7280",
  },
  callCountContainer: {
    alignItems: "center",
    marginRight: 12,
  },
  callCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  callCountLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  favoriteIconButton: {
    padding: 8,
  },
  noDataContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    marginBottom: 4,
  },
  noDataDesc: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 18,
  },
  monthlyContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  monthlyItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    minWidth: 60,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  monthlyLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 4,
    fontWeight: "500",
  },
  monthlyCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  monthlyUnit: {
    fontSize: 10,
    color: "#9ca3af",
  },
  chartsContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSpacer: {
    // height는 동적으로 설정됨
  },
});

export default StatisticsScreen;
