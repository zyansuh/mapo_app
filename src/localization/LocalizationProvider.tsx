import React, { useState, useEffect } from "react";
import {
  LocalizationContext,
  localizationManager,
  SupportedLanguage,
} from "./i18n";

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<SupportedLanguage>("ko");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initLocalization = async () => {
      await localizationManager.init();
      setLanguage(localizationManager.getCurrentLanguage());
      setIsInitialized(true);
    };

    initLocalization();

    // 언어 변경 리스너 등록
    const handleLanguageChange = () => {
      setLanguage(localizationManager.getCurrentLanguage());
    };

    localizationManager.addListener(handleLanguageChange);

    return () => {
      localizationManager.removeListener(handleLanguageChange);
    };
  }, []);

  const handleSetLanguage = async (newLanguage: SupportedLanguage) => {
    await localizationManager.setLanguage(newLanguage);
  };

  const t = (key: string): string => {
    return localizationManager.t(key);
  };

  if (!isInitialized) {
    // 로딩 중일 때 아무것도 렌더링하지 않거나 로딩 스피너 표시
    return null;
  }

  const contextValue = {
    language,
    t,
    setLanguage: handleSetLanguage,
    supportedLanguages: localizationManager.getSupportedLanguages(),
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};
