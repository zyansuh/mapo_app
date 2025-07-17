// 상수 파일들을 중앙에서 관리
export * from "./app";
export * from "./messages";

// 기존 상수들도 호환성을 위해 re-export
export const COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745",
  WARNING: "#ffc107",
  ERROR: "#dc3545",
  WHITE: "#ffffff",
  BLACK: "#000000",
  LIGHT_GRAY: "#f8f9fa",
  DARK_GRAY: "#343a40",
};

export const SIZES = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};
