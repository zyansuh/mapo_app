// 성공 메시지
export const SUCCESS_MESSAGES = {
  COMPANY: {
    CREATED: "회사가 성공적으로 등록되었습니다.",
    UPDATED: "회사 정보가 성공적으로 수정되었습니다.",
    DELETED: "회사가 성공적으로 삭제되었습니다.",
    FAVORITE_ADDED: "즐겨찾기에 추가되었습니다.",
    FAVORITE_REMOVED: "즐겨찾기에서 제거되었습니다.",
  },
  PRODUCT: {
    CREATED: "상품이 성공적으로 등록되었습니다.",
    UPDATED: "상품 정보가 성공적으로 수정되었습니다.",
    DELETED: "상품이 성공적으로 삭제되었습니다.",
  },
  INVOICE: {
    CREATED: "계산서가 성공적으로 발행되었습니다.",
    UPDATED: "계산서가 성공적으로 수정되었습니다.",
    DELETED: "계산서가 성공적으로 삭제되었습니다.",
    SENT: "계산서가 성공적으로 전송되었습니다.",
  },
  DELIVERY: {
    CREATED: "배송이 성공적으로 등록되었습니다.",
    UPDATED: "배송 정보가 성공적으로 수정되었습니다.",
    COMPLETED: "배송이 완료되었습니다.",
    CANCELLED: "배송이 취소되었습니다.",
  },
  DATA: {
    EXPORTED: "데이터가 성공적으로 내보내졌습니다.",
    IMPORTED: "데이터가 성공적으로 가져와졌습니다.",
    BACKUP_CREATED: "백업이 성공적으로 생성되었습니다.",
    BACKUP_RESTORED: "백업이 성공적으로 복원되었습니다.",
    SYNC_COMPLETED: "동기화가 완료되었습니다.",
  },
  SETTINGS: {
    SAVED: "설정이 저장되었습니다.",
    RESET: "설정이 초기화되었습니다.",
    THEME_CHANGED: "테마가 변경되었습니다.",
    LANGUAGE_CHANGED: "언어가 변경되었습니다.",
  },
} as const;

// 오류 메시지
export const ERROR_MESSAGES = {
  NETWORK: {
    CONNECTION_FAILED: "네트워크 연결에 실패했습니다.",
    TIMEOUT: "요청 시간이 초과되었습니다.",
    SERVER_ERROR: "서버 오류가 발생했습니다.",
    UNAUTHORIZED: "인증에 실패했습니다.",
    FORBIDDEN: "접근 권한이 없습니다.",
    NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  },
  VALIDATION: {
    REQUIRED_FIELD: "필수 입력 항목입니다.",
    INVALID_EMAIL: "올바른 이메일 주소를 입력해주세요.",
    INVALID_PHONE: "올바른 전화번호를 입력해주세요.",
    INVALID_BUSINESS_NUMBER: "올바른 사업자등록번호를 입력해주세요.",
    PASSWORD_TOO_SHORT: "비밀번호는 8자 이상이어야 합니다.",
    PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
    INVALID_DATE: "올바른 날짜를 입력해주세요.",
    INVALID_NUMBER: "올바른 숫자를 입력해주세요.",
    MIN_LENGTH: (min: number) => `최소 ${min}자 이상 입력해주세요.`,
    MAX_LENGTH: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
  },
  COMPANY: {
    NOT_FOUND: "회사 정보를 찾을 수 없습니다.",
    DUPLICATE_NAME: "이미 등록된 회사명입니다.",
    CREATE_FAILED: "회사 등록에 실패했습니다.",
    UPDATE_FAILED: "회사 정보 수정에 실패했습니다.",
    DELETE_FAILED: "회사 삭제에 실패했습니다.",
    LIMIT_EXCEEDED: "등록 가능한 회사 수를 초과했습니다.",
  },
  PRODUCT: {
    NOT_FOUND: "상품 정보를 찾을 수 없습니다.",
    DUPLICATE_NAME: "이미 등록된 상품명입니다.",
    CREATE_FAILED: "상품 등록에 실패했습니다.",
    UPDATE_FAILED: "상품 정보 수정에 실패했습니다.",
    DELETE_FAILED: "상품 삭제에 실패했습니다.",
    OUT_OF_STOCK: "재고가 부족합니다.",
  },
  INVOICE: {
    NOT_FOUND: "계산서를 찾을 수 없습니다.",
    CREATE_FAILED: "계산서 발행에 실패했습니다.",
    UPDATE_FAILED: "계산서 수정에 실패했습니다.",
    DELETE_FAILED: "계산서 삭제에 실패했습니다.",
    ALREADY_ISSUED: "이미 발행된 계산서입니다.",
    CANNOT_MODIFY: "수정할 수 없는 계산서입니다.",
  },
  DATA: {
    STORAGE_FULL: "저장 공간이 부족합니다.",
    CORRUPTED: "데이터가 손상되었습니다.",
    EXPORT_FAILED: "데이터 내보내기에 실패했습니다.",
    IMPORT_FAILED: "데이터 가져오기에 실패했습니다.",
    BACKUP_FAILED: "백업 생성에 실패했습니다.",
    RESTORE_FAILED: "백업 복원에 실패했습니다.",
    SYNC_FAILED: "동기화에 실패했습니다.",
  },
  FILE: {
    TOO_LARGE: "파일 크기가 너무 큽니다.",
    INVALID_FORMAT: "지원하지 않는 파일 형식입니다.",
    UPLOAD_FAILED: "파일 업로드에 실패했습니다.",
    DOWNLOAD_FAILED: "파일 다운로드에 실패했습니다.",
    NOT_FOUND: "파일을 찾을 수 없습니다.",
  },
  PERMISSION: {
    CAMERA_DENIED: "카메라 권한이 필요합니다.",
    STORAGE_DENIED: "저장소 권한이 필요합니다.",
    MICROPHONE_DENIED: "마이크 권한이 필요합니다.",
    LOCATION_DENIED: "위치 권한이 필요합니다.",
    CONTACTS_DENIED: "연락처 권한이 필요합니다.",
  },
} as const;

// 확인 메시지
export const CONFIRM_MESSAGES = {
  DELETE: {
    COMPANY: "이 회사를 삭제하시겠습니까?",
    PRODUCT: "이 상품을 삭제하시겠습니까?",
    INVOICE: "이 계산서를 삭제하시겠습니까?",
    DELIVERY: "이 배송을 삭제하시겠습니까?",
    ALL_DATA: "모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
  },
  SAVE: {
    UNSAVED_CHANGES: "저장하지 않은 변경사항이 있습니다. 저장하시겠습니까?",
    OVERWRITE: "기존 데이터를 덮어쓰시겠습니까?",
  },
  CANCEL: {
    OPERATION: "작업을 취소하시겠습니까?",
    CHANGES: "변경사항을 취소하시겠습니까?",
  },
  RESET: {
    SETTINGS: "설정을 초기화하시겠습니까?",
    DATA: "데이터를 초기화하시겠습니까?",
  },
} as const;

// 정보 메시지
export const INFO_MESSAGES = {
  LOADING: {
    COMPANIES: "회사 목록을 불러오는 중...",
    PRODUCTS: "상품 목록을 불러오는 중...",
    INVOICES: "계산서 목록을 불러오는 중...",
    DELIVERIES: "배송 목록을 불러오는 중...",
    SAVING: "저장 중...",
    DELETING: "삭제 중...",
    EXPORTING: "데이터를 내보내는 중...",
    IMPORTING: "데이터를 가져오는 중...",
    BACKUP: "백업을 생성하는 중...",
    RESTORE: "백업을 복원하는 중...",
    SYNC: "동기화 중...",
  },
  EMPTY: {
    COMPANIES: "등록된 회사가 없습니다.",
    PRODUCTS: "등록된 상품이 없습니다.",
    INVOICES: "발행된 계산서가 없습니다.",
    DELIVERIES: "배송 내역이 없습니다.",
    SEARCH_RESULTS: "검색 결과가 없습니다.",
    FAVORITES: "즐겨찾기가 없습니다.",
    CALL_HISTORY: "통화 기록이 없습니다.",
  },
  TUTORIAL: {
    WELCOME: "마포 비즈니스 매니저에 오신 것을 환영합니다!",
    ADD_COMPANY: "첫 번째 회사를 등록해보세요.",
    CREATE_INVOICE: "계산서를 발행해보세요.",
    MANAGE_PRODUCTS: "상품을 관리해보세요.",
    VIEW_STATISTICS: "통계를 확인해보세요.",
  },
} as const;

// 버튼 텍스트
export const BUTTON_TEXTS = {
  COMMON: {
    OK: "확인",
    CANCEL: "취소",
    SAVE: "저장",
    DELETE: "삭제",
    EDIT: "수정",
    ADD: "추가",
    SEARCH: "검색",
    FILTER: "필터",
    RESET: "초기화",
    BACK: "뒤로",
    NEXT: "다음",
    PREVIOUS: "이전",
    CLOSE: "닫기",
    RETRY: "다시 시도",
    REFRESH: "새로고침",
  },
  ACTIONS: {
    CREATE_COMPANY: "회사 등록",
    CREATE_PRODUCT: "상품 등록",
    CREATE_INVOICE: "계산서 발행",
    CREATE_DELIVERY: "배송 등록",
    EXPORT_DATA: "데이터 내보내기",
    IMPORT_DATA: "데이터 가져오기",
    BACKUP_DATA: "백업 생성",
    RESTORE_DATA: "백업 복원",
    CALL_PHONE: "전화걸기",
    SEND_EMAIL: "이메일 보내기",
    VIEW_MAP: "지도 보기",
  },
} as const;

// 플레이스홀더 텍스트
export const PLACEHOLDERS = {
  COMPANY: {
    NAME: "회사명을 입력하세요",
    ADDRESS: "주소를 입력하세요",
    PHONE: "전화번호를 입력하세요",
    EMAIL: "이메일을 입력하세요",
    CONTACT_PERSON: "담당자명을 입력하세요",
    BUSINESS_NUMBER: "사업자등록번호를 입력하세요",
    MEMO: "메모를 입력하세요",
  },
  PRODUCT: {
    NAME: "상품명을 입력하세요",
    PRICE: "가격을 입력하세요",
    DESCRIPTION: "상품 설명을 입력하세요",
    SKU: "상품 코드를 입력하세요",
    BARCODE: "바코드를 입력하세요",
  },
  SEARCH: {
    COMPANIES: "회사명, 주소, 전화번호로 검색",
    PRODUCTS: "상품명, 카테고리로 검색",
    INVOICES: "계산서 번호, 회사명으로 검색",
    GENERAL: "검색어를 입력하세요",
  },
} as const;

// 라벨 텍스트
export const LABELS = {
  COMPANY: {
    NAME: "회사명",
    TYPE: "업체 구분",
    REGION: "지역",
    ADDRESS: "주소",
    PHONE: "전화번호",
    EMAIL: "이메일",
    CONTACT_PERSON: "담당자",
    BUSINESS_NUMBER: "사업자등록번호",
    MEMO: "메모",
    STATUS: "상태",
    CREATED_AT: "등록일",
    UPDATED_AT: "수정일",
  },
  PRODUCT: {
    NAME: "상품명",
    CATEGORY: "카테고리",
    PRICE: "가격",
    UNIT: "단위",
    DESCRIPTION: "설명",
    SKU: "상품코드",
    STOCK: "재고",
    STATUS: "상태",
  },
  INVOICE: {
    NUMBER: "계산서 번호",
    COMPANY: "거래처",
    DATE: "발행일",
    DUE_DATE: "지불기한",
    AMOUNT: "금액",
    TAX: "세액",
    TOTAL: "총액",
    STATUS: "상태",
    MEMO: "메모",
  },
} as const;
