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
