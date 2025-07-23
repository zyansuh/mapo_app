import { StyleSheet, Platform } from "react-native";
import { THEME, TYPOGRAPHY, SPACING, SHADOWS } from "../themes";
import { DIMENSIONS } from "../dimensions";

export const invoiceEditStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },

  // 헤더 스타일
  header: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: SPACING.small,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    flex: 1,
    textAlign: "center",
    marginHorizontal: SPACING.medium,
    color: THEME.colors.white,
  },
  saveButton: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.sizes.radius.small,
    paddingHorizontal: SPACING.normal,
    paddingVertical: SPACING.small,
  },
  saveButtonText: {
    ...TYPOGRAPHY.buttonSmall,
    color: THEME.colors.primary,
  },

  // 스크롤 콘텐츠
  scrollContent: {
    flex: 1,
    padding: SPACING.medium,
  },

  // 폼 섹션
  formSection: {
    ...THEME.components.card,
    marginBottom: SPACING.medium,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: THEME.colors.text,
    marginBottom: SPACING.medium,
  },

  // 폼 필드
  fieldContainer: {
    marginBottom: SPACING.medium,
  },
  fieldLabel: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.text,
    marginBottom: SPACING.small,
    fontWeight: "600",
  },
  requiredLabel: {
    color: THEME.colors.error,
  },
  textInput: {
    ...THEME.components.input,
    minHeight: DIMENSIONS.input.height,
  },

  // 거래처 선택
  companySelector: {
    ...THEME.components.input,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: DIMENSIONS.input.height,
  },
  companySelectorText: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.text,
    flex: 1,
  },
  companySelectorPlaceholder: {
    color: THEME.colors.textSecondary,
  },

  // 상태 선택
  statusSelector: {
    marginBottom: SPACING.medium,
  },
  statusButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.small,
    marginBottom: SPACING.small,
  },
  statusButton: {
    paddingHorizontal: SPACING.normal,
    paddingVertical: SPACING.small,
    borderRadius: THEME.sizes.radius.small,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  statusButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  statusButtonText: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.text,
    textAlign: "center",
  },
  statusButtonTextActive: {
    color: THEME.colors.white,
    fontWeight: "600",
  },
  statusDescription: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.textSecondary,
    marginTop: SPACING.small,
    fontStyle: "italic",
  },

  // 품목 관련
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.medium,
  },
  addItemButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.sizes.radius.small,
    paddingHorizontal: SPACING.normal,
    paddingVertical: SPACING.small,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.tiny,
  },
  addItemButtonText: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.white,
    fontWeight: "600",
  },

  // 품목 카드
  itemCard: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.sizes.radius.small,
    padding: SPACING.normal,
    marginBottom: SPACING.normal,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.normal,
  },
  itemTitle: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  removeItemButton: {
    padding: SPACING.tiny,
  },

  // 품목 입력 필드
  itemRow: {
    flexDirection: "row",
    gap: SPACING.small,
    marginBottom: SPACING.small,
  },
  itemInputHalf: {
    flex: 1,
  },
  itemInputFull: {
    flex: 1,
  },

  // 과세 구분
  taxTypeContainer: {
    marginBottom: SPACING.small,
  },
  taxTypeButtons: {
    flexDirection: "row",
    gap: SPACING.small,
  },
  taxTypeButton: {
    flex: 1,
    paddingVertical: SPACING.small,
    borderRadius: THEME.sizes.radius.small,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.white,
  },
  taxTypeButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  taxTypeButtonText: {
    ...TYPOGRAPHY.caption,
    textAlign: "center",
    color: THEME.colors.text,
  },
  taxTypeButtonTextActive: {
    color: THEME.colors.white,
    fontWeight: "600",
  },

  // 계산 결과
  calculationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.tiny,
  },
  calculationLabel: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.textSecondary,
  },
  calculationValue: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.text,
    fontWeight: "600",
  },

  // 합계 섹션
  totalSection: {
    borderTopWidth: THEME.sizes.border.normal,
    borderTopColor: THEME.colors.border,
    paddingTop: SPACING.normal,
    marginTop: SPACING.normal,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.small,
  },
  totalLabel: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.textSecondary,
  },
  totalValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  grandTotalRow: {
    borderTopWidth: THEME.sizes.border.thick,
    borderTopColor: THEME.colors.text,
    paddingTop: SPACING.small,
    marginTop: SPACING.small,
  },
  grandTotalLabel: {
    ...TYPOGRAPHY.body1,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  grandTotalValue: {
    ...TYPOGRAPHY.h4,
    fontWeight: "700",
    color: THEME.colors.primary,
  },

  // 하단 버튼
  bottomButton: {
    backgroundColor: THEME.colors.primary,
    marginHorizontal: SPACING.medium,
    marginVertical: SPACING.medium,
    borderRadius: THEME.sizes.radius.small,
    paddingVertical: SPACING.medium,
    alignItems: "center",
    ...SHADOWS.small,
  },
  bottomButtonText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },

  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    ...THEME.components.modal,
    maxHeight: THEME.sizes.screen.height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.medium,
    paddingBottom: SPACING.normal,
    borderBottomWidth: THEME.sizes.border.normal,
    borderBottomColor: THEME.colors.border,
  },
  modalTitle: {
    ...TYPOGRAPHY.h4,
    color: THEME.colors.text,
  },
  modalCloseButton: {
    padding: SPACING.small,
  },

  // 검색 입력
  searchInput: {
    ...THEME.components.input,
    marginBottom: SPACING.medium,
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.normal,
  },
  searchResultsCount: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.textSecondary,
  },
  showAllButton: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: THEME.sizes.radius.small,
    backgroundColor: THEME.colors.background,
  },
  showAllButtonText: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.primary,
    fontWeight: "600",
  },

  // 회사 리스트 아이템
  companyItem: {
    padding: SPACING.normal,
    borderRadius: THEME.sizes.radius.small,
    marginBottom: SPACING.small,
    backgroundColor: THEME.colors.white,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
  },
  companyItemPressed: {
    backgroundColor: THEME.colors.background,
  },
  companyName: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.text,
    marginBottom: SPACING.tiny,
  },
  companyDetails: {
    flexDirection: "row",
    gap: SPACING.small,
  },
  companyDetailItem: {
    ...TYPOGRAPHY.caption,
    color: THEME.colors.textSecondary,
  },
});

export default invoiceEditStyles;
