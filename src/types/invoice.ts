import { BaseEntity } from "./common";
import { Company } from "./company";
import { ProductCategory } from "./product";

// 계산서 관련 타입 정의
export type InvoiceType = "과세" | "면세";
export type InvoiceStatus =
  | "임시저장"
  | "발행"
  | "취소"
  | "수정"
  | "발행완료"
  | "미수금"
  | "수금완료";
export type PaymentStatus = "미결제" | "부분결제" | "완료";
export type PaymentMethod =
  | "현금"
  | "계좌이체"
  | "카드"
  | "어음"
  | "수표"
  | "기타";

export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  taxType: InvoiceType; // 과세/면세 구분
  taxRate: number; // 세율 (%)
  taxAmount: number; // 세액
  discountRate?: number; // 할인율 (%)
  discountAmount?: number; // 할인액
  description?: string;
}

export interface Invoice extends BaseEntity {
  invoiceNumber: string; // 계산서 번호
  invoiceType: InvoiceType;
  companyId: string;
  company?: Company;
  deliveryId?: string; // 연결된 배송 ID
  items: InvoiceItem[];

  // 금액 관련
  subtotalAmount: number; // 소계
  discountAmount: number; // 할인액
  taxableAmount: number; // 과세 대상 금액
  taxAmount: number; // 부가세액
  totalAmount: number; // 총액
  totalWithTax: number; // 세금 포함 총액

  // 날짜 관련
  invoiceDate: Date;
  dueDate?: Date; // 지불 기한
  issuedDate?: Date; // 발행일

  // 상태 관련
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  // 기타
  memo?: string;
  notes?: string;
  internalMemo?: string;
  reference?: string; // 참조번호

  // 발행자 정보
  issuerName?: string;
  issuerTitle?: string; // 직책

  // 취소/수정 관련
  originalInvoiceId?: string; // 원본 계산서 ID (수정계산서인 경우)
  cancelReason?: string; // 취소 사유
  modifyReason?: string; // 수정 사유
}

export interface InvoiceFormData {
  companyId: string;
  invoiceType: InvoiceType;
  items: Omit<InvoiceItem, "id" | "taxAmount">[];
  invoiceDate: string; // ISO 날짜 문자열
  dueDate?: string;
  paymentMethod?: PaymentMethod;
  memo?: string;
  reference?: string;
}

export interface InvoiceFormErrors {
  companyId?: string;
  items?: string;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: string;
}

// 결제 기록
export interface PaymentRecord extends BaseEntity {
  invoiceId: string;
  invoice?: Invoice;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  reference?: string; // 결제 참조번호 (입금계좌, 카드승인번호 등)
  memo?: string;
  receivedBy?: string; // 수금 담당자
}

// 계산서 검색/필터 옵션
export interface InvoiceSearchFilters {
  companyIds?: string[];
  status?: InvoiceStatus[];
  paymentStatus?: PaymentStatus[];
  invoiceType?: InvoiceType[];
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

// 계산서 통계
export interface InvoiceStatistics {
  total: number;
  totalAmount: number;
  byStatus: Record<InvoiceStatus, { count: number; amount: number }>;
  byPaymentStatus: Record<PaymentStatus, { count: number; amount: number }>;
  byType: Record<InvoiceType, { count: number; amount: number }>;
  monthlyRevenue: number;
  outstandingAmount: number; // 미수금
  overdueAmount: number; // 연체액
  overdueCount: number; // 연체 건수
}

// 세금 계산 관련
export interface TaxCalculation {
  subtotal: number;
  taxableAmount: number;
  taxExemptAmount: number;
  taxAmount: number;
  total: number;
  taxRate: number;
}
