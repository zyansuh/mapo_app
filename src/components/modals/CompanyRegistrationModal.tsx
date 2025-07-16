import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  CompanyFormData,
  CompanyFormErrors,
  CompanyType,
  CompanyRegion,
} from "../../types";
import { validateEmail, validatePhoneNumber } from "../../utils";
import TextInput from "../forms/TextInput";
import Picker from "../forms/Picker";
import Button from "../forms/Button";
import { AddressSearchModal } from "./AddressSearchModal";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import { formStyles } from "../styles/formStyles";
import { COLORS } from "../../styles/colors";
import { Ionicons } from "@expo/vector-icons";

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

const companyRegionOptions = [
  { label: "순창", value: "순창" },
  { label: "담양", value: "담양" },
  { label: "장성", value: "장성" },
  { label: "기타", value: "기타" },
];

export const CompanyRegistrationModal: React.FC<
  CompanyRegistrationModalProps
> = ({ visible, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    type: "고객사",
    region: "순창",
    address: "",
    phoneNumber: "",
    email: "",
    businessNumber: "",
    contactPerson: "",
    memo: "",
  });

  const [errors, setErrors] = useState<CompanyFormErrors>({});
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      resetForm();
    }
  }, [editData, visible]);

  const resetForm = () => {
    setFormData({
      name: "",
      type: "고객사",
      region: "순창",
      address: "",
      phoneNumber: "",
      email: "",
      businessNumber: "",
      contactPerson: "",
      memo: "",
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: CompanyFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "회사명을 입력해주세요.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요.";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "전화번호를 입력해주세요.";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "올바른 전화번호 형식이 아닙니다.";
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
      onClose();
    }
  };

  const handleAddressSelect = (address: string) => {
    setFormData({ ...formData, address });
    setIsAddressModalVisible(false);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={modalStyles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>
                {editData ? "회사 정보 수정" : "회사 등록"}
              </Text>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={modalStyles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* 회사명 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>회사명 *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  placeholder="회사명을 입력하세요"
                  error={!!errors.name}
                />
                {errors.name && (
                  <Text style={formStyles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* 회사 유형 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>회사 유형 *</Text>
                <Picker
                  selectedValue={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as CompanyType })
                  }
                  options={companyTypeOptions}
                />
              </View>

              {/* 지역 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>지역 *</Text>
                <Picker
                  selectedValue={formData.region}
                  onValueChange={(value) =>
                    setFormData({ ...formData, region: value as CompanyRegion })
                  }
                  options={companyRegionOptions}
                />
              </View>

              {/* 주소 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>주소 *</Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    value={formData.address}
                    onChangeText={(value) =>
                      setFormData({ ...formData, address: value })
                    }
                    placeholder="주소를 입력하세요"
                    style={{ flex: 1 }}
                    error={!!errors.address}
                  />
                  <TouchableOpacity
                    style={[
                      formStyles.button,
                      formStyles.buttonSecondary,
                      { paddingHorizontal: 15 },
                    ]}
                    onPress={() => setIsAddressModalVisible(true)}
                  >
                    <Text style={formStyles.buttonTextSecondary}>검색</Text>
                  </TouchableOpacity>
                </View>
                {errors.address && (
                  <Text style={formStyles.errorText}>{errors.address}</Text>
                )}
              </View>

              {/* 전화번호 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>전화번호 *</Text>
                <TextInput
                  value={formData.phoneNumber}
                  onChangeText={(value) =>
                    setFormData({ ...formData, phoneNumber: value })
                  }
                  placeholder="전화번호를 입력하세요"
                  keyboardType="phone-pad"
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <Text style={formStyles.errorText}>{errors.phoneNumber}</Text>
                )}
              </View>

              {/* 이메일 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>이메일</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(value) =>
                    setFormData({ ...formData, email: value })
                  }
                  placeholder="이메일을 입력하세요"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={!!errors.email}
                />
                {errors.email && (
                  <Text style={formStyles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* 사업자등록번호 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>사업자등록번호</Text>
                <TextInput
                  value={formData.businessNumber}
                  onChangeText={(value) =>
                    setFormData({ ...formData, businessNumber: value })
                  }
                  placeholder="사업자등록번호를 입력하세요"
                  keyboardType="numeric"
                />
              </View>

              {/* 담당자 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>담당자</Text>
                <TextInput
                  value={formData.contactPerson}
                  onChangeText={(value) =>
                    setFormData({ ...formData, contactPerson: value })
                  }
                  placeholder="담당자명을 입력하세요"
                />
              </View>

              {/* 메모 */}
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>메모</Text>
                <TextInput
                  value={formData.memo}
                  onChangeText={(value) =>
                    setFormData({ ...formData, memo: value })
                  }
                  placeholder="메모를 입력하세요"
                  multiline
                />
              </View>
            </ScrollView>

            <View style={modalStyles.footer}>
              <TouchableOpacity
                style={modalStyles.buttonSecondary}
                onPress={() => {
                  resetForm();
                  onClose();
                }}
              >
                <Text style={modalStyles.buttonTextSecondary}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.buttonPrimary}
                onPress={handleSubmit}
              >
                <Text style={modalStyles.buttonText}>
                  {editData ? "수정" : "등록"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <AddressSearchModal
        visible={isAddressModalVisible}
        onClose={() => setIsAddressModalVisible(false)}
        onSelectAddress={handleAddressSelect}
      />
    </>
  );
};
