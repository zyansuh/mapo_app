// 로딩 상태 관리를 위한 핵심 훅

import { useState, useCallback, useRef, useEffect } from "react";

interface LoadingState {
  loading: boolean;
  error: string | null;
  progress?: number;
}

interface UseLoadingOptions {
  initialLoading?: boolean;
  onError?: (error: string) => void;
  onSuccess?: () => void;
  timeout?: number;
}

interface UseLoadingReturn {
  loading: boolean;
  error: string | null;
  progress: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;
  execute: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
}

export const useLoading = (
  options: UseLoadingOptions = {}
): UseLoadingReturn => {
  const { initialLoading = false, onError, onSuccess, timeout } = options;

  const [state, setState] = useState<LoadingState>({
    loading: initialLoading,
    error: null,
    progress: 0,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loading,
      error: loading ? null : prev.error,
    }));
  }, []);

  const setError = useCallback(
    (error: string | null) => {
      setState((prev) => ({ ...prev, error, loading: false }));
      if (error) {
        onError?.(error);
      }
    },
    [onError]
  );

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
    }));
  }, []);

  const execute = useCallback(
    async <T>(asyncFn: () => Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      setProgress(0);

      // 타임아웃 설정
      if (timeout) {
        timeoutRef.current = setTimeout(() => {
          setError("요청 시간이 초과되었습니다.");
        }, timeout);
      }

      try {
        const result = await asyncFn();
        setProgress(100);
        onSuccess?.();
        return result;
      } catch (error: any) {
        const errorMessage =
          error?.message || "알 수 없는 오류가 발생했습니다.";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    },
    [setLoading, setError, setProgress, onSuccess, timeout]
  );

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      progress: 0,
    });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    loading: state.loading,
    error: state.error,
    progress: state.progress || 0,
    setLoading,
    setError,
    setProgress,
    execute,
    reset,
  };
};

// 다중 로딩 상태 관리
interface UseMultipleLoadingOptions {
  onError?: (key: string, error: string) => void;
  onSuccess?: (key: string) => void;
}

interface UseMultipleLoadingReturn {
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  execute: <T>(key: string, asyncFn: () => Promise<T>) => Promise<T | null>;
  reset: (key?: string) => void;
  isAnyLoading: boolean;
  hasAnyError: boolean;
}

export const useMultipleLoading = (
  options: UseMultipleLoadingOptions = {}
): UseMultipleLoadingReturn => {
  const { onError, onSuccess } = options;

  const [loading, setLoadingState] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingState((prev) => ({ ...prev, [key]: loading }));
    if (loading) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  }, []);

  const setError = useCallback(
    (key: string, error: string | null) => {
      setErrors((prev) => ({ ...prev, [key]: error }));
      setLoadingState((prev) => ({ ...prev, [key]: false }));
      if (error) {
        onError?.(key, error);
      }
    },
    [onError]
  );

  const execute = useCallback(
    async <T>(key: string, asyncFn: () => Promise<T>): Promise<T | null> => {
      setLoading(key, true);
      setError(key, null);

      try {
        const result = await asyncFn();
        onSuccess?.(key);
        return result;
      } catch (error: any) {
        const errorMessage =
          error?.message || "알 수 없는 오류가 발생했습니다.";
        setError(key, errorMessage);
        return null;
      } finally {
        setLoading(key, false);
      }
    },
    [setLoading, setError, onSuccess]
  );

  const reset = useCallback((key?: string) => {
    if (key) {
      setLoadingState((prev) => ({ ...prev, [key]: false }));
      setErrors((prev) => ({ ...prev, [key]: null }));
    } else {
      setLoadingState({});
      setErrors({});
    }
  }, []);

  const isAnyLoading = Object.values(loading).some(Boolean);
  const hasAnyError = Object.values(errors).some(Boolean);

  return {
    loading,
    errors,
    setLoading,
    setError,
    execute,
    reset,
    isAnyLoading,
    hasAnyError,
  };
};

// 진행률이 있는 로딩 상태
interface UseProgressLoadingOptions {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface UseProgressLoadingReturn {
  loading: boolean;
  progress: number;
  error: string | null;
  start: () => void;
  updateProgress: (progress: number) => void;
  complete: () => void;
  fail: (error: string) => void;
  reset: () => void;
}

export const useProgressLoading = (
  options: UseProgressLoadingOptions = {}
): UseProgressLoadingReturn => {
  const { onProgress, onComplete, onError } = options;

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(() => {
    setLoading(true);
    setProgress(0);
    setError(null);
  }, []);

  const updateProgress = useCallback(
    (newProgress: number) => {
      const clampedProgress = Math.max(0, Math.min(100, newProgress));
      setProgress(clampedProgress);
      onProgress?.(clampedProgress);
    },
    [onProgress]
  );

  const complete = useCallback(() => {
    setProgress(100);
    setLoading(false);
    onComplete?.();
  }, [onComplete]);

  const fail = useCallback(
    (errorMessage: string) => {
      setError(errorMessage);
      setLoading(false);
      onError?.(errorMessage);
    },
    [onError]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    loading,
    progress,
    error,
    start,
    updateProgress,
    complete,
    fail,
    reset,
  };
};
