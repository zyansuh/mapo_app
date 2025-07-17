import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useCompany } from "../hooks";
import { Company, CompanyType } from "../types";
import { COLORS, SIZES } from "../constants";
import { Select } from "../components";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FILTER_OPTIONS = [
  { label: "전체 거래처", value: "all" },
  { label: "💰 고객사", value: "고객사" },
  { label: "🤝 협력업체", value: "협력업체" },
  { label: "📦 공급업체", value: "공급업체" },
  { label: "⚡ 하청업체", value: "하청업체" },
  { label: "📋 기타", value: "기타" },
];

const SORT_OPTIONS = [
  { label: "최근 등록순", value: "createdAt_desc" },
  { label: "오래된 등록순", value: "createdAt_asc" },
  { label: "가나다순", value: "name_asc" },
  { label: "즐겨찾기 우선", value: "favorite_first" },
];

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { companies, toggleFavorite } = useCompany();

  const [searchText, setSearchText] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies;

    // 텍스트 검색 필터
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (company) =>
          company.name.toLowerCase().includes(searchLower) ||
          company.address.toLowerCase().includes(searchLower) ||
          company.phoneNumber.includes(searchText) ||
          (company.contactPerson &&
            company.contactPerson.toLowerCase().includes(searchLower)) ||
          (company.email &&
            company.email.toLowerCase().includes(searchLower)) ||
          (company.businessNumber &&
            company.businessNumber.includes(searchText))
      );
    }

    // 거래처 유형 필터
    if (typeFilter !== "all") {
      filtered = filtered.filter((company) => company.type === typeFilter);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "createdAt_desc":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "createdAt_asc":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "favorite_first":
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [companies, searchText, typeFilter, sortBy]);

  const handleCompanyPress = (companyId: string) => {
    navigation.navigate("CompanyDetail", { companyId });
  };

  const handleToggleFavorite = (company: Company) => {
    toggleFavorite(company.id);
  };

  const clearSearch = () => {
    setSearchText("");
    setTypeFilter("all");
    setSortBy("createdAt_desc");
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

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case "고객사":
        return "people";
      case "협력업체":
        return "people-outline";
      case "공급업체":
        return "cube";
      case "하청업체":
        return "flash";
      default:
        return "business";
    }
  };

  const renderCompanyItem = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={[styles.companyCard, item.isFavorite && styles.favoriteCard]}
      onPress={() => handleCompanyPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.companyMainInfo}>
          <View style={styles.companyTitleRow}>
            <Ionicons
              name={getBusinessIcon(item.type)}
              size={16}
              color={getTypeColor(item.type)}
              style={styles.businessIcon}
            />
            <Text style={styles.companyName}>{item.name}</Text>
            {item.isFavorite && (
              <Ionicons
                name="star"
                size={14}
                color="#f59e0b"
                style={styles.favoriteIcon}
              />
            )}
          </View>
          <View
            style={[
              styles.typeTag,
              { backgroundColor: getTypeColor(item.type) },
            ]}
          >
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>

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
      </View>

      <View style={styles.companyDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={styles.companyAddress} numberOfLines={1}>
            {item.address || "주소 미등록"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={14} color="#6b7280" />
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        </View>

        {item.contactPerson && (
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={14} color="#6b7280" />
            <Text style={styles.contactPerson}>{item.contactPerson}</Text>
          </View>
        )}

        {item.businessNumber && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={14} color="#6b7280" />
            <Text style={styles.businessNumber}>
              사업자: {item.businessNumber}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.registrationDate}>
          등록: {new Date(item.createdAt).toLocaleDateString("ko-KR")}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name={
          searchText || typeFilter !== "all" ? "search" : "business-outline"
        }
        size={64}
        color="#9ca3af"
      />
      <Text style={styles.emptyTitle}>
        {searchText || typeFilter !== "all"
          ? "검색 결과가 없습니다"
          : "등록된 거래처가 없습니다"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchText || typeFilter !== "all"
          ? "다른 검색어나 필터를 시도해보세요"
          : "새 거래처를 등록해보세요"}
      </Text>
      {(searchText || typeFilter !== "all") && (
        <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
          <Ionicons name="refresh" size={16} color="#8b5cf6" />
          <Text style={styles.clearButtonText}>검색 초기화</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getSearchSummary = () => {
    const total = filteredAndSortedCompanies.length;
    const favorites = filteredAndSortedCompanies.filter(
      (c) => c.isFavorite
    ).length;

    if (searchText || typeFilter !== "all") {
      return `${total}개 검색됨 • ${favorites}개 즐겨찾기`;
    }
    return `총 ${total}개 거래처 • ${favorites}개 핵심 거래처`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#525252", "#404040"]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>거래처 검색</Text>
          <Text style={styles.headerSubtitle}>{getSearchSummary()}</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* 검색 입력 */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#9ca3af"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="거래처명, 주소, 전화번호, 담당자, 사업자번호..."
              placeholderTextColor="#9ca3af"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchText("")}
              >
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 필터 및 정렬 섹션 */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>거래처 유형</Text>
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
                options={FILTER_OPTIONS}
              />
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>정렬 기준</Text>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                options={SORT_OPTIONS}
              />
            </View>
          </View>

          {/* 활성 필터 표시 */}
          {(searchText || typeFilter !== "all") && (
            <View style={styles.activeFilters}>
              <Text style={styles.activeFiltersLabel}>활성 필터:</Text>
              {searchText && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>"{searchText}"</Text>
                  <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close" size={14} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
              {typeFilter !== "all" && (
                <View style={styles.filterChip}>
                  <Text style={styles.filterChipText}>
                    {FILTER_OPTIONS.find((f) => f.value === typeFilter)?.label}
                  </Text>
                  <TouchableOpacity onPress={() => setTypeFilter("all")}>
                    <Ionicons name="close" size={14} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearAllText}>전체 해제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 결과 목록 */}
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
          ListEmptyComponent={renderEmptyState}
        />
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
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  clearSearchButton: {
    padding: 4,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  filterSelect: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  activeFiltersLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  filterChipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  clearAllButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: "#8b5cf6",
    fontWeight: "600",
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
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  cardHeader: {
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
    marginBottom: 6,
  },
  businessIcon: {
    marginRight: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },
  favoriteIcon: {
    marginLeft: 6,
  },
  typeTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 4,
  },
  companyDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  registrationDate: {
    fontSize: 11,
    color: "#9ca3af",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
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
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "600",
  },
});

export default SearchScreen;
