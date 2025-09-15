// 공통으로 사용되는 기본 타입들

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseFormData {
  [key: string]: any;
}

export interface BaseStats {
  total: number;
  [key: string]: any;
}

export interface BaseSearchOptions {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BaseSearchFilters {
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type Status =
  | "active"
  | "inactive"
  | "pending"
  | "completed"
  | "cancelled";
export type UserRole = "user" | "admin";
export type Theme = "light" | "dark";
export type Language = "ko" | "en";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}
