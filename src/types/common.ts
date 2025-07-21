// 기본 엔티티 인터페이스
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// API 응답 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 로딩 상태 타입
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

// 필터링 관련 타입들
export interface DateRange {
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  searchQuery?: string;
  dateRange?: DateRange;
  status?: string[];
  category?: string[];
  tags?: string[];
}

// 폼 관련 타입들
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
  disabled?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

// 선택/체크박스 관련
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

export interface MultiSelectOption<T = string> extends SelectOption<T> {
  selected: boolean;
}

// 통계 관련 공통 타입들
export interface StatItem {
  label: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  color?: string;
  icon?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: Date;
  value: number;
  label?: string;
}

// 액션 관련 타입들
export interface Action {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  dangerous?: boolean;
  onPress: () => void;
}

export interface ActionGroup {
  title: string;
  actions: Action[];
}

// 상태 관련 공통 타입들
export type Status =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled"
  | "draft";

export interface StatusInfo {
  status: Status;
  label: string;
  color: string;
  backgroundColor: string;
  icon?: string;
}

// 알림 관련
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// 파일 관련
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
  uploadedBy?: string;
}

// 주소 관련
export interface Address {
  full: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// 연락처 정보
export interface ContactInfo {
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
}

// 검색 관련
export interface SearchResult<T> {
  item: T;
  score: number;
  matchedFields: string[];
  highlights?: Record<string, string>;
}

export interface SearchConfig {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
  limit?: number;
  offset?: number;
}

// 내보내기/가져오기 관련
export interface ExportConfig {
  format: "csv" | "xlsx" | "pdf" | "json";
  fileName?: string;
  fields?: string[];
  filters?: FilterConfig;
}

export interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
  }>;
}

// 권한 관련
export type Permission = "read" | "write" | "delete" | "admin";

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  description?: string;
}

// 설정 관련
export interface AppSettings {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReporting: boolean;
  };
}

// 메뉴/네비게이션 관련
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  badge?: string | number;
  children?: MenuItem[];
  disabled?: boolean;
  hidden?: boolean;
}

// 키-값 쌍
export type KeyValuePair<K extends string | number = string, V = any> = {
  key: K;
  value: V;
};

// 제네릭 맵 타입
export type StringMap<T = any> = Record<string, T>;
export type NumberMap<T = any> = Record<number, T>;

// 유틸리티 타입들
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Required<T> = {
  [P in keyof T]-?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// 날짜 관련 유틸리티 타입
export type DateLike = Date | string | number;

// ID 타입들
export type ID = string;
export type UUID = string;

// 화폐 관련
export type Currency = "KRW" | "USD" | "EUR" | "JPY";

export interface Money {
  amount: number;
  currency: Currency;
}

// 좌표 관련
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

// 색상 관련
export type ColorValue = string;
export type HexColor = string;
export type RGBColor = `rgb(${number}, ${number}, ${number})`;
export type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;

// 이벤트 관련
export interface BaseEvent {
  type: string;
  timestamp: Date;
  source?: string;
  metadata?: StringMap;
}

// 로그 관련
export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  component?: string;
  metadata?: StringMap;
}

// 버전 관련
export interface Version {
  major: number;
  minor: number;
  patch: number;
  preRelease?: string;
  build?: string;
}

// 환경 관련
export type Environment = "development" | "staging" | "production";

// 응답 메시지 템플릿
export const RESPONSE_MESSAGES = {
  SUCCESS: {
    CREATED: "성공적으로 생성되었습니다.",
    UPDATED: "성공적으로 수정되었습니다.",
    DELETED: "성공적으로 삭제되었습니다.",
    SAVED: "성공적으로 저장되었습니다.",
  },
  ERROR: {
    NOT_FOUND: "요청한 데이터를 찾을 수 없습니다.",
    UNAUTHORIZED: "권한이 없습니다.",
    VALIDATION: "입력 데이터가 올바르지 않습니다.",
    SERVER_ERROR: "서버 오류가 발생했습니다.",
    NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  },
} as const;
