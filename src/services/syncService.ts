// 데이터 동기화 서비스

import { SyncStatus, SyncRequest, BulkSyncRequest } from "../types";
import { storageService, STORAGE_KEYS } from "./storage";
import { apiService } from "./api";

export class SyncService {
  private static syncQueue: SyncRequest[] = [];
  private static isSyncing = false;
  private static syncStatus: SyncStatus = {
    isOnline: true,
    lastSyncTime: null,
    syncStatus: "idle",
    pendingChanges: 0,
    failedSyncs: 0,
    queueSize: 0,
  };

  // 동기화 상태 가져오기
  static getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  // 온라인 상태 확인
  static checkOnlineStatus(): boolean {
    return navigator.onLine;
  }

  // 동기화 큐에 추가
  static addToSyncQueue(request: SyncRequest): void {
    this.syncQueue.push(request);
    this.updateSyncStatus();
  }

  // 동기화 큐에서 제거
  static removeFromSyncQueue(id: string): void {
    this.syncQueue = this.syncQueue.filter((item) => item.id !== id);
    this.updateSyncStatus();
  }

  // 동기화 상태 업데이트
  private static updateSyncStatus(): void {
    this.syncStatus = {
      ...this.syncStatus,
      isOnline: this.checkOnlineStatus(),
      pendingChanges: this.syncQueue.length,
      queueSize: this.syncQueue.length,
    };
  }

  // 전체 동기화 실행
  static async syncAll(): Promise<{ success: boolean; message: string }> {
    if (this.isSyncing) {
      return { success: false, message: "이미 동기화 중입니다." };
    }

    this.isSyncing = true;
    this.syncStatus.syncStatus = "syncing";

    try {
      // 큐에 있는 변경사항 동기화
      await this.syncPendingChanges();

      // 서버에서 최신 데이터 가져오기
      await this.syncFromServer();

      this.syncStatus.lastSyncTime = new Date();
      this.syncStatus.syncStatus = "success";
      this.syncStatus.failedSyncs = 0;

      return { success: true, message: "동기화가 완료되었습니다." };
    } catch (error) {
      this.syncStatus.syncStatus = "error";
      this.syncStatus.failedSyncs++;

      return {
        success: false,
        message: `동기화 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
      };
    } finally {
      this.isSyncing = false;
      this.updateSyncStatus();
    }
  }

  // 대기 중인 변경사항 동기화
  private static async syncPendingChanges(): Promise<void> {
    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const request of queue) {
      try {
        await this.syncRequest(request);
      } catch (error) {
        // 실패한 요청은 다시 큐에 추가
        this.syncQueue.push(request);
        throw error;
      }
    }
  }

  // 개별 동기화 요청 처리
  private static async syncRequest(request: SyncRequest): Promise<void> {
    switch (request.type) {
      case "companies":
        await this.syncCompanyRequest(request);
        break;
      case "deliveries":
        await this.syncDeliveryRequest(request);
        break;
      case "invoices":
        await this.syncInvoiceRequest(request);
        break;
      case "products":
        await this.syncProductRequest(request);
        break;
      default:
        throw new Error(`알 수 없는 동기화 타입: ${request.type}`);
    }
  }

  // 회사 동기화 요청 처리
  private static async syncCompanyRequest(request: SyncRequest): Promise<void> {
    switch (request.action) {
      case "create":
        await apiService.createCompany(request.data);
        break;
      case "update":
        await apiService.updateCompany(request.data.id, request.data);
        break;
      case "delete":
        await apiService.deleteCompany(request.data.id);
        break;
    }
  }

  // 배송 동기화 요청 처리
  private static async syncDeliveryRequest(
    request: SyncRequest
  ): Promise<void> {
    switch (request.action) {
      case "create":
        await apiService.createDelivery(request.data);
        break;
      case "update":
        await apiService.updateDelivery(request.data.id, request.data);
        break;
      case "delete":
        await apiService.deleteDelivery(request.data.id);
        break;
    }
  }

  // 계산서 동기화 요청 처리
  private static async syncInvoiceRequest(request: SyncRequest): Promise<void> {
    switch (request.action) {
      case "create":
        await apiService.createInvoice(request.data);
        break;
      case "update":
        await apiService.updateInvoice(request.data.id, request.data);
        break;
      case "delete":
        await apiService.deleteInvoice(request.data.id);
        break;
    }
  }

  // 상품 동기화 요청 처리
  private static async syncProductRequest(request: SyncRequest): Promise<void> {
    switch (request.action) {
      case "create":
        await apiService.createProduct(request.data);
        break;
      case "update":
        await apiService.updateProduct(request.data.id, request.data);
        break;
      case "delete":
        await apiService.deleteProduct(request.data.id);
        break;
    }
  }

  // 서버에서 데이터 동기화
  private static async syncFromServer(): Promise<void> {
    const [companiesRes, deliveriesRes, invoicesRes, productsRes] =
      await Promise.allSettled([
        apiService.getCompanies(),
        apiService.getDeliveries(),
        apiService.getInvoices(),
        apiService.getProducts(),
      ]);

    // 성공한 데이터만 로컬 스토리지에 저장
    if (companiesRes.status === "fulfilled" && companiesRes.value.success) {
      await storageService.setItem(
        STORAGE_KEYS.COMPANIES,
        companiesRes.value.data
      );
    }

    if (deliveriesRes.status === "fulfilled" && deliveriesRes.value.success) {
      await storageService.setItem(
        STORAGE_KEYS.DELIVERIES,
        deliveriesRes.value.data
      );
    }

    if (invoicesRes.status === "fulfilled" && invoicesRes.value.success) {
      await storageService.setItem(
        STORAGE_KEYS.INVOICES,
        invoicesRes.value.data
      );
    }

    if (productsRes.status === "fulfilled" && productsRes.value.success) {
      await storageService.setItem(
        STORAGE_KEYS.PRODUCTS,
        productsRes.value.data
      );
    }
  }

  // 특정 타입만 동기화
  static async syncType(
    type: "companies" | "deliveries" | "invoices" | "products"
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.syncStatus.syncStatus = "syncing";

      // 해당 타입의 대기 중인 변경사항 동기화
      const typeRequests = this.syncQueue.filter((req) => req.type === type);
      this.syncQueue = this.syncQueue.filter((req) => req.type !== type);

      for (const request of typeRequests) {
        await this.syncRequest(request);
      }

      // 서버에서 최신 데이터 가져오기
      let response;
      switch (type) {
        case "companies":
          response = await apiService.getCompanies();
          if (response.success && response.data) {
            await storageService.setItem(STORAGE_KEYS.COMPANIES, response.data);
          }
          break;
        case "deliveries":
          response = await apiService.getDeliveries();
          if (response.success && response.data) {
            await storageService.setItem(
              STORAGE_KEYS.DELIVERIES,
              response.data
            );
          }
          break;
        case "invoices":
          response = await apiService.getInvoices();
          if (response.success && response.data) {
            await storageService.setItem(STORAGE_KEYS.INVOICES, response.data);
          }
          break;
        case "products":
          response = await apiService.getProducts();
          if (response.success && response.data) {
            await storageService.setItem(STORAGE_KEYS.PRODUCTS, response.data);
          }
          break;
      }

      this.syncStatus.lastSyncTime = new Date();
      this.syncStatus.syncStatus = "success";
      this.updateSyncStatus();

      return { success: true, message: `${type} 동기화가 완료되었습니다.` };
    } catch (error) {
      this.syncStatus.syncStatus = "error";
      this.updateSyncStatus();

      return {
        success: false,
        message: `${type} 동기화 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
      };
    }
  }

  // 대량 동기화
  static async bulkSync(
    data: BulkSyncRequest
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.syncStatus.syncStatus = "syncing";

      // 각 타입별로 대량 동기화
      if (data.companies) {
        await storageService.setItem(STORAGE_KEYS.COMPANIES, data.companies);
      }

      if (data.deliveries) {
        await storageService.setItem(STORAGE_KEYS.DELIVERIES, data.deliveries);
      }

      if (data.invoices) {
        await storageService.setItem(STORAGE_KEYS.INVOICES, data.invoices);
      }

      if (data.products) {
        await storageService.setItem(STORAGE_KEYS.PRODUCTS, data.products);
      }

      this.syncStatus.lastSyncTime = new Date();
      this.syncStatus.syncStatus = "success";
      this.updateSyncStatus();

      return { success: true, message: "대량 동기화가 완료되었습니다." };
    } catch (error) {
      this.syncStatus.syncStatus = "error";
      this.updateSyncStatus();

      return {
        success: false,
        message: `대량 동기화 실패: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
      };
    }
  }

  // 동기화 큐 초기화
  static clearSyncQueue(): void {
    this.syncQueue = [];
    this.updateSyncStatus();
  }

  // 동기화 상태 초기화
  static resetSyncStatus(): void {
    this.syncStatus = {
      isOnline: this.checkOnlineStatus(),
      lastSyncTime: null,
      syncStatus: "idle",
      pendingChanges: 0,
      failedSyncs: 0,
      queueSize: 0,
    };
  }

  // 자동 동기화 시작
  static startAutoSync(intervalMs: number = 30000): void {
    setInterval(() => {
      if (this.checkOnlineStatus() && this.syncQueue.length > 0) {
        this.syncAll();
      }
    }, intervalMs);
  }

  // 네트워크 상태 변경 감지
  static setupNetworkListener(): void {
    window.addEventListener("online", () => {
      this.syncStatus.isOnline = true;
      if (this.syncQueue.length > 0) {
        this.syncAll();
      }
    });

    window.addEventListener("offline", () => {
      this.syncStatus.isOnline = false;
      this.syncStatus.syncStatus = "idle";
    });
  }
}
