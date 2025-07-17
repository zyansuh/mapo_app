import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Notification, NotificationType, NotificationPriority } from "../types";

// 알림 기본 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;
  private notificationHistory: Notification[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // 알림 서비스 초기화
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // 알림 권한 요청
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("푸시 알림 권한이 거부되었습니다.");
        return false;
      }

      // Android 알림 채널 설정
      if (Platform.OS === "android") {
        await this.setupAndroidChannels();
      }

      // 푸시 토큰 가져오기 (개발 환경에서는 생략)
      if (!__DEV__) {
        const token = await Notifications.getExpoPushTokenAsync();
        console.log("푸시 토큰:", token.data);
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("알림 서비스 초기화 실패:", error);
      return false;
    }
  }

  // Android 알림 채널 설정
  private async setupAndroidChannels(): Promise<void> {
    await Notifications.setNotificationChannelAsync("call-notifications", {
      name: "전화 알림",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("business-notifications", {
      name: "비즈니스 알림",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "default",
    });

    await Notifications.setNotificationChannelAsync("system-notifications", {
      name: "시스템 알림",
      importance: Notifications.AndroidImportance.LOW,
    });
  }

  // 즉시 알림 표시
  async showNotification(
    title: string,
    message: string,
    type: NotificationType = "system",
    priority: NotificationPriority = "normal",
    data?: any
  ): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const channelId = this.getChannelId(type);
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        priority,
        data,
        timestamp: new Date(),
        isRead: false,
      };

      // 알림 히스토리에 추가
      this.notificationHistory.unshift(notification);

      // 최대 100개까지만 유지
      if (this.notificationHistory.length > 100) {
        this.notificationHistory = this.notificationHistory.slice(0, 100);
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { ...data, notificationId: notification.id },
        },
        trigger: null, // 즉시 표시
        ...(Platform.OS === "android" && { channelId }),
      });

      return notificationId;
    } catch (error) {
      console.error("알림 표시 실패:", error);
      return null;
    }
  }

  // 예약 알림 설정
  async scheduleNotification(
    title: string,
    message: string,
    triggerDate: Date,
    type: NotificationType = "system",
    priority: NotificationPriority = "normal",
    data?: any
  ): Promise<string | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const channelId = this.getChannelId(type);
      const notification: Notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        priority,
        data,
        timestamp: triggerDate,
        isRead: false,
      };

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data: { ...data, notificationId: notification.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
        ...(Platform.OS === "android" && { channelId }),
      });

      return notificationId;
    } catch (error) {
      console.error("예약 알림 설정 실패:", error);
      return null;
    }
  }

  // 특정 알림 취소
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error("알림 취소 실패:", error);
    }
  }

  // 모든 알림 취소
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("모든 알림 취소 실패:", error);
    }
  }

  // 비즈니스 관련 알림들
  async notifyIncomingCall(
    phoneNumber: string,
    companyName?: string
  ): Promise<void> {
    const title = companyName ? `${companyName}에서 전화` : "수신 전화";
    const message = `전화번호: ${phoneNumber}`;

    await this.showNotification(title, message, "call", "urgent", {
      phoneNumber,
      companyName,
      action: "incoming_call",
    });
  }

  async notifyUnknownNumber(phoneNumber: string): Promise<void> {
    await this.showNotification(
      "미지의 번호",
      `${phoneNumber}에서 전화가 왔습니다. 거래처로 등록하시겠습니까?`,
      "call",
      "high",
      { phoneNumber, action: "unknown_number" }
    );
  }

  async notifyDeliveryReminder(
    deliveryNumber: string,
    companyName: string
  ): Promise<void> {
    await this.showNotification(
      "배송 알림",
      `${companyName} - ${deliveryNumber} 배송이 예정되어 있습니다.`,
      "delivery",
      "normal",
      { deliveryNumber, companyName, action: "delivery_reminder" }
    );
  }

  async notifyInvoiceDue(
    invoiceNumber: string,
    companyName: string,
    amount: number
  ): Promise<void> {
    await this.showNotification(
      "결제 기한 알림",
      `${companyName} - ${invoiceNumber} (${amount.toLocaleString()}원) 결제 기한이 임박했습니다.`,
      "invoice",
      "high",
      { invoiceNumber, companyName, amount, action: "invoice_due" }
    );
  }

  async notifyDataBackup(): Promise<void> {
    await this.showNotification(
      "데이터 백업 완료",
      "비즈니스 데이터가 성공적으로 백업되었습니다.",
      "system",
      "low",
      { action: "backup_complete" }
    );
  }

  // 알림 히스토리 관리
  getNotificationHistory(): Notification[] {
    return this.notificationHistory;
  }

  getUnreadNotifications(): Notification[] {
    return this.notificationHistory.filter((n) => !n.isRead);
  }

  markAsRead(notificationId: string): void {
    const notification = this.notificationHistory.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.notificationHistory.forEach((n) => (n.isRead = true));
  }

  clearHistory(): void {
    this.notificationHistory = [];
  }

  // 헬퍼 메서드
  private getChannelId(type: NotificationType): string {
    switch (type) {
      case "call":
        return "call-notifications";
      case "credit":
      case "delivery":
      case "invoice":
        return "business-notifications";
      case "system":
      default:
        return "system-notifications";
    }
  }

  // 알림 설정 관리
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // 테스트용 알림들
  async sendTestNotification(): Promise<void> {
    await this.showNotification(
      "테스트 알림",
      "알림 기능이 정상적으로 작동합니다!",
      "system",
      "normal",
      { action: "test" }
    );
  }

  // 정기 알림 설정 (매일 오후 6시)
  async setupDailyReports(): Promise<void> {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0, 0);

    // 오늘 6시가 이미 지났으면 내일로 설정
    if (now > sixPM) {
      sixPM.setDate(sixPM.getDate() + 1);
    }

    await this.scheduleNotification(
      "일일 비즈니스 리포트",
      "오늘의 거래처 활동과 통화 현황을 확인하세요.",
      sixPM,
      "system",
      "normal",
      { action: "daily_report" }
    );
  }
}

// 전역 인스턴스
export const notificationService = NotificationService.getInstance();
