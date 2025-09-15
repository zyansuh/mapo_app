// API 관련 타입 정의

import {
  BaseEntity,
  ApiResponse,
  PaginationParams,
  SortParams,
} from "./common";

// API 요청/응답 타입들
export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiError {
  code: number;
  message: string;
  details?: any;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 인증 관련 타입들
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  lastLogin?: Date;
}

export interface ProfileUpdateRequest {
  name?: string;
  phone?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// 데이터 동기화 관련 타입들
export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncStatus: "idle" | "syncing" | "success" | "error";
  pendingChanges: number;
}

export interface SyncRequest {
  type: "companies" | "deliveries" | "invoices" | "products";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: Date;
}

export interface BulkSyncRequest {
  companies?: any[];
  deliveries?: any[];
  invoices?: any[];
  products?: any[];
  lastSyncTime?: Date;
}

// 파일 업로드 관련 타입들
export interface FileUploadRequest {
  file: File | Blob;
  type: "image" | "document" | "attachment";
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: Date;
}

// 검색 및 필터링 관련 타입들
export interface SearchRequest extends PaginationParams, SortParams {
  query?: string;
  filters?: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchResponse<T> extends PaginatedResponse<T> {
  aggregations?: Record<string, any>;
  suggestions?: string[];
}

// 통계 및 분석 관련 타입들
export interface StatsRequest {
  type: "companies" | "deliveries" | "invoices" | "products";
  period: "day" | "week" | "month" | "year" | "custom";
  startDate?: Date;
  endDate?: Date;
  groupBy?: string;
}

export interface StatsResponse {
  period: {
    start: Date;
    end: Date;
  };
  data: Record<string, any>;
  summary: {
    total: number;
    growth: number;
    trend: "up" | "down" | "stable";
  };
}
