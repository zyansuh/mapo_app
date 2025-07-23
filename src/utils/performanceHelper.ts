import { InteractionManager } from "react-native";

// 간단한 디바운스 함수
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 인터랙션 완료 후 실행
export const runAfterInteractions = (callback: () => void): void => {
  InteractionManager.runAfterInteractions(callback);
};

// 메모리 모니터링 (개발 모드)
export const logMemoryUsage = () => {
  if (__DEV__) {
    console.log("메모리 체크:", new Date().toISOString());
  }
};

// FlatList 성능 최적화 설정
export const OPTIMIZED_FLATLIST_PROPS = {
  // 성능 최적화 설정
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  initialNumToRender: 15,
  windowSize: 10,
  showsVerticalScrollIndicator: false,
  keyboardShouldPersistTaps: "handled" as const,
};

// 성능 최적화 팁 (개발자 가이드)
export const PERFORMANCE_TIPS = {
  // React 컴포넌트 최적화
  components: [
    "React.memo 사용으로 불필요한 리렌더링 방지",
    "useCallback으로 함수 메모이제이션",
    "useMemo로 계산 결과 캐싱",
    "컴포넌트 분할로 렌더링 범위 최소화",
  ],

  // FlatList 최적화
  flatList: [
    "removeClippedSubviews로 화면 밖 아이템 제거",
    "getItemLayout으로 스크롤 성능 향상",
    "keyExtractor 최적화",
    "renderItem 함수 메모이제이션",
  ],

  // 메모리 최적화
  memory: [
    "이미지 캐싱 및 압축",
    "불필요한 상태 제거",
    "이벤트 리스너 정리",
    "타이머 정리",
  ],

  // 번들 최적화
  bundle: [
    "불필요한 import 제거",
    "React.lazy로 코드 스플리팅",
    "이미지 최적화",
    "라이브러리 크기 최소화",
  ],
} as const;
