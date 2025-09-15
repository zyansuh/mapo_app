// 스토리지 관련 타입 정의

export interface StorageService {
  getItem: <T = any>(key: string) => Promise<T | null>;
  setItem: <T = any>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  getAllKeys: () => Promise<string[]>;
  multiGet: <T = any>(keys: string[]) => Promise<Array<[string, T | null]>>;
  multiSet: <T = any>(keyValuePairs: Array<[string, T]>) => Promise<void>;
  multiRemove: (keys: string[]) => Promise<void>;
}

export interface StorageConfig {
  prefix?: string;
  encryption?: boolean;
  compression?: boolean;
  maxSize?: number; // bytes
  ttl?: number; // time to live in milliseconds
}

export interface StorageItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  encrypted?: boolean;
  compressed?: boolean;
}

export interface StorageStats {
  totalKeys: number;
  totalSize: number;
  oldestItem?: string;
  newestItem?: string;
  expiredItems: number;
}

export interface CacheConfig {
  maxAge: number; // milliseconds
  maxSize: number; // number of items
  strategy: "lru" | "lfu" | "fifo";
}

export interface CacheItem<T = any> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  maxSize: number;
  oldestItem?: string;
  newestItem?: string;
}

export interface SyncQueueItem {
  id: string;
  type: "create" | "update" | "delete";
  entityType: "company" | "delivery" | "invoice" | "product";
  entityId: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
  priority: "low" | "normal" | "high";
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncStatus: "idle" | "syncing" | "success" | "error";
  pendingChanges: number;
  failedSyncs: number;
  queueSize: number;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: "daily" | "weekly" | "monthly";
  retention: number; // days
  compression: boolean;
  encryption: boolean;
  location: "local" | "cloud";
}

export interface BackupItem {
  id: string;
  timestamp: Date;
  size: number;
  type: "full" | "incremental";
  status: "pending" | "completed" | "failed";
  location: string;
  checksum?: string;
}

export interface DataMigration {
  version: string;
  description: string;
  up: (data: any) => Promise<any>;
  down: (data: any) => Promise<any>;
  dependencies?: string[];
}

export interface StorageError extends Error {
  code:
    | "QUOTA_EXCEEDED"
    | "ENCRYPTION_FAILED"
    | "DECRYPTION_FAILED"
    | "COMPRESSION_FAILED"
    | "DECOMPRESSION_FAILED"
    | "UNKNOWN";
  key?: string;
  originalError?: Error;
}
