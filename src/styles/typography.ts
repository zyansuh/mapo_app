// 타이포그래피 스타일 정의

import { TextStyle } from "react-native";

export interface Typography {
  // 헤딩 스타일들
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  h5: TextStyle;
  h6: TextStyle;

  // 본문 텍스트 스타일들
  body1: TextStyle;
  body2: TextStyle;
  caption: TextStyle;
  overline: TextStyle;

  // 버튼 텍스트 스타일들
  button: TextStyle;
  buttonLarge: TextStyle;
  buttonSmall: TextStyle;

  // 특수 텍스트 스타일들
  link: TextStyle;
  error: TextStyle;
  success: TextStyle;
  warning: TextStyle;
  info: TextStyle;

  // 입력 필드 스타일들
  input: TextStyle;
  inputLabel: TextStyle;
  inputError: TextStyle;
  inputHelper: TextStyle;

  // 리스트 아이템 스타일들
  listItemTitle: TextStyle;
  listItemSubtitle: TextStyle;
  listItemCaption: TextStyle;
}

export const typography: Typography = {
  // 헤딩 스타일들
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  h5: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.15,
  },

  // 본문 텍스트 스타일들
  body1: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 14,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // 버튼 텍스트 스타일들
  button: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  buttonLarge: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0.1,
    textAlign: "center",
  },
  buttonSmall: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    letterSpacing: 0.1,
    textAlign: "center",
  },

  // 특수 텍스트 스타일들
  link: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.25,
    textDecorationLine: "underline",
  },
  error: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  success: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  warning: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  info: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },

  // 입력 필드 스타일들
  input: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  inputError: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  inputHelper: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // 리스트 아이템 스타일들
  listItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
    letterSpacing: 0.15,
  },
  listItemSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  listItemCaption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    letterSpacing: 0.4,
  },
};

// 폰트 패밀리 정의
export const fontFamilies = {
  regular: "System",
  medium: "System",
  semiBold: "System",
  bold: "System",
  light: "System",
} as const;

// 폰트 크기 정의
export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  "5xl": 36,
  "6xl": 48,
} as const;

// 폰트 두께 정의
export const fontWeights = {
  light: "300" as const,
  normal: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
  extraBold: "800" as const,
} as const;

// 줄 높이 정의
export const lineHeights = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// 자간 정의
export const letterSpacings = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// 텍스트 정렬 정의
export const textAligns = {
  left: "left" as const,
  center: "center" as const,
  right: "right" as const,
  justify: "justify" as const,
} as const;

// 텍스트 변환 정의
export const textTransforms = {
  none: "none" as const,
  uppercase: "uppercase" as const,
  lowercase: "lowercase" as const,
  capitalize: "capitalize" as const,
} as const;

// 텍스트 장식 정의
export const textDecorations = {
  none: "none" as const,
  underline: "underline" as const,
  lineThrough: "line-through" as const,
} as const;
