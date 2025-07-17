import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Company, DeliveryStatus } from "../../types";

import { generateId } from "../../utils";
import TextInput from "../forms/TextInput";
import Button from "../forms/Button";
import Picker from "../forms/Picker";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import { formStyles } from "../styles/formStyles";
import { COLORS } from "../../styles/colors";

// 간단한 배송 폼 데이터
interface SimpleDeliveryFormData {
  deliveryNumber: string;
  companyId: string;
  deliveryDate: string;
  requestedDate: string;
  status: DeliveryStatus;
  trackingNumber: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  memo: string;
  totalAmount: number;
}

interface DeliveryRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: SimpleDeliveryFormData) => void;
  company: Company;
}

const deliveryStatusOptions = [
  { label: "배송 준비중", value: "배송준비" as DeliveryStatus },
  { label: "배송중", value: "배송중" as DeliveryStatus },
  { label: "배송 완료", value: "배송완료" as DeliveryStatus },
  { label: "취소", value: "취소" as DeliveryStatus },
];

export const DeliveryRegistrationModal: React.FC<
  DeliveryRegistrationModalProps
> = ({ visible, onClose, onSubmit, company }) => {
  const [formData, setFormData] = useState<SimpleDeliveryFormData>({
    deliveryNumber: `DEL-${Date.now()}`,
    companyId: company.id,
    deliveryDate: new Date().toISOString().split("T")[0],
    requestedDate: new Date().toISOString().split("T")[0],
    status: "배송준비",
    trackingNumber: "",
    driverName: "",
    driverPhone: "",
    vehicleNumber: "",
    memo: "",
    totalAmount: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setFormData({
      deliveryNumber: `DEL-${Date.now()}`,
      companyId: company.id,
      deliveryDate: new Date().toISOString().split("T")[0],
      requestedDate: new Date().toISOString().split("T")[0],
      status: "배송준비",
      trackingNumber: "",
      driverName: "",
      driverPhone: "",
      vehicleNumber: "",
      memo: "",
      totalAmount: 0,
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "배송일을 선택해주세요.";
    }

    if (formData.totalAmount <= 0) {
      newErrors.totalAmount = "올바른 금액을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
    resetForm();
    onClose();
    Alert.alert("완료", "배송이 등록되었습니다!");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>배송 등록</Text>
            <TouchableOpacity
              style={modalStyles.closeButton}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 회사 정보 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>거래처</Text>
              <View style={[formStyles.input, { justifyContent: "center" }]}>
                <Text style={{ color: COLORS.text }}>{company.name}</Text>
              </View>
            </View>

            {/* 배송번호 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>배송번호</Text>
              <View style={[formStyles.input, { justifyContent: "center" }]}>
                <Text style={{ color: COLORS.text }}>
                  {formData.deliveryNumber}
                </Text>
              </View>
            </View>

            {/* 배송일 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>배송일 *</Text>
              <TextInput
                value={formData.deliveryDate}
                onChangeText={(value) =>
                  setFormData({ ...formData, deliveryDate: value })
                }
                placeholder="YYYY-MM-DD"
                error={!!errors.deliveryDate}
              />
              {errors.deliveryDate && (
                <Text style={formStyles.errorText}>{errors.deliveryDate}</Text>
              )}
            </View>

            {/* 요청 배송일 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>요청 배송일</Text>
              <TextInput
                value={formData.requestedDate}
                onChangeText={(value) =>
                  setFormData({ ...formData, requestedDate: value })
                }
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* 배송 상태 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>배송 상태</Text>
              <Picker
                selectedValue={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as DeliveryStatus })
                }
                options={deliveryStatusOptions}
              />
            </View>

            {/* 송장번호 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>송장번호</Text>
              <TextInput
                value={formData.trackingNumber}
                onChangeText={(value) =>
                  setFormData({ ...formData, trackingNumber: value })
                }
                placeholder="송장번호를 입력하세요"
              />
            </View>

            {/* 기사 정보 */}
            <View style={{ marginTop: 20, marginBottom: 10 }}>
              <Text style={formStyles.sectionTitle}>기사 정보</Text>
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>기사명</Text>
              <TextInput
                value={formData.driverName}
                onChangeText={(value) =>
                  setFormData({ ...formData, driverName: value })
                }
                placeholder="기사명을 입력하세요"
              />
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>기사 연락처</Text>
              <TextInput
                value={formData.driverPhone}
                onChangeText={(value) =>
                  setFormData({ ...formData, driverPhone: value })
                }
                placeholder="기사 연락처를 입력하세요"
                keyboardType="phone-pad"
              />
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>차량번호</Text>
              <TextInput
                value={formData.vehicleNumber}
                onChangeText={(value) =>
                  setFormData({ ...formData, vehicleNumber: value })
                }
                placeholder="차량번호를 입력하세요"
              />
            </View>

            {/* 금액 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>총 금액 *</Text>
              <TextInput
                value={formData.totalAmount.toString()}
                onChangeText={(value) =>
                  setFormData({
                    ...formData,
                    totalAmount: parseInt(value) || 0,
                  })
                }
                placeholder="총 금액을 입력하세요"
                keyboardType="numeric"
                error={!!errors.totalAmount}
              />
              {errors.totalAmount && (
                <Text style={formStyles.errorText}>{errors.totalAmount}</Text>
              )}
            </View>

            {/* 메모 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>메모</Text>
              <TextInput
                value={formData.memo}
                onChangeText={(value) =>
                  setFormData({ ...formData, memo: value })
                }
                placeholder="배송 관련 메모를 입력하세요"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={modalStyles.footer}>
            <View style={formStyles.buttonGroup}>
              <TouchableOpacity
                style={[formStyles.button, formStyles.buttonSecondary]}
                onPress={handleClose}
              >
                <Text style={formStyles.buttonTextSecondary}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[formStyles.button, formStyles.buttonPrimary]}
                onPress={handleSubmit}
              >
                <Text style={formStyles.buttonText}>등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeliveryRegistrationModal;
