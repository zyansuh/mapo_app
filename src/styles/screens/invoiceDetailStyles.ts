import { StyleSheet, Platform } from "react-native";
import { THEME, TYPOGRAPHY, SPACING, SHADOWS } from "../themes";
import { DIMENSIONS } from "../dimensions";

export const invoiceDetailStyles = StyleSheet.create({
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
  editButton: {
    padding: SPACING.small,
  },

  // 콘텐츠 스타일
  content: {
    flex: 1,
    padding: SPACING.medium,
  },
  section: {
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

  // 정보 행 스타일
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.normal,
  },
  infoLabel: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.text,
    flex: 2,
    textAlign: "right",
  },

  // 상태 관련 스타일
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.small,
  },
  statusBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: THEME.sizes.radius.small,
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },
  statusChangeButton: {
    padding: SPACING.tiny,
  },

  // 품목 카드 스타일
  itemCard: {
    backgroundColor: THEME.colors.background,
    padding: SPACING.normal,
    borderRadius: THEME.sizes.radius.small,
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
  itemName: {
    ...TYPOGRAPHY.body1,
    fontWeight: "600",
    color: THEME.colors.text,
    flex: 1,
  },
  taxTypeBadge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: THEME.sizes.radius.small,
  },
  taxTypeText: {
    ...TYPOGRAPHY.caption,
    fontWeight: "600",
  },

  // 품목 상세 정보
  itemDetails: {
    gap: SPACING.tiny,
  },
  itemDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetailLabel: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.textSecondary,
  },
  itemDetailValue: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.text,
  },
  itemTotalLabel: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.text,
  },
  itemTotalValue: {
    ...TYPOGRAPHY.body2,
    fontWeight: "600",
    color: THEME.colors.primary,
  },

  // 합계 스타일
  totalContainer: {
    gap: SPACING.small,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: SPACING.small,
    borderTopWidth: THEME.sizes.border.normal,
    borderTopColor: THEME.colors.border,
  },
  totalLabel: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.textSecondary,
  },
  totalValue: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.text,
  },
  grandTotalRow: {
    marginTop: SPACING.small,
    paddingTop: SPACING.normal,
    borderTopWidth: THEME.sizes.border.thick,
    borderTopColor: THEME.colors.text,
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

  // 액션 버튼 스타일
  actionSection: {
    flexDirection: "row",
    gap: SPACING.normal,
    marginTop: SPACING.medium,
    marginBottom: SPACING.huge * 2,
  },
  actionButton: {
    ...THEME.components.button,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.normal,
    borderRadius: THEME.sizes.radius.small,
    gap: SPACING.small,
  },
  actionButtonText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },
});

export default invoiceDetailStyles;
