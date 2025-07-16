import { useEffect, useRef } from "react";
import { Platform } from "react-native";

// 키보드 단축키 타입
export interface KeyboardShortcut {
  keys: string[];
  action: () => void;
  description: string;
  enabled?: boolean;
}

// 단축키 콤보 타입
export interface ShortcutCombo {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  key: string;
}

// 키보드 이벤트 타입 (웹 환경용)
interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  preventDefault: () => void;
}

// 네비게이션 액션 타입
export interface NavigationActions {
  goForward?: () => void;
  goBackward?: () => void;
  goHome?: () => void;
  openSearch?: () => void;
  openSettings?: () => void;
  refresh?: () => void;
  save?: () => void;
  cancel?: () => void;
}

/**
 * 키보드 단축키 훅
 * @param actions 네비게이션 액션들
 * @param customShortcuts 커스텀 단축키들
 */
export const useKeyboardShortcuts = (
  actions: NavigationActions = {},
  customShortcuts: KeyboardShortcut[] = []
) => {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);

  // 기본 단축키 정의
  const getDefaultShortcuts = (): KeyboardShortcut[] => {
    const shortcuts: KeyboardShortcut[] = [];

    // 네비게이션 단축키
    if (actions.goForward) {
      shortcuts.push({
        keys: ["ctrl", "alt", "ArrowRight"],
        action: actions.goForward,
        description: "앞으로 이동 (Ctrl+Alt+→)",
        enabled: true,
      });
    }

    if (actions.goBackward) {
      shortcuts.push({
        keys: ["ctrl", "ArrowLeft"],
        action: actions.goBackward,
        description: "뒤로 이동 (Ctrl+←)",
        enabled: true,
      });
    }

    if (actions.goHome) {
      shortcuts.push({
        keys: ["ctrl", "h"],
        action: actions.goHome,
        description: "홈으로 이동 (Ctrl+H)",
        enabled: true,
      });
    }

    if (actions.openSearch) {
      shortcuts.push({
        keys: ["ctrl", "f"],
        action: actions.openSearch,
        description: "검색 열기 (Ctrl+F)",
        enabled: true,
      });
    }

    if (actions.openSettings) {
      shortcuts.push({
        keys: ["ctrl", ","],
        action: actions.openSettings,
        description: "설정 열기 (Ctrl+,)",
        enabled: true,
      });
    }

    if (actions.refresh) {
      shortcuts.push({
        keys: ["F5"],
        action: actions.refresh,
        description: "새로고침 (F5)",
        enabled: true,
      });
      shortcuts.push({
        keys: ["ctrl", "r"],
        action: actions.refresh,
        description: "새로고침 (Ctrl+R)",
        enabled: true,
      });
    }

    if (actions.save) {
      shortcuts.push({
        keys: ["ctrl", "s"],
        action: actions.save,
        description: "저장 (Ctrl+S)",
        enabled: true,
      });
    }

    if (actions.cancel) {
      shortcuts.push({
        keys: ["Escape"],
        action: actions.cancel,
        description: "취소 (ESC)",
        enabled: true,
      });
    }

    return shortcuts;
  };

  // 키 조합이 일치하는지 확인
  const matchesShortcut = (
    event: KeyboardEvent,
    shortcut: KeyboardShortcut
  ): boolean => {
    const { keys } = shortcut;

    // 특수 키 확인
    const requiresCtrl = keys.includes("ctrl");
    const requiresAlt = keys.includes("alt");
    const requiresShift = keys.includes("shift");

    // 특수 키 일치 확인
    if (requiresCtrl && !event.ctrlKey) return false;
    if (requiresAlt && !event.altKey) return false;
    if (requiresShift && !event.shiftKey) return false;

    // 메인 키 확인
    const mainKey = keys.find((key) => !["ctrl", "alt", "shift"].includes(key));
    if (!mainKey) return false;

    // 키 일치 확인 (대소문자 무시)
    return event.key.toLowerCase() === mainKey.toLowerCase();
  };

  // 키보드 이벤트 핸들러
  const handleKeyDown = (event: KeyboardEvent) => {
    // 웹 환경에서만 작동
    if (Platform.OS !== "web") return;

    const allShortcuts = [...shortcutsRef.current, ...customShortcuts];

    for (const shortcut of allShortcuts) {
      if (shortcut.enabled !== false && matchesShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  };

  // 단축키 등록
  useEffect(() => {
    shortcutsRef.current = getDefaultShortcuts();

    if (Platform.OS === "web") {
      // 웹 환경에서 키보드 이벤트 리스너 등록
      const handleKeyDownEvent = (event: any) =>
        handleKeyDown(event as KeyboardEvent);

      document.addEventListener("keydown", handleKeyDownEvent);

      return () => {
        document.removeEventListener("keydown", handleKeyDownEvent);
      };
    }
  }, [actions, customShortcuts]);

  // 단축키 목록 반환
  const getAllShortcuts = (): KeyboardShortcut[] => {
    return [...shortcutsRef.current, ...customShortcuts];
  };

  // 특정 단축키 활성화/비활성화
  const setShortcutEnabled = (keys: string[], enabled: boolean) => {
    const shortcut = shortcutsRef.current.find(
      (s) =>
        s.keys.length === keys.length &&
        s.keys.every((key) => keys.includes(key))
    );

    if (shortcut) {
      shortcut.enabled = enabled;
    }
  };

  // 단축키 도움말 텍스트 생성
  const getShortcutHelpText = (): string => {
    const allShortcuts = getAllShortcuts().filter((s) => s.enabled !== false);

    return allShortcuts.map((shortcut) => shortcut.description).join("\n");
  };

  // 단축키 조합을 텍스트로 변환
  const shortcutToText = (keys: string[]): string => {
    const specialKeys = {
      ctrl: Platform.OS === "ios" ? "⌘" : "Ctrl",
      alt: Platform.OS === "ios" ? "⌥" : "Alt",
      shift: Platform.OS === "ios" ? "⇧" : "Shift",
    };

    return keys
      .map(
        (key) =>
          specialKeys[key as keyof typeof specialKeys] || key.toUpperCase()
      )
      .join("+");
  };

  return {
    getAllShortcuts,
    setShortcutEnabled,
    getShortcutHelpText,
    shortcutToText,
    isWebPlatform: Platform.OS === "web",
  };
};

// 전역 단축키 매니저
export class GlobalShortcutManager {
  private static instance: GlobalShortcutManager;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private isEnabled = true;

  static getInstance(): GlobalShortcutManager {
    if (!GlobalShortcutManager.instance) {
      GlobalShortcutManager.instance = new GlobalShortcutManager();
    }
    return GlobalShortcutManager.instance;
  }

  // 전역 단축키 등록
  registerShortcut(id: string, shortcut: KeyboardShortcut) {
    this.shortcuts.set(id, shortcut);
  }

  // 전역 단축키 제거
  unregisterShortcut(id: string) {
    this.shortcuts.delete(id);
  }

  // 전역 단축키 활성화/비활성화
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // 등록된 모든 단축키 가져오기
  getAllShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  // 단축키 실행
  executeShortcut(keys: string[]): boolean {
    if (!this.isEnabled) return false;

    for (const [id, shortcut] of this.shortcuts) {
      if (shortcut.enabled !== false && this.keysMatch(keys, shortcut.keys)) {
        shortcut.action();
        return true;
      }
    }

    return false;
  }

  private keysMatch(keys1: string[], keys2: string[]): boolean {
    if (keys1.length !== keys2.length) return false;
    return keys1.every((key) => keys2.includes(key));
  }
}

// 싱글톤 인스턴스
export const globalShortcutManager = GlobalShortcutManager.getInstance();

// 단축키 조합 생성 헬퍼
export const createShortcut = (
  combo: ShortcutCombo,
  action: () => void,
  description: string
): KeyboardShortcut => {
  const keys: string[] = [];

  if (combo.ctrl) keys.push("ctrl");
  if (combo.alt) keys.push("alt");
  if (combo.shift) keys.push("shift");
  keys.push(combo.key);

  return {
    keys,
    action,
    description,
    enabled: true,
  };
};

// 일반적인 단축키 프리셋
export const commonShortcuts = {
  save: (action: () => void) =>
    createShortcut({ ctrl: true, key: "s" }, action, "저장 (Ctrl+S)"),

  cancel: (action: () => void) =>
    createShortcut({ key: "Escape" }, action, "취소 (ESC)"),

  search: (action: () => void) =>
    createShortcut({ ctrl: true, key: "f" }, action, "검색 (Ctrl+F)"),

  refresh: (action: () => void) =>
    createShortcut({ key: "F5" }, action, "새로고침 (F5)"),

  goBack: (action: () => void) =>
    createShortcut(
      { ctrl: true, key: "ArrowLeft" },
      action,
      "뒤로 이동 (Ctrl+←)"
    ),

  goForward: (action: () => void) =>
    createShortcut(
      { ctrl: true, alt: true, key: "ArrowRight" },
      action,
      "앞으로 이동 (Ctrl+Alt+→)"
    ),
};
