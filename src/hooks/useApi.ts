import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { ApiResponse } from "../types";

// API 호출 훅
export const useApi = <T>(endpoint: string, immediate: boolean = true) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<T> = await apiService.get(endpoint);

      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message || "API 요청 실패");
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [endpoint, immediate]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// POST 요청을 위한 훅
export const useApiPost = <T, U = any>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (endpoint: string, body: U): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse<T> = await apiService.post(endpoint, body);

      if (response.success) {
        return response.data;
      } else {
        setError(response.message || "API 요청 실패");
        return null;
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};
