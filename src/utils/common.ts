// 공통 유틸리티 함수들

// ID 생성 함수
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// UUID 생성 함수
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// 깊은 복사 함수
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

// 객체 병합 함수
export const merge = <T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
};

// 객체인지 확인
export const isObject = (item: any): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

// 배열에서 중복 제거
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// 배열에서 중복 제거 (키 기준)
export const uniqueBy = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// 배열 그룹화
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// 배열 정렬
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// 배열 필터링
export const filterBy = <T>(array: T[], filters: Partial<T>): T[] => {
  return array.filter((item) => {
    return Object.keys(filters).every((key) => {
      const filterValue = filters[key as keyof T];
      const itemValue = item[key as keyof T];

      if (typeof filterValue === "string" && typeof itemValue === "string") {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }

      return itemValue === filterValue;
    });
  });
};

// 배열 검색
export const searchIn = <T>(
  array: T[],
  query: string,
  keys: (keyof T)[]
): T[] => {
  if (!query.trim()) return array;

  const lowercaseQuery = query.toLowerCase();

  return array.filter((item) => {
    return keys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowercaseQuery);
      }
      return false;
    });
  });
};

// 배열 분할
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// 배열 플래튼
export const flatten = <T>(array: T[][]): T[] => {
  return array.reduce((flat, item) => flat.concat(item), []);
};

// 배열에서 랜덤 요소 선택
export const randomItem = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

// 배열에서 여러 랜덤 요소 선택
export const randomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// 배열 셔플
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 스로틀 함수
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 지연 함수
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 재시도 함수
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
};

// 타임아웃 함수
export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), ms)
    ),
  ]);
};

// 조건부 실행
export const when = <T>(condition: boolean, value: T): T | undefined => {
  return condition ? value : undefined;
};

// 안전한 접근
export const safeGet = <T>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
};

// 안전한 설정
export const safeSet = (obj: any, path: string, value: any): void => {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  let current = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
};

// 값이 비어있는지 확인
export const isEmpty = (value: any): boolean => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

// 값이 존재하는지 확인
export const isNotEmpty = (value: any): boolean => {
  return !isEmpty(value);
};

// 타입 가드 함수들
export const isString = (value: any): value is string =>
  typeof value === "string";
export const isNumber = (value: any): value is number =>
  typeof value === "number";
export const isBoolean = (value: any): value is boolean =>
  typeof value === "boolean";
export const isFunction = (value: any): value is Function =>
  typeof value === "function";
export const isArray = (value: any): value is any[] => Array.isArray(value);
export const isDate = (value: any): value is Date => value instanceof Date;
export const isRegExp = (value: any): value is RegExp =>
  value instanceof RegExp;

// 숫자 관련 유틸리티
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const round = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
