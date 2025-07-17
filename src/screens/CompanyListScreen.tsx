import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useCompany } from "../hooks";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { Company } from "../types";
import { COLORS, SIZES } from "../constants";
import { Button } from "../components";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const CompanyListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { companies, loading, deleteCompany, toggleFavorite, refreshData } =
    useCompany();
  const { makeCall } = usePhoneCall();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleCompanyPress = (companyId: string) => {
    navigation.navigate("CompanyDetail", { companyId });
  };

  const handleAddPress = () => {
    navigation.navigate("CompanyEdit", {});
  };

  const handleDeletePress = (company: Company) => {
    Alert.alert(
      "거래처 삭제",
      `${company.name}을(를) 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => deleteCompany(company.id),
        },
      ]
    );
  };

  const handleToggleFavorite = (company: Company) => {
    toggleFavorite(company.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "고객사":
        return "#10b981"; // 녹색 - 매출
      case "협력업체":
        return "#3b82f6"; // 파란색 - 파트너
      case "공급업체":
        return "#f59e0b"; // 주황색 - 공급
      case "하청업체":
        return "#8b5cf6"; // 보라색 - 하청
      default:
        return "#6b7280"; // 회색 - 기타
    }
  };

  const getBusinessDescription = (type: string) => {
    switch (type) {
      case "고객사":
        return "💰 매출 창출";
      case "협력업체":
        return "🤝 파트너십";
      case "공급업체":
        return "📦 자재/서비스";
      case "하청업체":
        return "⚡ 외주";
      default:
        return "📋 일반";
    }
  };

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={styles.companyCard}
      onPress={() => handleCompanyPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.companyHeader}>
          <View style={styles.companyMainInfo}>
            <View style={styles.companyTitleRow}>
              <Text style={styles.companyName}>{item.name}</Text>
              {item.isFavorite && (
                <Ionicons name="star" size={16} color="#f59e0b" />
              )}
            </View>
            <Text style={styles.businessDescription}>
              {getBusinessDescription(item.type)}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleToggleFavorite(item)}
            >
              <Ionicons
                name={item.isFavorite ? "star" : "star-outline"}
                size={20}
                color={item.isFavorite ? "#f59e0b" : "#9ca3af"}
              />
            </TouchableOpacity>
            <View
              style={[
                styles.typeTag,
                { backgroundColor: getTypeColor(item.type) },
              ]}
            >
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.companyDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color="#6b7280" />
            <Text style={styles.companyAddress} numberOfLines={1}>
              {item.address || "주소 미등록"}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={14} color="#6b7280" />
            <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
          </View>

          {item.contactPerson && (
            <View style={styles.detailItem}>
              <Ionicons name="person-outline" size={14} color="#6b7280" />
              <Text style={styles.contactPerson}>{item.contactPerson}</Text>
            </View>
          )}

          {item.businessNumber && (
            <View style={styles.detailItem}>
              <Ionicons name="document-outline" size={14} color="#6b7280" />
              <Text style={styles.businessNumber}>
                사업자: {item.businessNumber}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <Text style={styles.createdDate}>
            등록일: {new Date(item.createdAt).toLocaleDateString("ko-KR")}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => makeCall(item.phoneNumber, item.name)}
            >
              <Ionicons name="call" size={16} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeletePress(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>등록된 거래처가 없습니다</Text>
      <Text style={styles.emptySubtitle}>
        첫 번째 거래처를 등록하고{"\n"}비즈니스 네트워크를 구축해보세요!
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handleAddPress}>
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>거래처 등록하기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#525252", "#404040"]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>거래처 관리</Text>
          <Text style={styles.headerSubtitle}>
            총 {companies.length}개 거래처 •{" "}
            {companies.filter((c) => c.isFavorite).length}개 즐겨찾기
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={companies}
          renderItem={renderCompanyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 100 + insets.bottom },
            companies.length === 0 && styles.emptyListContainer,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.WHITE}
            />
          }
          ListEmptyComponent={renderEmptyState}
        />
      </View>

      <View style={[styles.fab, { bottom: 80 + insets.bottom }]}>
        <TouchableOpacity style={styles.fabButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    // paddingBottom은 동적으로 설정됨
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  companyCard: {
    backgroundColor: "#F5F5F5", // NEUTRAL_100
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  companyMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginRight: 8,
    flex: 1,
  },
  businessDescription: {
    fontSize: 12,
    color: "#737373", // NEUTRAL_500
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  companyDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyAddress: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
    flex: 1,
  },
  phoneNumber: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
    fontWeight: "500",
  },
  contactPerson: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  businessNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  createdDate: {
    fontSize: 11,
    color: "#9ca3af",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    backgroundColor: "#10b981",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primaryButton: {
    backgroundColor: "#737373", // NEUTRAL_500 - 톤 다운된 회색
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    // bottom은 동적으로 설정됨
  },
  fabButton: {
    backgroundColor: "#737373", // NEUTRAL_500 - 톤 다운된 회색
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CompanyListScreen;
