import { scaledSizes, screenInfo } from "../utils/scaling";
import { COLORS } from "./colors";

// 폰트 패밀리 정의
export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  light: "System",
} as const;

// 타이포그래피 시스템
export const TYPOGRAPHY = {
  // 제목
  h1: {
    fontFamily: FONTS.bold,
    fontSize: scaledSizes.text.huge,
    lineHeight: scaledSizes.text.huge * 1.2,
    fontWeight: "700" as const,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: scaledSizes.text.xxlarge,
    lineHeight: scaledSizes.text.xxlarge * 1.2,
    fontWeight: "600" as const,
  },
  h3: {
    fontFamily: FONTS.medium,
    fontSize: scaledSizes.text.xlarge,
    lineHeight: scaledSizes.text.xlarge * 1.2,
    fontWeight: "600" as const,
  },
  h4: {
    fontFamily: FONTS.medium,
    fontSize: scaledSizes.text.large,
    lineHeight: scaledSizes.text.large * 1.2,
    fontWeight: "600" as const,
  },

  // 본문
  body1: {
    fontFamily: FONTS.regular,
    fontSize: scaledSizes.text.medium,
    lineHeight: scaledSizes.text.medium * 1.4,
    fontWeight: "400" as const,
  },
  body2: {
    fontFamily: FONTS.regular,
    fontSize: scaledSizes.text.normal,
    lineHeight: scaledSizes.text.normal * 1.4,
    fontWeight: "400" as const,
  },

  // 캡션
  caption: {
    fontFamily: FONTS.regular,
    fontSize: scaledSizes.text.small,
    lineHeight: scaledSizes.text.small * 1.3,
    fontWeight: "400" as const,
  },
  caption2: {
    fontFamily: FONTS.regular,
    fontSize: scaledSizes.text.tiny,
    lineHeight: scaledSizes.text.tiny * 1.3,
    fontWeight: "400" as const,
  },

  // 버튼
  button: {
    fontFamily: FONTS.medium,
    fontSize: scaledSizes.text.medium,
    lineHeight: scaledSizes.text.medium * 1.2,
    fontWeight: "600" as const,
  },
  buttonSmall: {
    fontFamily: FONTS.medium,
    fontSize: scaledSizes.text.normal,
    lineHeight: scaledSizes.text.normal * 1.2,
    fontWeight: "600" as const,
  },
} as const;

// 간격 시스템
export const SPACING = {
  ...scaledSizes.spacing,
  // 시맨틱 간격
  sectionPadding: scaledSizes.spacing.medium,
  cardPadding: scaledSizes.spacing.normal,
  itemPadding: scaledSizes.spacing.small,
  screenPadding: scaledSizes.spacing.medium,
} as const;

// 크기 시스템
export const SIZES = {
  ...scaledSizes,

  // 화면 크기
  screen: {
    width: screenInfo.width,
    height: screenInfo.height,
    isSmall: screenInfo.isSmallScreen,
    isMedium: screenInfo.isMediumScreen,
    isLarge: screenInfo.isLargeScreen,
    isTablet: screenInfo.isTablet,
  },

  // 카드 크기
  card: {
    minHeight: scaledSizes.button.large * 2,
    maxWidth: screenInfo.width - scaledSizes.spacing.medium * 2,
  },

  // 헤더 크기
  header: {
    height: scaledSizes.button.large + scaledSizes.spacing.medium,
  },
} as const;

// 그림자 시스템
export const SHADOWS = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  small: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: scaledSizes.spacing.tiny / 4 },
    shadowOpacity: 0.1,
    shadowRadius: scaledSizes.spacing.tiny,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: scaledSizes.spacing.tiny / 2 },
    shadowOpacity: 0.15,
    shadowRadius: scaledSizes.spacing.small,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: scaledSizes.spacing.small },
    shadowOpacity: 0.2,
    shadowRadius: scaledSizes.spacing.normal,
    elevation: 8,
  },
} as const;

// 통합 테마
export const THEME = {
  colors: COLORS,
  fonts: FONTS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizes: SIZES,
  shadows: SHADOWS,

  // 컴포넌트별 기본 스타일
  components: {
    card: {
      backgroundColor: COLORS.white,
      borderRadius: scaledSizes.radius.normal,
      padding: SPACING.cardPadding,
      ...SHADOWS.small,
    },
    button: {
      borderRadius: scaledSizes.radius.small,
      paddingHorizontal: SPACING.medium,
      paddingVertical: SPACING.normal,
      ...TYPOGRAPHY.button,
    },
    input: {
      borderRadius: scaledSizes.radius.small,
      paddingHorizontal: SPACING.normal,
      paddingVertical: SPACING.small,
      borderWidth: scaledSizes.border.normal,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
      ...TYPOGRAPHY.body2,
    },
    modal: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: scaledSizes.radius.large,
      borderTopRightRadius: scaledSizes.radius.large,
      padding: SPACING.sectionPadding,
      ...SHADOWS.large,
    },
  },
} as const;

export default THEME;
