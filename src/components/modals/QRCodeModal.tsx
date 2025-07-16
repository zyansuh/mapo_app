import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QRCodeData, QRCodeOptions, Company } from "../../types";
import { qrCodeService } from "../../services/qrCodeService";
import TextInput from "../forms/TextInput";
import Picker from "../forms/Picker";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import { formStyles } from "../styles/formStyles";
import { listStyles } from "../styles/listStyles";
import { COLORS } from "../../styles/colors";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  company?: Company;
  title?: string;
}

const qrTypeOptions = [
  { label: "회사 정보", value: "company" },
  { label: "연락처", value: "contact" },
  { label: "웹사이트", value: "website" },
  { label: "텍스트", value: "text" },
];

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  company,
  title = "QR 코드 생성",
}) => {
  const [qrType, setQrType] = useState<
    "company" | "contact" | "website" | "text"
  >("company");
  const [qrData, setQrData] = useState<QRCodeData>({
    type: "company",
    company: company,
  });
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 200,
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    errorCorrectionLevel: "M",
    includeMargin: true,
  });
  const [qrCodeUri, setQrCodeUri] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 연락처 정보 상태
  const [contactInfo, setContactInfo] = useState({
    name: company?.name || "",
    phone: company?.phoneNumber || "",
    email: company?.email || "",
    address: company?.address || "",
  });

  // 웹사이트 정보 상태
  const [website, setWebsite] = useState("");

  // 텍스트 정보 상태
  const [text, setText] = useState("");

  useEffect(() => {
    if (company) {
      setContactInfo({
        name: company.name,
        phone: company.phoneNumber,
        email: company.email || "",
        address: company.address,
      });
      setQrData({
        type: qrType,
        company: qrType === "company" ? company : undefined,
        contactInfo:
          qrType === "contact"
            ? {
                name: company.name,
                phone: company.phoneNumber,
                email: company.email,
                address: company.address,
              }
            : undefined,
      });
    }
  }, [company, qrType]);

  const handleTypeChange = (type: string) => {
    const newType = type as typeof qrType;
    setQrType(newType);

    switch (newType) {
      case "company":
        setQrData({
          type: "company",
          company: company,
        });
        break;
      case "contact":
        setQrData({
          type: "contact",
          contactInfo: contactInfo,
        });
        break;
      case "website":
        setQrData({
          type: "website",
          website: website,
        });
        break;
      case "text":
        setQrData({
          type: "text",
          text: text,
        });
        break;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // QR 코드 데이터를 문자열로 변환
      const qrString = qrCodeService.qrDataToString(qrData);

      // 실제 QR 코드 라이브러리가 없으므로 임시로 문자열을 저장
      // 추후 react-native-qrcode-svg 등의 라이브러리로 교체 필요
      setQrCodeUri(qrString);
    } catch (error) {
      Alert.alert("오류", "QR 코드 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!qrCodeUri) {
      Alert.alert("알림", "먼저 QR 코드를 생성해주세요.");
      return;
    }

    try {
      await Share.share({
        message: "QR 코드를 공유합니다.",
        url: qrCodeUri,
      });
    } catch (error) {
      Alert.alert("오류", "공유 중 오류가 발생했습니다.");
    }
  };

  const renderTypeSpecificFields = () => {
    switch (qrType) {
      case "company":
        return (
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>회사 정보</Text>
            {company ? (
              <View style={listStyles.card}>
                <Text style={listStyles.cardTitle}>{company.name}</Text>
                <Text style={listStyles.cardSubtitle}>{company.address}</Text>
                <Text style={listStyles.cardSubtitle}>
                  {company.phoneNumber}
                </Text>
                {company.email && (
                  <Text style={listStyles.cardSubtitle}>{company.email}</Text>
                )}
              </View>
            ) : (
              <Text style={formStyles.helpText}>회사 정보가 없습니다.</Text>
            )}
          </View>
        );

      case "contact":
        return (
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>연락처 정보</Text>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>이름 *</Text>
              <TextInput
                value={contactInfo.name}
                onChangeText={(value) => {
                  setContactInfo({ ...contactInfo, name: value });
                  setQrData({
                    type: "contact",
                    contactInfo: { ...contactInfo, name: value },
                  });
                }}
                placeholder="이름을 입력하세요"
              />
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>전화번호 *</Text>
              <TextInput
                value={contactInfo.phone}
                onChangeText={(value) => {
                  setContactInfo({ ...contactInfo, phone: value });
                  setQrData({
                    type: "contact",
                    contactInfo: { ...contactInfo, phone: value },
                  });
                }}
                placeholder="전화번호를 입력하세요"
                keyboardType="phone-pad"
              />
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>이메일</Text>
              <TextInput
                value={contactInfo.email}
                onChangeText={(value) => {
                  setContactInfo({ ...contactInfo, email: value });
                  setQrData({
                    type: "contact",
                    contactInfo: { ...contactInfo, email: value },
                  });
                }}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
              />
            </View>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>주소</Text>
              <TextInput
                value={contactInfo.address}
                onChangeText={(value) => {
                  setContactInfo({ ...contactInfo, address: value });
                  setQrData({
                    type: "contact",
                    contactInfo: { ...contactInfo, address: value },
                  });
                }}
                placeholder="주소를 입력하세요"
                multiline
              />
            </View>
          </View>
        );

      case "website":
        return (
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>웹사이트 정보</Text>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>웹사이트 URL *</Text>
              <TextInput
                value={website}
                onChangeText={(value) => {
                  setWebsite(value);
                  setQrData({
                    type: "website",
                    website: value,
                  });
                }}
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>
        );

      case "text":
        return (
          <View style={formStyles.section}>
            <Text style={formStyles.sectionTitle}>텍스트 정보</Text>

            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>텍스트 *</Text>
              <TextInput
                value={text}
                onChangeText={(value) => {
                  setText(value);
                  setQrData({
                    type: "text",
                    text: value,
                  });
                }}
                placeholder="QR 코드에 포함할 텍스트를 입력하세요"
                multiline
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.container, { maxHeight: "90%" }]}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {qrCodeUri && (
                <TouchableOpacity
                  onPress={handleShare}
                  style={[
                    modalStyles.buttonSecondary,
                    { paddingVertical: 8, paddingHorizontal: 12 },
                  ]}
                >
                  <Text
                    style={[modalStyles.buttonTextSecondary, { fontSize: 12 }]}
                  >
                    공유
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={modalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* QR 코드 타입 선택 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>QR 코드 타입</Text>
              <Picker
                selectedValue={qrType}
                onValueChange={handleTypeChange}
                options={qrTypeOptions}
              />
            </View>

            {/* 타입별 입력 필드 */}
            {renderTypeSpecificFields()}

            {/* QR 코드 옵션 */}
            <View style={formStyles.section}>
              <Text style={formStyles.sectionTitle}>QR 코드 옵션</Text>

              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>크기</Text>
                <Picker
                  selectedValue={qrOptions.size.toString()}
                  onValueChange={(value) =>
                    setQrOptions({ ...qrOptions, size: parseInt(value) })
                  }
                  options={[
                    { label: "작음 (150px)", value: "150" },
                    { label: "보통 (200px)", value: "200" },
                    { label: "큼 (300px)", value: "300" },
                    { label: "매우 큼 (400px)", value: "400" },
                  ]}
                />
              </View>

              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>오류 수정 레벨</Text>
                <Picker
                  selectedValue={qrOptions.errorCorrectionLevel}
                  onValueChange={(value) =>
                    setQrOptions({
                      ...qrOptions,
                      errorCorrectionLevel: value as "L" | "M" | "Q" | "H",
                    })
                  }
                  options={[
                    { label: "낮음 (L)", value: "L" },
                    { label: "보통 (M)", value: "M" },
                    { label: "높음 (Q)", value: "Q" },
                    { label: "최고 (H)", value: "H" },
                  ]}
                />
              </View>
            </View>

            {/* QR 코드 미리보기 */}
            {qrCodeUri && (
              <View style={formStyles.section}>
                <Text style={formStyles.sectionTitle}>미리보기</Text>
                <View style={[listStyles.card, { alignItems: "center" }]}>
                  <View
                    style={{
                      width: qrOptions.size,
                      height: qrOptions.size,
                      backgroundColor: COLORS.border,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.textSecondary }}>QR 코드</Text>
                  </View>
                  <Text
                    style={[
                      formStyles.helpText,
                      { marginTop: 10, textAlign: "center" },
                    ]}
                  >
                    실제 앱에서는 생성된 QR 코드가 여기에 표시됩니다.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={modalStyles.buttonSecondary}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonTextSecondary}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                modalStyles.buttonPrimary,
                isGenerating && formStyles.buttonDisabled,
              ]}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              <Text style={modalStyles.buttonText}>
                {isGenerating ? "생성 중..." : "QR 코드 생성"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
