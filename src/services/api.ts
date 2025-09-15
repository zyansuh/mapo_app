import { API_CONFIG } from "../constants";
import { ApiResponse } from "../types";
import { storageService } from "./storage";

// API 기본 설정
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // 인증 토큰 가져오기
  private async getAuthToken(): Promise<string | null> {
    try {
      const userData = await storageService.getItem("userData");
      return userData?.token || null;
    } catch (error) {
      console.error("토큰 가져오기 오류:", error);
      return null;
    }
  }

  // 공통 헤더 생성
  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          data,
          message: data.message || "API 요청 실패",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  // POST 요청
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          data,
          message: data.message || "API 요청 실패",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  // PUT 요청
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          data,
          message: data.message || "API 요청 실패",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          data,
          message: data.message || "API 요청 실패",
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: "네트워크 오류가 발생했습니다.",
      };
    }
  }

  // 인증 관련 메서드들
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.post("/auth/login", { email, password });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
  }): Promise<ApiResponse<any>> {
    return this.post("/auth/register", userData);
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.get("/auth/profile");
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.put("/auth/profile", profileData);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<any>> {
    return this.put("/auth/password", { currentPassword, newPassword });
  }

  // 회사 관련 메서드들
  async getCompanies(params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    region?: string;
    status?: string;
    isFavorite?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get(`/companies${queryString ? `?${queryString}` : ""}`);
  }

  async getCompany(id: string): Promise<ApiResponse<any>> {
    return this.get(`/companies/${id}`);
  }

  async createCompany(companyData: any): Promise<ApiResponse<any>> {
    return this.post("/companies", companyData);
  }

  async updateCompany(id: string, companyData: any): Promise<ApiResponse<any>> {
    return this.put(`/companies/${id}`, companyData);
  }

  async deleteCompany(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/companies/${id}`);
  }

  async getCompanyStats(): Promise<ApiResponse<any>> {
    return this.get("/companies/stats/overview");
  }

  // 배송 관련 메서드들
  async getDeliveries(params?: {
    page?: number;
    limit?: number;
    status?: string;
    companyId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get(`/deliveries${queryString ? `?${queryString}` : ""}`);
  }

  async getDelivery(id: string): Promise<ApiResponse<any>> {
    return this.get(`/deliveries/${id}`);
  }

  async createDelivery(deliveryData: any): Promise<ApiResponse<any>> {
    return this.post("/deliveries", deliveryData);
  }

  async updateDelivery(
    id: string,
    deliveryData: any
  ): Promise<ApiResponse<any>> {
    return this.put(`/deliveries/${id}`, deliveryData);
  }

  async deleteDelivery(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/deliveries/${id}`);
  }

  async getDeliveryStats(): Promise<ApiResponse<any>> {
    return this.get("/deliveries/stats/overview");
  }

  // 계산서 관련 메서드들
  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
    companyId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get(`/invoices${queryString ? `?${queryString}` : ""}`);
  }

  async getInvoice(id: string): Promise<ApiResponse<any>> {
    return this.get(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: any): Promise<ApiResponse<any>> {
    return this.post("/invoices", invoiceData);
  }

  async updateInvoice(id: string, invoiceData: any): Promise<ApiResponse<any>> {
    return this.put(`/invoices/${id}`, invoiceData);
  }

  async deleteInvoice(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/invoices/${id}`);
  }

  async getInvoiceStats(): Promise<ApiResponse<any>> {
    return this.get("/invoices/stats/overview");
  }

  // 제품 관련 메서드들
  async getProductCategories(): Promise<ApiResponse<any>> {
    return this.get("/products/categories");
  }

  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const queryString = queryParams.toString();
    return this.get(`/products${queryString ? `?${queryString}` : ""}`);
  }

  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.post("/products", productData);
  }

  async updateProduct(id: string, productData: any): Promise<ApiResponse<any>> {
    return this.put(`/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/products/${id}`);
  }
}

// API 서비스 인스턴스 생성
export const apiService = new ApiService();
export default apiService;
