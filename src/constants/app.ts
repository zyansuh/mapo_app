// 앱 정보 상수
export const APP_INFO = {
  NAME: "Mapo Business Manager",
  VERSION: "2.0.0",
  BUILD_NUMBER: "2024010100",
  AUTHOR: "Mapo Development Team",
  DESCRIPTION: "마포종합식품 관리프로그램",
} as const;

// API 관련 상수
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || "https://api.mapo.com",
  TIMEOUT: 30000, // 30초
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1초
  // 추가 API 키들
  KAKAO_API_KEY: process.env.KAKAO_REST_API_KEY,
} as const;

// 스토리지 관련 상수 (storage.ts에서 이동)
export const STORAGE_KEYS = {
  COMPANIES: "mapo_companies_v2",
  PRODUCTS: "mapo_products_v2",
  INVOICES: "mapo_invoices_v2",
  DELIVERIES: "mapo_deliveries_v2",
  CALL_HISTORY: "mapo_call_history_v2",
  SETTINGS: "mapo_settings_v2",
  CACHE: "mapo_cache_v2",
  USER_DATA: "mapo_user_data_v2",
  ONBOARDING: "mapo_onboarding_v2",
  ANALYTICS: "mapo_analytics_v2",
} as const;

// 제한값 상수
export const LIMITS = {
  MAX_COMPANIES: 10000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  SEARCH_DEBOUNCE: 300, // ms
  AUTO_SAVE_INTERVAL: 5000, // 5초
} as const;

// 페이지네이션 상수
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  LARGE_PAGE_SIZE: 50,
  SMALL_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// 날짜 형식 상수
export const DATE_FORMATS = {
  DISPLAY: "YYYY년 MM월 DD일",
  SHORT: "MM/DD",
  ISO: "YYYY-MM-DD",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
  TIME: "HH:mm",
  MONTH_YEAR: "YYYY년 MM월",
} as const;

// 통화 관련 상수
export const CURRENCY = {
  KRW: {
    code: "KRW",
    symbol: "₩",
    name: "한국 원",
    decimals: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "미국 달러",
    decimals: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "유로",
    decimals: 2,
  },
} as const;

// 정규식 패턴
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  BUSINESS_NUMBER: /^[0-9]{3}-[0-9]{2}-[0-9]{5}$/,
  PASSWORD:
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
  KOREAN: /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/,
  NUMBER_ONLY: /^[0-9]+$/,
} as const;

// 성능 관련 상수
export const PERFORMANCE = {
  VIRTUAL_LIST_THRESHOLD: 50, // 이 개수 이상일 때 가상화 사용
  IMAGE_LAZY_LOAD_THRESHOLD: 10, // 이 개수 이상일 때 lazy loading 사용
  DEBOUNCE_SEARCH: 300, // ms
  THROTTLE_SCROLL: 100, // ms
  CACHE_TTL: 5 * 60 * 1000, // 5분
} as const;

// 애니메이션 상수
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 250,
    SLOW: 350,
  },
  EASING: {
    EASE_OUT: "ease-out",
    EASE_IN: "ease-in",
    EASE_IN_OUT: "ease-in-out",
  },
} as const;

// 개발 환경 관련 상수
export const DEV_CONFIG = {
  ENABLE_LOGGING: __DEV__,
  ENABLE_REDUX_DEVTOOLS: __DEV__,
  ENABLE_PERFORMANCE_MONITOR: __DEV__,
  MOCK_DELAY: 1000, // 목업 API 지연 시간
} as const;
