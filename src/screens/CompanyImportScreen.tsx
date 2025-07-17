import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCompany } from "../hooks";
import { useTheme } from "../hooks/useTheme";
import {
  parseProvidedCompanies,
  getImportSummary,
} from "../utils/importCompanies";
import { RootStackParamList } from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CompanyImportScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { companies, addCompany } = useCompany();

  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);

  // 미리 파싱된 데이터 정보 가져오기
  const parsedCompanies = parseProvidedCompanies();
  const summary = getImportSummary(parsedCompanies);

  const handleImport = async () => {
    Alert.alert(
      "거래처 일괄 등록",
      `${summary.total}개의 거래처를 등록하시겠습니까?\n\n` +
        `• 고객사: ${summary.byType.고객사 || 0}개\n` +
        `• 협력업체: ${summary.byType.협력업체 || 0}개\n` +
        `• 공급업체: ${summary.byType.공급업체 || 0}개\n` +
        `• 기타: ${summary.byType.기타 || 0}개\n\n` +
        `⚠️ 중복된 데이터는 건너뛰어집니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "등록",
          onPress: performImport,
        },
      ]
    );
  };

  const performImport = async () => {
    setIsImporting(true);

    try {
      let successCount = 0;
      let skipCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const company of parsedCompanies) {
        try {
          // 중복 체크 (사업자번호 기준)
          const existingCompany = companies.find(
            (c) =>
              c.businessNumber === company.businessNumber &&
              company.businessNumber
          );

          if (existingCompany) {
            skipCount++;
            continue;
          }

          // 거래처 추가
          const result = await addCompany({
            name: company.name,
            type: company.type,
            region: company.region,
            status: company.status,
            address: company.address,
            phoneNumber: company.phoneNumber,
            email: company.email || "",
            businessNumber: company.businessNumber || "",
            contactPerson: company.contactPerson || "",
            contactPhone: company.contactPhone || "",
            memo: "",
            tags: [],
          });

          if (result) {
            successCount++;
          } else {
            errorCount++;
            errors.push(`${company.name}: 등록 실패`);
          }
        } catch (error) {
          errorCount++;
          errors.push(`${company.name}: ${error}`);
        }
      }

      setImportResults({
        total: parsedCompanies.length,
        success: successCount,
        skip: skipCount,
        error: errorCount,
        errors,
      });

      setImportComplete(true);

      Alert.alert(
        "등록 완료",
        `✅ 성공: ${successCount}개\n` +
          `⏭️ 중복 건너뛰기: ${skipCount}개\n` +
          `❌ 실패: ${errorCount}개\n\n` +
          "자세한 결과는 아래에서 확인하세요."
      );
    } catch (error) {
      Alert.alert("오류", "일괄 등록 중 오류가 발생했습니다.");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const renderImportSummary = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        등록 예정 데이터
      </Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: theme.colors.primary }]}>
            {summary.total}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            총 거래처
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#10b981" }]}>
            {summary.byType.고객사 || 0}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            고객사
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#f59e0b" }]}>
            {summary.byType.협력업체 || 0}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            협력업체
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#8b5cf6" }]}>
            {summary.byType.공급업체 || 0}
          </Text>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
          >
            공급업체
          </Text>
        </View>
      </View>

      <View style={styles.summaryDetails}>
        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            이메일 보유:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {summary.withEmail}개
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            전화번호 보유:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {summary.withPhone}개
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text
            style={[styles.detailLabel, { color: theme.colors.textSecondary }]}
          >
            담당자 연락처:
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            {summary.withContactPhone}개
          </Text>
        </View>
      </View>
    </View>
  );

  const renderImportResults = () => {
    if (!importComplete || !importResults) return null;

    return (
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          등록 결과
        </Text>

        <View style={styles.resultsGrid}>
          <View style={styles.resultItem}>
            <Text style={[styles.resultNumber, { color: "#10b981" }]}>
              {importResults.success}
            </Text>
            <Text
              style={[
                styles.resultLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              성공
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={[styles.resultNumber, { color: "#f59e0b" }]}>
              {importResults.skip}
            </Text>
            <Text
              style={[
                styles.resultLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              중복 건너뛰기
            </Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={[styles.resultNumber, { color: "#ef4444" }]}>
              {importResults.error}
            </Text>
            <Text
              style={[
                styles.resultLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              실패
            </Text>
          </View>
        </View>

        {importResults.errors.length > 0 && (
          <View style={styles.errorsList}>
            <Text style={[styles.errorsTitle, { color: theme.colors.error }]}>
              오류 목록:
            </Text>
            {importResults.errors
              .slice(0, 5)
              .map((error: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    styles.errorText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  • {error}
                </Text>
              ))}
            {importResults.errors.length > 5 && (
              <Text
                style={[
                  styles.errorText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ... 외 {importResults.errors.length - 5}개
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary]}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
            거래처 일괄 등록
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: theme.colors.white + "CC" },
            ]}
          >
            CSV 데이터 기반 대량 등록
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderImportSummary()}

        {!importComplete && (
          <View
            style={[styles.section, { backgroundColor: theme.colors.card }]}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              주의사항
            </Text>
            <Text
              style={[styles.noteText, { color: theme.colors.textSecondary }]}
            >
              • 사업자번호가 동일한 거래처는 중복으로 간주하여 건너뛰어집니다.
            </Text>
            <Text
              style={[styles.noteText, { color: theme.colors.textSecondary }]}
            >
              • 주소를 기반으로 지역이 자동 분류됩니다.
            </Text>
            <Text
              style={[styles.noteText, { color: theme.colors.textSecondary }]}
            >
              • 업체명을 기반으로 고객사/협력업체/공급업체가 자동 분류됩니다.
            </Text>
            <Text
              style={[styles.noteText, { color: theme.colors.textSecondary }]}
            >
              • 등록된 모든 거래처는 "활성" 상태로 설정됩니다.
            </Text>
          </View>
        )}

        {renderImportResults()}

        {!importComplete && (
          <TouchableOpacity
            style={[
              styles.importButton,
              {
                backgroundColor: isImporting
                  ? theme.colors.disabled
                  : theme.colors.primary,
                opacity: isImporting ? 0.7 : 1,
              },
            ]}
            onPress={handleImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : (
              <Ionicons
                name="cloud-upload"
                size={20}
                color={theme.colors.white}
              />
            )}
            <Text
              style={[styles.importButtonText, { color: theme.colors.white }]}
            >
              {isImporting
                ? "등록 중..."
                : `${summary.total}개 거래처 일괄 등록`}
            </Text>
          </TouchableOpacity>
        )}

        {importComplete && (
          <TouchableOpacity
            style={[styles.importButton, { backgroundColor: "#10b981" }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="list" size={20} color={theme.colors.white} />
            <Text
              style={[styles.importButtonText, { color: theme.colors.white }]}
            >
              뒤로 가기
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  summaryDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  resultsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  resultItem: {
    alignItems: "center",
  },
  resultNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultLabel: {
    fontSize: 12,
  },
  errorsList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  errorsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CompanyImportScreen;
