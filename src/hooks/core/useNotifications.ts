// 알림 관리를 위한 핵심 훅

import { useState, useCallback, useRef, useEffect } from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: "primary" | "secondary" | "danger";
}

interface UseNotificationsOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  success: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  error: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  warning: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
  info: (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => string;
}

export const useNotifications = (
  options: UseNotificationsOptions = {}
): UseNotificationsReturn => {
  const {
    maxNotifications = 5,
    defaultDuration = 5000,
    position = "top-right",
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }, []);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">): string => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        timestamp: new Date(),
        duration: notification.duration ?? defaultDuration,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        // 최대 개수 제한
        if (updated.length > maxNotifications) {
          return updated.slice(0, maxNotifications);
        }
        return updated;
      });

      // 자동 제거 설정
      if (
        !newNotification.persistent &&
        newNotification.duration &&
        newNotification.duration > 0
      ) {
        const timeout = setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);

        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [defaultDuration, maxNotifications, generateId]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    // 타임아웃 정리
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);

    // 모든 타임아웃 정리
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
  }, []);

  const updateNotification = useCallback(
    (id: string, updates: Partial<Notification>) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, ...updates }
            : notification
        )
      );
    },
    []
  );

  // 편의 메서드들
  const success = useCallback(
    (title: string, message?: string, options: Partial<Notification> = {}) => {
      return addNotification({
        type: "success",
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string, options: Partial<Notification> = {}) => {
      return addNotification({
        type: "error",
        title,
        message,
        persistent: true, // 에러는 기본적으로 지속적
        ...options,
      });
    },
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string, options: Partial<Notification> = {}) => {
      return addNotification({
        type: "warning",
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string, options: Partial<Notification> = {}) => {
      return addNotification({
        type: "info",
        title,
        message,
        ...options,
      });
    },
    [addNotification]
  );

  // 컴포넌트 언마운트 시 타임아웃 정리
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    updateNotification,
    success,
    error,
    warning,
    info,
  };
};

// 토스트 알림 (간단한 알림)
interface UseToastOptions {
  duration?: number;
  position?: "top" | "bottom" | "center";
}

interface UseToastReturn {
  toast: (
    message: string,
    type?: "success" | "error" | "warning" | "info"
  ) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

export const useToast = (options: UseToastOptions = {}): UseToastReturn => {
  const { duration = 3000, position = "top" } = options;
  const notifications = useNotifications({ defaultDuration: duration });

  const toast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning" | "info" = "info"
    ) => {
      notifications.addNotification({
        type,
        title: message,
        duration,
      });
    },
    [notifications, duration]
  );

  const success = useCallback(
    (message: string) => {
      toast(message, "success");
    },
    [toast]
  );

  const error = useCallback(
    (message: string) => {
      toast(message, "error");
    },
    [toast]
  );

  const warning = useCallback(
    (message: string) => {
      toast(message, "warning");
    },
    [toast]
  );

  const info = useCallback(
    (message: string) => {
      toast(message, "info");
    },
    [toast]
  );

  return {
    toast,
    success,
    error,
    warning,
    info,
  };
};

// 확인 다이얼로그
interface UseConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger" | "warning";
}

interface UseConfirmReturn {
  confirm: (options?: UseConfirmOptions) => Promise<boolean>;
}

export const useConfirm = (): UseConfirmReturn => {
  const confirm = useCallback(
    async (options: UseConfirmOptions = {}): Promise<boolean> => {
      const {
        title = "확인",
        message = "정말로 진행하시겠습니까?",
        confirmText = "확인",
        cancelText = "취소",
        variant = "primary",
      } = options;

      return new Promise((resolve) => {
        // 실제 구현에서는 모달 컴포넌트를 사용
        // 여기서는 간단히 window.confirm 사용
        const result = window.confirm(`${title}\n\n${message}`);
        resolve(result);
      });
    },
    []
  );

  return { confirm };
};
