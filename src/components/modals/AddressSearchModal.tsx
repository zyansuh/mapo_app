import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { searchAddress, AddressSearchResult } from "../../services/kakaoApi";
import TextInput from "../forms/TextInput";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import { formStyles } from "../styles/formStyles";
import { listStyles } from "../styles/listStyles";
import { COLORS } from "../../styles/colors";

interface AddressSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
}

export const AddressSearchModal: React.FC<AddressSearchModalProps> = ({
  visible,
  onClose,
  onSelectAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("알림", "검색어를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert("오류", "주소 검색 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address: AddressSearchResult) => {
    const fullAddress = address.roadAddressName || address.addressName;
    onSelectAddress(fullAddress);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClose = () => {
    resetSearch();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>주소 검색</Text>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={modalStyles.content}>
            {/* 검색 입력 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>주소 검색</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="도로명 또는 지번 주소를 입력하세요"
                  style={{ flex: 1 }}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  style={[
                    formStyles.button,
                    formStyles.buttonPrimary,
                    { paddingHorizontal: 15 },
                    isLoading && formStyles.buttonDisabled,
                  ]}
                  onPress={handleSearch}
                  disabled={isLoading}
                >
                  <Text style={formStyles.buttonText}>
                    {isLoading ? "검색중..." : "검색"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 검색 결과 */}
            <View style={{ flex: 1, marginTop: 20 }}>
              {searchResults.length === 0 ? (
                <View style={listStyles.emptyContainer}>
                  <Ionicons
                    name="location-outline"
                    size={50}
                    color={COLORS.textSecondary}
                  />
                  <Text style={listStyles.emptyText}>주소를 검색해보세요</Text>
                  <Text style={listStyles.emptySubtext}>
                    도로명 또는 지번 주소를 입력하세요
                  </Text>
                </View>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[formStyles.label, { marginBottom: 10 }]}>
                    검색 결과 ({searchResults.length}건)
                  </Text>

                  {searchResults.map((address, index) => (
                    <TouchableOpacity
                      key={index}
                      style={listStyles.card}
                      onPress={() => handleSelectAddress(address)}
                    >
                      <View style={listStyles.cardHeader}>
                        <Text style={listStyles.cardTitle}>
                          {address.roadAddressName || address.addressName}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color={COLORS.textSecondary}
                        />
                      </View>

                      {address.roadAddressName &&
                        address.roadAddressName !== address.addressName && (
                          <Text style={listStyles.cardSubtitle}>
                            지번: {address.addressName}
                          </Text>
                        )}

                      <View
                        style={{ flexDirection: "row", gap: 5, marginTop: 5 }}
                      >
                        <View
                          style={[
                            listStyles.categoryBadge,
                            { backgroundColor: COLORS.primary + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              listStyles.categoryText,
                              { color: COLORS.primary },
                            ]}
                          >
                            주소
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={modalStyles.buttonSecondary}
              onPress={handleClose}
            >
              <Text style={modalStyles.buttonTextSecondary}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
