import { StyleSheet } from "react-native";
import { COLORS } from "../../styles/colors";

export const formStyles = StyleSheet.create({
  // 기본 컨테이너
  container: {
    padding: 20,
    backgroundColor: COLORS.background,
  },

  // 입력 필드 스타일
  fieldContainer: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 5,
  },

  requiredLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 5,
  },

  requiredMark: {
    color: COLORS.error,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    minHeight: 44,
  },

  inputFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  inputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // 선택 필드 스타일
  picker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },

  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    minHeight: 44,
  },

  pickerText: {
    fontSize: 16,
    color: COLORS.text,
  },

  pickerPlaceholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },

  // 체크박스 스타일
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkboxLabel: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },

  // 라디오 버튼 스타일
  radioGroup: {
    marginBottom: 15,
  },

  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  radioCircleSelected: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },

  radioLabel: {
    fontSize: 16,
    color: COLORS.text,
  },

  // 버튼 그룹 스타일
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },

  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.white,
  },

  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },

  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },

  // 에러 및 도움말 텍스트
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 5,
  },

  helpText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },

  // 구분선
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },

  // 섹션 스타일
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },

  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
});
