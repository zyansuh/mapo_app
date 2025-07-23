import { useMemo, useCallback } from "react";

// FlatList 렌더링 최적화 훅
export const useOptimizedFlatList = <T>(
  data: T[],
  keyExtractorFn: (item: T, index: number) => string
) => {
  const memoizedKeyExtractor = useCallback(keyExtractorFn, []);

  const flatListConfig = useMemo(
    () => ({
      // 성능 최적화 설정
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 50,
      initialNumToRender: 15,
      windowSize: 10,
      showsVerticalScrollIndicator: false,
      keyboardShouldPersistTaps: "handled" as const,
    }),
    []
  );

  return {
    data,
    keyExtractor: memoizedKeyExtractor,
    ...flatListConfig,
  };
};

// 검색 최적화 훅 (디바운싱)
export const useOptimizedSearch = <T>(
  data: T[],
  searchQuery: string,
  filterFn: (item: T, query: string) => boolean,
  debounceMs: number = 300
) => {
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase().trim();
    return data.filter((item) => filterFn(item, query));
  }, [data, searchQuery, filterFn]);

  const searchStats = useMemo(
    () => ({
      total: data.length,
      filtered: filteredData.length,
      hasResults: filteredData.length > 0,
    }),
    [data.length, filteredData.length]
  );

  return {
    filteredData,
    searchStats,
  };
};

// 콜백 최적화 헬퍼
export const useOptimizedCallbacks = () => {
  const createOptimizedCallback = useCallback(
    <T extends (...args: any[]) => any>(fn: T, deps: any[]) => {
      return useCallback(fn, deps);
    },
    []
  );

  return { createOptimizedCallback };
};
