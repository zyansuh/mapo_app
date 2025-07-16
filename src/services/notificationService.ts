import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification, NotificationType, NotificationPriority } from "../types";

// 알림 표시 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const NOTIFICATION_STORAGE_KEY = "@mapo_notifications";
const PUSH_TOKEN_STORAGE_KEY = "@mapo_push_token";

export class NotificationService {
  private static instance: NotificationService;
  private pushToken: string | null = null;
  private notifications: Notification[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // 푸시 알림 권한 요청 및 토큰 획득
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.warn("푸시 알림은 실제 기기에서만 작동합니다.");
      return null;
    }

    // 기존 권한 상태 확인
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 권한이 없으면 요청
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("푸시 알림 권한이 거부되었습니다.");
      return null;
    }

    try {
      // 푸시 토큰 획득
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.pushToken = token.data;
      await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token.data);

      console.log("푸시 토큰:", token.data);
      return token.data;
    } catch (error) {
      console.error("푸시 토큰 획득 실패:", error);
      return null;
    }
  }

  // 안드로이드 알림 채널 설정
  async setupAndroidNotificationChannel() {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      // 통화 알림 채널
      await Notifications.setNotificationChannelAsync("call", {
        name: "통화 알림",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 1000, 500, 1000],
        sound: "default",
      });

      // 외상 알림 채널
      await Notifications.setNotificationChannelAsync("credit", {
        name: "외상 알림",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
      });

      // 배송 알림 채널
      await Notifications.setNotificationChannelAsync("delivery", {
        name: "배송 알림",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  }

  // 로컬 알림 전송
  async sendLocalNotification(
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
    priority: NotificationPriority = "normal"
  ): Promise<string> {
    const notificationId = `notification_${Date.now()}`;

    // 알림 데이터 생성
    const notification: Notification = {
      id: notificationId,
      type,
      title,
      message,
      priority,
      data,
      timestamp: new Date(),
      isRead: false,
    };

    // 메모리와 저장소에 추가
    this.notifications.unshift(notification);
    await this.saveNotifications();

    // 실제 알림 전송
    const channelId = this.getChannelId(type);
    const scheduledNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { ...data, notificationId },
          categoryIdentifier: type,
          priority: this.getPriorityLevel(priority),
        },
        trigger: null, // 즉시 전송
        identifier: notificationId,
      });

    return scheduledNotificationId;
  }

  // 예약 알림 전송
  async scheduleNotification(
    type: NotificationType,
    title: string,
    message: string,
    triggerDate: Date,
    data?: any,
    priority: NotificationPriority = "normal"
  ): Promise<string> {
    const notificationId = `scheduled_${Date.now()}`;

    const notification: Notification = {
      id: notificationId,
      type,
      title,
      message,
      priority,
      data,
      timestamp: new Date(),
      isRead: false,
    };

    this.notifications.unshift(notification);
    await this.saveNotifications();

    const scheduledNotificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { ...data, notificationId },
          categoryIdentifier: type,
          priority: this.getPriorityLevel(priority),
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.floor((triggerDate.getTime() - Date.now()) / 1000),
        },
        identifier: notificationId,
      });

    return scheduledNotificationId;
  }

  // 특정 업체의 외상 만료 알림
  async schedulePaymentDueNotification(
    companyName: string,
    amount: number,
    dueDate: Date
  ) {
    const title = "외상 결제 알림";
    const message = `${companyName}의 외상 ${amount.toLocaleString()}원이 ${dueDate.toLocaleDateString()}에 만료됩니다.`;

    // 만료일 1일 전에 알림
    const notificationDate = new Date(dueDate);
    notificationDate.setDate(notificationDate.getDate() - 1);
    notificationDate.setHours(9, 0, 0, 0); // 오전 9시

    if (notificationDate > new Date()) {
      return await this.scheduleNotification(
        "credit",
        title,
        message,
        notificationDate,
        { companyName, amount, dueDate: dueDate.toISOString() },
        "high"
      );
    }
  }

  // 배송 완료 알림
  async sendDeliveryCompletedNotification(
    companyName: string,
    productNames: string[]
  ) {
    const title = "배송 완료";
    const message = `${companyName}에 ${productNames.join(
      ", "
    )} 배송이 완료되었습니다.`;

    return await this.sendLocalNotification(
      "delivery",
      title,
      message,
      { companyName, productNames },
      "normal"
    );
  }

  // 통화 종료 후 알림
  async sendCallEndNotification(
    phoneNumber: string,
    duration: number,
    companyName?: string
  ) {
    const title = "통화 종료";
    const durationText = this.formatCallDuration(duration);
    const message = companyName
      ? `${companyName}(${phoneNumber})와의 통화가 종료되었습니다. (${durationText})`
      : `${phoneNumber}와의 통화가 종료되었습니다. (${durationText})`;

    return await this.sendLocalNotification(
      "call",
      title,
      message,
      { phoneNumber, duration, companyName },
      "normal"
    );
  }

  // 알림 목록 조회
  async getNotifications(): Promise<Notification[]> {
    if (this.notifications.length === 0) {
      await this.loadNotifications();
    }
    return this.notifications.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // 알림 읽음 처리
  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
      await this.saveNotifications();
    }
  }

  // 모든 알림 읽음 처리
  async markAllAsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.isRead = true));
    await this.saveNotifications();
  }

  // 알림 삭제
  async deleteNotification(notificationId: string): Promise<void> {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );
    await this.saveNotifications();

    // 예약된 알림도 취소
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // 모든 알림 삭제
  async clearAllNotifications(): Promise<void> {
    this.notifications = [];
    await this.saveNotifications();
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // 읽지 않은 알림 개수
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  // 헬퍼 메서드들
  private getChannelId(type: NotificationType): string {
    switch (type) {
      case "call":
        return "call";
      case "credit":
        return "credit";
      case "delivery":
        return "delivery";
      default:
        return "default";
    }
  }

  private getPriorityLevel(
    priority: NotificationPriority
  ): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case "low":
        return Notifications.AndroidNotificationPriority.LOW;
      case "high":
        return Notifications.AndroidNotificationPriority.HIGH;
      case "urgent":
        return Notifications.AndroidNotificationPriority.MAX;
      default:
        return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  private formatCallDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else {
      return `${remainingSeconds}초`;
    }
  }

  private async saveNotifications(): Promise<void> {
    try {
      const notificationsData = this.notifications.map((n) => ({
        ...n,
        timestamp: n.timestamp.toISOString(),
      }));
      await AsyncStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(notificationsData)
      );
    } catch (error) {
      console.error("알림 저장 실패:", error);
    }
  }

  private async loadNotifications(): Promise<void> {
    try {
      const notificationsData = await AsyncStorage.getItem(
        NOTIFICATION_STORAGE_KEY
      );
      if (notificationsData) {
        const parsed = JSON.parse(notificationsData);
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }
    } catch (error) {
      console.error("알림 로드 실패:", error);
      this.notifications = [];
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const notificationService = NotificationService.getInstance();
