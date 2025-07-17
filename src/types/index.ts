// 통합 타입 export
// 모든 도메인별 타입들을 중앙에서 관리

// 공통 타입
export * from "./common";

// 도메인별 타입
export * from "./company";
export * from "./product";
export * from "./invoice";
export * from "./call";
export * from "./settings";
export * from "./navigation";

// 외상 관리 관련 타입 (인보이스와 분리된 부분)
export type CreditStatus = "정상" | "연체" | "상환완료" | "취소";

export interface CreditRecord {
  id: string;
  companyId: string;
  amount: number; // 외상 금액
  paidAmount: number; // 지불된 금액
  remainingAmount: number; // 잔여 금액
  dueDate: Date; // 지불 기한
  status: CreditStatus;
  description?: string;
  products?: any[]; // ProductDelivery[] 타입 참조
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPayment {
  id: string;
  creditRecordId: string;
  amount: number;
  paymentMethod: string; // PaymentMethod 타입 참조
  paymentDate: Date;
  memo?: string;
  createdAt: Date;
}

// 알림 관련 타입
export type NotificationType =
  | "call"
  | "credit"
  | "delivery"
  | "invoice"
  | "system";
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

// 데이터 내보내기 관련 타입
export type ExportFormat = "excel" | "csv" | "json";
export type ExportDataType =
  | "companies"
  | "products"
  | "deliveries"
  | "invoices"
  | "credits"
  | "calls"
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
  filters?: Record<string, any>;
}

export interface ExportResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  recordCount: number;
  fileSize?: number;
  error?: string;
}

// 대시보드 통계
export interface DashboardStats {
  totalCompanies: number;
  totalProducts: number;
  totalDeliveries: number;
  totalInvoices: number;
  monthlyRevenue: number;
  outstandingAmount: number;
  topCompanies: Array<{
    companyId: string;
    companyName: string;
    totalAmount: number;
    deliveryCount: number;
  }>;
  recentActivities: Array<{
    id: string;
    type: "delivery" | "invoice" | "payment" | "call";
    title: string;
    timestamp: Date;
    amount?: number;
  }>;
}
