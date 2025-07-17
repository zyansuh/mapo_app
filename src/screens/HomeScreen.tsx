import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCompany } from "../hooks/useCompany";
import { useTheme } from "../hooks/useTheme";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { companies, getStats } = useCompany();
  const { theme } = useTheme();

  // getStats는 이미 계산된 객체이므로 직접 사용
  const stats = getStats;

  const menuItems = [
    {
      title: "거래처 관리",
      icon: "business" as const,
      color: theme.colors.primary,
      onPress: () => navigation.jumpTo("CompanyList"),
      count: stats.total,
    },
  ];

  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle={theme.mode === "dark" ? "light-content" : "light-content"}
      />
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primary]}
          style={[
            styles.header,
            { paddingTop: Platform.OS === "android" ? 20 : insets.top },
          ]}
        >
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
              마포 비즈니스 매니저
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.colors.white + "CC" },
              ]}
            >
              사업 관리의 모든 것
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              안녕하세요! 👋
            </Text>
            <Text
              style={[
                styles.welcomeSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              오늘도 효율적인 사업 관리를 도와드리겠습니다.
            </Text>
          </View>

          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              빠른 통계
            </Text>
            <View style={styles.statsGrid}>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={[styles.statNumber, { color: theme.colors.primary }]}
                >
                  {stats.total}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  총 거래처
                </Text>
              </View>
              <View
                style={[
                  styles.statCard,
                  { backgroundColor: theme.colors.card },
                ]}
              >
                <Text
                  style={[styles.statNumber, { color: theme.colors.success }]}
                >
                  {stats.favorites}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  즐겨찾기
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.menuSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              주요 기능
            </Text>
            <View style={styles.menuGrid}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    { backgroundColor: theme.colors.card },
                  ]}
                  onPress={item.onPress}
                >
                  <View
                    style={[styles.menuIcon, { backgroundColor: item.color }]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={theme.colors.white}
                    />
                  </View>
                  <Text
                    style={[styles.menuTitle, { color: theme.colors.text }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.menuCount,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {item.count}개
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              빠른 작업
            </Text>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() =>
                navigation.getParent()?.navigate("CompanyEdit", {})
              }
            >
              <Ionicons name="add" size={20} color={theme.colors.white} />
              <Text
                style={[styles.actionButtonText, { color: theme.colors.white }]}
              >
                새 거래처 등록
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
