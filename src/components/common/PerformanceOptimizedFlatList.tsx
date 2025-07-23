import React from "react";
import { FlatList, FlatListProps } from "react-native";

interface PerformanceOptimizedFlatListProps<T> extends FlatListProps<T> {
  estimatedItemSize?: number;
}

function PerformanceOptimizedFlatList<T>(
  props: PerformanceOptimizedFlatListProps<T>
) {
  const optimizedProps = {
    // 성능 최적화 기본 설정
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 15,
    windowSize: 10,
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: "handled" as const,

    // 사용자 정의 props로 오버라이드 가능
    ...props,
  };

  return <FlatList {...optimizedProps} />;
}

export default React.memo(PerformanceOptimizedFlatList);
