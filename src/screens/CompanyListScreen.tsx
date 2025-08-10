import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
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
import { formatPhoneNumber } from "../utils/format";

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const CompanyListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { companies, loading, deleteCompany, toggleFavorite, refreshData } =
    useCompany();
  const { makeCall } = usePhoneCall();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "recent" | "favorite">(
    "recent"
  );
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<string>("전체");

  // 검색, 필터링 및 정렬된 회사 목록
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies;

    // 즐겨찾기 필터 적용
    if (showFavoritesOnly) {
      filtered = filtered.filter((company) => company.isFavorite);
    }

    // 거래처 유형 필터 적용
    if (selectedCompanyType !== "전체") {
      filtered = filtered.filter(
        (company) => company.type === selectedCompanyType
      );
    }

    // 검색 필터 적용
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(query) ||
          company.address.toLowerCase().includes(query) ||
          (company.contactPerson &&
            company.contactPerson.toLowerCase().includes(query)) ||
          company.phoneNumber
            .replace(/[^0-9]/g, "")
            .includes(query.replace(/[^0-9]/g, "")) ||
          (company.businessNumber &&
            company.businessNumber
              .replace(/[^0-9]/g, "")
              .includes(query.replace(/[^0-9]/g, "")))
      );
    }

    // 정렬 적용 (즐겨찾기 필터가 꺼져있을 때는 즐겨찾기를 항상 상단에)
    const sorted = [...filtered].sort((a, b) => {
      // 즐겨찾기 필터가 꺼져있고, 일반 정렬일 때는 즐겨찾기를 먼저
      if (!showFavoritesOnly && sortBy !== "favorite") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
      }

      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "ko-KR");
        case "recent":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "favorite":
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [companies, searchQuery, sortBy, showFavoritesOnly, selectedCompanyType]);

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
        return "#6b7280"; // 회색 - 파트너
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
            <Text style={styles.phoneNumber}>
              {formatPhoneNumber(item.phoneNumber)}
            </Text>
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

  const renderEmptyState = () => {
    if (searchQuery.trim()) {
      // 검색 결과가 없는 경우
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
          <Text style={styles.emptySubtitle}>
            '{searchQuery}'에 대한 검색 결과를 찾을 수 없습니다.{"\n"}
            다른 검색어로 시도해보세요.
          </Text>
        </View>
      );
    }

    // 등록된 거래처가 없는 경우
    return (
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#525252", "#404040"]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <View style={styles.titleSection}>
              <Text style={styles.headerTitle}>거래처 관리</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setSearchVisible(!searchVisible)}
              >
                <Ionicons
                  name={searchVisible ? "close" : "search"}
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortButton}
                onPress={() => setSortModalVisible(true)}
              >
                <Ionicons name="funnel-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.favoriteFilterButton,
                  showFavoritesOnly && styles.favoriteFilterButtonActive,
                ]}
                onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Ionicons
                  name={showFavoritesOnly ? "star" : "star-outline"}
                  size={20}
                  color="#ffffff"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.headerSubtitle}>
              총{" "}
              {searchQuery || showFavoritesOnly
                ? filteredAndSortedCompanies.length
                : companies.length}
              개 거래처 • {companies.filter((c) => c.isFavorite).length}개
              즐겨찾기
              {showFavoritesOnly && " (즐겨찾기만 표시)"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* 검색 바 */}
      {searchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.GRAY}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="거래처명, 주소, 담당자, 전화번호로 검색..."
              placeholderTextColor={COLORS.GRAY}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Ionicons name="close-circle" size={20} color={COLORS.GRAY} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* 거래처 유형 필터 탭 */}
      <View style={styles.typeFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeFilterScrollContent}
        >
          {["전체", "고객사", "협력업체", "공급업체", "하청업체", "기타"].map(
            (type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeFilterTab,
                  selectedCompanyType === type && styles.typeFilterTabActive,
                ]}
                onPress={() => setSelectedCompanyType(type)}
              >
                <Text
                  style={[
                    styles.typeFilterText,
                    selectedCompanyType === type && styles.typeFilterTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredAndSortedCompanies}
          renderItem={renderCompanyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            { paddingBottom: 100 + insets.bottom },
            filteredAndSortedCompanies.length === 0 &&
              styles.emptyListContainer,
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

      <TouchableOpacity
        style={[styles.fab, { bottom: 20 + insets.bottom, right: 20 }]}
        onPress={handleAddPress}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>

      {/* 정렬 모달 */}
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>정렬 옵션</Text>
              <TouchableOpacity
                onPress={() => setSortModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={COLORS.BLACK} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "recent" && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortBy("recent");
                setSortModalVisible(false);
              }}
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={sortBy === "recent" ? COLORS.PRIMARY : COLORS.GRAY}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === "recent" && styles.selectedSortOptionText,
                ]}
              >
                최근 생성순
              </Text>
              {sortBy === "recent" && (
                <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "name" && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortBy("name");
                setSortModalVisible(false);
              }}
            >
              <Ionicons
                name="text-outline"
                size={20}
                color={sortBy === "name" ? COLORS.PRIMARY : COLORS.GRAY}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === "name" && styles.selectedSortOptionText,
                ]}
              >
                이름순 (가나다)
              </Text>
              {sortBy === "name" && (
                <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortBy === "favorite" && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortBy("favorite");
                setSortModalVisible(false);
              }}
            >
              <Ionicons
                name="star-outline"
                size={20}
                color={sortBy === "favorite" ? COLORS.PRIMARY : COLORS.GRAY}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  sortBy === "favorite" && styles.selectedSortOptionText,
                ]}
              >
                즐겨찾기 우선
              </Text>
              {sortBy === "favorite" && (
                <Ionicons name="checkmark" size={20} color={COLORS.PRIMARY} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  titleSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsRow: {
    width: "100%",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
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
  searchContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
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
  sortButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  modalCloseButton: {
    padding: 8,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
  },
  selectedSortOption: {
    backgroundColor: "#007AFF20",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  sortOptionText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    color: "#666666",
  },
  selectedSortOptionText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  favoriteFilterButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 16,
  },
  favoriteFilterButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  typeFilterContainer: {
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  typeFilterScrollContent: {
    paddingHorizontal: 20,
  },
  typeFilterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  typeFilterTabActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeFilterText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  typeFilterTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default CompanyListScreen;
