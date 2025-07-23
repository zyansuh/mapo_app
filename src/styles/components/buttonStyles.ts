import { StyleSheet } from "react-native";
import { THEME, TYPOGRAPHY, SPACING, SHADOWS } from "../themes";
import { DIMENSIONS } from "../dimensions";

export const buttonStyles = StyleSheet.create({
  // 기본 버튼
  base: {
    ...THEME.components.button,
    alignItems: "center",
    justifyContent: "center",
    minHeight: DIMENSIONS.button.height.medium,
  },

  // 버튼 크기
  small: {
    minHeight: DIMENSIONS.button.height.small,
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
  },
  medium: {
    minHeight: DIMENSIONS.button.height.medium,
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
  },
  large: {
    minHeight: DIMENSIONS.button.height.large,
    paddingHorizontal: SPACING.large,
    paddingVertical: SPACING.normal,
  },

  // 버튼 타입
  primary: {
    backgroundColor: THEME.colors.primary,
    ...SHADOWS.small,
  },
  secondary: {
    backgroundColor: THEME.colors.white,
    borderWidth: THEME.sizes.border.normal,
    borderColor: THEME.colors.primary,
  },
  success: {
    backgroundColor: THEME.colors.success,
    ...SHADOWS.small,
  },
  warning: {
    backgroundColor: THEME.colors.warning,
    ...SHADOWS.small,
  },
  error: {
    backgroundColor: THEME.colors.error,
    ...SHADOWS.small,
  },

  // 버튼 텍스트
  primaryText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },
  secondaryText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.primary,
  },
  successText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },
  warningText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },
  errorText: {
    ...TYPOGRAPHY.button,
    color: THEME.colors.white,
  },

  // 아이콘 버튼
  iconButton: {
    width: DIMENSIONS.button.height.medium,
    height: DIMENSIONS.button.height.medium,
    borderRadius: THEME.sizes.radius.small,
    alignItems: "center",
    justifyContent: "center",
  },

  // 플로팅 액션 버튼
  fab: {
    width: THEME.sizes.icon.xlarge + SPACING.medium,
    height: THEME.sizes.icon.xlarge + SPACING.medium,
    borderRadius: THEME.sizes.radius.round,
    backgroundColor: THEME.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.large,
  },

  // 버튼 상태
  disabled: {
    backgroundColor: THEME.colors.textSecondary,
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export const BUTTON_VARIANTS = {
  primary: {
    style: [buttonStyles.base, buttonStyles.primary],
    textStyle: buttonStyles.primaryText,
  },
  secondary: {
    style: [buttonStyles.base, buttonStyles.secondary],
    textStyle: buttonStyles.secondaryText,
  },
  success: {
    style: [buttonStyles.base, buttonStyles.success],
    textStyle: buttonStyles.successText,
  },
  warning: {
    style: [buttonStyles.base, buttonStyles.warning],
    textStyle: buttonStyles.warningText,
  },
  error: {
    style: [buttonStyles.base, buttonStyles.error],
    textStyle: buttonStyles.errorText,
  },
} as const;
