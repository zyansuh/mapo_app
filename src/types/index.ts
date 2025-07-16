// 전역 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
}

// 네비게이션 타입 정의
export type RootStackParamList = {
  Home: undefined;
  // 추가 화면들을 여기에 정의
};

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 전화 관련 타입 정의
export interface CallState {
  isCallActive: boolean;
  callDirection: "incoming" | "outgoing" | null;
  phoneNumber: string | null;
  callStartTime: Date | null;
}

export type CallStatus =
  | "Incoming"
  | "Dialing"
  | "Offhook"
  | "Disconnected"
  | "Unknown";

export interface IncomingCallData {
  phoneNumber: string;
  callStatus: CallStatus;
  timestamp: Date;
}

// 업체 관련 타입 정의
export type CompanyType =
  | "고객사"
  | "협력업체"
  | "공급업체"
  | "하청업체"
  | "기타";

export type CompanyRegion = "순창" | "담양" | "장성" | "기타";

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  region: CompanyRegion; // 지역 구분 추가
  address: string;
  phoneNumber: string;
  email?: string;
  businessNumber?: string; // 사업자등록번호
  contactPerson?: string; // 담당자명
  memo?: string;
  isFavorite?: boolean; // 즐겨찾기 여부
  createdAt: Date;
  updatedAt: Date;
}

// 업체 폼 데이터 타입 (등록/수정용)
export interface CompanyFormData {
  name: string;
  type: CompanyType;
  region: CompanyRegion; // 지역 구분 추가
  address: string;
  phoneNumber: string;
  email: string;
  businessNumber: string;
  contactPerson: string;
  memo: string;
}

export interface CompanyFormErrors {
  name?: string;
  type?: string;
  region?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  businessNumber?: string;
}

// 통계 관련 타입 정의
export interface CallAnalytics {
  totalCalls: number;
  outgoingCalls: number;
  incomingCalls: number;
  missedCalls: number;
  callsByCompany: { [companyId: string]: number };
  callsByDate: { [date: string]: number };
  callsByWeek: { [week: string]: number };
  callsByMonth: { [month: string]: number };
  favoriteCompanies: Company[];
  mostContactedCompanies: Array<{
    company: Company;
    callCount: number;
  }>;
}

// 상품 관련 타입 정의
export type ProductCategory = "두부" | "콩나물" | "묵류";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string; // 단위 (개, kg, 박스 등)
  description?: string;
  companyId: string; // 관련 거래처 ID
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDelivery {
  id: string;
  productId: string;
  product: Product;
  companyId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: Date;
  status: "배송중" | "배송완료" | "취소";
  memo?: string;
  createdAt: Date;
}

// 외상관리 관련 타입 정의
export type CreditStatus = "정상" | "연체" | "상환완료" | "취소";
export type PaymentMethod = "현금" | "계좌이체" | "카드" | "어음" | "기타";

export interface CreditRecord {
  id: string;
  companyId: string;
  amount: number; // 외상 금액
  paidAmount: number; // 지불된 금액
  remainingAmount: number; // 잔여 금액
  dueDate: Date; // 지불 기한
  status: CreditStatus;
  description?: string;
  products?: ProductDelivery[]; // 관련 상품 배송 내역
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPayment {
  id: string;
  creditRecordId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  memo?: string;
  createdAt: Date;
}

// 상품 선택 폼 데이터 타입
export interface ProductSelectionFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
  deliveryDate: Date;
  memo?: string;
}

// 테마 관련 타입 정의
export type ThemeMode = "light" | "dark" | "system";

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
  };
}

// 설정 관련 타입 정의
export interface AppSettings {
  theme: ThemeMode;
  language: "ko" | "en";
  notifications: {
    pushEnabled: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    callAlerts: boolean;
    creditAlerts: boolean;
    deliveryAlerts: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: "daily" | "weekly" | "monthly";
    lastBackupDate?: Date;
  };
  dataManagement: {
    autoDeleteOldData: boolean;
    dataRetentionDays: number;
  };
}

// 알림 관련 타입 정의
export type NotificationType = "call" | "credit" | "delivery" | "system";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  data?: any; // 알림과 관련된 추가 데이터
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string; // 알림 클릭 시 이동할 화면
}

// 데이터 내보내기 관련 타입 정의
export type ExportFormat = "excel" | "csv" | "json";
export type ExportDataType =
  | "companies"
  | "credits"
  | "deliveries"
  | "statistics"
  | "all";

export interface ExportOptions {
  format: ExportFormat;
  dataType: ExportDataType;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  includeDeleted: boolean;
  companyIds?: string[]; // 특정 업체만 내보내기
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  recordCount: number;
  error?: string;
}

// 배송등록 관련 타입 정의
export type DeliveryStatus = "배송준비" | "배송중" | "배송완료" | "취소";

export interface DeliveryItem {
  id: string;
  productId: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  price: number;
}

export interface DeliveryFormData {
  id: string;
  companyId: string;
  items: DeliveryItem[];
  totalAmount: number;
  date: string; // ISO 날짜 문자열
  memo?: string;
  // 결제 관련 정보
  paymentMethod: PaymentMethod;
  isCredit: boolean; // 외상 여부
  dueDate?: string; // 외상인 경우 지불 기한 (ISO 날짜 문자열)
  creditMemo?: string; // 외상 관련 메모
}

// 계산서 관련 타입 정의
export type InvoiceType = "과세" | "면세";
export type InvoiceStatus = "발행" | "취소" | "수정";

export interface InvoiceItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxType: InvoiceType; // 과세/면세 구분
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // 계산서 번호
  companyId: string;
  company: Company;
  deliveryId?: string; // 연결된 배송 ID
  items: InvoiceItem[];
  totalAmount: number;
  taxAmount: number; // 부가세액 (과세 항목만)
  totalWithTax: number; // 총액 (부가세 포함)
  invoiceDate: Date;
  status: InvoiceStatus;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 통계 관련 타입 확장
export interface ProductStatistics {
  companyId: string;
  companyName: string;
  // 묵류 통계 (과세)
  mukQuantity: number; // 묵 총 수량
  mukAmount: number; // 묵 총 금액
  // 두부, 콩나물 통계 (면세)
  tofuBeansproutQuantity: number; // 두부+콩나물 총 수량
  tofuBeansproutAmount: number; // 두부+콩나물 총 금액
}

export interface DashboardStats {
  totalCompanies: number;
  totalDeliveries: number;
  totalInvoices: number;
  monthlyRevenue: number;
  topCompanies: ProductStatistics[];
}
