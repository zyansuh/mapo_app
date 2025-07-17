import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Company,
  CompanyFormData,
  CompanyStats,
  CompanySearchFilters,
  SearchOptions,
} from "../types";
import { getInitialCompanies } from "../data/companies";
import { generateId } from "../utils";
import { storageService, STORAGE_KEYS } from "../services/storage";

// 회사 훅의 반환 타입
interface UseCompanyReturn {
  // 상태
  companies: Company[];
  loading: boolean;
  error: string | null;

  // 기본 CRUD
  addCompany: (data: CompanyFormData) => Promise<Company | null>;
  updateCompany: (
    id: string,
    data: Partial<CompanyFormData>
  ) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  getCompanyById: (id: string) => Company | undefined;

  // 검색 및 필터링
  searchCompanies: (options: SearchOptions) => Company[];
  filterCompanies: (filters: CompanySearchFilters) => Company[];

  // 즐겨찾기
  toggleFavorite: (id: string) => Promise<boolean>;
  getFavoriteCompanies: () => Company[];

  // 통계 및 분석
  getStats: CompanyStats;
  getCompaniesByType: (type: string) => Company[];
  getCompaniesByRegion: (region: string) => Company[];

  // 유틸리티
  refreshData: () => Promise<void>;
  clearCache: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: Company[]) => Promise<boolean>;
}

export const useCompany = (): UseCompanyReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadCompanies();
  }, []);

  // 데이터 로드
  const loadCompanies = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const storedData = await storageService.getItem<Company[]>(
        STORAGE_KEYS.COMPANIES
      );

      if (storedData && Array.isArray(storedData)) {
        // 날짜 객체 복원
        const restoredData = storedData.map((company) => ({
          ...company,
          createdAt: new Date(company.createdAt),
          updatedAt: new Date(company.updatedAt),
          lastContactDate: company.lastContactDate
            ? new Date(company.lastContactDate)
            : undefined,
          nextContactDate: company.nextContactDate
            ? new Date(company.nextContactDate)
            : undefined,
        }));
        setCompanies(restoredData);
      } else {
        // 초기 데이터 로드
        const initialData = getInitialCompanies();
        setCompanies(initialData);
        // 초기 데이터 저장
        await storageService.setItem(STORAGE_KEYS.COMPANIES, initialData);
      }
    } catch (err) {
      setError("회사 데이터를 불러오는 중 오류가 발생했습니다.");
      console.error("회사 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 스토리지에 저장
  const saveToStorage = useCallback(async (data: Company[]): Promise<void> => {
    try {
      await storageService.setItem(STORAGE_KEYS.COMPANIES, data);
    } catch (error) {
      console.error("회사 데이터 저장 실패:", error);
      throw new Error("데이터 저장에 실패했습니다.");
    }
  }, []);

  // 회사 추가
  const addCompany = useCallback(
    async (data: CompanyFormData): Promise<Company | null> => {
      try {
        const newCompany: Company = {
          id: generateId(),
          ...data,
          status: "활성",
          tags: data.tags || [],
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedCompanies = [...companies, newCompany];
        setCompanies(updatedCompanies);
        await saveToStorage(updatedCompanies);

        return newCompany;
      } catch (error) {
        setError("회사 추가에 실패했습니다.");
        console.error("회사 추가 실패:", error);
        return null;
      }
    },
    [companies, saveToStorage]
  );

  // 회사 수정
  const updateCompany = useCallback(
    async (id: string, data: Partial<CompanyFormData>): Promise<boolean> => {
      try {
        const updatedCompanies = companies.map((company) =>
          company.id === id
            ? { ...company, ...data, updatedAt: new Date() }
            : company
        );

        setCompanies(updatedCompanies);
        await saveToStorage(updatedCompanies);
        return true;
      } catch (error) {
        setError("회사 정보 수정에 실패했습니다.");
        console.error("회사 수정 실패:", error);
        return false;
      }
    },
    [companies, saveToStorage]
  );

  // 회사 삭제
  const deleteCompany = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const updatedCompanies = companies.filter(
          (company) => company.id !== id
        );
        setCompanies(updatedCompanies);
        await saveToStorage(updatedCompanies);
        return true;
      } catch (error) {
        setError("회사 삭제에 실패했습니다.");
        console.error("회사 삭제 실패:", error);
        return false;
      }
    },
    [companies, saveToStorage]
  );

  // ID로 회사 찾기
  const getCompanyById = useCallback(
    (id: string): Company | undefined => {
      return companies.find((company) => company.id === id);
    },
    [companies]
  );

  // 회사 검색
  const searchCompanies = useCallback(
    (options: SearchOptions): Company[] => {
      let result = companies;

      // 텍스트 검색
      if (options.query) {
        const query = options.query.toLowerCase();
        result = result.filter(
          (company) =>
            company.name.toLowerCase().includes(query) ||
            company.address.toLowerCase().includes(query) ||
            company.contactPerson?.toLowerCase().includes(query) ||
            company.phoneNumber.includes(query) ||
            company.businessNumber?.includes(query)
        );
      }

      return result;
    },
    [companies]
  );

  // 회사 필터링
  const filterCompanies = useCallback(
    (filters: CompanySearchFilters): Company[] => {
      return companies.filter((company) => {
        if (filters.type && !filters.type.includes(company.type)) return false;
        if (filters.region && !filters.region.includes(company.region))
          return false;
        if (filters.status && !filters.status.includes(company.status))
          return false;
        if (
          filters.isFavorite !== undefined &&
          company.isFavorite !== filters.isFavorite
        )
          return false;

        return true;
      });
    },
    [companies]
  );

  // 즐겨찾기 토글
  const toggleFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const updatedCompanies = companies.map((company) =>
          company.id === id
            ? {
                ...company,
                isFavorite: !company.isFavorite,
                updatedAt: new Date(),
              }
            : company
        );

        setCompanies(updatedCompanies);
        await saveToStorage(updatedCompanies);
        return true;
      } catch (error) {
        setError("즐겨찾기 설정에 실패했습니다.");
        console.error("즐겨찾기 토글 실패:", error);
        return false;
      }
    },
    [companies, saveToStorage]
  );

  // 즐겨찾기 회사 목록
  const getFavoriteCompanies = useCallback((): Company[] => {
    return companies.filter((company) => company.isFavorite);
  }, [companies]);

  // 통계 계산 (메모이제이션)
  const getStats = useMemo((): CompanyStats => {
    const total = companies.length;
    const byType = companies.reduce((acc, company) => {
      acc[company.type] = (acc[company.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byRegion = companies.reduce((acc, company) => {
      acc[company.region] = (acc[company.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = companies.reduce((acc, company) => {
      acc[company.status] = (acc[company.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favorites = companies.filter((c) => c.isFavorite).length;
    const withBusinessNumber = companies.filter(
      (c) => !!c.businessNumber
    ).length;
    const withEmail = companies.filter((c) => !!c.email).length;

    return {
      total,
      byType: byType as any,
      byRegion: byRegion as any,
      byStatus: byStatus as any,
      favorites,
      withBusinessNumber,
      withEmail,
    };
  }, [companies]);

  // 타입별 회사 조회
  const getCompaniesByType = useCallback(
    (type: string): Company[] => {
      return companies.filter((company) => company.type === type);
    },
    [companies]
  );

  // 지역별 회사 조회
  const getCompaniesByRegion = useCallback(
    (region: string): Company[] => {
      return companies.filter((company) => company.region === region);
    },
    [companies]
  );

  // 데이터 새로고침
  const refreshData = useCallback(async (): Promise<void> => {
    await loadCompanies();
  }, [loadCompanies]);

  // 캐시 클리어
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      await storageService.removeItem(STORAGE_KEYS.COMPANIES);
      await storageService.removeItem(STORAGE_KEYS.CACHE);
      setCompanies([]);
    } catch (error) {
      console.error("캐시 클리어 실패:", error);
    }
  }, []);

  // 데이터 내보내기
  const exportData = useCallback(async (): Promise<string> => {
    try {
      return JSON.stringify(companies, null, 2);
    } catch (error) {
      console.error("데이터 내보내기 실패:", error);
      throw new Error("데이터 내보내기에 실패했습니다.");
    }
  }, [companies]);

  // 데이터 가져오기
  const importData = useCallback(
    async (data: Company[]): Promise<boolean> => {
      try {
        // 데이터 검증
        const validData = data.filter(
          (company) =>
            company.id && company.name && company.type && company.region
        );

        setCompanies(validData);
        await saveToStorage(validData);
        return true;
      } catch (error) {
        setError("데이터 가져오기에 실패했습니다.");
        console.error("데이터 가져오기 실패:", error);
        return false;
      }
    },
    [saveToStorage]
  );

  return {
    // 상태
    companies,
    loading,
    error,

    // 기본 CRUD
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,

    // 검색 및 필터링
    searchCompanies,
    filterCompanies,

    // 즐겨찾기
    toggleFavorite,
    getFavoriteCompanies,

    // 통계 및 분석
    getStats,
    getCompaniesByType,
    getCompaniesByRegion,

    // 유틸리티
    refreshData,
    clearCache,
    exportData,
    importData,
  };
};
