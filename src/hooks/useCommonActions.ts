import React, { useState, useCallback } from "react";
import { Alert } from "react-native";

// 공통 로딩 상태 관리
export const useLoading = (initialState: boolean = false) => {
  const [loading, setLoading] = useState(initialState);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const setLoadingError = useCallback((errorMessage: string) => {
    setLoading(false);
    setError(errorMessage);
  }, []);

  const withLoading = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T | null> => {
      try {
        startLoading();
        const result = await asyncFunction();
        stopLoading();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "알 수 없는 오류가 발생했습니다.";
        setLoadingError(errorMessage);
        return null;
      }
    },
    [startLoading, stopLoading, setLoadingError]
  );

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    withLoading,
  };
};

// 공통 CRUD 액션들
export const useCrudActions = <T extends { id: string }>() => {
  // 삭제 확인 다이얼로그
  const confirmDelete = useCallback(
    (itemName: string, onConfirm: () => void, customMessage?: string) => {
      Alert.alert(
        "삭제 확인",
        customMessage ||
          `${itemName}을(를) 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.`,
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            style: "destructive",
            onPress: onConfirm,
          },
        ]
      );
    },
    []
  );

  // 일괄 선택 관리
  const useSelection = () => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelection = useCallback((id: string) => {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }, []);

    const selectAll = useCallback((items: T[]) => {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }, []);

    const clearSelection = useCallback(() => {
      setSelectedIds(new Set());
    }, []);

    const isSelected = useCallback(
      (id: string) => {
        return selectedIds.has(id);
      },
      [selectedIds]
    );

    return {
      selectedIds: Array.from(selectedIds),
      selectedCount: selectedIds.size,
      toggleSelection,
      selectAll,
      clearSelection,
      isSelected,
    };
  };

  // 정렬 관리
  const useSorting = <K extends keyof T>(
    defaultSortKey: K,
    defaultSortOrder: "asc" | "desc" = "asc"
  ) => {
    const [sortKey, setSortKey] = useState<K>(defaultSortKey);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
      defaultSortOrder
    );

    const updateSort = useCallback(
      (key: K) => {
        if (sortKey === key) {
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
          setSortKey(key);
          setSortOrder("asc");
        }
      },
      [sortKey]
    );

    const sortItems = useCallback(
      (items: T[]) => {
        return [...items].sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];

          if (aValue === bValue) return 0;

          const comparison = aValue > bValue ? 1 : -1;
          return sortOrder === "asc" ? comparison : -comparison;
        });
      },
      [sortKey, sortOrder]
    );

    return {
      sortKey,
      sortOrder,
      updateSort,
      sortItems,
    };
  };

  // 필터링 관리
  const useFiltering = <F>(defaultFilters: F) => {
    const [filters, setFilters] = useState<F>(defaultFilters);

    const updateFilter = useCallback(
      <K extends keyof F>(key: K, value: F[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
      },
      []
    );

    const resetFilters = useCallback(() => {
      setFilters(defaultFilters);
    }, [defaultFilters]);

    const hasActiveFilters = useCallback(() => {
      return Object.entries(filters as any).some(([key, value]) => {
        const defaultValue = (defaultFilters as any)[key];
        return value !== defaultValue;
      });
    }, [filters, defaultFilters]);

    return {
      filters,
      updateFilter,
      resetFilters,
      hasActiveFilters,
    };
  };

  return {
    confirmDelete,
    useSelection,
    useSorting,
    useFiltering,
  };
};

// 공통 알림 액션들
export const useNotifications = () => {
  const showSuccess = useCallback((message: string, title: string = "성공") => {
    Alert.alert(title, message);
  }, []);

  const showError = useCallback((message: string, title: string = "오류") => {
    Alert.alert(title, message);
  }, []);

  const showInfo = useCallback((message: string, title: string = "알림") => {
    Alert.alert(title, message);
  }, []);

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      onCancel?: () => void,
      title: string = "확인"
    ) => {
      Alert.alert(title, message, [
        { text: "취소", style: "cancel", onPress: onCancel },
        { text: "확인", onPress: onConfirm },
      ]);
    },
    []
  );

  return {
    showSuccess,
    showError,
    showInfo,
    showConfirm,
  };
};

// 폼 관리 공통 훅
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: Partial<
    Record<keyof T, (value: any) => string | undefined>
  >
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));

      // 실시간 유효성 검사
      if (validationSchema && validationSchema[key] && touched[key]) {
        const error = validationSchema[key]!(value);
        setErrors((prev) => ({ ...prev, [key]: error }));
      }
    },
    [validationSchema, touched]
  );

  const markAsTouched = useCallback(<K extends keyof T>(key: K) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const validateField = useCallback(
    <K extends keyof T>(key: K) => {
      if (validationSchema && validationSchema[key]) {
        const error = validationSchema[key]!(values[key]);
        setErrors((prev) => ({ ...prev, [key]: error }));
        return !error;
      }
      return true;
    },
    [validationSchema, values]
  );

  const validateAll = useCallback(() => {
    if (!validationSchema) return true;

    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key in validationSchema) {
      const error = validationSchema[key]!(values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validationSchema, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const hasErrors = Object.keys(errors).some((key) => errors[key as keyof T]);

  return {
    values,
    errors,
    touched,
    setValue,
    markAsTouched,
    validateField,
    validateAll,
    reset,
    hasErrors,
  };
};

// 데이터 페칭 관리
export const useDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const { loading, error, withLoading } = useLoading();

  const fetchData = useCallback(async () => {
    const result = await withLoading(fetchFunction);
    if (result !== null) {
      setData(result);
    }
  }, [fetchFunction, withLoading]);

  const refreshData = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // 초기 데이터 로드
  React.useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refreshData,
    setData,
  };
};
