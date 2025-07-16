// 훅들을 중앙에서 관리하는 index 파일

// 기존 훅들
export { useApi } from "./useApi";
export { useCallAnalytics } from "./useCallAnalytics";
export { useCallDetection } from "./useCallDetection";
export { useCompany } from "./useCompany";
export { usePhoneCall } from "./usePhoneCall";

// 새로운 훅들
export { useTheme, ThemeProvider } from "./useTheme";
export {
  useKeyboardShortcuts,
  globalShortcutManager,
  commonShortcuts,
} from "./useKeyboardShortcuts";
