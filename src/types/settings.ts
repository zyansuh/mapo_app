// 설정 관련 타입 정의

export type ThemeMode = "light" | "dark" | "system";
export type SupportedLanguage = "ko" | "en" | "ja" | "zh";
export type DateFormat = "YYYY-MM-DD" | "MM/DD/YYYY" | "DD/MM/YYYY";
export type TimeFormat = "24h" | "12h";
export type Currency = "KRW" | "USD" | "EUR" | "JPY" | "CNY";

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    success: string;
    warning: string;
    error: string;
    white: string;
    black: string;
    disabled: string;
    placeholder: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: string };
    h2: { fontSize: number; fontWeight: string };
    h3: { fontSize: number; fontWeight: string };
    body: { fontSize: number; fontWeight: string };
    caption: { fontSize: number; fontWeight: string };
  };
}

export interface NotificationSettings {
  pushEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  callAlerts: boolean;
  creditAlerts: boolean;
  deliveryAlerts: boolean;
  invoiceAlerts: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string; // "HH:mm" 형식
    endTime: string; // "HH:mm" 형식
  };
}

export interface DisplaySettings {
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  currency: Currency;
  showCurrency: boolean;
  thousandSeparator: "," | "." | " ";
  decimalSeparator: "." | ",";
  decimalPlaces: number;
  compactNumbers: boolean; // 1K, 1M 형태로 표시
}

export interface SecuritySettings {
  requireAuth: boolean;
  authMethod: "pin" | "password" | "biometric" | "pattern";
  autoLockTime: number; // 분 단위, 0이면 비활성화
  hidePreviewInBackground: boolean;
  encryptLocalData: boolean;
  allowScreenshots: boolean;
  showSensitiveData: boolean;
}

export interface AppSettings {
  version: string;
  theme: ThemeMode;
  language: SupportedLanguage;
  notifications: NotificationSettings;
  display: DisplaySettings;
  security: SecuritySettings;

  // 기능별 설정
  features: {
    callDetection: boolean;
    autoInvoiceGeneration: boolean;
    inventoryTracking: boolean;
    creditManagement: boolean;
    analytics: boolean;
    exportData: boolean;
  };

  // 개발자 설정
  developer: {
    debugMode: boolean;
    showPerformanceMetrics: boolean;
    enableCrashReporting: boolean;
    logLevel: "error" | "warn" | "info" | "debug";
  };
}
