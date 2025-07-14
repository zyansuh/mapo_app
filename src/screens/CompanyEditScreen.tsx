import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { CompanyFormData, CompanyType } from "../types";
import { useCompany } from "../hooks";
import { Input, Select, AddressSearchModal } from "../components";

// Navigation 타입 정의
type RootStackParamList = {
  CompanyEdit: { companyId?: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "CompanyEdit">;

interface FormData {
  name: string;
  type: CompanyType;
  phoneNumber: string;
  address: string;
  email?: string;
  contactPerson?: string;
  businessNumber?: string;
  memo?: string;
}

const COMPANY_TYPES: { label: string; value: CompanyType }[] = [
  { label: "고객사", value: "고객사" },
  { label: "협력업체", value: "협력업체" },
  { label: "공급업체", value: "공급업체" },
  { label: "하청업체", value: "하청업체" },
];

export const CompanyEditScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { companyId } = route.params;
  const insets = useSafeAreaInsets();

  const { getCompanyById, addCompany, updateCompany } = useCompany();
  const isEditing = !!companyId;
  const existingCompany = isEditing ? getCompanyById(companyId) : null;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "고객사",
    phoneNumber: "",
    address: "",
    email: "",
    contactPerson: "",
    businessNumber: "",
    memo: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [showAddressSearch, setShowAddressSearch] = useState(false);

  useEffect(() => {
    if (existingCompany) {
      setFormData({
        name: existingCompany.name,
        type: existingCompany.type,
        phoneNumber: existingCompany.phoneNumber,
        address: existingCompany.address,
        email: existingCompany.email || "",
        contactPerson: existingCompany.contactPerson || "",
        businessNumber: existingCompany.businessNumber || "",
        memo: existingCompany.memo || "",
      });
    }
  }, [existingCompany]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "업체명을 입력해주세요.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "전화번호를 입력해주세요.";
    } else if (!/^[0-9-+\s()]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "올바른 전화번호 형식을 입력해주세요.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (
      formData.businessNumber &&
      !/^[0-9-]{10,}$/.test(formData.businessNumber)
    ) {
      newErrors.businessNumber = "올바른 사업자등록번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const companyData: CompanyFormData = {
        name: formData.name.trim(),
        type: formData.type,
        phoneNumber: formData.phoneNumber.trim(),
        address: formData.address.trim(),
        email: formData.email?.trim() || "",
        contactPerson: formData.contactPerson?.trim() || "",
        businessNumber: formData.businessNumber?.trim() || "",
        memo: formData.memo?.trim() || "",
      };

      if (isEditing && companyId) {
        await updateCompany(companyId, companyData);
        Alert.alert("성공", "업체 정보가 수정되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      } else {
        await addCompany(companyData);
        Alert.alert("성공", "새 업체가 등록되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("오류", "저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        "변경사항 취소",
        "작성 중인 내용이 사라집니다. 계속하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          { text: "확인", onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const hasChanges = (): boolean => {
    if (!existingCompany) {
      return Object.values(formData).some((value) => value.trim() !== "");
    }

    return (
      formData.name !== existingCompany.name ||
      formData.type !== existingCompany.type ||
      formData.phoneNumber !== existingCompany.phoneNumber ||
      formData.address !== existingCompany.address ||
      formData.email !== (existingCompany.email || "") ||
      formData.contactPerson !== (existingCompany.contactPerson || "") ||
      formData.businessNumber !== (existingCompany.businessNumber || "") ||
      formData.memo !== (existingCompany.memo || "")
    );
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // 주소 검색 결과 처리
  const handleAddressSelect = (selectedAddress: string) => {
    updateField("address", selectedAddress);
    setShowAddressSearch(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={["#525252", "#404040"]}
          style={[styles.header, { paddingTop: 20 + insets.top }]}
        >
          <Text style={styles.headerTitle}>
            {isEditing ? "업체 수정" : "새 업체 등록"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isEditing ? "업체 정보를 수정하세요" : "새로운 업체를 등록하세요"}
          </Text>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* 기본 정보 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>기본 정보</Text>

              <Input
                label="업체명 *"
                value={formData.name}
                onChangeText={(value) => updateField("name", value)}
                placeholder="업체명을 입력하세요"
                error={errors.name}
              />

              <Select
                label="업체 유형 *"
                value={formData.type}
                onValueChange={(value) =>
                  updateField("type", value as CompanyType)
                }
                options={COMPANY_TYPES}
              />

              <Input
                label="전화번호 *"
                value={formData.phoneNumber}
                onChangeText={(value) => updateField("phoneNumber", value)}
                placeholder="010-0000-0000"
                keyboardType="phone-pad"
                error={errors.phoneNumber}
              />
            </View>

            {/* 연락처 정보 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>연락처 정보</Text>

              {/* 주소 입력 - 카카오맵 검색 기능 추가 */}
              <View style={styles.addressSection}>
                <Text style={styles.fieldLabel}>주소 *</Text>
                <View style={styles.addressInputContainer}>
                  <Input
                    label=""
                    value={formData.address}
                    onChangeText={(value) => updateField("address", value)}
                    placeholder="주소를 입력하거나 검색 버튼을 눌러주세요"
                    multiline
                    numberOfLines={3}
                    style={styles.addressInput}
                  />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => setShowAddressSearch(true)}
                  >
                    <Text style={styles.searchButtonText}>🔍 검색</Text>
                  </TouchableOpacity>
                </View>
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
              </View>

              <Input
                label="이메일"
                value={formData.email}
                onChangeText={(value) => updateField("email", value)}
                placeholder="example@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Input
                label="담당자"
                value={formData.contactPerson}
                onChangeText={(value) => updateField("contactPerson", value)}
                placeholder="담당자명을 입력하세요"
              />
            </View>

            {/* 추가 정보 섹션 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>추가 정보</Text>

              <Input
                label="사업자등록번호"
                value={formData.businessNumber}
                onChangeText={(value) => updateField("businessNumber", value)}
                placeholder="000-00-00000"
                keyboardType="numeric"
                error={errors.businessNumber}
              />

              <Input
                label="메모"
                value={formData.memo}
                onChangeText={(value) => updateField("memo", value)}
                placeholder="추가 메모나 특이사항을 입력하세요"
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "저장 중..." : isEditing ? "수정" : "등록"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 주소 검색 모달 */}
        <AddressSearchModal
          visible={showAddressSearch}
          onClose={() => setShowAddressSearch(false)}
          onSelectAddress={handleAddressSelect}
          currentAddress={formData.address}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  // 주소 검색 관련 스타일
  addressSection: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#525252",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  saveButton: {
    backgroundColor: "#525252",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default CompanyEditScreen;
