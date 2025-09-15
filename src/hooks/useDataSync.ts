import { useState, useCallback, useEffect } from "react";
import { apiService } from "../services/api";
import { storageService, STORAGE_KEYS } from "../services/storage";
import { useAuth } from "./useAuth";

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime: Date | null;
  isSyncing: boolean;
  syncError: string | null;
}

export const useDataSync = () => {
  const { isAuthenticated, user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: true,
    lastSyncTime: null,
    isSyncing: false,
    syncError: null,
  });

  // 온라인 상태 확인
  const checkOnlineStatus = useCallback(() => {
    setSyncStatus((prev) => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // 온라인 상태 모니터링
  useEffect(() => {
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
  }, [checkOnlineStatus]);

  // 로컬 데이터를 서버로 동기화
  const syncToServer = useCallback(async () => {
    if (!isAuthenticated || !user || !syncStatus.isOnline) {
      return { success: false, error: "동기화할 수 없는 상태입니다." };
    }

    try {
      setSyncStatus((prev) => ({ ...prev, isSyncing: true, syncError: null }));

      // 회사 데이터 동기화
      const localCompanies = await storageService.getItem(
        STORAGE_KEYS.COMPANIES
      );
      if (localCompanies && Array.isArray(localCompanies)) {
        for (const company of localCompanies) {
          try {
            if (company._id) {
              // 기존 데이터 업데이트
              await apiService.updateCompany(company._id, company);
            } else {
              // 새 데이터 생성
              await apiService.createCompany(company);
            }
          } catch (error) {
            console.error("회사 데이터 동기화 오류:", error);
          }
        }
      }

      // 배송 데이터 동기화
      const localDeliveries = await storageService.getItem(
        STORAGE_KEYS.DELIVERIES
      );
      if (localDeliveries && Array.isArray(localDeliveries)) {
        for (const delivery of localDeliveries) {
          try {
            if (delivery._id) {
              await apiService.updateDelivery(delivery._id, delivery);
            } else {
              await apiService.createDelivery(delivery);
            }
          } catch (error) {
            console.error("배송 데이터 동기화 오류:", error);
          }
        }
      }

      // 계산서 데이터 동기화
      const localInvoices = await storageService.getItem(STORAGE_KEYS.INVOICES);
      if (localInvoices && Array.isArray(localInvoices)) {
        for (const invoice of localInvoices) {
          try {
            if (invoice._id) {
              await apiService.updateInvoice(invoice._id, invoice);
            } else {
              await apiService.createInvoice(invoice);
            }
          } catch (error) {
            console.error("계산서 데이터 동기화 오류:", error);
          }
        }
      }

      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncError: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = "데이터 동기화 중 오류가 발생했습니다.";
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated, user, syncStatus.isOnline]);

  // 서버 데이터를 로컬로 동기화
  const syncFromServer = useCallback(async () => {
    if (!isAuthenticated || !user || !syncStatus.isOnline) {
      return { success: false, error: "동기화할 수 없는 상태입니다." };
    }

    try {
      setSyncStatus((prev) => ({ ...prev, isSyncing: true, syncError: null }));

      // 서버에서 데이터 가져오기
      const [companiesResponse, deliveriesResponse, invoicesResponse] =
        await Promise.all([
          apiService.getCompanies({ limit: 1000 }),
          apiService.getDeliveries({ limit: 1000 }),
          apiService.getInvoices({ limit: 1000 }),
        ]);

      // 로컬 스토리지에 저장
      if (companiesResponse.success && companiesResponse.data) {
        await storageService.setItem(
          STORAGE_KEYS.COMPANIES,
          companiesResponse.data.companies
        );
      }

      if (deliveriesResponse.success && deliveriesResponse.data) {
        await storageService.setItem(
          STORAGE_KEYS.DELIVERIES,
          deliveriesResponse.data.deliveries
        );
      }

      if (invoicesResponse.success && invoicesResponse.data) {
        await storageService.setItem(
          STORAGE_KEYS.INVOICES,
          invoicesResponse.data.invoices
        );
      }

      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncError: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = "서버에서 데이터를 가져오는 중 오류가 발생했습니다.";
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [isAuthenticated, user, syncStatus.isOnline]);

  // 양방향 동기화
  const fullSync = useCallback(async () => {
    if (!isAuthenticated || !user || !syncStatus.isOnline) {
      return { success: false, error: "동기화할 수 없는 상태입니다." };
    }

    try {
      setSyncStatus((prev) => ({ ...prev, isSyncing: true, syncError: null }));

      // 1. 로컬 데이터를 서버로 업로드
      await syncToServer();

      // 2. 서버 데이터를 로컬로 다운로드
      await syncFromServer();

      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncError: null,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = "전체 동기화 중 오류가 발생했습니다.";
      setSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [
    isAuthenticated,
    user,
    syncStatus.isOnline,
    syncToServer,
    syncFromServer,
  ]);

  // 자동 동기화 (앱 시작 시)
  useEffect(() => {
    if (isAuthenticated && user && syncStatus.isOnline) {
      // 앱 시작 시 서버에서 최신 데이터 가져오기
      syncFromServer();
    }
  }, [isAuthenticated, user, syncStatus.isOnline, syncFromServer]);

  // 주기적 동기화 (5분마다)
  useEffect(() => {
    if (!isAuthenticated || !user || !syncStatus.isOnline) {
      return;
    }

    const interval = setInterval(() => {
      syncToServer();
    }, 5 * 60 * 1000); // 5분

    return () => clearInterval(interval);
  }, [isAuthenticated, user, syncStatus.isOnline, syncToServer]);

  // 동기화 에러 초기화
  const clearSyncError = useCallback(() => {
    setSyncStatus((prev) => ({ ...prev, syncError: null }));
  }, []);

  return {
    ...syncStatus,
    syncToServer,
    syncFromServer,
    fullSync,
    clearSyncError,
  };
};
