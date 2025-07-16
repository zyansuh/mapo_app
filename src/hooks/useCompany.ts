import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Company, CompanyFormData } from "../types";

// AsyncStorage 키
const COMPANIES_STORAGE_KEY = "mapo_companies";

// 웹/앱 호환 스토리지 래퍼
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    return await AsyncStorage.setItem(key, value);
  },
};

export const useCompany = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadCompanies();
  }, []);

  // 업체 목록 로드 (AsyncStorage에서)
  const loadCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제 앱에서는 API 호출로 대체
      const storedData = await storage.getItem(COMPANIES_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCompanies(parsedData);
      } else {
        // 초기 샘플 데이터
        const sampleCompanies: Company[] = [
          {
            id: "1",
            name: "(주)삼성전자",
            type: "고객사",
            region: "순창",
            address: "서울시 강남구 테헤란로 123",
            phoneNumber: "02-1234-5678",
            email: "contact@samsung.com",
            businessNumber: "1234567890",
            contactPerson: "김철수",
            memo: "주요 고객사",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "2",
            name: "엘지디스플레이",
            type: "공급업체",
            region: "담양",
            address: "경기도 파주시 산업로 456",
            phoneNumber: "031-987-6543",
            contactPerson: "박영희",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "3",
            name: "현대자동차",
            type: "고객사",
            region: "장성",
            address: "전라남도 장성군 산업로 789",
            phoneNumber: "061-123-4567",
            contactPerson: "이민수",
            memo: "장성 지역 주요 고객",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        setCompanies(sampleCompanies);
        await saveToStorage(sampleCompanies);
      }
    } catch (err) {
      setError("업체 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("Load companies error:", err);
    } finally {
      setLoading(false);
    }
  };

  // AsyncStorage에 저장
  const saveToStorage = async (data: Company[]) => {
    try {
      await storage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error("Save to storage error:", err);
    }
  };

  // 새 업체 등록
  const addCompany = async (formData: CompanyFormData): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const newCompany: Company = {
        id: Date.now().toString(), // 실제 앱에서는 UUID 사용
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedCompanies = [...companies, newCompany];
      setCompanies(updatedCompanies);
      await saveToStorage(updatedCompanies);

      console.log("업체 등록 완료:", newCompany);
    } catch (err) {
      setError("업체 등록 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 업체 정보 수정
  const updateCompany = async (
    id: string,
    formData: CompanyFormData
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCompanies = companies.map((company) =>
        company.id === id
          ? {
              ...company,
              ...formData,
              updatedAt: new Date(),
            }
          : company
      );

      setCompanies(updatedCompanies);
      await saveToStorage(updatedCompanies);

      console.log("업체 수정 완료:", id);
    } catch (err) {
      setError("업체 수정 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 업체 삭제
  const deleteCompany = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const updatedCompanies = companies.filter((company) => company.id !== id);
      setCompanies(updatedCompanies);
      await saveToStorage(updatedCompanies);

      console.log("업체 삭제 완료:", id);
    } catch (err) {
      setError("업체 삭제 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ID로 업체 찾기
  const getCompanyById = (id: string): Company | undefined => {
    return companies.find((company) => company.id === id);
  };

  // 타입별 업체 필터링
  const getCompaniesByType = (type: string): Company[] => {
    return companies.filter((company) => company.type === type);
  };

  // 업체명으로 검색
  const searchCompanies = (query: string): Company[] => {
    const lowerQuery = query.toLowerCase();
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(lowerQuery) ||
        company.address.toLowerCase().includes(lowerQuery) ||
        (company.contactPerson &&
          company.contactPerson.toLowerCase().includes(lowerQuery))
    );
  };

  // 통계 정보
  const getStats = () => {
    const stats = {
      total: companies.length,
      byType: {
        고객사: 0,
        협력업체: 0,
        공급업체: 0,
        하청업체: 0,
        기타: 0,
      },
    };

    companies.forEach((company) => {
      stats.byType[company.type as keyof typeof stats.byType]++;
    });

    return stats;
  };

  // 즐겨찾기 토글
  const toggleFavorite = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

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

      console.log("즐겨찾기 토글 완료:", id);
    } catch (err) {
      setError("즐겨찾기 설정 중 오류가 발생했습니다.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
    getCompaniesByType,
    searchCompanies,
    getStats,
    toggleFavorite,
    refresh: loadCompanies,
  };
};
