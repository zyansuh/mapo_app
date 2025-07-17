import { BaseEntity } from "./common";
import { Company } from "./company";

// 전화 관련 타입 정의
export interface CallState {
  isCallActive: boolean;
  callDirection: "incoming" | "outgoing" | null;
  phoneNumber: string | null;
  callStartTime: Date | null;
  callEndTime?: Date | null;
  duration?: number; // 통화 시간 (초)
}

export type CallStatus =
  | "Incoming"
  | "Dialing"
  | "Ringing"
  | "Offhook"
  | "Disconnected"
  | "Missed"
  | "Rejected"
  | "Unknown";

export type CallType = "incoming" | "outgoing" | "missed";

export interface CallHistoryItem {
  id: string;
  phoneNumber: string;
  companyName?: string;
  timestamp: Date;
  duration?: number;
  type: CallType;
}

export interface CallRecord extends BaseEntity {
  phoneNumber: string;
  type: CallType;
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number; // 통화 시간 (초)
  companyId?: string;
  company?: Company;
  contactName?: string;
  memo?: string;
  isImportant?: boolean; // 중요 통화 표시
  tags?: string[];
  recordingPath?: string; // 녹음 파일 경로
}

export interface IncomingCallData {
  phoneNumber: string;
  callStatus: CallStatus;
  timestamp: Date;
  contactName?: string;
  companyName?: string;
}

export interface UnknownNumber extends BaseEntity {
  phoneNumber: string;
  timestamp: Date;
  callCount: number; // 이 번호로부터 온 총 통화 수
  lastCallTime: Date;
  isBlocked?: boolean; // 차단 여부
  memo?: string;
}

// 통화 분석 관련 타입
export interface CallAnalytics {
  totalCalls: number;
  outgoingCalls: number;
  incomingCalls: number;
  missedCalls: number;
  totalDuration: number; // 총 통화 시간 (초)
  averageDuration: number; // 평균 통화 시간 (초)
  callsByCompany: Record<string, number>;
  callsByDate: Record<string, number>;
  callsByWeek: Record<string, number>;
  callsByMonth: Record<string, number>;
  callsByHour: Record<string, number>; // 시간대별 통화량
  favoriteCompanies: Company[];
  mostContactedCompanies: Array<{
    company: Company;
    callCount: number;
    totalDuration: number;
  }>;
  peakCallTimes: Array<{
    hour: number;
    count: number;
  }>;
}

// 통화 설정
export interface CallSettings {
  autoRecord: boolean; // 자동 녹음
  recordIncoming: boolean; // 수신 통화 녹음
  recordOutgoing: boolean; // 발신 통화 녹음
  detectUnknownNumbers: boolean; // 미지의 번호 감지
  showCallHistory: boolean; // 통화 기록 표시
  callVibration: boolean; // 통화 진동
  callSound: boolean; // 통화음
  blockUnknownNumbers: boolean; // 미지의 번호 차단
}
