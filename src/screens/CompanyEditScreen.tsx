import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useCompany } from "../hooks";
import { Company, CompanyType, CompanyFormData } from "../types";
import { COLORS, SIZES } from "../constants";
import { Button, Input, Select } from "../components";

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
    if (!isEditing) {
      return Object.values(formData).some((value) => value?.trim());
    }

    if (!existingCompany) return false;

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

              <Input
                label="주소 *"
                value={formData.address}
                onChangeText={(value) => updateField("address", value)}
                placeholder="주소를 입력하세요"
                multiline
                numberOfLines={3}
                error={errors.address}
              />

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

        {/* 액션 버튼들 */}
        <View
          style={[styles.actionSection, { paddingBottom: 16 + insets.bottom }]}
        >
          <Button
            title="취소"
            onPress={handleCancel}
            variant="secondary"
            style={styles.actionButton}
          />
          <Button
            title={isEditing ? "수정 완료" : "등록하기"}
            onPress={handleSave}
            loading={loading}
            style={styles.actionButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    paddingBottom: 30,
    paddingHorizontal: SIZES.LARGE,
    alignItems: "center",
    // paddingTop은 동적으로 설정됨
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SIZES.LARGE,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  actionSection: {
    flexDirection: "row",
    padding: SIZES.LARGE,
    paddingTop: 16,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CompanyEditScreen;
