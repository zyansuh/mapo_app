import { BaseEntity } from "./common";
import { Company } from "./company";
import { ProductCategory, ProductItem } from "./product";

export type DeliveryStatus = "준비중" | "배송중" | "배송완료" | "취소";

export interface DeliveryProduct {
  id: string;
  category: ProductCategory;
  productItem: ProductItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  memo?: string;
}

export interface Delivery extends BaseEntity {
  deliveryNumber: string; // 배송 번호
  companyId: string; // 거래처 ID
  company?: Company; // 거래처 정보 (populated)
  products: DeliveryProduct[]; // 배송 상품 목록
  totalAmount: number; // 총 배송 금액
  deliveryDate: Date; // 배송 예정일
  deliveryAddress?: string; // 배송 주소 (선택사항)
  deliveryMemo?: string; // 배송 메모
  driverName?: string; // 배송 기사명
  driverPhone?: string; // 배송 기사 연락처
  status: DeliveryStatus; // 배송 상태
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryFormData {
  companyId: string;
  products: Omit<DeliveryProduct, "id" | "totalPrice">[];
  deliveryDate: Date;
  deliveryAddress?: string; // 배송 주소 (선택사항)
  deliveryMemo?: string;
  driverName?: string;
  driverPhone?: string;
}

// 배송 등록 통계
export interface DeliveryStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  totalAmount: number;
}
