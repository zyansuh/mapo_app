import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import { COLORS, SIZES } from "../constants";
import {
  searchAddress,
  searchKeyword,
  AddressSearchResult,
} from "../services/kakaoApi";

interface AddressSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
  currentAddress?: string;
}

export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  visible,
  onClose,
  onSelectAddress,
  currentAddress = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(currentAddress);
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"address" | "keyword">(
    "address"
  );
  const [hasSearched, setHasSearched] = useState(false);

  // 모달이 열릴 때 현재 주소로 검색어 초기화
  useEffect(() => {
    if (visible) {
      setSearchQuery(currentAddress);
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [visible, currentAddress]);

  // 주소 검색 함수
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("알림", "검색어를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    Keyboard.dismiss();

    try {
      let results: AddressSearchResult[] = [];

      if (searchType === "address") {
        results = await searchAddress(searchQuery.trim());
      } else {
        results = await searchKeyword(searchQuery.trim());
      }

      setSearchResults(results);

      if (results.length === 0) {
        Alert.alert(
          "검색 결과 없음",
          "검색 결과가 없습니다. 다른 키워드로 검색해보세요."
        );
      }
    } catch (error) {
      Alert.alert(
        "오류",
        error instanceof Error ? error.message : "주소 검색에 실패했습니다."
      );
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 주소 선택 처리
  const handleSelectAddress = (result: AddressSearchResult) => {
    const selectedAddress = result.roadAddressName || result.addressName;
    onSelectAddress(selectedAddress);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    onClose();
  };

  // 검색 결과 아이템 렌더링
  const renderSearchResultItem = ({ item }: { item: AddressSearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelectAddress(item)}
    >
      <View style={styles.resultContent}>
        <Text style={styles.primaryAddress}>
          {item.roadAddressName || item.addressName}
        </Text>
        {item.roadAddressName && item.addressName !== item.roadAddressName && (
          <Text style={styles.secondaryAddress}>{item.addressName}</Text>
        )}
      </View>
      <View style={styles.selectButton}>
        <Text style={styles.selectButtonText}>선택</Text>
      </View>
    </TouchableOpacity>
  );

  // 빈 상태 컴포넌트
  const renderEmptyState = () => {
    if (isLoading) return null;

    if (!hasSearched) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            주소나 건물명을 입력하고 검색해보세요
          </Text>
          <Text style={styles.emptyStateSubText}>
            예: 강남구 테헤란로, 카카오판교오피스
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>검색 결과가 없습니다</Text>
        <Text style={styles.emptyStateSubText}>다른 키워드로 검색해보세요</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>주소 검색</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 검색 타입 선택 */}
        <View style={styles.searchTypeContainer}>
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === "address" && styles.searchTypeButtonActive,
            ]}
            onPress={() => setSearchType("address")}
          >
            <Text
              style={[
                styles.searchTypeButtonText,
                searchType === "address" && styles.searchTypeButtonTextActive,
              ]}
            >
              주소 검색
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.searchTypeButton,
              searchType === "keyword" && styles.searchTypeButtonActive,
            ]}
            onPress={() => setSearchType("keyword")}
          >
            <Text
              style={[
                styles.searchTypeButtonText,
                searchType === "keyword" && styles.searchTypeButtonTextActive,
              ]}
            >
              장소 검색
            </Text>
          </TouchableOpacity>
        </View>

        {/* 검색 입력 */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              searchType === "address"
                ? "도로명 주소나 지번 주소를 입력하세요"
                : "건물명이나 업체명을 입력하세요"
            }
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoFocus
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              isLoading && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.WHITE} />
            ) : (
              <Text style={styles.searchButtonText}>검색</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        <View style={styles.resultsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Text style={styles.loadingText}>
                주소를 검색하고 있습니다...
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResultItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
              contentContainerStyle={
                searchResults.length === 0
                  ? styles.emptyListContainer
                  : undefined
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerSpacer: {
    width: 50,
  },
  searchTypeContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 4,
    alignItems: "center",
  },
  searchTypeButtonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  searchTypeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  searchTypeButtonTextActive: {
    color: COLORS.WHITE,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#ccc",
  },
  searchButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  resultContent: {
    flex: 1,
  },
  primaryAddress: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  secondaryAddress: {
    fontSize: 14,
    color: "#666",
  },
  selectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.PRIMARY,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
});
