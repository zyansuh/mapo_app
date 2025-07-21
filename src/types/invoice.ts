import { BaseEntity } from "./common";
import { Company } from "./company";

// 과세 구분
export type TaxType = "과세" | "면세" | "영세";

// 계산서 상태
export type InvoiceStatus = "임시저장" | "발행" | "전송" | "승인" | "취소";

// 계산서 항목
export interface InvoiceItem {
  id: string;
  name: string; // 품목명
  quantity: number; // 수량
  unitPrice: number; // 단가
  amount: number; // 공급가액
  taxType: TaxType; // 과세구분
  taxAmount: number; // 세액
  totalAmount: number; // 합계금액
  memo?: string;
}

// 계산서
export interface Invoice extends BaseEntity {
  invoiceNumber: string; // 계산서 번호
  companyId: string;
  company?: Company;
  items: InvoiceItem[];

  // 금액 정보
  totalSupplyAmount: number; // 총 공급가액
  totalTaxAmount: number; // 총 세액
  totalAmount: number; // 총 합계금액

  // 날짜 정보
  issueDate: Date; // 발행일
  dueDate?: Date; // 납기일

  // 상태
  status: InvoiceStatus;

  // 기타
  memo?: string;
  attachments?: string[]; // 첨부파일
}

// 계산서 폼 데이터 (생성/수정용)
export interface InvoiceFormData {
  invoiceNumber?: string;
  companyId: string;
  items: InvoiceItem[];
  totalSupplyAmount: number;
  totalTaxAmount: number;
  totalAmount: number;
  issueDate: Date;
  dueDate?: Date;
  status: InvoiceStatus;
  memo?: string;
  attachments?: string[];
}
