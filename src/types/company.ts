import { BaseEntity } from "./common";

// 회사 관련 타입 정의
export type CompanyType =
  | "고객사"
  | "협력업체"
  | "공급업체"
  | "하청업체"
  | "기타";

export type CompanyRegion =
  | "서울"
  | "부산"
  | "대구"
  | "인천"
  | "광주"
  | "대전"
  | "울산"
  | "경기"
  | "강원"
  | "충북"
  | "충남"
  | "전북"
  | "전남"
  | "경북"
  | "경남"
  | "제주"
  | "순창"
  | "담양"
  | "장성"
  | "기타";

export type CompanyStatus = "활성" | "비활성" | "보류" | "종료";

export interface Company extends BaseEntity {
  name: string;
  type: CompanyType;
  region: CompanyRegion;
  status: CompanyStatus;
  address: string;
  phoneNumber: string;
  email?: string;
  businessNumber?: string; // 사업자등록번호
  contactPerson?: string; // 담당자명
  contactPhone?: string; // 담당자 연락처
  memo?: string;
  isFavorite?: boolean; // 즐겨찾기 여부
  tags?: string[]; // 태그
  lastContactDate?: Date; // 마지막 연락일
  nextContactDate?: Date; // 다음 연락 예정일
}

// 회사 폼 데이터 타입 (등록/수정용)
export interface CompanyFormData {
  name: string;
  type: CompanyType;
  region: CompanyRegion;
  status: CompanyStatus;
  address: string;
  phoneNumber: string;
  email: string;
  businessNumber: string;
  contactPerson: string;
  contactPhone: string;
  memo: string;
  tags: string[];
}

export interface CompanyFormErrors {
  name?: string;
  type?: string;
  region?: string;
  status?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  businessNumber?: string;
  contactPerson?: string;
  contactPhone?: string;
}

// 회사 검색/필터 옵션
export interface CompanySearchFilters {
  type?: CompanyType[];
  region?: CompanyRegion[];
  status?: CompanyStatus[];
  isFavorite?: boolean;
  tags?: string[];
  businessNumberExists?: boolean;
  emailExists?: boolean;
}

// 회사 통계
export interface CompanyStats {
  total: number;
  byType: Record<CompanyType, number>;
  byRegion: Record<CompanyRegion, number>;
  byStatus: Record<CompanyStatus, number>;
  favorites: number;
  withBusinessNumber: number;
  withEmail: number;
}

// 회사 활동 로그
export interface CompanyActivityLog extends BaseEntity {
  companyId: string;
  type: "call" | "email" | "meeting" | "delivery" | "payment" | "note";
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  userId?: string; // 활동한 사용자
}
