import { useState, useEffect, useCallback, useMemo } from "react";
import { useColorScheme } from "react-native";
import { Theme, ThemeMode } from "../types";
import { storage } from "../services/storage";

// 기본 색상 팔레트
const COLORS = {
  // Primary colors
  primary: "#475569",
  primaryLight: "#64748b",
  primaryDark: "#334155",

  // Secondary colors
  secondary: "#6c757d",
  secondaryLight: "#a6acb3",
  secondaryDark: "#495057",

  // Success colors
  success: "#28a745",
  successLight: "#71db74",
  successDark: "#1e7e34",

  // Warning colors
  warning: "#ffc107",
  warningLight: "#ffda6a",
  warningDark: "#d39e00",

  // Error colors
  error: "#dc3545",
  errorLight: "#f1919a",
  errorDark: "#bd2130",

  // Neutral colors
  white: "#ffffff",
  black: "#000000",
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#6c757d",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
};

// 라이트 테마
const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.white,
    surface: COLORS.white,
    card: COLORS.white,
    text: COLORS.gray900,
    textSecondary: COLORS.gray600,
    border: COLORS.gray300,
    notification: COLORS.primary,
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    white: COLORS.white,
    black: COLORS.black,
    disabled: COLORS.gray400,
    placeholder: COLORS.gray500,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "bold" },
    h2: { fontSize: 28, fontWeight: "bold" },
    h3: { fontSize: 24, fontWeight: "600" },
    body: { fontSize: 16, fontWeight: "normal" },
    caption: { fontSize: 14, fontWeight: "normal" },
  },
};

// 다크 테마
const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: COLORS.primaryLight,
    secondary: COLORS.secondaryLight,
    background: COLORS.gray900,
    surface: COLORS.gray800,
    card: COLORS.gray800,
    text: COLORS.white,
    textSecondary: COLORS.gray400,
    border: COLORS.gray700,
    notification: COLORS.primaryLight,
    success: COLORS.successLight,
    warning: COLORS.warningLight,
    error: COLORS.errorLight,
    white: COLORS.white,
    black: COLORS.black,
    disabled: COLORS.gray600,
    placeholder: COLORS.gray500,
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
};

// 테마 컨텍스트 반환 타입
interface UseThemeReturn {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  resetTheme: () => Promise<void>;
}

export const useTheme = (): UseThemeReturn => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  // 초기 테마 로드
  useEffect(() => {
    loadThemeMode();
  }, []);

  // 실제 테마 계산 (시스템 설정 고려)
  const actualTheme = useMemo(() => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  const isDark = useMemo(() => {
    return actualTheme.mode === "dark";
  }, [actualTheme.mode]);

  // 스토리지에서 테마 모드 로드
  const loadThemeMode = useCallback(async () => {
    try {
      const savedMode = await storage.settings.get();
      if (savedMode?.theme) {
        setThemeModeState(savedMode.theme);
      }
    } catch (error) {
      console.error("테마 모드 로드 실패:", error);
    }
  }, []);

  // 테마 모드 설정
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);

      // 스토리지에 저장
      const currentSettings = (await storage.settings.get()) || {};
      await storage.settings.set({
        ...currentSettings,
        theme: mode,
      });
    } catch (error) {
      console.error("테마 모드 저장 실패:", error);
    }
  }, []);

  // 테마 토글
  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = themeMode === "light" ? "dark" : "light";
    await setThemeMode(newMode);
  }, [themeMode, setThemeMode]);

  // 테마 초기화
  const resetTheme = useCallback(async () => {
    await setThemeMode("system");
  }, [setThemeMode]);

  return {
    theme: actualTheme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
    resetTheme,
  };
};

// 테마 유틸리티 함수들
export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T
) => {
  return (theme: Theme) => styleCreator(theme);
};

export const getSpacing = (theme: Theme, size: keyof Theme["spacing"]) => {
  return theme.spacing[size];
};

export const getColor = (theme: Theme, color: keyof Theme["colors"]) => {
  return theme.colors[color];
};

export const getTypography = (
  theme: Theme,
  variant: keyof Theme["typography"]
) => {
  return theme.typography[variant];
};

// 색상 유틸리티
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const lightenColor = (color: string, amount: number): string => {
  // 간단한 색상 밝게 만들기 (실제로는 더 복잡한 로직 필요)
  return color;
};

export const darkenColor = (color: string, amount: number): string => {
  // 간단한 색상 어둡게 만들기 (실제로는 더 복잡한 로직 필요)
  return color;
};
