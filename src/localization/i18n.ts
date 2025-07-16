import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext } from "react";

// 지원 언어 타입
export type SupportedLanguage = "ko" | "en" | "ja" | "zh";

// 번역 키 타입
export interface TranslationKeys {
  // 공통
  common: {
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    done: string;
    retry: string;
    refresh: string;
  };

  // 네비게이션
  navigation: {
    home: string;
    companies: string;
    search: string;
    statistics: string;
    settings: string;
  };

  // 업체 관련
  company: {
    name: string;
    type: string;
    region: string;
    address: string;
    phoneNumber: string;
    email: string;
    businessNumber: string;
    contactPerson: string;
    memo: string;
    favorite: string;
    list: string;
    detail: string;
    registration: string;
    edit: string;
    delete: string;
    call: string;
    qrCode: string;
    share: string;
  };

  // 상품 관련
  product: {
    name: string;
    category: string;
    price: string;
    unit: string;
    quantity: string;
    delivery: string;
    deliveryDate: string;
    status: string;
    total: string;
    registration: string;
    selection: string;
  };

  // 설정
  settings: {
    title: string;
    theme: string;
    notifications: string;
    dataManagement: string;
    language: string;
    about: string;
    version: string;
    export: string;
    backup: string;
    pushNotifications: string;
    sound: string;
    vibration: string;
    callAlerts: string;
    creditAlerts: string;
    deliveryAlerts: string;
  };

  // 테마
  theme: {
    light: string;
    dark: string;
    system: string;
    selection: string;
  };

  // 알림
  notifications: {
    title: string;
    message: string;
    paymentDue: string;
    deliveryCompleted: string;
    callEnded: string;
    unreadCount: string;
    markAsRead: string;
    deleteAll: string;
  };

  // 데이터 내보내기
  export: {
    title: string;
    format: string;
    excel: string;
    csv: string;
    json: string;
    completed: string;
    failed: string;
    selectFormat: string;
  };

  // QR 코드
  qr: {
    title: string;
    generate: string;
    share: string;
    save: string;
    description: string;
    companyInfo: string;
  };

  // 에러 메시지
  errors: {
    networkError: string;
    invalidInput: string;
    permissionDenied: string;
    fileNotFound: string;
    unknown: string;
  };

  // 성공 메시지
  success: {
    saved: string;
    deleted: string;
    exported: string;
    shared: string;
    copied: string;
  };
}

// 한국어 번역
const ko: TranslationKeys = {
  common: {
    cancel: "취소",
    confirm: "확인",
    save: "저장",
    delete: "삭제",
    edit: "수정",
    add: "추가",
    search: "검색",
    loading: "로딩 중...",
    error: "오류",
    success: "성공",
    warning: "경고",
    info: "정보",
    yes: "예",
    no: "아니오",
    ok: "확인",
    close: "닫기",
    back: "이전",
    next: "다음",
    previous: "이전",
    done: "완료",
    retry: "다시 시도",
    refresh: "새로고침",
  },

  navigation: {
    home: "홈",
    companies: "업체 목록",
    search: "검색",
    statistics: "통계",
    settings: "설정",
  },

  company: {
    name: "업체명",
    type: "업체구분",
    region: "지역",
    address: "주소",
    phoneNumber: "전화번호",
    email: "이메일",
    businessNumber: "사업자등록번호",
    contactPerson: "담당자",
    memo: "메모",
    favorite: "즐겨찾기",
    list: "업체 목록",
    detail: "업체 상세",
    registration: "업체 등록",
    edit: "업체 수정",
    delete: "업체 삭제",
    call: "통화하기",
    qrCode: "QR 코드",
    share: "공유",
  },

  product: {
    name: "상품명",
    category: "카테고리",
    price: "가격",
    unit: "단위",
    quantity: "수량",
    delivery: "배송",
    deliveryDate: "배송일",
    status: "상태",
    total: "총액",
    registration: "상품 등록",
    selection: "상품 선택",
  },

  settings: {
    title: "설정",
    theme: "테마",
    notifications: "알림",
    dataManagement: "데이터 관리",
    language: "언어",
    about: "정보",
    version: "앱 버전",
    export: "데이터 내보내기",
    backup: "데이터 백업",
    pushNotifications: "푸시 알림",
    sound: "알림음",
    vibration: "진동",
    callAlerts: "통화 알림",
    creditAlerts: "외상 알림",
    deliveryAlerts: "배송 알림",
  },

  theme: {
    light: "라이트 모드",
    dark: "다크 모드",
    system: "시스템 설정",
    selection: "테마 선택",
  },

  notifications: {
    title: "알림",
    message: "메시지",
    paymentDue: "외상 결제 알림",
    deliveryCompleted: "배송 완료",
    callEnded: "통화 종료",
    unreadCount: "읽지 않은 알림",
    markAsRead: "읽음 표시",
    deleteAll: "모두 삭제",
  },

  export: {
    title: "데이터 내보내기",
    format: "형식",
    excel: "Excel 파일",
    csv: "CSV 파일",
    json: "JSON 파일",
    completed: "내보내기 완료",
    failed: "내보내기 실패",
    selectFormat: "내보내기 형식 선택",
  },

  qr: {
    title: "QR 코드",
    generate: "QR 코드 생성",
    share: "공유",
    save: "저장",
    description: "QR 코드를 스캔하여 업체 정보를 확인할 수 있습니다.",
    companyInfo: "업체 정보",
  },

  errors: {
    networkError: "네트워크 오류가 발생했습니다.",
    invalidInput: "입력값이 올바르지 않습니다.",
    permissionDenied: "권한이 거부되었습니다.",
    fileNotFound: "파일을 찾을 수 없습니다.",
    unknown: "알 수 없는 오류가 발생했습니다.",
  },

  success: {
    saved: "저장되었습니다.",
    deleted: "삭제되었습니다.",
    exported: "내보내기가 완료되었습니다.",
    shared: "공유되었습니다.",
    copied: "복사되었습니다.",
  },
};

// 영어 번역
const en: TranslationKeys = {
  common: {
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    yes: "Yes",
    no: "No",
    ok: "OK",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    done: "Done",
    retry: "Retry",
    refresh: "Refresh",
  },

  navigation: {
    home: "Home",
    companies: "Companies",
    search: "Search",
    statistics: "Statistics",
    settings: "Settings",
  },

  company: {
    name: "Company Name",
    type: "Company Type",
    region: "Region",
    address: "Address",
    phoneNumber: "Phone Number",
    email: "Email",
    businessNumber: "Business Number",
    contactPerson: "Contact Person",
    memo: "Memo",
    favorite: "Favorite",
    list: "Company List",
    detail: "Company Detail",
    registration: "Company Registration",
    edit: "Edit Company",
    delete: "Delete Company",
    call: "Call",
    qrCode: "QR Code",
    share: "Share",
  },

  product: {
    name: "Product Name",
    category: "Category",
    price: "Price",
    unit: "Unit",
    quantity: "Quantity",
    delivery: "Delivery",
    deliveryDate: "Delivery Date",
    status: "Status",
    total: "Total",
    registration: "Product Registration",
    selection: "Product Selection",
  },

  settings: {
    title: "Settings",
    theme: "Theme",
    notifications: "Notifications",
    dataManagement: "Data Management",
    language: "Language",
    about: "About",
    version: "App Version",
    export: "Export Data",
    backup: "Backup Data",
    pushNotifications: "Push Notifications",
    sound: "Sound",
    vibration: "Vibration",
    callAlerts: "Call Alerts",
    creditAlerts: "Credit Alerts",
    deliveryAlerts: "Delivery Alerts",
  },

  theme: {
    light: "Light Mode",
    dark: "Dark Mode",
    system: "System Setting",
    selection: "Theme Selection",
  },

  notifications: {
    title: "Notifications",
    message: "Message",
    paymentDue: "Payment Due Alert",
    deliveryCompleted: "Delivery Completed",
    callEnded: "Call Ended",
    unreadCount: "Unread Notifications",
    markAsRead: "Mark as Read",
    deleteAll: "Delete All",
  },

  export: {
    title: "Export Data",
    format: "Format",
    excel: "Excel File",
    csv: "CSV File",
    json: "JSON File",
    completed: "Export Completed",
    failed: "Export Failed",
    selectFormat: "Select Export Format",
  },

  qr: {
    title: "QR Code",
    generate: "Generate QR Code",
    share: "Share",
    save: "Save",
    description: "Scan this QR code to view company information.",
    companyInfo: "Company Information",
  },

  errors: {
    networkError: "Network error occurred.",
    invalidInput: "Invalid input.",
    permissionDenied: "Permission denied.",
    fileNotFound: "File not found.",
    unknown: "Unknown error occurred.",
  },

  success: {
    saved: "Saved successfully.",
    deleted: "Deleted successfully.",
    exported: "Export completed successfully.",
    shared: "Shared successfully.",
    copied: "Copied successfully.",
  },
};

// 일본어 번역 (기본)
const ja: TranslationKeys = {
  common: {
    cancel: "キャンセル",
    confirm: "確認",
    save: "保存",
    delete: "削除",
    edit: "編集",
    add: "追加",
    search: "検索",
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
    warning: "警告",
    info: "情報",
    yes: "はい",
    no: "いいえ",
    ok: "OK",
    close: "閉じる",
    back: "戻る",
    next: "次へ",
    previous: "前へ",
    done: "完了",
    retry: "再試行",
    refresh: "更新",
  },

  navigation: {
    home: "ホーム",
    companies: "会社一覧",
    search: "検索",
    statistics: "統計",
    settings: "設定",
  },

  company: {
    name: "会社名",
    type: "会社区分",
    region: "地域",
    address: "住所",
    phoneNumber: "電話番号",
    email: "メール",
    businessNumber: "事業者登録番号",
    contactPerson: "担当者",
    memo: "メモ",
    favorite: "お気に入り",
    list: "会社一覧",
    detail: "会社詳細",
    registration: "会社登録",
    edit: "会社編集",
    delete: "会社削除",
    call: "通話",
    qrCode: "QRコード",
    share: "共有",
  },

  product: {
    name: "商品名",
    category: "カテゴリー",
    price: "価格",
    unit: "単位",
    quantity: "数量",
    delivery: "配送",
    deliveryDate: "配送日",
    status: "状態",
    total: "合計",
    registration: "商品登録",
    selection: "商品選択",
  },

  settings: {
    title: "設定",
    theme: "テーマ",
    notifications: "通知",
    dataManagement: "データ管理",
    language: "言語",
    about: "情報",
    version: "アプリバージョン",
    export: "データエクスポート",
    backup: "データバックアップ",
    pushNotifications: "プッシュ通知",
    sound: "音",
    vibration: "振動",
    callAlerts: "通話アラート",
    creditAlerts: "信用アラート",
    deliveryAlerts: "配送アラート",
  },

  theme: {
    light: "ライトモード",
    dark: "ダークモード",
    system: "システム設定",
    selection: "テーマ選択",
  },

  notifications: {
    title: "通知",
    message: "メッセージ",
    paymentDue: "支払い期限アラート",
    deliveryCompleted: "配送完了",
    callEnded: "通話終了",
    unreadCount: "未読通知",
    markAsRead: "既読にする",
    deleteAll: "すべて削除",
  },

  export: {
    title: "データエクスポート",
    format: "フォーマット",
    excel: "Excelファイル",
    csv: "CSVファイル",
    json: "JSONファイル",
    completed: "エクスポート完了",
    failed: "エクスポート失敗",
    selectFormat: "エクスポート形式選択",
  },

  qr: {
    title: "QRコード",
    generate: "QRコード生成",
    share: "共有",
    save: "保存",
    description: "このQRコードをスキャンして会社情報を確認できます。",
    companyInfo: "会社情報",
  },

  errors: {
    networkError: "ネットワークエラーが発生しました。",
    invalidInput: "無効な入力です。",
    permissionDenied: "権限が拒否されました。",
    fileNotFound: "ファイルが見つかりません。",
    unknown: "不明なエラーが発生しました。",
  },

  success: {
    saved: "保存されました。",
    deleted: "削除されました。",
    exported: "エクスポートが完了しました。",
    shared: "共有されました。",
    copied: "コピーされました。",
  },
};

// 중국어 번역 (기본)
const zh: TranslationKeys = {
  common: {
    cancel: "取消",
    confirm: "确认",
    save: "保存",
    delete: "删除",
    edit: "编辑",
    add: "添加",
    search: "搜索",
    loading: "加载中...",
    error: "错误",
    success: "成功",
    warning: "警告",
    info: "信息",
    yes: "是",
    no: "否",
    ok: "确定",
    close: "关闭",
    back: "返回",
    next: "下一步",
    previous: "上一步",
    done: "完成",
    retry: "重试",
    refresh: "刷新",
  },

  navigation: {
    home: "首页",
    companies: "公司列表",
    search: "搜索",
    statistics: "统计",
    settings: "设置",
  },

  company: {
    name: "公司名称",
    type: "公司类型",
    region: "地区",
    address: "地址",
    phoneNumber: "电话号码",
    email: "邮箱",
    businessNumber: "营业执照号",
    contactPerson: "联系人",
    memo: "备注",
    favorite: "收藏",
    list: "公司列表",
    detail: "公司详情",
    registration: "公司注册",
    edit: "编辑公司",
    delete: "删除公司",
    call: "拨打电话",
    qrCode: "二维码",
    share: "分享",
  },

  product: {
    name: "产品名称",
    category: "类别",
    price: "价格",
    unit: "单位",
    quantity: "数量",
    delivery: "配送",
    deliveryDate: "配送日期",
    status: "状态",
    total: "总计",
    registration: "产品注册",
    selection: "产品选择",
  },

  settings: {
    title: "设置",
    theme: "主题",
    notifications: "通知",
    dataManagement: "数据管理",
    language: "语言",
    about: "关于",
    version: "应用版本",
    export: "导出数据",
    backup: "备份数据",
    pushNotifications: "推送通知",
    sound: "声音",
    vibration: "振动",
    callAlerts: "通话提醒",
    creditAlerts: "信用提醒",
    deliveryAlerts: "配送提醒",
  },

  theme: {
    light: "浅色模式",
    dark: "深色模式",
    system: "系统设置",
    selection: "主题选择",
  },

  notifications: {
    title: "通知",
    message: "消息",
    paymentDue: "付款到期提醒",
    deliveryCompleted: "配送完成",
    callEnded: "通话结束",
    unreadCount: "未读通知",
    markAsRead: "标记为已读",
    deleteAll: "全部删除",
  },

  export: {
    title: "导出数据",
    format: "格式",
    excel: "Excel文件",
    csv: "CSV文件",
    json: "JSON文件",
    completed: "导出完成",
    failed: "导出失败",
    selectFormat: "选择导出格式",
  },

  qr: {
    title: "二维码",
    generate: "生成二维码",
    share: "分享",
    save: "保存",
    description: "扫描此二维码查看公司信息。",
    companyInfo: "公司信息",
  },

  errors: {
    networkError: "网络错误。",
    invalidInput: "输入无效。",
    permissionDenied: "权限被拒绝。",
    fileNotFound: "文件未找到。",
    unknown: "发生未知错误。",
  },

  success: {
    saved: "保存成功。",
    deleted: "删除成功。",
    exported: "导出成功。",
    shared: "分享成功。",
    copied: "复制成功。",
  },
};

// 번역 데이터
const translations = {
  ko,
  en,
  ja,
  zh,
};

// 기본 언어
const DEFAULT_LANGUAGE: SupportedLanguage = "ko";
const LANGUAGE_STORAGE_KEY = "@mapo_language";

// 로컬라이제이션 매니저
export class LocalizationManager {
  private static instance: LocalizationManager;
  private currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;
  private listeners: Set<() => void> = new Set();

  static getInstance(): LocalizationManager {
    if (!LocalizationManager.instance) {
      LocalizationManager.instance = new LocalizationManager();
    }
    return LocalizationManager.instance;
  }

  async init(): Promise<void> {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && this.isValidLanguage(savedLanguage)) {
        this.currentLanguage = savedLanguage as SupportedLanguage;
      }
    } catch (error) {
      console.error("언어 설정 로드 실패:", error);
    }
  }

  private isValidLanguage(language: string): boolean {
    return ["ko", "en", "ja", "zh"].includes(language);
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  async setLanguage(language: SupportedLanguage): Promise<void> {
    try {
      this.currentLanguage = language;
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      this.notifyListeners();
    } catch (error) {
      console.error("언어 설정 저장 실패:", error);
    }
  }

  getTranslations(): TranslationKeys {
    return translations[this.currentLanguage] || translations[DEFAULT_LANGUAGE];
  }

  // 번역 헬퍼 함수
  t(key: string): string {
    const keys = key.split(".");
    let value: any = this.getTranslations();

    for (const k of keys) {
      value = value[k];
      if (value === undefined) {
        console.warn(`번역 키를 찾을 수 없습니다: ${key}`);
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  }

  // 리스너 등록
  addListener(listener: () => void): void {
    this.listeners.add(listener);
  }

  // 리스너 제거
  removeListener(listener: () => void): void {
    this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  // 지원 언어 목록
  getSupportedLanguages() {
    return [
      { code: "ko", name: "한국어", nativeName: "한국어" },
      { code: "en", name: "English", nativeName: "English" },
      { code: "ja", name: "Japanese", nativeName: "日本語" },
      { code: "zh", name: "Chinese", nativeName: "中文" },
    ] as const;
  }
}

// 싱글톤 인스턴스
export const localizationManager = LocalizationManager.getInstance();

// React Context
export const LocalizationContext = createContext<{
  language: SupportedLanguage;
  t: (key: string) => string;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
  supportedLanguages: ReturnType<LocalizationManager["getSupportedLanguages"]>;
}>({
  language: DEFAULT_LANGUAGE,
  t: (key: string) => key,
  setLanguage: async () => {},
  supportedLanguages: localizationManager.getSupportedLanguages(),
});

// Hook
export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
};
