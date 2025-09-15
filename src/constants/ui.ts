// UI 관련 상수들

// 색상 팔레트
export const COLORS = {
  // Primary Colors
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Secondary Colors
  secondary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Success Colors
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    300: "#6EE7B7",
    400: "#34D399",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
    900: "#064E3B",
  },

  // Warning Colors
  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Error Colors
  error: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
  },

  // Info Colors
  info: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#0369A1",
    800: "#075985",
    900: "#0C4A6E",
  },

  // Gray Colors
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Neutral Colors
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Basic Colors
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

// 그림자
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
} as const;

// 보더 반지름
export const BORDER_RADIUS = {
  none: "0px",
  sm: "2px",
  base: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px",
  "2xl": "16px",
  "3xl": "24px",
  full: "9999px",
} as const;

// 보더 두께
export const BORDER_WIDTH = {
  0: "0px",
  1: "1px",
  2: "2px",
  4: "4px",
  8: "8px",
} as const;

// 간격
export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  11: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
  36: "144px",
  40: "160px",
  44: "176px",
  48: "192px",
  52: "208px",
  56: "224px",
  60: "240px",
  64: "256px",
  72: "288px",
  80: "320px",
  96: "384px",
} as const;

// 폰트 크기
export const FONT_SIZES = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
  "4xl": "36px",
  "5xl": "48px",
  "6xl": "60px",
  "7xl": "72px",
  "8xl": "96px",
  "9xl": "128px",
} as const;

// 폰트 두께
export const FONT_WEIGHTS = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
} as const;

// 줄 높이
export const LINE_HEIGHTS = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
} as const;

// 자간
export const LETTER_SPACINGS = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
} as const;

// Z-Index
export const Z_INDEX = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// 애니메이션 지속 시간
export const DURATIONS = {
  75: "75ms",
  100: "100ms",
  150: "150ms",
  200: "200ms",
  300: "300ms",
  500: "500ms",
  700: "700ms",
  1000: "1000ms",
} as const;

// 애니메이션 타이밍 함수
export const EASING = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// 브레이크포인트
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// 컨테이너 크기
export const CONTAINER_SIZES = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

// 그리드 컬럼
export const GRID_COLUMNS = {
  1: "repeat(1, minmax(0, 1fr))",
  2: "repeat(2, minmax(0, 1fr))",
  3: "repeat(3, minmax(0, 1fr))",
  4: "repeat(4, minmax(0, 1fr))",
  5: "repeat(5, minmax(0, 1fr))",
  6: "repeat(6, minmax(0, 1fr))",
  12: "repeat(12, minmax(0, 1fr))",
} as const;

// 플렉스 방향
export const FLEX_DIRECTIONS = {
  row: "row",
  "row-reverse": "row-reverse",
  col: "column",
  "col-reverse": "column-reverse",
} as const;

// 플렉스 래핑
export const FLEX_WRAPS = {
  nowrap: "nowrap",
  wrap: "wrap",
  "wrap-reverse": "wrap-reverse",
} as const;

// 정렬
export const ALIGN_ITEMS = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
} as const;

export const JUSTIFY_CONTENT = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
} as const;

// 위치
export const POSITIONS = {
  static: "static",
  fixed: "fixed",
  absolute: "absolute",
  relative: "relative",
  sticky: "sticky",
} as const;

// 오버플로우
export const OVERFLOWS = {
  auto: "auto",
  hidden: "hidden",
  visible: "visible",
  scroll: "scroll",
} as const;

// 커서
export const CURSORS = {
  auto: "auto",
  default: "default",
  pointer: "pointer",
  wait: "wait",
  text: "text",
  move: "move",
  help: "help",
  "not-allowed": "not-allowed",
} as const;

// 사용자 선택
export const USER_SELECTS = {
  none: "none",
  text: "text",
  all: "all",
  auto: "auto",
} as const;

// 포인터 이벤트
export const POINTER_EVENTS = {
  none: "none",
  auto: "auto",
} as const;

// 리사이즈
export const RESIZES = {
  none: "none",
  both: "both",
  horizontal: "horizontal",
  vertical: "vertical",
} as const;

// 테이블 레이아웃
export const TABLE_LAYOUTS = {
  auto: "auto",
  fixed: "fixed",
} as const;

// 텍스트 정렬
export const TEXT_ALIGNS = {
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
} as const;

// 텍스트 변환
export const TEXT_TRANSFORMS = {
  uppercase: "uppercase",
  lowercase: "lowercase",
  capitalize: "capitalize",
  none: "none",
} as const;

// 텍스트 장식
export const TEXT_DECORATIONS = {
  underline: "underline",
  "line-through": "line-through",
  none: "none",
} as const;

// 텍스트 오버플로우
export const TEXT_OVERFLOWS = {
  clip: "clip",
  ellipsis: "ellipsis",
} as const;

// 화이트 스페이스
export const WHITE_SPACES = {
  normal: "normal",
  nowrap: "nowrap",
  pre: "pre",
  "pre-line": "pre-line",
  "pre-wrap": "pre-wrap",
} as const;

// 워드 브레이크
export const WORD_BREAKS = {
  normal: "normal",
  "break-all": "break-all",
  "keep-all": "keep-all",
} as const;

// 워드 래핑
export const WORD_WRAPS = {
  normal: "normal",
  "break-word": "break-word",
} as const;
