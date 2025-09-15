import { renderHook, act } from "@testing-library/react-native";
import { useCompany } from "../useCompany.v2";
import { apiService } from "../../services/api";
import { storageService } from "../../services/storage";
import { useAuth } from "../useAuth";

// Mock dependencies
jest.mock("../../services/api");
jest.mock("../../services/storage");
jest.mock("../useAuth");

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockStorageService = storageService as jest.Mocked<typeof storageService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("useCompany", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { _id: "1", email: "test@example.com", name: "Test User" },
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
    });
  });

  it("should initialize with empty companies array", () => {
    const { result } = renderHook(() => useCompany());

    expect(result.current.companies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should load companies from backend when authenticated", async () => {
    const mockCompanies = [
      {
        _id: "1",
        name: "Test Company 1",
        type: "공급업체",
        region: "서울",
        address: "서울시 마포구",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "2",
        name: "Test Company 2",
        type: "고객",
        region: "부산",
        address: "부산시 해운대구",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockApiService.getCompanies.mockResolvedValue({
      success: true,
      data: mockCompanies,
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCompany());

    await act(async () => {
      // Wait for the effect to run
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.companies).toEqual(mockCompanies);
    expect(mockApiService.getCompanies).toHaveBeenCalled();
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      "companies",
      mockCompanies
    );
  });

  it("should load companies from local storage when not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
    });

    const mockLocalCompanies = [
      {
        _id: "local_1",
        name: "Local Company",
        type: "공급업체",
        region: "서울",
        address: "서울시 마포구",
        userId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockStorageService.getItem.mockResolvedValue(mockLocalCompanies);

    const { result } = renderHook(() => useCompany());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.companies).toEqual(mockLocalCompanies);
    expect(mockStorageService.getItem).toHaveBeenCalledWith("companies");
  });

  it("should add company successfully when authenticated", async () => {
    const newCompanyData = {
      name: "New Company",
      type: "공급업체" as const,
      region: "서울",
      address: "서울시 마포구",
      phoneNumber: "02-1234-5678",
    };

    const mockCreatedCompany = {
      _id: "3",
      ...newCompanyData,
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockApiService.createCompany.mockResolvedValue({
      success: true,
      data: mockCreatedCompany,
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCompany());

    let addedCompany;
    await act(async () => {
      addedCompany = await result.current.addCompany(newCompanyData);
    });

    expect(addedCompany).toEqual(mockCreatedCompany);
    expect(result.current.companies).toContain(mockCreatedCompany);
    expect(mockApiService.createCompany).toHaveBeenCalledWith(newCompanyData);
  });

  it("should add company to local storage when not authenticated", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      changePassword: jest.fn(),
    });

    const newCompanyData = {
      name: "Local Company",
      type: "공급업체" as const,
      region: "서울",
      address: "서울시 마포구",
    };

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCompany());

    let addedCompany;
    await act(async () => {
      addedCompany = await result.current.addCompany(newCompanyData);
    });

    expect(addedCompany).toBeDefined();
    expect(addedCompany?.name).toBe(newCompanyData.name);
    expect(addedCompany?.id).toMatch(/^local_/);
    expect(result.current.companies).toContain(addedCompany);
  });

  it("should update company successfully", async () => {
    const existingCompany = {
      _id: "1",
      name: "Original Company",
      type: "공급업체" as const,
      region: "서울",
      address: "서울시 마포구",
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCompany = {
      ...existingCompany,
      name: "Updated Company",
    };

    mockApiService.updateCompany.mockResolvedValue({
      success: true,
      data: updatedCompany,
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCompany());

    // Set initial companies
    act(() => {
      result.current.companies = [existingCompany];
    });

    let updateResult;
    await act(async () => {
      updateResult = await result.current.updateCompany("1", {
        name: "Updated Company",
      });
    });

    expect(updateResult).toBe(true);
    expect(mockApiService.updateCompany).toHaveBeenCalledWith("1", {
      name: "Updated Company",
    });
  });

  it("should delete company successfully", async () => {
    const companyToDelete = {
      _id: "1",
      name: "Company to Delete",
      type: "공급업체" as const,
      region: "서울",
      address: "서울시 마포구",
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockApiService.deleteCompany.mockResolvedValue({
      success: true,
      message: "Company deleted successfully",
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useCompany());

    // Set initial companies
    act(() => {
      result.current.companies = [companyToDelete];
    });

    let deleteResult;
    await act(async () => {
      deleteResult = await result.current.deleteCompany("1");
    });

    expect(deleteResult).toBe(true);
    expect(result.current.companies).not.toContain(companyToDelete);
    expect(mockApiService.deleteCompany).toHaveBeenCalledWith("1");
  });

  it("should calculate stats correctly", () => {
    const companies = [
      {
        _id: "1",
        name: "Company 1",
        type: "공급업체",
        region: "서울",
        status: "활성",
        isFavorite: true,
      },
      {
        _id: "2",
        name: "Company 2",
        type: "고객",
        region: "부산",
        status: "활성",
        isFavorite: false,
      },
      {
        _id: "3",
        name: "Company 3",
        type: "공급업체",
        region: "서울",
        status: "비활성",
        isFavorite: true,
      },
    ];

    const { result } = renderHook(() => useCompany());

    act(() => {
      result.current.companies = companies;
    });

    const stats = result.current.getStats;

    expect(stats.total).toBe(3);
    expect(stats.byType.공급업체).toBe(2);
    expect(stats.byType.고객).toBe(1);
    expect(stats.byRegion.서울).toBe(2);
    expect(stats.byRegion.부산).toBe(1);
    expect(stats.favorites).toBe(2);
  });
});
