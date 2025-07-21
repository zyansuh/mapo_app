import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  CompanyType,
  CompanyRegion,
  CompanyStatus,
  RootStackParamList,
  CompanyFormData,
} from "../types";
import { useCompany } from "../hooks";
import { COLORS } from "../styles/colors";
import { formatPhoneNumber } from "../utils/format";
import { Select } from "../components";
import { searchAddress, AddressSearchResult } from "../services/kakaoApi";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CompanyEditScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { companies, addCompany, updateCompany } = useCompany();
  const { companyId } = (route.params as any) || {};

  const existingCompany = companyId
    ? companies.find((c) => c.id === companyId)
    : null;

  const [formData, setFormData] = useState<CompanyFormData>({
    name: existingCompany?.name || "",
    type: existingCompany?.type || "고객사",
    region: existingCompany?.region || "서울",
    status: existingCompany?.status || "활성",
    address: existingCompany?.address || "",
    phoneNumber: existingCompany?.phoneNumber || "",
    email: existingCompany?.email || "",
    businessNumber: existingCompany?.businessNumber || "",
    contactPerson: existingCompany?.contactPerson || "",
    contactPhone: existingCompany?.contactPhone || "",
    memo: existingCompany?.memo || "",
    tags: existingCompany?.tags || [],
  });

  // 주소 검색 관련 상태
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState("");
  const [addressSearchResults, setAddressSearchResults] = useState<
    AddressSearchResult[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("입력 오류", "업체명을 입력해주세요.");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert("입력 오류", "전화번호를 입력해주세요.");
      return;
    }

    const companyData = {
      ...formData,
      tags: formData.tags || [],
    };

    try {
      if (companyId) {
        // 기존 회사 수정
        updateCompany(companyId, companyData);
        Alert.alert("저장 완료", "업체 정보가 수정되었습니다.");
      } else {
        // 새 회사 추가
        const newCompany = await addCompany(companyData);
        if (newCompany) {
          Alert.alert("등록 완료", "새 업체가 등록되었습니다.");
        }
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("오류", "저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // 주소 검색 함수
  const handleAddressSearch = async () => {
    if (!addressSearchQuery.trim()) {
      Alert.alert("알림", "검색할 주소를 입력해주세요.");
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchAddress(addressSearchQuery);
      setAddressSearchResults(results);

      if (results.length === 0) {
        Alert.alert(
          "검색 결과 없음",
          "검색된 주소가 없습니다. 다른 키워드로 검색해보세요."
        );
      }
    } catch (error) {
      Alert.alert("검색 오류", "주소 검색 중 오류가 발생했습니다.");
      console.error("Address search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (address: AddressSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      address: address.roadAddressName || address.addressName,
    }));
    setAddressModalVisible(false);
    setAddressSearchQuery("");
    setAddressSearchResults([]);
  };

  // 주소 검색 모달 열기
  const openAddressSearch = () => {
    setAddressModalVisible(true);
    setAddressSearchQuery("");
    setAddressSearchResults([]);
  };

  const typeOptions = [
    { label: "고객사", value: "고객사" as CompanyType },
    { label: "협력업체", value: "협력업체" as CompanyType },
    { label: "공급업체", value: "공급업체" as CompanyType },
    { label: "기타", value: "기타" as CompanyType },
  ];

  const regionOptions = [
    { label: "서울", value: "서울" as CompanyRegion },
    { label: "부산", value: "부산" as CompanyRegion },
    { label: "대구", value: "대구" as CompanyRegion },
    { label: "인천", value: "인천" as CompanyRegion },
    { label: "광주", value: "광주" as CompanyRegion },
    { label: "대전", value: "대전" as CompanyRegion },
    { label: "울산", value: "울산" as CompanyRegion },
    { label: "경기", value: "경기" as CompanyRegion },
    { label: "강원", value: "강원" as CompanyRegion },
    { label: "충북", value: "충북" as CompanyRegion },
    { label: "충남", value: "충남" as CompanyRegion },
    { label: "전북", value: "전북" as CompanyRegion },
    { label: "전남", value: "전남" as CompanyRegion },
    { label: "경북", value: "경북" as CompanyRegion },
    { label: "경남", value: "경남" as CompanyRegion },
    { label: "제주", value: "제주" as CompanyRegion },
  ];

  const statusOptions = [
    { label: "활성", value: "활성" as CompanyStatus },
    { label: "비활성", value: "비활성" as CompanyStatus },
    { label: "잠김", value: "잠김" as CompanyStatus },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>
          {companyId ? "업체 수정" : "업체 등록"}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={[styles.saveText, { color: COLORS.primary }]}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 기본 정보 */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            기본 정보
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>업체명 *</Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="업체명을 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                업체 유형
              </Text>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as CompanyType,
                  }))
                }
                options={typeOptions}
                placeholder="유형 선택"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: COLORS.text }]}>지역</Text>
              <Select
                value={formData.region}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    region: value as CompanyRegion,
                  }))
                }
                options={regionOptions}
                placeholder="지역 선택"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>상태</Text>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as CompanyStatus,
                }))
              }
              options={statusOptions}
              placeholder="상태 선택"
            />
          </View>
        </View>

        {/* 연락처 정보 */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            연락처 정보
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              전화번호 *
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              placeholder="전화번호를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>이메일</Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="이메일을 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: COLORS.text }]}>담당자</Text>
              <TextInput
                style={[
                  styles.textInput,
                  { borderColor: COLORS.border, color: COLORS.text },
                ]}
                value={formData.contactPerson}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, contactPerson: text }))
                }
                placeholder="담당자명"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                담당자 연락처
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { borderColor: COLORS.border, color: COLORS.text },
                ]}
                value={formData.contactPhone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, contactPhone: text }))
                }
                placeholder="담당자 연락처"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* 추가 정보 */}
        <View style={[styles.section, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            추가 정보
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>주소</Text>
            <View style={styles.addressInputContainer}>
              <TextInput
                style={[
                  styles.addressInput,
                  { borderColor: COLORS.border, color: COLORS.text },
                ]}
                value={formData.address}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text }))
                }
                placeholder="주소를 입력하거나 검색하세요"
                placeholderTextColor={COLORS.textSecondary}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { backgroundColor: COLORS.primary },
                ]}
                onPress={openAddressSearch}
              >
                <Ionicons name="search" size={16} color={COLORS.white} />
                <Text
                  style={[styles.searchButtonText, { color: COLORS.white }]}
                >
                  검색
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>
              사업자번호
            </Text>
            <TextInput
              style={[
                styles.textInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={formData.businessNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, businessNumber: text }))
              }
              placeholder="사업자번호를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: COLORS.text }]}>메모</Text>
            <TextInput
              style={[
                styles.textArea,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={formData.memo}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, memo: text }))
              }
              placeholder="메모를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </ScrollView>

      {/* 주소 검색 모달 */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: COLORS.background },
          ]}
        >
          <View style={[styles.modalHeader, { backgroundColor: COLORS.white }]}>
            <TouchableOpacity onPress={() => setAddressModalVisible(false)}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: COLORS.text }]}>
              주소 검색
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View
            style={[styles.searchContainer, { backgroundColor: COLORS.white }]}
          >
            <TextInput
              style={[
                styles.searchInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={addressSearchQuery}
              onChangeText={setAddressSearchQuery}
              placeholder="도로명 또는 지번 주소를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              onSubmitEditing={handleAddressSearch}
            />
            <TouchableOpacity
              style={[
                styles.searchModalButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={handleAddressSearch}
              disabled={searchLoading}
            >
              <Text
                style={[styles.searchModalButtonText, { color: COLORS.white }]}
              >
                {searchLoading ? "검색중..." : "검색"}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={addressSearchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.addressItem, { backgroundColor: COLORS.white }]}
                onPress={() => handleAddressSelect(item)}
              >
                <Text style={[styles.addressText, { color: COLORS.text }]}>
                  {item.roadAddressName || item.addressName}
                </Text>
                {item.roadAddressName && (
                  <Text
                    style={[
                      styles.addressSubText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {item.addressName}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            style={styles.addressList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text
                  style={[styles.emptyText, { color: COLORS.textSecondary }]}
                >
                  주소를 검색해보세요
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    minHeight: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
  },
  // 주소 검색 관련 스타일
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
    minHeight: 48,
    justifyContent: "center",
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // 모달 스타일
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  searchModalButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addressList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  addressSubText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default CompanyEditScreen;
