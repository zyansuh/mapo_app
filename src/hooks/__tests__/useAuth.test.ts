import { renderHook, act } from "@testing-library/react-native";
import { useAuth } from "../useAuth";
import { apiService } from "../../services/api";
import { storageService } from "../../services/storage";

// Mock dependencies
jest.mock("../../services/api");
jest.mock("../../services/storage");

const mockApiService = apiService as jest.Mocked<typeof apiService>;
const mockStorageService = storageService as jest.Mocked<typeof storageService>;

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("should login successfully", async () => {
    const mockUser = {
      _id: "1",
      email: "test@example.com",
      name: "Test User",
    };

    const mockToken = "mock-jwt-token";

    mockApiService.login.mockResolvedValue({
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      "auth_token",
      mockToken
    );
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      "user_data",
      mockUser
    );
  });

  it("should handle login failure", async () => {
    const errorMessage = "Invalid credentials";
    mockApiService.login.mockResolvedValue({
      success: false,
      message: errorMessage,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "wrongpassword");
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });

  it("should register successfully", async () => {
    const mockUser = {
      _id: "1",
      email: "newuser@example.com",
      name: "New User",
    };

    const mockToken = "mock-jwt-token";

    mockApiService.register.mockResolvedValue({
      success: true,
      data: {
        user: mockUser,
        token: mockToken,
      },
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({
        email: "newuser@example.com",
        password: "password123",
        name: "New User",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("should logout successfully", async () => {
    // First login
    const mockUser = { _id: "1", email: "test@example.com", name: "Test User" };
    const mockToken = "mock-jwt-token";

    mockApiService.login.mockResolvedValue({
      success: true,
      data: { user: mockUser, token: mockToken },
    });

    mockStorageService.setItem.mockResolvedValue(undefined);
    mockStorageService.removeItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(mockStorageService.removeItem).toHaveBeenCalledWith("auth_token");
    expect(mockStorageService.removeItem).toHaveBeenCalledWith("user_data");
  });

  it("should update profile successfully", async () => {
    const mockUser = { _id: "1", email: "test@example.com", name: "Test User" };
    const updatedUser = { ...mockUser, name: "Updated Name" };

    mockApiService.updateProfile.mockResolvedValue({
      success: true,
      data: updatedUser,
    });

    mockStorageService.setItem.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.updateProfile({ name: "Updated Name" });
    });

    expect(result.current.user).toEqual(updatedUser);
    expect(mockStorageService.setItem).toHaveBeenCalledWith(
      "user_data",
      updatedUser
    );
  });

  it("should change password successfully", async () => {
    mockApiService.changePassword.mockResolvedValue({
      success: true,
      message: "Password changed successfully",
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.changePassword("oldpass", "newpass");
    });

    expect(result.current.error).toBeNull();
  });
});
