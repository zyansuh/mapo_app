import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../../styles/colors";

const { width, height } = Dimensions.get("window");

export const modalStyles = StyleSheet.create({
  // 기본 모달 스타일
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 20,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    width: "100%",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  // 헤더 스타일
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },

  closeButton: {
    padding: 4,
  },

  // 컨텐츠 스타일
  content: {
    flex: 1,
  },

  scrollContent: {
    flex: 1,
  },

  // 푸터 스타일
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 20,
    gap: 10,
  },

  // 버튼 스타일
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },

  buttonSecondary: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },

  buttonTextSecondary: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },

  // 폼 스타일
  formRow: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 5,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 44,
  },

  // 선택 버튼 스타일
  selectButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },

  selectButtonPlaceholder: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },

  // 에러 스타일
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 5,
  },

  // 탭 스타일
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: COLORS.primary,
  },

  tabText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },

  tabTextActive: {
    color: COLORS.white,
  },
});
