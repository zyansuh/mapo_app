import { API_CONFIG } from "../constants";
import { ApiResponse } from "../types";

// API 기본 설정
class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
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
}

// API 서비스 인스턴스 생성
export const apiService = new ApiService();
export default apiService;
