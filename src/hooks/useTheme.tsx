import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeMode } from "../types";

// 라이트 테마 정의
const lightTheme: Theme = {
  mode: "light",
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: "#F2F2F7",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    textSecondary: "#6D6D70",
    border: "#C6C6C8",
    notification: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    white: "#FFFFFF",
    black: "#000000",
  },
};

// 다크 테마 정의
const darkTheme: Theme = {
  mode: "dark",
  colors: {
    primary: "#0A84FF",
    secondary: "#5E5CE6",
    background: "#000000",
    surface: "#1C1C1E",
    card: "#2C2C2E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    notification: "#FF453A",
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    white: "#FFFFFF",
    black: "#000000",
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@mapo_theme_mode";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // 시스템 색상 스키마 변경 감지
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription?.remove();
  }, []);

  // 저장된 테마 모드 로드
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error("테마 모드 로드 실패:", error);
      }
    };

    loadThemeMode();
  }, []);

  // 테마 모드 변경 및 저장
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("테마 모드 저장 실패:", error);
    }
  };

  // 현재 테마 결정
  const getEffectiveTheme = (): Theme => {
    if (themeMode === "system") {
      return systemColorScheme === "dark" ? darkTheme : lightTheme;
    }
    return themeMode === "dark" ? darkTheme : lightTheme;
  };

  const currentTheme = getEffectiveTheme();
  const isDark =
    currentTheme.mode === "dark" ||
    (themeMode === "system" && systemColorScheme === "dark");
  const isLight = !isDark;

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    themeMode,
    setThemeMode,
    isDark,
    isLight,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
