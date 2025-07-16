import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { ThemeMode, ExportOptions } from "../types";
import { exportService } from "../services/exportService";
import { useCompany } from "../hooks/useCompany";

export const SettingsScreen = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();
  const { companies } = useCompany();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    callAlerts: true,
    creditAlerts: true,
    deliveryAlerts: true,
  });

  const themeOptions = [
    { value: "light", label: "라이트 모드", icon: "☀️" },
    { value: "dark", label: "다크 모드", icon: "🌙" },
    { value: "system", label: "시스템 설정", icon: "⚙️" },
  ];

  const exportOptions = [
    {
      format: "excel",
      label: "Excel 파일",
      icon: "📊",
      description: ".xlsx 형식",
    },
    { format: "csv", label: "CSV 파일", icon: "📄", description: ".csv 형식" },
    {
      format: "json",
      label: "JSON 파일",
      icon: "🔧",
      description: ".json 형식",
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    setThemeModalVisible(false);
  };

  const handleExportData = () => {
    setExportModalVisible(true);
  };

  const performExport = async (format: "excel" | "csv" | "json") => {
    setExportModalVisible(false);

    try {
      const options: ExportOptions = {
        format: format,
        dataType: "all",
        includeDeleted: false,
      };

      const result = await exportService.exportData(
        companies,
        [], // TODO: 실제 외상 데이터 연결
        [], // TODO: 실제 배송 데이터 연결
        options
      );

      if (result.success) {
        Alert.alert(
          "내보내기 완료",
          `${result.recordCount}개의 데이터가 ${result.fileName} 파일로 내보내졌습니다.`
        );
      } else {
        Alert.alert("오류", result.error || "내보내기 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("오류", "내보내기 중 오류가 발생했습니다.");
    }
  };

  const exportToExcel = () => performExport("excel");
  const exportToCSV = () => performExport("csv");
  const exportToJSON = () => performExport("json");

  const handleBackup = () => {
    Alert.alert("백업", "데이터를 백업하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "백업", onPress: () => performBackup() },
    ]);
  };

  const performBackup = async () => {
    try {
      const result = await exportService.exportStatistics(companies, [], []);
      if (result.success) {
        Alert.alert(
          "백업 완료",
          `데이터가 ${result.fileName} 파일로 백업되었습니다.`
        );
      } else {
        Alert.alert(
          "백업 실패",
          result.error || "백업 중 오류가 발생했습니다."
        );
      }
    } catch (error) {
      Alert.alert("백업 실패", "백업 중 오류가 발생했습니다.");
    }
  };

  const styles = createStyles(theme.colors);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* 테마 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>테마 설정</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎨</Text>
              <Text style={styles.settingText}>테마</Text>
            </View>
            <Text style={styles.settingValue}>
              {themeOptions.find((option) => option.value === themeMode)?.label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>푸시 알림</Text>
            </View>
            <Switch
              value={notifications.pushEnabled}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, pushEnabled: value }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingText}>알림음</Text>
            </View>
            <Switch
              value={notifications.soundEnabled}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, soundEnabled: value }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📳</Text>
              <Text style={styles.settingText}>진동</Text>
            </View>
            <Switch
              value={notifications.vibrationEnabled}
              onValueChange={(value) =>
                setNotifications((prev) => ({
                  ...prev,
                  vibrationEnabled: value,
                }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📞</Text>
              <Text style={styles.settingText}>통화 알림</Text>
            </View>
            <Switch
              value={notifications.callAlerts}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, callAlerts: value }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💳</Text>
              <Text style={styles.settingText}>외상 알림</Text>
            </View>
            <Switch
              value={notifications.creditAlerts}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, creditAlerts: value }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📦</Text>
              <Text style={styles.settingText}>배송 알림</Text>
            </View>
            <Switch
              value={notifications.deliveryAlerts}
              onValueChange={(value) =>
                setNotifications((prev) => ({ ...prev, deliveryAlerts: value }))
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
            />
          </View>
        </View>

        {/* 데이터 관리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>데이터 관리</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📤</Text>
              <Text style={styles.settingText}>데이터 내보내기</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={handleBackup}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💾</Text>
              <Text style={styles.settingText}>데이터 백업</Text>
            </View>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📱</Text>
              <Text style={styles.settingText}>앱 버전</Text>
            </View>
            <Text style={styles.settingValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      {/* 테마 선택 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>테마 선택</Text>

            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  themeMode === option.value && styles.themeOptionSelected,
                ]}
                onPress={() => handleThemeChange(option.value as ThemeMode)}
              >
                <Text style={styles.themeIcon}>{option.icon}</Text>
                <Text style={styles.themeLabel}>{option.label}</Text>
                {themeMode === option.value && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 내보내기 형식 선택 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={exportModalVisible}
        onRequestClose={() => setExportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>내보내기 형식 선택</Text>

            {exportOptions.map((option) => (
              <TouchableOpacity
                key={option.format}
                style={styles.exportOption}
                onPress={() => performExport(option.format as any)}
              >
                <Text style={styles.themeIcon}>{option.icon}</Text>
                <View style={styles.exportOptionText}>
                  <Text style={styles.themeLabel}>{option.label}</Text>
                  <Text style={styles.exportDescription}>
                    {option.description}
                  </Text>
                </View>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setExportModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    settingValue: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    settingArrow: {
      fontSize: 18,
      color: colors.textSecondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      margin: 20,
      width: "80%",
      maxWidth: 300,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
      marginBottom: 20,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    themeOptionSelected: {
      backgroundColor: colors.primary + "20",
    },
    themeIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    themeLabel: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    checkMark: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "bold",
    },
    modalCloseButton: {
      backgroundColor: colors.border,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    modalCloseText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      fontWeight: "500",
    },
    exportOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exportOptionText: {
      flex: 1,
      marginLeft: 12,
    },
    exportDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });
