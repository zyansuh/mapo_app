import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { CompanyFormData, CompanyFormErrors, CompanyType } from "../types";
import { COLORS, SIZES } from "../constants";
import { isValidEmail, isValidPhoneNumber } from "../utils";
import TextInput from "./TextInput";
import Picker from "./Picker";
import Button from "./Button";

interface CompanyRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
  editData?: CompanyFormData | null;
}

const companyTypeOptions = [
  { label: "고객사", value: "고객사" },
  { label: "협력업체", value: "협력업체" },
  { label: "공급업체", value: "공급업체" },
  { label: "하청업체", value: "하청업체" },
  { label: "기타", value: "기타" },
];

export const CompanyRegistrationModal: React.FC<
  CompanyRegistrationModalProps
> = ({ visible, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    type: "고객사",
    address: "",
    phoneNumber: "",
    email: "",
    businessNumber: "",
    contactPerson: "",
    memo: "",
  });

  const [errors, setErrors] = useState<CompanyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 편집 데이터가 있을 때 폼 초기화
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      // 새 등록일 때 폼 초기화
      setFormData({
        name: "",
        type: "고객사",
        address: "",
        phoneNumber: "",
        email: "",
        businessNumber: "",
        contactPerson: "",
        memo: "",
      });
    }
    setErrors({});
  }, [editData, visible]);

  const validateForm = (): boolean => {
    const newErrors: CompanyFormErrors = {};

    // 필수 필드 검증
    if (!formData.name.trim()) {
      newErrors.name = "업체명은 필수입니다.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소는 필수입니다.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "전화번호는 필수입니다.";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "올바른 전화번호 형식이 아닙니다.";
    }

    // 선택 필드 검증
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (formData.businessNumber && formData.businessNumber.length !== 10) {
      newErrors.businessNumber = "사업자등록번호는 10자리 숫자여야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("입력 오류", "필수 정보를 올바르게 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      Alert.alert(
        "완료",
        `업체가 성공적으로 ${editData ? "수정" : "등록"}되었습니다.`,
        [{ text: "확인", onPress: onClose }]
      );
    } catch (error) {
      Alert.alert("오류", "업체 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CompanyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 해당 필드의 에러 제거
    if (errors[field as keyof CompanyFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {editData ? "업체 수정" : "업체 등록"}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 폼 컨텐츠 */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* 업체명 (필수) */}
            <TextInput
              label="업체명"
              value={formData.name}
              onChangeText={(value) => updateFormData("name", value)}
              placeholder="업체명을 입력하세요"
              error={errors.name}
              required
            />

            {/* 거래처 유형 (필수) */}
            <Picker
              label="거래처 유형"
              options={companyTypeOptions}
              selectedValue={formData.type}
              onValueChange={(value) =>
                updateFormData("type", value as CompanyType)
              }
              error={errors.type}
              required
            />

            {/* 주소 (필수) */}
            <TextInput
              label="주소"
              value={formData.address}
              onChangeText={(value) => updateFormData("address", value)}
              placeholder="주소를 입력하세요"
              error={errors.address}
              required
              multiline
              numberOfLines={2}
            />

            {/* 전화번호 (필수) */}
            <TextInput
              label="전화번호"
              value={formData.phoneNumber}
              onChangeText={(value) => updateFormData("phoneNumber", value)}
              placeholder="010-0000-0000"
              error={errors.phoneNumber}
              keyboardType="phone-pad"
              required
            />

            {/* 담당자명 (선택) */}
            <TextInput
              label="담당자명"
              value={formData.contactPerson}
              onChangeText={(value) => updateFormData("contactPerson", value)}
              placeholder="담당자명을 입력하세요"
            />

            {/* 이메일 (선택) */}
            <TextInput
              label="이메일"
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              placeholder="email@example.com"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* 사업자등록번호 (선택) */}
            <TextInput
              label="사업자등록번호"
              value={formData.businessNumber}
              onChangeText={(value) => updateFormData("businessNumber", value)}
              placeholder="0000000000 (10자리)"
              error={errors.businessNumber}
              keyboardType="numeric"
              maxLength={10}
            />

            {/* 메모 (선택) */}
            <TextInput
              label="메모"
              value={formData.memo}
              onChangeText={(value) => updateFormData("memo", value)}
              placeholder="추가 정보를 입력하세요"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* 액션 버튼 */}
        <View style={styles.footer}>
          <Button
            title={editData ? "수정 완료" : "등록하기"}
            onPress={handleSubmit}
            disabled={isSubmitting}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingHorizontal: SIZES.LARGE,
    paddingBottom: SIZES.MEDIUM,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GRAY,
  },
  closeButton: {
    padding: SIZES.SMALL,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: SIZES.LARGE,
  },
  footer: {
    padding: SIZES.LARGE,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.GRAY,
  },
});

export default CompanyRegistrationModal;
