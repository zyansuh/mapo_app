import { BaseEntity } from "./common";
import { Company } from "./company";

// 상품 관련 타입 정의
export type ProductCategory = "두부" | "콩나물" | "묵류" | "기타";

export type ProductStatus = "활성" | "단종" | "일시중단";

// 카테고리별 상세 품목 타입
export type TofuItems =
  | "착한손두부"
  | "고소한손두부"
  | "순두부"
  | "맛두부"
  | "판두부"
  | "모두부"
  | "콩물";

export type BeansproutItems = "시루콩나물" | "박스콩나물" | "두절콩나물";

export type JellyItems =
  | "도토리묵小"
  | "도토리묵大"
  | "도토리420"
  | "검정깨묵"
  | "우뭇가사리"
  | "청포묵";

export type ProductItem = TofuItems | BeansproutItems | JellyItems | string;

// 카테고리별 상세 품목 매핑
export const CATEGORY_ITEMS: Record<ProductCategory, string[]> = {
  두부: [
    "착한손두부",
    "고소한손두부",
    "순두부",
    "맛두부",
    "판두부",
    "모두부",
    "콩물",
  ],
  콩나물: ["시루콩나물", "박스콩나물", "두절콩나물"],
  묵류: [
    "도토리묵小",
    "도토리묵大",
    "도토리420",
    "검정깨묵",
    "우뭇가사리",
    "청포묵",
  ],
  기타: [],
};

export interface Product extends BaseEntity {
  name: string;
  category: ProductCategory;
  productItem?: ProductItem; // 상세 품목 추가
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
