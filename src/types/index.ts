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

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
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
export type ProductCategory =
  | "식품"
  | "전자제품"
  | "의류"
  | "가구"
  | "화장품"
  | "서비스"
  | "기타";

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
