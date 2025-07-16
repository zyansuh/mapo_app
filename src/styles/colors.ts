// 공통 색상 상수 정의
export const COLORS = {
  // 기본 배경 및 표면
  background: "#ffffff",
  surface: "#f9fafb",
  border: "#e5e7eb",

  // 텍스트 색상
  text: "#111827",
  textSecondary: "#6b7280",
  textLight: "#9ca3af",

  // 주요 색상
  primary: "#3b82f6",
  primaryLight: "#60a5fa",
  primaryDark: "#2563eb",

  // 기능별 색상
  white: "#ffffff",
  black: "#000000",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#dc2626",
  info: "#3b82f6",

  // 투명도
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.3)",

  // 그림자
  shadow: "#000000",
} as const;

// 제품 카테고리별 색상
export const CATEGORY_COLORS = {
  두부: {
    primary: "#10b981",
    light: "#d1fae5",
    text: "#065f46",
  },
  콩나물: {
    primary: "#f59e0b",
    light: "#fef3c7",
    text: "#92400e",
  },
  묵류: {
    primary: "#8b5cf6",
    light: "#ede9fe",
    text: "#5b21b6",
  },
} as const;

// 상태별 색상
export const STATUS_COLORS = {
  pending: {
    background: "#fef3c7",
    text: "#92400e",
    border: "#f59e0b",
  },
  completed: {
    background: "#d1fae5",
    text: "#065f46",
    border: "#10b981",
  },
  cancelled: {
    background: "#fee2e2",
    text: "#991b1b",
    border: "#dc2626",
  },
  processing: {
    background: "#dbeafe",
    text: "#1e40af",
    border: "#3b82f6",
  },
} as const;

// 지역별 색상 (기존 코드와 호환)
export const REGION_COLORS = {
  순창: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#2563eb",
  },
  담양: {
    primary: "#10b981",
    secondary: "#34d399",
    accent: "#059669",
  },
  장성: {
    primary: "#dc2626",
    secondary: "#f87171",
    accent: "#b91c1c",
  },
  기타: {
    primary: "#6b7280",
    secondary: "#9ca3af",
    accent: "#4b5563",
  },
} as const;
