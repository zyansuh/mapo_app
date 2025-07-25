// 통합 타입 export
// 모든 도메인별 타입들을 중앙에서 관리

// 공통 타입들
export * from "./common";
export * from "./company";
export * from "./product";
export * from "./invoice";
export * from "./call";
export * from "./delivery";
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
  products?: any[]; // 상품 정보
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

// 간단한 통계
export interface DashboardStats {
  totalCompanies: number;
  recentActivities: Array<{
    id: string;
    type: "call";
    title: string;
    timestamp: Date;
  }>;
}
