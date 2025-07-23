import { useMemo, useState, useCallback, useRef, useEffect } from "react";

// 데이터 필터링 및 정렬 최적화 훅
export function useOptimizedFilter<T>(
  data: T[],
  filterFn: (item: T, query: string) => boolean,
  searchQuery: string,
  sortFn?: (a: T, b: T) => number,
  debounceMs: number = 300
) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 검색어 디바운싱
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery, debounceMs]);

  // 필터링 및 정렬 최적화
  const filteredData = useMemo(() => {
    let result = data;

    // 필터링
    if (debouncedQuery.trim()) {
      result = data.filter((item) =>
        filterFn(item, debouncedQuery.toLowerCase())
      );
    }

    // 정렬
    if (sortFn) {
      result = [...result].sort(sortFn);
    }

    return result;
  }, [data, debouncedQuery, filterFn, sortFn]);

  return {
    filteredData,
    isSearching: searchQuery !== debouncedQuery,
  };
}

// 페이지네이션 최적화 훅
export function useOptimizedPagination<T>(
  data: T[],
  itemsPerPage: number = 20
) {
  const [currentPage, setCurrentPage] = useState(0);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(0, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    const maxPage = Math.ceil(data.length / itemsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, data.length, itemsPerPage]);

  const reset = useCallback(() => {
    setCurrentPage(0);
  }, []);

  const hasMore = useMemo(() => {
    return (currentPage + 1) * itemsPerPage < data.length;
  }, [currentPage, itemsPerPage, data.length]);

  return {
    paginatedData,
    loadMore,
    reset,
    hasMore,
    currentPage,
  };
}

// 메모리 최적화를 위한 대용량 데이터 처리 훅
export function useVirtualizedData<T>(
  data: T[],
  visibleRange: { start: number; end: number }
) {
  const visibleData = useMemo(() => {
    return data.slice(visibleRange.start, visibleRange.end);
  }, [data, visibleRange.start, visibleRange.end]);

  return visibleData;
}
