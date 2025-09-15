import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { storageService } from "../services/storage";

export interface User {
  _id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: "admin" | "manager" | "user";
  isActive: boolean;
  lastLogin?: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // 로그인
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // 토큰과 사용자 정보를 로컬 스토리지에 저장
        await storageService.setItem("userData", { user, token });

        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true, user };
      } else {
        const errorMessage = response.message || "로그인에 실패했습니다.";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "네트워크 오류가 발생했습니다.";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // 회원가입
  const register = useCallback(
    async (userData: {
      email: string;
      password: string;
      name: string;
      phoneNumber?: string;
    }) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await apiService.register(userData);

        if (response.success && response.data) {
          const { user, token } = response.data;

          // 토큰과 사용자 정보를 로컬 스토리지에 저장
          await storageService.setItem("userData", { user, token });

          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true, user };
        } else {
          const errorMessage = response.message || "회원가입에 실패했습니다.";
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        const errorMessage = "네트워크 오류가 발생했습니다.";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      // 로컬 스토리지에서 사용자 데이터 제거
      await storageService.removeItem("userData");

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  }, []);

  // 프로필 업데이트
  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiService.updateProfile(profileData);

      if (response.success && response.data) {
        const updatedUser = response.data.user;

        // 로컬 스토리지의 사용자 정보 업데이트
        const currentUserData = await storageService.getItem("userData");
        if (currentUserData) {
          await storageService.setItem("userData", {
            ...currentUserData,
            user: updatedUser,
          });
        }

        setAuthState((prev) => ({
          ...prev,
          user: updatedUser,
          isLoading: false,
          error: null,
        }));

        return { success: true, user: updatedUser };
      } else {
        const errorMessage =
          response.message || "프로필 업데이트에 실패했습니다.";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "네트워크 오류가 발생했습니다.";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // 비밀번호 변경
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const response = await apiService.changePassword(
          currentPassword,
          newPassword
        );

        if (response.success) {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: null,
          }));
          return { success: true };
        } else {
          const errorMessage =
            response.message || "비밀번호 변경에 실패했습니다.";
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
          }));
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        const errorMessage = "네트워크 오류가 발생했습니다.";
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // 토큰 검증 및 자동 로그인
  const checkAuth = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const userData = await storageService.getItem("userData");

      if (userData && userData.token && userData.user) {
        // 토큰 유효성 검증
        const response = await apiService.getProfile();

        if (response.success && response.data) {
          setAuthState({
            user: response.data.user,
            token: userData.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          // 토큰이 유효하지 않으면 로그아웃
          await storageService.removeItem("userData");
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("인증 확인 오류:", error);
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // 앱 시작 시 인증 상태 확인
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    clearError,
  };
};
