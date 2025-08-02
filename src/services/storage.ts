import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Storage key constants imported from constants/app.ts
import { STORAGE_KEYS } from "../constants/app";
export { STORAGE_KEYS };

export type StorageKey = keyof typeof STORAGE_KEYS;

// Storage interface
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

// Web/Native compatible storage implementation
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

      // Try JSON parsing
      try {
        return JSON.parse(rawValue) as T;
      } catch {
        // Return original string if not JSON
        return rawValue as unknown as T;
      }
    } catch (error) {
      console.error(`스토리지 getItem 오류 (키: ${key}):`, error);
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
      console.error(`스토리지 setItem 오류 (키: ${key}):`, error);
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
      console.error(`스토리지 removeItem 오류 (키: ${key}):`, error);
      throw new Error(`스토리지 삭제 실패: ${key}`);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isWeb) {
        // Only delete app-related keys in web
        const keys = Object.values(STORAGE_KEYS) as string[];
        keys.forEach((key) => localStorage.removeItem(key));
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error("스토리지 전체 삭제 오류:", error);
      throw new Error("스토리지 전체 삭제 실패");
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      if (this.isWeb) {
        return Object.keys(localStorage);
      } else {
        const keys = await AsyncStorage.getAllKeys();
        return [...keys]; // Convert readonly array to mutable array
      }
    } catch (error) {
      console.error("스토리지 getAllKeys 오류:", error);
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
      console.error("스토리지 multiGet 오류:", error);
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
      console.error("스토리지 multiSet 오류:", error);
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
      console.error("스토리지 multiRemove 오류:", error);
      throw new Error("다중 스토리지 삭제 실패");
    }
  }

  // Utility methods
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
      console.error("스토리지 정보 오류:", error);
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
      console.error("스토리지 백업 오류:", error);
      throw new Error("스토리지 백업 실패");
    }
  }

  async restore(backupData: Record<string, any>): Promise<void> {
    try {
      // Remove metadata
      const { _metadata, ...data } = backupData;

      // Backup current data
      const currentBackup = await this.backup();

      try {
        const pairs: Array<[string, any]> = Object.entries(data);
        await this.multiSet(pairs);
      } catch (restoreError) {
        // Rollback to existing data if restore fails
        console.error("복원 실패, 롤백 중:", restoreError);
        const rollbackPairs: Array<[string, any]> =
          Object.entries(currentBackup);
        await this.multiSet(rollbackPairs);
        throw new Error("스토리지 복원 실패");
      }
    } catch (error) {
      console.error("스토리지 복원 오류:", error);
      throw error;
    }
  }
}

// Singleton instance
export const storageService = new StorageService();

// Convenience functions
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
