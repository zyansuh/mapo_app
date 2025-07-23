import { InteractionManager } from "react-native";

// 디바운스 함수
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// 스로틀 함수
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// 인터랙션 완료 후 실행
export function runAfterInteractions(callback: () => void): void {
  InteractionManager.runAfterInteractions(callback);
}

// 청크 단위로 작업 실행 (메인 스레드 블로킹 방지)
export async function processInChunks<T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 10
): Promise<void> {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    // 각 청크 처리
    chunk.forEach(processor);

    // 다음 청크 처리 전 메인 스레드에 제어권 반환
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

// 메모리 사용량 최적화를 위한 객체 풀
export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(
    createFn: () => T,
    resetFn: (obj: T) => void,
    initialSize: number = 5
  ) {
    this.createFn = createFn;
    this.resetFn = resetFn;

    // 초기 객체들 생성
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  acquire(): T {
    const obj = this.pool.pop();
    return obj || this.createFn();
  }

  release(obj: T): void {
    this.resetFn(obj);
    this.pool.push(obj);
  }

  clear(): void {
    this.pool.length = 0;
  }
}

// 이미지 캐시 최적화
export class ImageCacheManager {
  private static cache = new Map<string, string>();
  private static maxSize = 50; // 최대 캐시 크기

  static set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      // LRU 방식으로 가장 오래된 항목 제거
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  static get(key: string): string | undefined {
    const value = this.cache.get(key);
    if (value) {
      // 접근한 항목을 맨 뒤로 이동 (LRU)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  static clear(): void {
    this.cache.clear();
  }

  static size(): number {
    return this.cache.size;
  }
}

// 비동기 작업 배치 처리
export class BatchProcessor {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private batchSize: number;
  private delay: number;

  constructor(batchSize: number = 5, delay: number = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
  }

  add(task: () => Promise<void>): void {
    this.queue.push(task);
    this.process();
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);

      try {
        await Promise.all(batch.map((task) => task()));
      } catch (error) {
        console.error("Batch processing error:", error);
      }

      // 다음 배치 처리 전 지연
      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.delay));
      }
    }

    this.processing = false;
  }
}

// 메모리 사용량 모니터링 (개발 모드)
export const MemoryMonitor = {
  log: () => {
    if (__DEV__) {
      // React Native에서는 performance.memory가 제한적
      console.log("메모리 사용량 체크 - 현재 시간:", new Date().toISOString());
    }
  },

  // 메모리 누수 감지를 위한 객체 추적
  track: <T extends object>(obj: T, name: string): T => {
    if (__DEV__) {
      console.log(`메모리 추적 시작: ${name}`);
    }
    return obj;
  },
};
