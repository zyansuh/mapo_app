import { BaseEntity } from "./common";
import { Company } from "./company";

// 상품 관련 타입 정의
export type ProductCategory = "두부" | "콩나물" | "묵류" | "기타";

export type ProductStatus = "활성" | "단종" | "일시중단";

export interface Product extends BaseEntity {
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  unit: string; // 단위 (개, kg, 박스 등)
  description?: string;
  sku?: string; // 상품 코드
  barcode?: string;
  weight?: number; // 중량(g)
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  minStock?: number; // 최소 재고량
  maxStock?: number; // 최대 재고량
  currentStock?: number; // 현재 재고량
  costPrice?: number; // 원가
  sellPrice?: number; // 판매가
  tags?: string[];
  images?: string[]; // 이미지 URL 배열
  companyId?: string; // 주요 공급업체 ID
}

export interface ProductFormData {
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  unit: string;
  description: string;
  sku: string;
  barcode: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellPrice: number;
  tags: string[];
  companyId: string;
}

export interface ProductFormErrors {
  name?: string;
  category?: string;
  price?: string;
  unit?: string;
  sku?: string;
  weight?: string;
  minStock?: string;
  maxStock?: string;
  costPrice?: string;
  sellPrice?: string;
}

// 배송 관련 타입
export type DeliveryStatus =
  | "배송준비"
  | "배송중"
  | "배송완료"
  | "취소"
  | "반품";

export interface DeliveryItem {
  id: string;
  productId: string;
  product?: Product;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  price: number; // 단가 (unitPrice와 동일한 의미)
  unitPrice: number;
  totalPrice: number;
  discountRate?: number; // 할인율
  discountAmount?: number; // 할인액
  taxRate?: number; // 세율
  taxAmount?: number; // 세액
}

export interface ProductDelivery extends BaseEntity {
  deliveryNumber: string; // 배송번호
  companyId: string;
  company?: Company;
  items: DeliveryItem[];
  totalQuantity: number;
  subtotalAmount: number; // 소계
  discountAmount: number; // 총 할인액
  taxAmount: number; // 총 세액
  totalAmount: number; // 총액
  deliveryDate: Date;
  requestedDate?: Date; // 요청 배송일
  actualDate?: Date; // 실제 배송일
  status: DeliveryStatus;
  driverName?: string; // 기사명
  driverPhone?: string; // 기사 연락처
  vehicleNumber?: string; // 차량번호
  memo?: string;
  internalMemo?: string; // 내부 메모
  trackingNumber?: string; // 송장번호
}

export interface DeliveryFormData {
  id: string;
  companyId: string;
  items: DeliveryItem[];
  totalAmount: number;
  date: string; // ISO 날짜 문자열
  deliveryDate: string; // ISO 날짜 문자열
  requestedDate?: string;
  driverName?: string;
  driverPhone?: string;
  vehicleNumber?: string;
  memo?: string;
  trackingNumber?: string;
}

// 상품 선택 폼 데이터 타입
export interface ProductSelectionFormData {
  productId: string;
  quantity: number;
  unitPrice: number;
  deliveryDate: Date;
  discountRate?: number;
  memo?: string;
}

// 재고 관리 관련 타입
export interface StockMovement extends BaseEntity {
  productId: string;
  product?: Product;
  type: "in" | "out" | "adjustment"; // 입고, 출고, 조정
  quantity: number;
  previousStock: number;
  newStock: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  referenceType?: "delivery" | "purchase" | "return" | "adjustment" | "loss";
  referenceId?: string; // 참조 문서 ID
  userId?: string;
  memo?: string;
}

// 상품 통계
export interface ProductStatistics {
  productId: string;
  productName: string;
  category: ProductCategory;
  companyId: string;
  companyName: string;
  totalQuantity: number;
  totalAmount: number;
  averagePrice: number;
  deliveryCount: number;
  lastDeliveryDate?: Date;
  mukQuantity: number;
  mukAmount: number;
  tofuBeansproutQuantity: number;
  tofuBeansproutAmount: number;
  topCompanies: Array<{
    companyId: string;
    companyName: string;
    quantity: number;
    amount: number;
  }>;
}
