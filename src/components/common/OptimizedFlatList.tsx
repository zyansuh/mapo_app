import React, { useMemo, useCallback } from "react";
import { FlatList, FlatListProps, View, Text } from "react-native";
import { THEME } from "../../styles/themes";

// 최적화된 FlatList 컴포넌트
interface OptimizedFlatListProps<T>
  extends Omit<FlatListProps<T>, "renderItem" | "keyExtractor"> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  itemHeight?: number;
  estimatedItemSize?: number;
  emptyMessage?: string;
  emptyIcon?: string;
}

function OptimizedFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  estimatedItemSize = 80,
  emptyMessage = "데이터가 없습니다",
  emptyIcon,
  ...props
}: OptimizedFlatListProps<T>) {
  // 렌더링 최적화를 위한 메모이제이션
  const memoizedRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      return renderItem(item, index);
    },
    [renderItem]
  );

  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => keyExtractor(item, index),
    [keyExtractor]
  );

  // 고정 높이가 있을 때 getItemLayout 최적화
  const getItemLayout = useMemo(() => {
    if (itemHeight) {
      return (data: any, index: number) => ({
        length: itemHeight,
        offset: itemHeight * index,
        index,
      });
    }
    return undefined;
  }, [itemHeight]);

  // 빈 상태 컴포넌트
  const EmptyComponent = useMemo(() => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 60,
        }}
      >
        <Text
          style={{
            fontSize: THEME.typography.body1.fontSize,
            color: THEME.colors.textSecondary,
            textAlign: "center",
          }}
        >
          {emptyMessage}
        </Text>
      </View>
    );
  }, [emptyMessage]);

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      getItemLayout={getItemLayout}
      // 성능 최적화 설정
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
      // 스크롤 최적화
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      // 빈 상태
      ListEmptyComponent={EmptyComponent}
      // 추가 props
      {...props}
    />
  );
}

export default React.memo(OptimizedFlatList) as <T>(
  props: OptimizedFlatListProps<T>
) => React.ReactElement;
