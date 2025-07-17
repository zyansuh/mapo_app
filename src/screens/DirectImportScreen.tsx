import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { useCompany } from "../hooks/useCompany";
import {
  directImportToStorage,
  getImportStats,
} from "../utils/directImportCompanies";

const DirectImportScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { refreshData } = useCompany();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    skipped: number;
    errors: string[];
  } | null>(null);

  // 임포트 통계 가져오기
  const stats = getImportStats();

  const handleDirectImport = async () => {
    Alert.alert(
      "데이터베이스 직접 등록",
      `${stats.totalRows}개의 회사 데이터를 직접 데이터베이스에 등록하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "등록",
          style: "destructive",
          onPress: performDirectImport,
        },
      ]
    );
  };

  const performDirectImport = async () => {
    setIsImporting(true);
    setImportResult(null);

    try {
      const result = await directImportToStorage();
      setImportResult(result);

      // 회사 데이터 새로고침
      await refreshData();

      Alert.alert(
        "등록 완료",
        `✅ 데이터베이스 직접 등록이 완료되었습니다!\n\n` +
          `• 성공: ${result.success}개\n` +
          `• 중복 스킵: ${result.skipped}개\n` +
          `• 오류: ${result.errors.length}개`,
        [
          {
            text: "확인",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("직접 임포트 오류:", error);
      Alert.alert(
        "오류 발생",
        "데이터 등록 중 오류가 발생했습니다. 다시 시도해주세요.",
        [{ text: "확인" }]
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight : insets.top,
        },
      ]}
    >
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          데이터베이스 직접 등록
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 안내 메시지 */}
        <View
          style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color={theme.colors.warning}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            이 기능은 CSV 데이터를 파싱하여 바로 데이터베이스(AsyncStorage)에
            저장합니다. 일괄 등록 화면을 거치지 않고 직접 저장됩니다.
          </Text>
        </View>

        {/* 데이터 미리보기 */}
        <View
          style={[
            styles.previewCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            📊 등록 예정 데이터
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {stats.totalRows}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                총 회사 수
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <Text style={[styles.subTitle, { color: theme.colors.text }]}>
              지역별 분포
            </Text>
            {Object.entries(stats.byRegion).map(([region, count]) => (
              <View key={region} style={styles.statRow}>
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  {region}
                </Text>
                <Text
                  style={[styles.statNumber, { color: theme.colors.primary }]}
                >
                  {count}개
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.statsGrid}>
            <Text style={[styles.subTitle, { color: theme.colors.text }]}>
              업체 유형별 분포
            </Text>
            {Object.entries(stats.byType).map(([type, count]) => (
              <View key={type} style={styles.statRow}>
                <Text style={[styles.statText, { color: theme.colors.text }]}>
                  {type}
                </Text>
                <Text
                  style={[styles.statNumber, { color: theme.colors.primary }]}
                >
                  {count}개
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 결과 표시 */}
        {importResult && (
          <View
            style={[
              styles.resultCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              ✅ 등록 결과
            </Text>

            <View style={styles.resultItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={theme.colors.success}
              />
              <Text style={[styles.resultText, { color: theme.colors.text }]}>
                성공: {importResult.success}개
              </Text>
            </View>

            <View style={styles.resultItem}>
              <Ionicons
                name="remove-circle"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={[styles.resultText, { color: theme.colors.text }]}>
                중복 스킵: {importResult.skipped}개
              </Text>
            </View>

            <View style={styles.resultItem}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.colors.error}
              />
              <Text style={[styles.resultText, { color: theme.colors.text }]}>
                오류: {importResult.errors.length}개
              </Text>
            </View>

            {importResult.errors.length > 0 && (
              <View style={styles.errorList}>
                <Text
                  style={[styles.errorTitle, { color: theme.colors.error }]}
                >
                  오류 내역:
                </Text>
                {importResult.errors.slice(0, 5).map((error, index) => (
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
                {importResult.errors.length > 5 && (
                  <Text
                    style={[
                      styles.errorText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    ... 외 {importResult.errors.length - 5}개
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* 실행 버튼 */}
        <TouchableOpacity
          style={[
            styles.importButton,
            {
              backgroundColor: isImporting
                ? theme.colors.textSecondary
                : theme.colors.primary,
            },
          ]}
          onPress={handleDirectImport}
          disabled={isImporting}
        >
          <Ionicons
            name={isImporting ? "hourglass" : "cloud-upload"}
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.importButtonText}>
            {isImporting ? "등록 중..." : "데이터베이스에 직접 등록"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 100 + insets.bottom }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 32,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  previewCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 36,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  statText: {
    fontSize: 14,
  },
  statNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  resultText: {
    marginLeft: 8,
    fontSize: 16,
  },
  errorList: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 2,
  },
  importButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  importButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

export default DirectImportScreen;
