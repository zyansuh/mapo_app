// 앱 설정 상수
export const APP_CONFIG = {
  NAME: "Mapo",
  VERSION: "1.0.0",
} as const;

// 색상 상수 - Neutral 테마
export const COLORS = {
  PRIMARY: "#525252", // neutral/600
  SECONDARY: "#737373", // neutral/500
  SUCCESS: "#34C759",
  WARNING: "#FF9500",
  ERROR: "#FF3B30",
  BACKGROUND: "#F5F5F5", // neutral/100
  WHITE: "#FFFFFF",
  BLACK: "#171717", // neutral/900
  GRAY: "#A3A3A3", // neutral/400

  // 추가 neutral 색상들
  NEUTRAL_50: "#FAFAFA",
  NEUTRAL_100: "#F5F5F5",
  NEUTRAL_200: "#E5E5E5",
  NEUTRAL_300: "#D4D4D4",
  NEUTRAL_400: "#A3A3A3",
  NEUTRAL_500: "#737373",
  NEUTRAL_600: "#525252",
  NEUTRAL_700: "#404040",
  NEUTRAL_800: "#262626",
  NEUTRAL_900: "#171717",
} as const;

// 크기 상수
export const SIZES = {
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
} as const;

// API 상수
export const API_CONFIG = {
  BASE_URL: "https://api.example.com",
  TIMEOUT: 10000,
} as const;
