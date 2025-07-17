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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CompanyType, CompanyRegion, CompanyStatus } from "../types";
import { useCompany } from "../hooks";
import { useLocalization } from "../localization/i18n";
import { AddressSearchModal } from "../components/modals/AddressSearchModal";
import {
  useKeyboardShortcuts,
  commonShortcuts,
} from "../hooks/useKeyboardShortcuts";

// 정적 색상 정의
const COLORS = {
  primary: "#007bff",
  text: "#343a40",
  textSecondary: "#6c757d",
  white: "#ffffff",
};

export default function CompanyEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useLocalization();
  const { companies, addCompany, updateCompany } = useCompany();
  const { companyId } = (route.params as any) || {};

  // 주소 검색 모달 상태 추가
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const existingCompany = companyId
    ? companies.find((c) => c.id === companyId)
    : null;

  const [formData, setFormData] = useState({
    name: existingCompany?.name || "",
    type: existingCompany?.type || ("고객사" as CompanyType),
    region: existingCompany?.region || ("순창" as CompanyRegion),
    status: existingCompany?.status || ("활성" as CompanyStatus),
    phoneNumber: existingCompany?.phoneNumber || "",
    address: existingCompany?.address || "",
    email: existingCompany?.email || "",
    contactPerson: existingCompany?.contactPerson || "",
    contactPhone: existingCompany?.contactPhone || "",
    businessNumber: existingCompany?.businessNumber || "",
    memo: existingCompany?.memo || "",
    tags: existingCompany?.tags || [],
  });

  // 키보드 단축키 설정
  useKeyboardShortcuts(
    {
      save: handleSave,
      cancel: handleCancel,
    },
    [commonShortcuts.save(handleSave), commonShortcuts.cancel(handleCancel)]
  );

  function handleSave() {
    if (!formData.name.trim()) {
      Alert.alert(t("errors.invalidInput"), "업체명을 입력해주세요.");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert(t("errors.invalidInput"), "전화번호를 입력해주세요.");
      return;
    }

    const companyData = {
      ...formData,
      id: companyId || `company_${Date.now()}`,
      isFavorite: existingCompany?.isFavorite || false,
      createdAt: existingCompany?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (companyId) {
      updateCompany(companyId, companyData);
      Alert.alert(t("success.saved"), "업체 정보가 수정되었습니다.");
    } else {
      addCompany(companyData);
      Alert.alert(t("success.saved"), "새 업체가 등록되었습니다.");
    }

    navigation.goBack();
  }

  function handleCancel() {
    navigation.goBack();
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f8f9fa",
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      padding: 20,
      paddingTop: 0,
    },
    textMedium: {
      fontSize: 16,
    },
    textNormal: {
      fontSize: 14,
    },
    textSmall: {
      fontSize: 12,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ced4da",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 14,
      color: COLORS.text,
    },
    buttonPrimary: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondary: {
      backgroundColor: "#e9ecef",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {/* 업체명 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>업체명 *</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="업체명을 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {/* 업체구분 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>업체구분</Text>
            <View style={localStyles.radioGroup}>
              {(
                ["고객사", "협력업체", "공급업체", "하청업체"] as CompanyType[]
              ).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    localStyles.radioOption,
                    formData.type === type && {
                      backgroundColor: COLORS.primary + "20",
                    },
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, type }))}
                >
                  <Text
                    style={[
                      styles.textNormal,
                      {
                        color:
                          formData.type === type ? COLORS.primary : COLORS.text,
                      },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 지역 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>지역</Text>
            <View style={localStyles.radioGroup}>
              {(["순창", "담양", "장성", "기타"] as CompanyRegion[]).map(
                (region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      localStyles.radioOption,
                      formData.region === region && {
                        backgroundColor: COLORS.primary + "20",
                      },
                    ]}
                    onPress={() => setFormData((prev) => ({ ...prev, region }))}
                  >
                    <Text
                      style={[
                        styles.textNormal,
                        {
                          color:
                            formData.region === region
                              ? COLORS.primary
                              : COLORS.text,
                        },
                      ]}
                    >
                      {region}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* 전화번호 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>전화번호</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              placeholder="010-1234-5678"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          {/* 주소 - 카카오맵 검색 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>주소</Text>
            <TouchableOpacity
              style={[styles.input, localStyles.addressInput]}
              onPress={() => setAddressModalVisible(true)}
            >
              <Text
                style={[
                  styles.textNormal,
                  {
                    color: formData.address
                      ? COLORS.text
                      : COLORS.textSecondary,
                  },
                ]}
              >
                {formData.address || "주소를 검색하세요"}
              </Text>
              <Text style={[styles.textSmall, { color: COLORS.primary }]}>
                🔍 검색
              </Text>
            </TouchableOpacity>
          </View>

          {/* 이메일 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>이메일</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="email@example.com"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 담당자명 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>담당자명</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.contactPerson}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, contactPerson: text }))
              }
              placeholder="담당자명을 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {/* 사업자등록번호 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              사업자등록번호
            </Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.businessNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, businessNumber: text }))
              }
              placeholder="123-45-67890"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          {/* 메모 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>메모</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text, height: 80 }]}
              value={formData.memo}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, memo: text }))
              }
              placeholder="메모를 입력하세요"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* 저장 버튼 */}
          <View style={localStyles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonSecondary, localStyles.button]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.textMedium, { color: COLORS.primary }]}>
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonPrimary, localStyles.button]}
              onPress={handleSave}
            >
              <Text style={[styles.textMedium, { color: COLORS.white }]}>
                저장
              </Text>
            </TouchableOpacity>
          </View>

          {/* 도움말 */}
          <View style={localStyles.helpText}>
            <Text style={[styles.textSmall, { color: COLORS.textSecondary }]}>
              💡 단축키: Ctrl+S (저장), ESC (취소)
            </Text>
          </View>
        </View>
      </ScrollView>
      <AddressSearchModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSelectAddress={(address) => {
          setFormData((prev) => ({ ...prev, address }));
          setAddressModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  radioOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 16,
  },
  button: {
    flex: 1,
  },
  helpText: {
    marginTop: 16,
    alignItems: "center",
  },
  addressInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    fontSize: 14,
    color: COLORS.text,
  },
});
