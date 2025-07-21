import { Invoice, InvoiceItem, TaxType } from "./invoice";
import { Company } from "./company";

// 거래처별 매출 통계
export interface CompanySalesStats {
  companyId: string;
  company: Company;
  totalAmount: number;
  totalSupplyAmount: number;
  totalTaxAmount: number;

  // 과세구분별 통계
  salesByTaxType: {
    [K in TaxType]: {
      count: number;
      totalAmount: number;
      totalSupplyAmount: number;
      totalTaxAmount: number;
    };
  };

  // 월별 통계
  salesByMonth: Array<{
    month: string; // YYYY-MM 형식
    totalAmount: number;
    totalSupplyAmount: number;
    totalTaxAmount: number;
    salesByTaxType: {
      [K in TaxType]: {
        count: number;
        totalAmount: number;
        totalSupplyAmount: number;
        totalTaxAmount: number;
      };
    };
  }>;

  // 상품별 통계
  salesByProduct: Array<{
    productName: string;
    taxType: TaxType;
    quantity: number;
    totalAmount: number;
    averagePrice: number;
  }>;

  invoiceCount: number;
  lastInvoiceDate?: Date;
}

// 전체 매출 분석
export interface SalesAnalytics {
  totalCompanies: number;
  totalAmount: number;
  totalSupplyAmount: number;
  totalTaxAmount: number;

  // 기간별 필터
  period: {
    startDate: Date;
    endDate: Date;
  };

  // 거래처별 매출
  companySales: CompanySalesStats[];

  // 과세구분별 전체 통계
  totalSalesByTaxType: {
    [K in TaxType]: {
      count: number;
      totalAmount: number;
      totalSupplyAmount: number;
      totalTaxAmount: number;
      companies: number; // 거래처 수
    };
  };

  // 월별 전체 통계
  totalSalesByMonth: Array<{
    month: string;
    totalAmount: number;
    totalSupplyAmount: number;
    totalTaxAmount: number;
    companiesCount: number;
    invoicesCount: number;
    salesByTaxType: {
      [K in TaxType]: {
        count: number;
        totalAmount: number;
        totalSupplyAmount: number;
        totalTaxAmount: number;
      };
    };
  }>;
}

// 검색 필터
export interface SalesSearchFilter {
  companyName?: string;
  taxType?: TaxType | "all";
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  productName?: string;
}

// 정렬 옵션
export type SalesSortBy =
  | "company"
  | "totalAmount"
  | "invoiceCount"
  | "lastInvoiceDate"
  | "taxableAmount"
  | "taxFreeAmount";

export type SortOrder = "asc" | "desc";

export interface SalesSortOptions {
  sortBy: SalesSortBy;
  order: SortOrder;
}
