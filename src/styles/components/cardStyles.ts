import { StyleSheet } from "react-native";
import { THEME, TYPOGRAPHY, SPACING, SHADOWS } from "../themes";

export const cardStyles = StyleSheet.create({
  // 기본 카드
  base: {
    ...THEME.components.card,
  },

  // 카드 변형
  elevated: {
    ...THEME.components.card,
    ...SHADOWS.medium,
  },
  outlined: {
    backgroundColor: THEME.colors.white,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.border,
    borderRadius: THEME.sizes.radius.normal,
    padding: SPACING.cardPadding,
  },
  filled: {
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.sizes.radius.normal,
    padding: SPACING.cardPadding,
  },

  // 카드 헤더
  header: {
    borderBottomWidth: THEME.sizes.border.normal,
    borderBottomColor: THEME.colors.border,
    paddingBottom: SPACING.normal,
    marginBottom: SPACING.normal,
  },
  headerTitle: {
    ...TYPOGRAPHY.h4,
    color: THEME.colors.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body2,
    color: THEME.colors.textSecondary,
    marginTop: SPACING.tiny,
  },

  // 카드 콘텐츠
  content: {
    flex: 1,
  },

  // 카드 푸터
  footer: {
    borderTopWidth: THEME.sizes.border.normal,
    borderTopColor: THEME.colors.border,
    paddingTop: SPACING.normal,
    marginTop: SPACING.normal,
  },

  // 카드 액션
  actions: {
    flexDirection: "row",
    gap: SPACING.small,
    justifyContent: "flex-end",
    marginTop: SPACING.normal,
  },

  // 리스트 카드
  listItem: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.sizes.radius.small,
    padding: SPACING.normal,
    marginVertical: SPACING.tiny,
    marginHorizontal: SPACING.medium,
    ...SHADOWS.small,
  },
  listItemPressed: {
    backgroundColor: THEME.colors.background,
    opacity: 0.8,
  },

  // 상태별 카드
  success: {
    borderLeftWidth: SPACING.tiny,
    borderLeftColor: THEME.colors.success,
  },
  warning: {
    borderLeftWidth: SPACING.tiny,
    borderLeftColor: THEME.colors.warning,
  },
  error: {
    borderLeftWidth: SPACING.tiny,
    borderLeftColor: THEME.colors.error,
  },
  info: {
    borderLeftWidth: SPACING.tiny,
    borderLeftColor: THEME.colors.primary,
  },
});
