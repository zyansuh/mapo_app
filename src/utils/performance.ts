// 성능 관련 유틸리티 함수들

// 성능 측정 데코레이터
export const measurePerformance = (name: string) => {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await method.apply(this, args);
      const end = performance.now();

      console.log(`${name} 실행 시간: ${(end - start).toFixed(2)}ms`);
      return result;
    };

    return descriptor;
  };
};

// 함수 실행 시간 측정
export const measureTime = async <T>(
  fn: () => Promise<T>,
  label?: string
): Promise<T> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (label) {
    console.log(`${label} 실행 시간: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

// 동기 함수 실행 시간 측정
export const measureTimeSync = <T>(fn: () => T, label?: string): T => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  if (label) {
    console.log(`${label} 실행 시간: ${(end - start).toFixed(2)}ms`);
  }

  return result;
};

// 메모리 사용량 측정
export const measureMemory = (): number => {
  if ("memory" in performance) {
    return (performance as any).memory.usedJSHeapSize;
  }
  return 0;
};

// 메모리 사용량 로깅
export const logMemoryUsage = (label?: string): void => {
  if ("memory" in performance) {
    const memory = (performance as any).memory;
    const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    const limit = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);

    console.log(
      `${label || "Memory Usage"}: ${used}MB / ${total}MB (limit: ${limit}MB)`
    );
  }
};

// FPS 측정 클래스
export class FPSMeter {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 0;
  private isRunning = false;
  private animationId: number | null = null;
  private callback?: (fps: number) => void;

  constructor(callback?: (fps: number) => void) {
    this.callback = callback;
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.measure();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private measure = (): void => {
    if (!this.isRunning) return;

    this.frameCount++;
    const currentTime = performance.now();

    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastTime)
      );
      this.callback?.(this.fps);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    this.animationId = requestAnimationFrame(this.measure);
  };

  getFPS(): number {
    return this.fps;
  }
}

// 성능 모니터링 클래스
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.setupObservers();
  }

  private setupObservers(): void {
    // Navigation Timing
    if ("PerformanceObserver" in window) {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric("navigation", entry.duration);
        }
      });

      try {
        navObserver.observe({ entryTypes: ["navigation"] });
        this.observers.set("navigation", navObserver);
      } catch (e) {
        console.warn("Navigation timing not supported");
      }

      // Resource Timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric("resource", entry.duration);
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ["resource"] });
        this.observers.set("resource", resourceObserver);
      } catch (e) {
        console.warn("Resource timing not supported");
      }
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // 최대 100개까지만 유지
    if (values.length > 100) {
      values.shift();
    }
  }

  getMetricStats(
    name: string
  ): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg, min, max, count: values.length };
  }

  getAllMetrics(): Record<
    string,
    { avg: number; min: number; max: number; count: number }
  > {
    const result: Record<
      string,
      { avg: number; min: number; max: number; count: number }
    > = {};

    for (const [name] of this.metrics) {
      const stats = this.getMetricStats(name);
      if (stats) {
        result[name] = stats;
      }
    }

    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  destroy(): void {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.metrics.clear();
  }
}

// 지연 로딩 유틸리티
export const lazyLoad = <T>(importFn: () => Promise<T>): (() => Promise<T>) => {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = importFn();
    }
    return promise;
  };
};

// 가상 스크롤링 유틸리티
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  offsetY: number;
}

export const calculateVirtualScroll = (
  scrollTop: number,
  itemCount: number,
  options: VirtualScrollOptions
): VirtualScrollResult => {
  const { itemHeight, containerHeight, overscan = 5 } = options;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(
    itemCount - 1,
    startIndex + visibleCount + overscan * 2
  );

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  };
};

// 이미지 지연 로딩
export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// 리소스 프리로딩
export const preloadResource = (
  url: string,
  type: "image" | "script" | "style" = "image"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let element: HTMLElement;

    switch (type) {
      case "image":
        element = new Image();
        (element as HTMLImageElement).onload = () => resolve();
        (element as HTMLImageElement).onerror = reject;
        (element as HTMLImageElement).src = url;
        break;

      case "script":
        element = document.createElement("script");
        element.onload = () => resolve();
        element.onerror = reject;
        (element as HTMLScriptElement).src = url;
        document.head.appendChild(element);
        break;

      case "style":
        element = document.createElement("link");
        element.onload = () => resolve();
        element.onerror = reject;
        (element as HTMLLinkElement).rel = "stylesheet";
        (element as HTMLLinkElement).href = url;
        document.head.appendChild(element);
        break;
    }
  });
};

// 배치 처리 유틸리티
export const batchProcess = async <T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10,
  delay: number = 0
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);

    if (delay > 0 && i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
};

// 캐시 유틸리티
export class SimpleCache<T> {
  private cache = new Map<
    string,
    { value: T; timestamp: number; ttl: number }
  >();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize: number = 100, defaultTTL: number = 5 * 60 * 1000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set(key: string, value: T, ttl?: number): void {
    // 캐시 크기 제한
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// 성능 최적화된 디바운스
export const optimizedDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): ((...args: Parameters<T>) => void) => {
  const { leading = false, trailing = true, maxWait } = options;

  let timeout: NodeJS.Timeout;
  let maxTimeout: NodeJS.Timeout;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T>;
  let lastThis: any;
  let result: any;

  const invokeFunc = (time: number) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined as any;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const leadingEdge = (time: number) => {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time: number) => {
    timeout = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined as any;
    lastThis = undefined;
    return result;
  };

  const cancel = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastCallTime = 0;
    lastArgs = undefined as any;
    lastThis = undefined;
    timeout = undefined;
  };

  const flush = () => {
    return timeout === undefined ? result : trailingEdge(Date.now());
  };

  const debounced = function (this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === undefined) {
      timeout = setTimeout(timerExpired, wait);
    }
    return result;
  };

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};
