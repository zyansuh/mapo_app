import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { formatCurrency, formatDate } from "../utils/format";

const CompanySalesDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const { companyData } = route.params;

  const [selectedTab, setSelectedTab] = useState<"products" | "monthly">(
    "products"
  );

  // 월별 통계 계산 (실제로는 전체 인보이스 데이터에서 계산해야 함)
  const monthlyStats = useMemo(() => {
    // 샘플 월별 데이터
    return [
      {
        month: "2024-01",
        totalAmount: 29000,
        taxableAmount: 0,
        taxFreeAmount: 29000,
        invoiceCount: 1,
      },
      {
        month: "2024-02",
        totalAmount: 0,
        taxableAmount: 0,
        taxFreeAmount: 0,
        invoiceCount: 0,
      },
      {
        month: "2024-03",
        totalAmount: 40000,
        taxableAmount: 22000,
        taxFreeAmount: 18000,
        invoiceCount: 1,
      },
      {
        month: "2024-04",
        totalAmount: 0,
        taxableAmount: 0,
        taxFreeAmount: 0,
        invoiceCount: 0,
      },
      {
        month: "2024-05",
        totalAmount: 0,
        taxableAmount: 0,
        taxFreeAmount: 0,
        invoiceCount: 0,
      },
      {
        month: "2024-06",
        totalAmount: 55800,
        taxableAmount: 19800,
        taxFreeAmount: 36000,
        invoiceCount: 1,
      },
    ];
  }, []);

  const renderTabButton = (tab: "products" | "monthly", title: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        selectedTab === tab && [
          styles.activeTab,
          { backgroundColor: COLORS.primary },
        ],
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text
        style={[
          styles.tabText,
          {
            color:
              selectedTab === tab
                ? COLORS.white
                : COLORS.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderProductsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* 과세 상품 */}
      <View
        style={[styles.productSection, { backgroundColor: COLORS.white }]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            과세 상품 (묵류)
          </Text>
          <Text style={[styles.sectionAmount, { color: COLORS.primary }]}>
            {formatCurrency(companyData.taxableAmount)}
          </Text>
        </View>

        {companyData.taxableProducts.length > 0 ? (
          companyData.taxableProducts.map((product: any, index: number) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: COLORS.text }]}
                >
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.productQuantity,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  {product.quantity}개
                </Text>
              </View>
              <Text
                style={[styles.productAmount, { color: COLORS.text }]}
              >
                {formatCurrency(product.amount)}
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: COLORS.textSecondary }]}
          >
            과세 상품 판매 내역이 없습니다
          </Text>
        )}
      </View>

      {/* 면세 상품 */}
      <View
        style={[styles.productSection, { backgroundColor: COLORS.white }]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            면세 상품 (두부, 콩나물)
          </Text>
          <Text style={[styles.sectionAmount, { color: COLORS.success }]}>
            {formatCurrency(companyData.taxFreeAmount)}
          </Text>
        </View>

        {companyData.taxFreeProducts.length > 0 ? (
          companyData.taxFreeProducts.map((product: any, index: number) => (
            <View key={index} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text
                  style={[styles.productName, { color: COLORS.text }]}
                >
                  {product.name}
                </Text>
                <Text
                  style={[
                    styles.productQuantity,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  {product.quantity}개
                </Text>
              </View>
              <Text
                style={[styles.productAmount, { color: COLORS.text }]}
              >
                {formatCurrency(product.amount)}
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={[styles.noDataText, { color: COLORS.textSecondary }]}
          >
            면세 상품 판매 내역이 없습니다
          </Text>
        )}
      </View>

      {/* 상품별 분석 */}
      <View
        style={[styles.analysisSection, { backgroundColor: COLORS.white }]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
          판매 분석
        </Text>

        <View style={styles.analysisRow}>
          <Text
            style={[
              styles.analysisLabel,
              { color: COLORS.textSecondary },
            ]}
          >
            과세 비율
          </Text>
          <Text style={[styles.analysisValue, { color: COLORS.primary }]}>
            {companyData.totalAmount > 0
              ? (
                  (companyData.taxableAmount / companyData.totalAmount) *
                  100
                ).toFixed(1)
              : "0"}
            %
          </Text>
        </View>

        <View style={styles.analysisRow}>
          <Text
            style={[
              styles.analysisLabel,
              { color: COLORS.textSecondary },
            ]}
          >
            면세 비율
          </Text>
          <Text style={[styles.analysisValue, { color: COLORS.success }]}>
            {companyData.totalAmount > 0
              ? (
                  (companyData.taxFreeAmount / companyData.totalAmount) *
                  100
                ).toFixed(1)
              : "0"}
            %
          </Text>
        </View>

        <View style={styles.analysisRow}>
          <Text
            style={[
              styles.analysisLabel,
              { color: COLORS.textSecondary },
            ]}
          >
            평균 주문 금액
          </Text>
          <Text style={[styles.analysisValue, { color: COLORS.text }]}>
            {companyData.invoiceCount > 0
              ? formatCurrency(
                  Math.round(companyData.totalAmount / companyData.invoiceCount)
                )
              : formatCurrency(0)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderMonthlyTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View
        style={[styles.monthlySection, { backgroundColor: COLORS.white }]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
          월별 매출 현황 (1~6월)
        </Text>

        {monthlyStats.map((monthData, index) => (
          <View key={index} style={styles.monthlyItem}>
            <View style={styles.monthHeader}>
              <Text style={[styles.monthTitle, { color: COLORS.text }]}>
                {monthData.month.split("-")[1]}월
              </Text>
              <Text style={[styles.monthTotal, { color: COLORS.text }]}>
                {formatCurrency(monthData.totalAmount)}
              </Text>
            </View>

            {monthData.totalAmount > 0 ? (
              <View style={styles.monthDetails}>
                <View style={styles.monthDetailRow}>
                  <Text
                    style={[
                      styles.monthDetailLabel,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    과세 상품
                  </Text>
                  <Text
                    style={[
                      styles.monthDetailValue,
                      { color: COLORS.primary },
                    ]}
                  >
                    {formatCurrency(monthData.taxableAmount)}
                  </Text>
                </View>

                <View style={styles.monthDetailRow}>
                  <Text
                    style={[
                      styles.monthDetailLabel,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    면세 상품
                  </Text>
                  <Text
                    style={[
                      styles.monthDetailValue,
                      { color: COLORS.success },
                    ]}
                  >
                    {formatCurrency(monthData.taxFreeAmount)}
                  </Text>
                </View>

                <View style={styles.monthDetailRow}>
                  <Text
                    style={[
                      styles.monthDetailLabel,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    계산서 수
                  </Text>
                  <Text
                    style={[
                      styles.monthDetailValue,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {monthData.invoiceCount}건
                  </Text>
                </View>
              </View>
            ) : (
              <Text
                style={[
                  styles.noSalesText,
                  { color: COLORS.textSecondary },
                ]}
              >
                해당 월 판매 내역 없음
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* 월별 분석 차트 영역 (나중에 차트 라이브러리로 구현 가능) */}
      <View
        style={[styles.chartSection, { backgroundColor: COLORS.white }]}
      >
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
          월별 추이
        </Text>
        <View style={styles.chartPlaceholder}>
          <Ionicons
            name="bar-chart-outline"
            size={50}
            color={COLORS.textSecondary}
          />
          <Text
            style={[
              styles.chartPlaceholderText,
              { color: COLORS.textSecondary },
            ]}
          >
            차트 기능은 추후 업데이트 예정입니다
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary + "DD"]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={[styles.headerTitle, { color: COLORS.white }]}>
                {companyData.companyName}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: COLORS.white + "CC" },
                ]}
              >
                매출 상세 내역
              </Text>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: COLORS.white + "CC" },
                ]}
              >
                총 매출
              </Text>
              <Text
                style={[styles.summaryValue, { color: COLORS.white }]}
              >
                {formatCurrency(companyData.totalAmount)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: COLORS.white + "CC" },
                ]}
              >
                계산서
              </Text>
              <Text
                style={[styles.summaryValue, { color: COLORS.white }]}
              >
                {companyData.invoiceCount}건
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text
                style={[
                  styles.summaryLabel,
                  { color: COLORS.white + "CC" },
                ]}
              >
                최근 거래
              </Text>
              <Text
                style={[styles.summaryValue, { color: COLORS.white }]}
              >
                {formatDate(companyData.lastInvoiceDate)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View
          style={[styles.content, { backgroundColor: COLORS.background }]}
        >
          {/* 탭 버튼 */}
          <View style={styles.tabContainer}>
            {renderTabButton("products", "상품별 분석")}
            {renderTabButton("monthly", "월별 분석")}
          </View>

          {/* 탭 내용 */}
          {selectedTab === "products"
            ? renderProductsTab()
            : renderMonthlyTab()}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeTab: {
    borderWidth: 0,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
  },
  productQuantity: {
    fontSize: 12,
    marginTop: 2,
  },
  productAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  noDataText: {
    fontSize: 14,
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  analysisSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  analysisLabel: {
    fontSize: 14,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  monthlySection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  monthTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  monthDetails: {
    paddingLeft: 15,
  },
  monthDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  monthDetailLabel: {
    fontSize: 13,
  },
  monthDetailValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  noSalesText: {
    fontSize: 13,
    fontStyle: "italic",
    paddingLeft: 15,
  },
  chartSection: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
  },
  chartPlaceholderText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default CompanySalesDetailScreen;
