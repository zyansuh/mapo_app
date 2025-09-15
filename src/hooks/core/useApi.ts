// API 통신을 위한 핵심 훅

import { useState, useCallback, useRef, useEffect } from "react";
import { apiService } from "../../services/api";
import { ApiResponse, ApiRequestConfig, ApiError } from "../../types/api";

interface UseApiOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onError?: (error: ApiError) => void;
  onSuccess?: (data: any) => void;
}

interface UseApiReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (config: ApiRequestConfig) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export const useApi = <T = any>(
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const {
    timeout = 30000,
    retries = 3,
    retryDelay = 1000,
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (config: ApiRequestConfig): Promise<ApiResponse<T>> => {
      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새로운 AbortController 생성
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      let lastError: ApiError | null = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await apiService.request<T>({
            ...config,
            timeout,
            signal: abortControllerRef.current.signal,
          });

          if (response.success) {
            setData(response.data || null);
            onSuccess?.(response.data);
            return response;
          } else {
            throw new Error(response.message || "API 요청 실패");
          }
        } catch (err: any) {
          lastError = {
            code: err.status || 500,
            message: err.message || "알 수 없는 오류가 발생했습니다.",
            details: err.details,
            timestamp: new Date().toISOString(),
            path: config.url,
          };

          // 마지막 시도가 아니고 재시도 가능한 오류인 경우
          if (attempt < retries && !err.name?.includes("Abort")) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * (attempt + 1))
            );
            continue;
          }

          setError(lastError);
          onError?.(lastError);
          throw lastError;
        }
      }

      throw lastError;
    },
    [timeout, retries, retryDelay, onError, onSuccess]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// GET 요청 전용 훅
export const useApiGet = <T = any>(
  url: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(options);

  const fetch = useCallback(
    async (params?: Record<string, any>) => {
      return api.execute({
        method: "GET",
        url,
        params,
      });
    },
    [api, url]
  );

  return {
    ...api,
    fetch,
  };
};

// POST 요청 전용 훅
export const useApiPost = <T = any>(
  url: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(options);

  const post = useCallback(
    async (data?: any) => {
      return api.execute({
        method: "POST",
        url,
        data,
      });
    },
    [api, url]
  );

  return {
    ...api,
    post,
  };
};

// PUT 요청 전용 훅
export const useApiPut = <T = any>(
  url: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(options);

  const put = useCallback(
    async (data?: any) => {
      return api.execute({
        method: "PUT",
        url,
        data,
      });
    },
    [api, url]
  );

  return {
    ...api,
    put,
  };
};

// DELETE 요청 전용 훅
export const useApiDelete = <T = any>(
  url: string,
  options: UseApiOptions = {}
) => {
  const api = useApi<T>(options);

  const del = useCallback(async () => {
    return api.execute({
      method: "DELETE",
      url,
    });
  }, [api, url]);

  return {
    ...api,
    delete: del,
  };
};
