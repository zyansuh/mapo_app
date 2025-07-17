import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// 스토리지 키 상수들은 constants/app.ts에서 import
import { STORAGE_KEYS } from "../constants/app";
export { STORAGE_KEYS };

export type StorageKey = keyof typeof STORAGE_KEYS;

// 스토리지 인터페이스
export interface IStorageService {
  getItem<T = any>(key: string): Promise<T | null>;
  setItem<T = any>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  getAllKeys(): Promise<string[]>;
  multiGet(keys: string[]): Promise<Array<[string, any]>>;
  multiSet(pairs: Array<[string, any]>): Promise<void>;
  multiRemove(keys: string[]): Promise<void>;
}

// 웹/네이티브 호환 스토리지 구현
class StorageService implements IStorageService {
  private isWeb = Platform.OS === "web";

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      let rawValue: string | null;

      if (this.isWeb) {
        rawValue = localStorage.getItem(key);
      } else {
        rawValue = await AsyncStorage.getItem(key);
      }

      if (rawValue === null) {
        return null;
      }

      // JSON 파싱 시도
      try {
        return JSON.parse(rawValue) as T;
      } catch {
        // JSON이 아닌 경우 원본 문자열 반환
        return rawValue as unknown as T;
      }
    } catch (error) {
      console.error(`Storage getItem error for key ${key}:`, error);
      return null;
    }
  }

  async setItem<T = any>(key: string, value: T): Promise<void> {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);

      if (this.isWeb) {
        localStorage.setItem(key, stringValue);
      } else {
        await AsyncStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error(`Storage setItem error for key ${key}:`, error);
      throw new Error(`스토리지 저장 실패: ${key}`);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Storage removeItem error for key ${key}:`, error);
      throw new Error(`스토리지 삭제 실패: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isWeb) {
        // 웹에서는 앱 관련 키만 삭제
        const keys = Object.values(STORAGE_KEYS) as string[];
        keys.forEach((key) => localStorage.removeItem(key));
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error("Storage clear error:", error);
      throw new Error("스토리지 전체 삭제 실패");
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      if (this.isWeb) {
        return Object.keys(localStorage);
      } else {
        const keys = await AsyncStorage.getAllKeys();
        return [...keys]; // readonly 배열을 mutable 배열로 변환
      }
    } catch (error) {
      console.error("Storage getAllKeys error:", error);
      return [];
    }
  }

  async multiGet(keys: string[]): Promise<Array<[string, any]>> {
    try {
      if (this.isWeb) {
        const results: Array<[string, any]> = [];
        for (const key of keys) {
          const value = await this.getItem(key);
          results.push([key, value]);
        }
        return results;
      } else {
        const rawResults = await AsyncStorage.multiGet(keys);
        return rawResults.map(([key, rawValue]) => {
          if (rawValue === null) {
            return [key, null];
          }
          try {
            return [key, JSON.parse(rawValue)];
          } catch {
            return [key, rawValue];
          }
        });
      }
    } catch (error) {
      console.error("Storage multiGet error:", error);
      return [];
    }
  }

  async multiSet(pairs: Array<[string, any]>): Promise<void> {
    try {
      if (this.isWeb) {
        for (const [key, value] of pairs) {
          await this.setItem(key, value);
        }
      } else {
        const stringPairs: Array<[string, string]> = pairs.map(
          ([key, value]) => [
            key,
            typeof value === "string" ? value : JSON.stringify(value),
          ]
        );
        await AsyncStorage.multiSet(stringPairs);
      }
    } catch (error) {
      console.error("Storage multiSet error:", error);
      throw new Error("다중 스토리지 저장 실패");
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      if (this.isWeb) {
        keys.forEach((key) => localStorage.removeItem(key));
      } else {
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      console.error("Storage multiRemove error:", error);
      throw new Error("다중 스토리지 삭제 실패");
    }
  }

  // 유틸리티 메서드들
  async getStorageInfo(): Promise<{
    usedSize: number;
    totalKeys: number;
    appKeys: number;
  }> {
    try {
      const allKeys = await this.getAllKeys();
      const appKeys = allKeys.filter((key) =>
        Object.values(STORAGE_KEYS).includes(key as any)
      );

      let usedSize = 0;
      for (const key of appKeys) {
        const value = await this.getItem(key);
        if (value !== null) {
          usedSize += JSON.stringify(value).length;
        }
      }

      return {
        usedSize,
        totalKeys: allKeys.length,
        appKeys: appKeys.length,
      };
    } catch (error) {
      console.error("Storage info error:", error);
      return { usedSize: 0, totalKeys: 0, appKeys: 0 };
    }
  }

  async backup(): Promise<Record<string, any>> {
    try {
      const appKeys = Object.values(STORAGE_KEYS) as string[];
      const backupData: Record<string, any> = {};

      for (const key of appKeys) {
        const value = await this.getItem(key);
        if (value !== null) {
          backupData[key] = value;
        }
      }

      return {
        ...backupData,
        _metadata: {
          version: "2.0.0",
          timestamp: new Date().toISOString(),
          platform: Platform.OS,
        },
      };
    } catch (error) {
      console.error("Storage backup error:", error);
      throw new Error("스토리지 백업 실패");
    }
  }

  async restore(backupData: Record<string, any>): Promise<void> {
    try {
      // 메타데이터 제거
      const { _metadata, ...data } = backupData;

      // 기존 데이터 백업
      const currentBackup = await this.backup();

      try {
        const pairs: Array<[string, any]> = Object.entries(data);
        await this.multiSet(pairs);
      } catch (restoreError) {
        // 복원 실패 시 기존 데이터로 롤백
        console.error("Restore failed, rolling back:", restoreError);
        const rollbackPairs: Array<[string, any]> =
          Object.entries(currentBackup);
        await this.multiSet(rollbackPairs);
        throw new Error("스토리지 복원 실패");
      }
    } catch (error) {
      console.error("Storage restore error:", error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스
export const storageService = new StorageService();

// 편의 함수들
export const storage = {
  companies: {
    get: () => storageService.getItem(STORAGE_KEYS.COMPANIES),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.COMPANIES, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.COMPANIES),
  },
  products: {
    get: () => storageService.getItem(STORAGE_KEYS.PRODUCTS),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.PRODUCTS, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.PRODUCTS),
  },
  invoices: {
    get: () => storageService.getItem(STORAGE_KEYS.INVOICES),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.INVOICES, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.INVOICES),
  },
  deliveries: {
    get: () => storageService.getItem(STORAGE_KEYS.DELIVERIES),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.DELIVERIES, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.DELIVERIES),
  },
  callHistory: {
    get: () => storageService.getItem(STORAGE_KEYS.CALL_HISTORY),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.CALL_HISTORY, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.CALL_HISTORY),
  },
  settings: {
    get: () => storageService.getItem(STORAGE_KEYS.SETTINGS),
    set: (data: any) => storageService.setItem(STORAGE_KEYS.SETTINGS, data),
    remove: () => storageService.removeItem(STORAGE_KEYS.SETTINGS),
  },
};
