import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 리팩토링된 imports
import {
  useCompany,
  useInvoice,
  useDelivery,
  useLoading,
  useNotifications,
} from "../hooks";
import {
  COLORS,
  commonStyles,
  shadowStyles,
  scaledSizes,
  iconScale,
} from "../styles";
import {
  importCompaniesToDatabase,
  getImportStats,
} from "../utils/bulkImportCompanies";
import { resetAndReimportCompanies } from "../utils/resetImport";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // 리팩토링된 훅 사용
  const { companies, getStats, refreshData } = useCompany();
  const { invoices } = useInvoice();
  const { stats: deliveryStats } = useDelivery();
  const { loading } = useLoading();
  const { showSuccess, showError } = useNotifications();

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

// 리팩토링된 스타일 - 공통 스타일과 scaling 활용
const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: COLORS.surface,
  },

  header: {
    paddingHorizontal: scaledSizes.spacing.large,
    paddingBottom: scaledSizes.spacing.large,
  },

  headerContent: {
    alignItems: "center",
    marginTop: scaledSizes.spacing.large, // HERO 부분을 아래로 이동
  },

  headerTitle: {
    fontSize: scaledSizes.text.xlarge,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: scaledSizes.spacing.tiny,
  },

  headerSubtitle: {
    fontSize: scaledSizes.text.medium,
    color: COLORS.white,
  },

  content: {
    flex: 1,
    padding: scaledSizes.spacing.large,
  },

  welcomeSection: {
    marginBottom: scaledSizes.spacing.xxlarge,
  },

  welcomeText: {
    ...commonStyles.textTitle,
    fontSize: scaledSizes.text.large,
    marginBottom: scaledSizes.spacing.tiny,
  },

  welcomeSubtext: {
    ...commonStyles.textBody,
    fontSize: scaledSizes.text.medium,
    color: COLORS.textSecondary,
  },

  statsSection: {
    marginBottom: scaledSizes.spacing.xxlarge,
  },

  sectionTitle: {
    ...commonStyles.sectionTitle,
    fontSize: scaledSizes.text.large,
    marginBottom: scaledSizes.spacing.medium,
  },

  statsGrid: {
    ...commonStyles.row,
    gap: scaledSizes.spacing.medium,
  },

  statCard: {
    ...commonStyles.card,
    ...shadowStyles.small,
    flex: 1,
    padding: scaledSizes.spacing.large,
    alignItems: "center",
  },

  statNumber: {
    fontSize: scaledSizes.text.huge,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: scaledSizes.spacing.tiny,
  },

  statLabel: {
    ...commonStyles.textCaption,
    fontSize: scaledSizes.text.small,
  },

  menuSection: {
    marginBottom: scaledSizes.spacing.xxlarge,
  },

  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scaledSizes.spacing.medium,
  },

  menuItem: {
    ...commonStyles.card,
    ...shadowStyles.small,
    width: "47%",
    padding: scaledSizes.spacing.large,
    alignItems: "center",
  },

  menuIcon: {
    width: iconScale(48),
    height: iconScale(48),
    borderRadius: iconScale(24),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scaledSizes.spacing.normal,
  },

  menuTitle: {
    ...commonStyles.textSubtitle,
    fontSize: scaledSizes.text.medium,
    marginBottom: scaledSizes.spacing.tiny,
    textAlign: "center",
  },

  menuCount: {
    ...commonStyles.textCaption,
    fontSize: scaledSizes.text.small,
  },

  actionsSection: {
    marginBottom: scaledSizes.spacing.xxlarge,
  },

  actionButton: {
    ...commonStyles.button,
    ...commonStyles.rowCenter,
    padding: scaledSizes.spacing.medium,
    gap: scaledSizes.spacing.small,
  },

  actionButtonText: {
    ...commonStyles.buttonText,
    fontSize: scaledSizes.text.medium,
  },
});

export default HomeScreen;
