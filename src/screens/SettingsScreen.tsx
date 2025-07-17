import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
  Switch,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  Pressable,
} from "react-native";
import { ThemeMode } from "../types";
import { useCompany } from "../hooks/useCompany";
import { useTheme } from "../hooks/useTheme";

const SettingsScreen = () => {
  // 실제 테마 훅 사용
  const { theme, themeMode, setThemeMode } = useTheme();
  const { companies } = useCompany();

  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const themeOptions = [
    { value: "light", label: "라이트 모드", icon: "☀️" },
    { value: "dark", label: "다크 모드", icon: "🌙" },
    { value: "system", label: "시스템 설정", icon: "⚙️" },
  ];

  const handleThemeChange = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setThemeModalVisible(false);
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
  });

export default SettingsScreen;
