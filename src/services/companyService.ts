// 회사 관련 비즈니스 로직 서비스

import {
  Company,
  CompanyFormData,
  CompanySearchFilters,
  SearchOptions,
} from "../types";
import { apiService } from "./api";
import { storageService, STORAGE_KEYS } from "./storage";

export class CompanyService {
  // 회사 목록 조회
  static async getCompanies(options?: SearchOptions & CompanySearchFilters) {
    try {
      const response = await apiService.getCompanies(options);
      if (response.success && response.data) {
        // 로컬 스토리지에 백업
        await storageService.setItem(STORAGE_KEYS.COMPANIES, response.data);
        return response;
      }
      throw new Error(
        response.message || "회사 목록을 불러오는데 실패했습니다."
      );
    } catch (error) {
      // 네트워크 오류 시 로컬 스토리지에서 로드
      const localData = await storageService.getItem<Company[]>(
        STORAGE_KEYS.COMPANIES
      );
      if (localData) {
        return {
          success: true,
          data: localData,
          message: "오프라인 데이터를 불러왔습니다.",
        };
      }
      throw error;
    }
  }

  // 회사 상세 조회
  static async getCompanyById(id: string) {
    try {
      const response = await apiService.getCompanyById(id);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(
        response.message || "회사 정보를 불러오는데 실패했습니다."
      );
    } catch (error) {
      // 로컬 스토리지에서 찾기
      const companies = await storageService.getItem<Company[]>(
        STORAGE_KEYS.COMPANIES
      );
      const company = companies?.find((c) => c.id === id);
      if (company) {
        return {
          success: true,
          data: company,
          message: "오프라인 데이터를 불러왔습니다.",
        };
      }
      throw error;
    }
  }

  // 회사 생성
  static async createCompany(data: CompanyFormData) {
    try {
      const response = await apiService.createCompany(data);
      if (response.success && response.data) {
        // 로컬 스토리지에 추가
        const companies =
          (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) ||
          [];
        companies.unshift(response.data);
        await storageService.setItem(STORAGE_KEYS.COMPANIES, companies);
        return response;
      }
      throw new Error(response.message || "회사 등록에 실패했습니다.");
    } catch (error) {
      // 오프라인 모드에서 로컬에만 저장
      const newCompany: Company = {
        id: `local_${Date.now()}`,
        ...data,
        status: "활성",
        tags: data.tags || [],
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];
      companies.unshift(newCompany);
      await storageService.setItem(STORAGE_KEYS.COMPANIES, companies);

      return {
        success: true,
        data: newCompany,
        message: "오프라인 모드에서 저장되었습니다.",
      };
    }
  }

  // 회사 수정
  static async updateCompany(id: string, data: Partial<CompanyFormData>) {
    try {
      const response = await apiService.updateCompany(id, data);
      if (response.success && response.data) {
        // 로컬 스토리지 업데이트
        const companies =
          (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) ||
          [];
        const updatedCompanies = companies.map((company) =>
          company.id === id ? response.data : company
        );
        await storageService.setItem(STORAGE_KEYS.COMPANIES, updatedCompanies);
        return response;
      }
      throw new Error(response.message || "회사 정보 수정에 실패했습니다.");
    } catch (error) {
      // 오프라인 모드에서 로컬 업데이트
      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];
      const companyIndex = companies.findIndex((c) => c.id === id);

      if (companyIndex !== -1) {
        companies[companyIndex] = {
          ...companies[companyIndex],
          ...data,
          updatedAt: new Date(),
        };
        await storageService.setItem(STORAGE_KEYS.COMPANIES, companies);

        return {
          success: true,
          data: companies[companyIndex],
          message: "오프라인 모드에서 수정되었습니다.",
        };
      }

      throw new Error("회사를 찾을 수 없습니다.");
    }
  }

  // 회사 삭제
  static async deleteCompany(id: string) {
    try {
      const response = await apiService.deleteCompany(id);
      if (response.success) {
        // 로컬 스토리지에서 제거
        const companies =
          (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) ||
          [];
        const filteredCompanies = companies.filter((c) => c.id !== id);
        await storageService.setItem(STORAGE_KEYS.COMPANIES, filteredCompanies);
        return response;
      }
      throw new Error(response.message || "회사 삭제에 실패했습니다.");
    } catch (error) {
      // 오프라인 모드에서 로컬 삭제
      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];
      const filteredCompanies = companies.filter((c) => c.id !== id);
      await storageService.setItem(STORAGE_KEYS.COMPANIES, filteredCompanies);

      return {
        success: true,
        message: "오프라인 모드에서 삭제되었습니다.",
      };
    }
  }

  // 회사 검색
  static async searchCompanies(query: string, filters?: CompanySearchFilters) {
    try {
      const response = await apiService.searchCompanies(query, filters);
      if (response.success && response.data) {
        return response;
      }
      throw new Error(response.message || "회사 검색에 실패했습니다.");
    } catch (error) {
      // 로컬 검색
      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];
      let filteredCompanies = companies;

      // 텍스트 검색
      if (query) {
        const lowercaseQuery = query.toLowerCase();
        filteredCompanies = filteredCompanies.filter(
          (company) =>
            company.name.toLowerCase().includes(lowercaseQuery) ||
            company.address.toLowerCase().includes(lowercaseQuery) ||
            company.contactPerson?.toLowerCase().includes(lowercaseQuery) ||
            company.phoneNumber.includes(query) ||
            company.businessNumber?.includes(query)
        );
      }

      // 필터 적용
      if (filters) {
        filteredCompanies = filteredCompanies.filter((company) => {
          if (filters.type && !filters.type.includes(company.type))
            return false;
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
      }

      return {
        success: true,
        data: filteredCompanies,
        message: "오프라인 검색 결과입니다.",
      };
    }
  }

  // 회사 통계
  static async getCompanyStats() {
    try {
      const response = await apiService.getCompanyStats();
      if (response.success && response.data) {
        return response;
      }
      throw new Error(
        response.message || "회사 통계를 불러오는데 실패했습니다."
      );
    } catch (error) {
      // 로컬 통계 계산
      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];

      const stats = {
        total: companies.length,
        byType: companies.reduce((acc, company) => {
          acc[company.type] = (acc[company.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byRegion: companies.reduce((acc, company) => {
          acc[company.region] = (acc[company.region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: companies.reduce((acc, company) => {
          acc[company.status] = (acc[company.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        favorites: companies.filter((c) => c.isFavorite).length,
        withBusinessNumber: companies.filter((c) => !!c.businessNumber).length,
        withEmail: companies.filter((c) => !!c.email).length,
      };

      return {
        success: true,
        data: stats,
        message: "오프라인 통계입니다.",
      };
    }
  }

  // 즐겨찾기 토글
  static async toggleFavorite(id: string) {
    try {
      const company = await this.getCompanyById(id);
      if (company.success && company.data) {
        return await this.updateCompany(id, {
          isFavorite: !company.data.isFavorite,
        });
      }
      throw new Error("회사를 찾을 수 없습니다.");
    } catch (error) {
      throw error;
    }
  }

  // 회사 데이터 내보내기
  static async exportCompanies() {
    try {
      const companies =
        (await storageService.getItem<Company[]>(STORAGE_KEYS.COMPANIES)) || [];
      return {
        success: true,
        data: JSON.stringify(companies, null, 2),
        message: "회사 데이터를 내보냈습니다.",
      };
    } catch (error) {
      throw new Error("데이터 내보내기에 실패했습니다.");
    }
  }

  // 회사 데이터 가져오기
  static async importCompanies(data: string) {
    try {
      const companies = JSON.parse(data) as Company[];

      // 데이터 검증
      const validCompanies = companies.filter(
        (company) =>
          company.id && company.name && company.type && company.region
      );

      await storageService.setItem(STORAGE_KEYS.COMPANIES, validCompanies);

      return {
        success: true,
        data: validCompanies,
        message: `${validCompanies.length}개의 회사 데이터를 가져왔습니다.`,
      };
    } catch (error) {
      throw new Error("데이터 가져오기에 실패했습니다.");
    }
  }

  // 회사 데이터 동기화
  static async syncCompanies() {
    try {
      // 서버에서 최신 데이터 가져오기
      const response = await apiService.getCompanies();
      if (response.success && response.data) {
        await storageService.setItem(STORAGE_KEYS.COMPANIES, response.data);
        return {
          success: true,
          data: response.data,
          message: "회사 데이터가 동기화되었습니다.",
        };
      }
      throw new Error(response.message || "동기화에 실패했습니다.");
    } catch (error) {
      throw error;
    }
  }
}
