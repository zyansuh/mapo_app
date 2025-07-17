import { StyleSheet } from "react-native";
import {
  scale,
  verticalScale,
  scaledSizes,
  screenInfo,
} from "../utils/scaling";
import { Theme } from "../types";

// 기본 색상 팔레트 (테마와 독립적)
export const colorPalette = {
  // Primary colors
  blue: {
    50: "#EBF8FF",
    100: "#BEE3F8",
    200: "#90CDF4",
    300: "#63B3ED",
    400: "#4299E1",
    500: "#3182CE",
    600: "#2B77CB",
    700: "#2C5282",
    800: "#2A4365",
    900: "#1A365D",
  },

  // Success colors
  green: {
    50: "#F0FFF4",
    100: "#C6F6D5",
    200: "#9AE6B4",
    300: "#68D391",
    400: "#48BB78",
    500: "#38A169",
    600: "#2F855A",
    700: "#276749",
    800: "#22543D",
    900: "#1C4532",
  },

  // Warning colors
  orange: {
    50: "#FFFAF0",
    100: "#FEEBC8",
    200: "#FBD38D",
    300: "#F6AD55",
    400: "#ED8936",
    500: "#DD6B20",
    600: "#C05621",
    700: "#9C4221",
    800: "#7B341E",
    900: "#652B19",
  },

  // Error colors
  red: {
    50: "#FED7D7",
    100: "#FEB2B2",
    200: "#FC8181",
    300: "#F56565",
    400: "#E53E3E",
    500: "#C53030",
    600: "#9B2C2C",
    700: "#822727",
    800: "#63171B",
    900: "#3C0A0C",
  },

  // Gray colors
  gray: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923",
  },
};

// 지역별 색상 테마
export const regionColors = {
  순창: {
    primary: colorPalette.gray[600],
    secondary: colorPalette.gray[400],
    accent: colorPalette.gray[500],
  },
  담양: {
    primary: colorPalette.green[600],
    secondary: colorPalette.green[400],
    accent: colorPalette.green[500],
  },
  장성: {
    primary: colorPalette.red[600],
    secondary: colorPalette.red[400],
    accent: colorPalette.red[500],
  },
  기타: {
    primary: colorPalette.gray[600],
    secondary: colorPalette.gray[400],
    accent: colorPalette.gray[500],
  },
};

// 스케일된 스타일 생성 함수
export const createScaledStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: screenInfo.isTablet
        ? scaledSizes.spacing.large
        : scaledSizes.spacing.medium,
    },

    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
      padding: scaledSizes.spacing.large,
    },

    scrollContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    contentContainer: {
      flexGrow: 1,
      padding: scaledSizes.spacing.medium,
    },

    // Layout styles
    row: {
      flexDirection: "row",
      alignItems: "center",
    },

    rowSpaceBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    rowCenter: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },

    column: {
      flexDirection: "column",
    },

    columnCenter: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },

    // Card styles
    card: {
      backgroundColor: colors.surface,
      borderRadius: scaledSizes.radius.medium,
      padding: scaledSizes.spacing.medium,
      marginBottom: scaledSizes.spacing.small,
      borderWidth: scaledSizes.border.normal,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: scale(4),
      elevation: 3,
    },

    cardLarge: {
      backgroundColor: colors.surface,
      borderRadius: scaledSizes.radius.large,
      padding: scaledSizes.spacing.large,
      marginBottom: scaledSizes.spacing.medium,
      borderWidth: scaledSizes.border.normal,
      borderColor: colors.border,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(3),
      },
      shadowOpacity: 0.15,
      shadowRadius: scale(6),
      elevation: 5,
    },

    // Text styles
    textTiny: {
      fontSize: scaledSizes.text.tiny,
      color: colors.text,
    },

    textSmall: {
      fontSize: scaledSizes.text.small,
      color: colors.text,
    },

    textNormal: {
      fontSize: scaledSizes.text.normal,
      color: colors.text,
    },

    textMedium: {
      fontSize: scaledSizes.text.medium,
      color: colors.text,
      fontWeight: "500",
    },

    textLarge: {
      fontSize: scaledSizes.text.large,
      color: colors.text,
      fontWeight: "600",
    },

    textXLarge: {
      fontSize: scaledSizes.text.xlarge,
      color: colors.text,
      fontWeight: "600",
    },

    textXXLarge: {
      fontSize: scaledSizes.text.xxlarge,
      color: colors.text,
      fontWeight: "bold",
    },

    textHuge: {
      fontSize: scaledSizes.text.huge,
      color: colors.text,
      fontWeight: "bold",
    },

    // Text variants
    textSecondary: {
      fontSize: scaledSizes.text.normal,
      color: colors.textSecondary,
    },

    textPrimary: {
      fontSize: scaledSizes.text.normal,
      color: colors.primary,
      fontWeight: "500",
    },

    textSuccess: {
      fontSize: scaledSizes.text.normal,
      color: colors.success,
      fontWeight: "500",
    },

    textWarning: {
      fontSize: scaledSizes.text.normal,
      color: colors.warning,
      fontWeight: "500",
    },

    textError: {
      fontSize: scaledSizes.text.normal,
      color: colors.error,
      fontWeight: "500",
    },

    // Button styles
    buttonPrimary: {
      backgroundColor: colors.primary,
      paddingHorizontal: scaledSizes.spacing.large,
      paddingVertical: scaledSizes.spacing.medium,
      borderRadius: scaledSizes.radius.normal,
      alignItems: "center",
      justifyContent: "center",
      minHeight: scaledSizes.button.normal,
    },

    buttonSecondary: {
      backgroundColor: colors.surface,
      paddingHorizontal: scaledSizes.spacing.large,
      paddingVertical: scaledSizes.spacing.medium,
      borderRadius: scaledSizes.radius.normal,
      borderWidth: scaledSizes.border.normal,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      minHeight: scaledSizes.button.normal,
    },

    buttonOutline: {
      backgroundColor: "transparent",
      paddingHorizontal: scaledSizes.spacing.large,
      paddingVertical: scaledSizes.spacing.medium,
      borderRadius: scaledSizes.radius.normal,
      borderWidth: scaledSizes.border.normal,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
      minHeight: scaledSizes.button.normal,
    },

    buttonSmall: {
      paddingHorizontal: scaledSizes.spacing.medium,
      paddingVertical: scaledSizes.spacing.small,
      borderRadius: scaledSizes.radius.small,
      minHeight: scaledSizes.button.small,
    },

    buttonLarge: {
      paddingHorizontal: scaledSizes.spacing.xlarge,
      paddingVertical: scaledSizes.spacing.large,
      borderRadius: scaledSizes.radius.medium,
      minHeight: scaledSizes.button.large,
    },

    // Input styles
    input: {
      backgroundColor: colors.surface,
      borderWidth: scaledSizes.border.normal,
      borderColor: colors.border,
      borderRadius: scaledSizes.radius.normal,
      paddingHorizontal: scaledSizes.spacing.medium,
      paddingVertical: scaledSizes.spacing.small,
      fontSize: scaledSizes.text.normal,
      color: colors.text,
      minHeight: scaledSizes.input.normal,
    },

    inputFocused: {
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: scale(4),
      elevation: 2,
    },

    inputError: {
      borderColor: colors.error,
    },

    // Spacing utilities
    marginTiny: { margin: scaledSizes.spacing.tiny },
    marginSmall: { margin: scaledSizes.spacing.small },
    marginNormal: { margin: scaledSizes.spacing.normal },
    marginMedium: { margin: scaledSizes.spacing.medium },
    marginLarge: { margin: scaledSizes.spacing.large },
    marginXLarge: { margin: scaledSizes.spacing.xlarge },

    paddingTiny: { padding: scaledSizes.spacing.tiny },
    paddingSmall: { padding: scaledSizes.spacing.small },
    paddingNormal: { padding: scaledSizes.spacing.normal },
    paddingMedium: { padding: scaledSizes.spacing.medium },
    paddingLarge: { padding: scaledSizes.spacing.large },
    paddingXLarge: { padding: scaledSizes.spacing.xlarge },

    // Margin specific
    marginTopSmall: { marginTop: scaledSizes.spacing.small },
    marginTopMedium: { marginTop: scaledSizes.spacing.medium },
    marginTopLarge: { marginTop: scaledSizes.spacing.large },

    marginBottomSmall: { marginBottom: scaledSizes.spacing.small },
    marginBottomMedium: { marginBottom: scaledSizes.spacing.medium },
    marginBottomLarge: { marginBottom: scaledSizes.spacing.large },

    marginHorizontalSmall: { marginHorizontal: scaledSizes.spacing.small },
    marginHorizontalMedium: { marginHorizontal: scaledSizes.spacing.medium },
    marginHorizontalLarge: { marginHorizontal: scaledSizes.spacing.large },

    marginVerticalSmall: { marginVertical: scaledSizes.spacing.small },
    marginVerticalMedium: { marginVertical: scaledSizes.spacing.medium },
    marginVerticalLarge: { marginVertical: scaledSizes.spacing.large },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: scaledSizes.spacing.large,
    },

    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: scaledSizes.radius.large,
      padding: scaledSizes.spacing.large,
      maxWidth: scale(400),
      width: "100%",
      maxHeight: "80%",
    },

    modalHeader: {
      paddingBottom: scaledSizes.spacing.medium,
      borderBottomWidth: scaledSizes.border.normal,
      borderBottomColor: colors.border,
      marginBottom: scaledSizes.spacing.medium,
    },

    modalTitle: {
      fontSize: scaledSizes.text.large,
      fontWeight: "600",
      color: colors.text,
      textAlign: "center",
    },

    // Icon styles
    iconTiny: {
      width: scaledSizes.icon.tiny,
      height: scaledSizes.icon.tiny,
    },

    iconSmall: {
      width: scaledSizes.icon.small,
      height: scaledSizes.icon.small,
    },

    iconNormal: {
      width: scaledSizes.icon.normal,
      height: scaledSizes.icon.normal,
    },

    iconMedium: {
      width: scaledSizes.icon.medium,
      height: scaledSizes.icon.medium,
    },

    iconLarge: {
      width: scaledSizes.icon.large,
      height: scaledSizes.icon.large,
    },

    // List styles
    listItem: {
      backgroundColor: colors.surface,
      paddingHorizontal: scaledSizes.spacing.medium,
      paddingVertical: scaledSizes.spacing.small,
      borderBottomWidth: scaledSizes.border.normal,
      borderBottomColor: colors.border,
    },

    listItemLast: {
      borderBottomWidth: 0,
    },

    // Divider
    divider: {
      height: scaledSizes.border.normal,
      backgroundColor: colors.border,
      marginVertical: scaledSizes.spacing.small,
    },

    dividerThick: {
      height: scaledSizes.border.thick,
      backgroundColor: colors.border,
      marginVertical: scaledSizes.spacing.medium,
    },

    // Shadow styles
    shadowSmall: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(1),
      },
      shadowOpacity: 0.1,
      shadowRadius: scale(2),
      elevation: 2,
    },

    shadowMedium: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(2),
      },
      shadowOpacity: 0.15,
      shadowRadius: scale(4),
      elevation: 4,
    },

    shadowLarge: {
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: verticalScale(4),
      },
      shadowOpacity: 0.2,
      shadowRadius: scale(8),
      elevation: 8,
    },
  });

// 지역별 스타일 생성
export const createRegionStyles = (
  region: keyof typeof regionColors,
  colors: Theme["colors"]
) => {
  const regionColor = regionColors[region];

  return StyleSheet.create({
    regionCard: {
      backgroundColor: colors.surface,
      borderRadius: scaledSizes.radius.medium,
      padding: scaledSizes.spacing.medium,
      borderLeftWidth: scale(4),
      borderLeftColor: regionColor.primary,
      shadowColor: regionColor.primary,
      shadowOffset: {
        width: 0,
        height: verticalScale(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: scale(4),
      elevation: 3,
    },

    regionButton: {
      backgroundColor: regionColor.primary,
      paddingHorizontal: scaledSizes.spacing.large,
      paddingVertical: scaledSizes.spacing.medium,
      borderRadius: scaledSizes.radius.normal,
      alignItems: "center",
      justifyContent: "center",
    },

    regionText: {
      color: regionColor.primary,
      fontWeight: "600",
    },

    regionAccent: {
      backgroundColor: regionColor.accent,
    },
  });
};

// 스마트 스타일 생성기 (디바이스 크기에 따라)
export const createResponsiveStyles = (colors: Theme["colors"]) => {
  const isTablet = screenInfo.isTablet;
  const isSmallScreen = screenInfo.isSmallScreen;

  return StyleSheet.create({
    adaptiveContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: isTablet
        ? scaledSizes.spacing.xxlarge
        : scaledSizes.spacing.medium,
    },

    adaptiveText: {
      fontSize: isSmallScreen
        ? scaledSizes.text.small
        : scaledSizes.text.normal,
      color: colors.text,
    },

    adaptiveButton: {
      paddingHorizontal: isTablet
        ? scaledSizes.spacing.xxlarge
        : scaledSizes.spacing.large,
      paddingVertical: isTablet
        ? scaledSizes.spacing.large
        : scaledSizes.spacing.medium,
      borderRadius: scaledSizes.radius.normal,
      minHeight: isTablet
        ? scaledSizes.button.large
        : scaledSizes.button.normal,
    },
  });
};
