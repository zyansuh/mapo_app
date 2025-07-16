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
import { CompanyType, CompanyRegion } from "../types";
import { useCompany } from "../hooks";
import { useTheme } from "../hooks/useTheme";
import { useLocalization } from "../localization/i18n";
import { createScaledStyles } from "../styles/globalStyles";
import {
  useKeyboardShortcuts,
  commonShortcuts,
} from "../hooks/useKeyboardShortcuts";

export default function CompanyEditScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { t } = useLocalization();
  const { companies, addCompany, updateCompany } = useCompany();
  const { companyId } = (route.params as any) || {};

  const existingCompany = companyId
    ? companies.find((c) => c.id === companyId)
    : null;

  const [formData, setFormData] = useState({
    name: existingCompany?.name || "",
    type: existingCompany?.type || ("고객사" as CompanyType),
    region: existingCompany?.region || ("순창" as CompanyRegion),
    phoneNumber: existingCompany?.phoneNumber || "",
    address: existingCompany?.address || "",
    email: existingCompany?.email || "",
    contactPerson: existingCompany?.contactPerson || "",
    businessNumber: existingCompany?.businessNumber || "",
    memo: existingCompany?.memo || "",
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

  const styles = createScaledStyles(theme.colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {/* 업체명 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.name")} *
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.name}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, name: text }))
              }
              placeholder="업체명을 입력하세요"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* 업체구분 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.type")}
            </Text>
            <View style={localStyles.radioGroup}>
              {(
                ["고객사", "협력업체", "공급업체", "하청업체"] as CompanyType[]
              ).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    localStyles.radioOption,
                    formData.type === type && {
                      backgroundColor: theme.colors.primary + "20",
                    },
                  ]}
                  onPress={() => setFormData((prev) => ({ ...prev, type }))}
                >
                  <Text
                    style={[
                      styles.textNormal,
                      {
                        color:
                          formData.type === type
                            ? theme.colors.primary
                            : theme.colors.text,
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
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.region")}
            </Text>
            <View style={localStyles.radioGroup}>
              {(["순창", "담양", "장성", "기타"] as CompanyRegion[]).map(
                (region) => (
                  <TouchableOpacity
                    key={region}
                    style={[
                      localStyles.radioOption,
                      formData.region === region && {
                        backgroundColor: theme.colors.primary + "20",
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
                              ? theme.colors.primary
                              : theme.colors.text,
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
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.phoneNumber")} *
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              placeholder="010-1234-5678"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          {/* 주소 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.address")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              placeholder="주소를 입력하세요"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* 이메일 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.email")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              placeholder="email@example.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 담당자 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.contactPerson")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.contactPerson}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, contactPerson: text }))
              }
              placeholder="담당자명을 입력하세요"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* 사업자등록번호 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.businessNumber")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={formData.businessNumber}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, businessNumber: text }))
              }
              placeholder="123-45-67890"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* 메모 */}
          <View style={localStyles.inputGroup}>
            <Text style={[styles.textMedium, localStyles.label]}>
              {t("company.memo")}
            </Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text, height: 80 }]}
              value={formData.memo}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, memo: text }))
              }
              placeholder="메모를 입력하세요"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* 버튼들 */}
          <View style={localStyles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonSecondary, localStyles.button]}
              onPress={handleCancel}
            >
              <Text
                style={[styles.textMedium, { color: theme.colors.primary }]}
              >
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonPrimary, localStyles.button]}
              onPress={handleSave}
            >
              <Text style={[styles.textMedium, { color: theme.colors.white }]}>
                {t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={localStyles.helpText}>
            <Text
              style={[styles.textSmall, { color: theme.colors.textSecondary }]}
            >
              💡 단축키: Ctrl+S (저장), ESC (취소)
            </Text>
          </View>
        </View>
      </ScrollView>
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
});
