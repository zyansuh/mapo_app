import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCompany } from "../hooks/useCompany";
import { useInvoice } from "../hooks/useInvoice";
import { useDelivery } from "../hooks/useDelivery";
import { COLORS } from "../styles/colors";
import {
  importCompaniesToDatabase,
  getImportStats,
} from "../utils/bulkImportCompanies";
import { resetAndReimportCompanies } from "../utils/resetImport";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { companies, getStats, refreshData } = useCompany();
  const { invoices } = useInvoice();
  const { stats: deliveryStats } = useDelivery();

  // getStats는 이미 계산된 객체이므로 직접 사용
  const stats = getStats;

  // 앱 시작 시 거래처 데이터 자동 임포트 (전화번호 포맷팅 업데이트)
  useEffect(() => {
    const autoImportCompanies = async () => {
      try {
        // 버전 체크를 위한 키
        const importVersion = await AsyncStorage.getItem("import_version");
        const currentVersion = "v2_phone_format"; // 전화번호 포맷팅 업데이트 버전

        if (importVersion === currentVersion) {
          console.log("최신 버전의 거래처 데이터가 이미 임포트되어 있습니다.");
          return;
        }

        console.log("거래처 데이터 업데이트를 시작합니다...");

        // 기존 데이터 삭제 후 재임포트
        const result = await resetAndReimportCompanies();

        if (result.success) {
          // 버전 정보 저장
          await AsyncStorage.setItem("import_version", currentVersion);

          // 회사 데이터 새로고침
          await refreshData();

          console.log(
            `✅ ${result.count}개의 거래처가 성공적으로 업데이트되었습니다!`
          );

          // 사용자에게 알림
          Alert.alert(
            "데이터 업데이트 완료",
            `${result.count}개의 거래처 데이터가 업데이트되었습니다.\n전화번호 포맷이 개선되었습니다.`,
            [{ text: "확인" }]
          );
        }

        if (result.errors.length > 0) {
          console.log(
            `⚠️ ${result.errors.length}개의 항목에서 오류가 발생했습니다.`
          );
        }
      } catch (error) {
        console.error("거래처 데이터 업데이트 중 오류:", error);
      }
    };

    autoImportCompanies();
  }, [refreshData]);

  // 과세/면세 계산서 통계 계산
  const invoiceStats = React.useMemo(() => {
    const taxableInvoices = invoices.filter((invoice) =>
      invoice.items.some((item) => item.taxType === "과세")
    );
    const taxFreeInvoices = invoices.filter((invoice) =>
      invoice.items.some((item) => item.taxType === "면세")
    );

    return {
      taxable: taxableInvoices.length,
      taxFree: taxFreeInvoices.length,
    };
  }, [invoices]);

  const menuItems = [
    {
      title: "거래처 관리",
      icon: "business" as const,
      color: COLORS.primary,
      onPress: () => navigation.jumpTo("CompanyList"),
      count: stats.total,
    },
    {
      title: "계산서 관리",
      icon: "document-text" as const,
      color: COLORS.warning,
      onPress: () => navigation.navigate("InvoiceManagement"),
      count: invoices.length,
    },
    {
      title: "과세 계산서",
      icon: "receipt" as const,
      color: COLORS.error,
      onPress: () =>
        navigation.navigate("InvoiceManagement", { filter: "과세" }),
      count: invoiceStats.taxable,
    },
    {
      title: "면세 계산서",
      icon: "receipt-outline" as const,
      color: COLORS.success,
      onPress: () =>
        navigation.navigate("InvoiceManagement", { filter: "면세" }),
      count: invoiceStats.taxFree,
    },
    {
      title: "배송 관리",
      icon: "car" as const,
      color: "#059669",
      onPress: () => navigation.navigate("DeliveryManagement"),
      count: deliveryStats.totalDeliveries,
    },
    {
      title: "매출 분석",
      icon: "bar-chart" as const,
      color: "#9333EA",
      onPress: () => navigation.navigate("CompanySalesAnalysis"),
      count: stats.total,
    },
  ];

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <SafeAreaView
        style={[styles.container, { backgroundColor: COLORS.background }]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary]}
          style={[
            styles.header,
            { paddingTop: Platform.OS === "android" ? 20 : insets.top },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: COLORS.white }]}>
              마포 비즈니스 매니저
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: COLORS.white + "CC" }]}
            >
              사업 관리의 모든 것
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: COLORS.text }]}>
              안녕하세요! 👋
            </Text>
            <Text
              style={[styles.welcomeSubtext, { color: COLORS.textSecondary }]}
            >
              오늘도 효율적인 사업 관리를 도와드리겠습니다.
            </Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              빠른 통계
            </Text>
            <View style={styles.statsGrid}>
              <View
                style={[styles.statCard, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.statNumber, { color: COLORS.primary }]}>
                  {stats.total}
                </Text>
                <Text
                  style={[styles.statLabel, { color: COLORS.textSecondary }]}
                >
                  총 거래처
                </Text>
              </View>
              <View
                style={[styles.statCard, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.statNumber, { color: COLORS.success }]}>
                  {invoices.length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: COLORS.textSecondary }]}
                >
                  총 계산서
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              주요 기능
            </Text>
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.menuItem, { backgroundColor: COLORS.white }]}
                  onPress={item.onPress}
                >
                  <View
                    style={[styles.menuIcon, { backgroundColor: item.color }]}
                  >
                    <Ionicons name={item.icon} size={24} color={COLORS.white} />
                  </View>
                  <Text style={[styles.menuTitle, { color: COLORS.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.menuCount, { color: COLORS.textSecondary }]}
                  >
                    {item.count}개
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              빠른 액션
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
              onPress={() => navigation.navigate("CompanyCreate")}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                새 거래처 추가
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 30,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  menuItem: {
    width: "47%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  menuCount: {
    fontSize: 14,
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default HomeScreen;
