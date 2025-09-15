// 유효성 검사 관련 상수들

// 이메일 정규식
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 전화번호 정규식
export const PHONE_REGEX = /^[\d\-\+\(\)\s]+$/;

// 한국 전화번호 정규식
export const KOREAN_PHONE_REGEX = /^(\+82|0)[1-9]\d{1,2}\d{3,4}\d{4}$/;

// 사업자등록번호 정규식
export const BUSINESS_NUMBER_REGEX = /^\d{3}-\d{2}-\d{5}$/;

// 주민등록번호 정규식
export const RESIDENT_NUMBER_REGEX = /^\d{6}-\d{7}$/;

// URL 정규식
export const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// IP 주소 정규식
export const IP_REGEX =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// 비밀번호 정규식
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// 한국어 정규식
export const KOREAN_REGEX = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

// 영어 정규식
export const ENGLISH_REGEX = /[a-zA-Z]/;

// 숫자만 정규식
export const DIGITS_ONLY_REGEX = /^\d+$/;

// 알파벳만 정규식
export const ALPHA_ONLY_REGEX = /^[a-zA-Z]+$/;

// 알파벳과 숫자만 정규식
export const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

// 공백 정규식
export const WHITESPACE_REGEX = /\s/;

// 특수문자 정규식
export const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

// 파일 확장자 정규식
export const FILE_EXTENSION_REGEX = /\.([a-zA-Z0-9]+)$/;

// 이미지 파일 확장자 정규식
export const IMAGE_EXTENSION_REGEX = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;

// 문서 파일 확장자 정규식
export const DOCUMENT_EXTENSION_REGEX =
  /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i;

// 비디오 파일 확장자 정규식
export const VIDEO_EXTENSION_REGEX = /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i;

// 오디오 파일 확장자 정규식
export const AUDIO_EXTENSION_REGEX = /\.(mp3|wav|flac|aac|ogg|wma)$/i;

// 최소/최대 길이 제한
export const LENGTH_LIMITS = {
  // 일반 텍스트
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 255,

  // 이름
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,

  // 제목
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 100,

  // 설명
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 1000,

  // 메모
  MIN_MEMO_LENGTH: 0,
  MAX_MEMO_LENGTH: 500,

  // 주소
  MIN_ADDRESS_LENGTH: 1,
  MAX_ADDRESS_LENGTH: 200,

  // 이메일
  MIN_EMAIL_LENGTH: 5,
  MAX_EMAIL_LENGTH: 100,

  // 전화번호
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15,

  // 비밀번호
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,

  // 사용자명
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,

  // 태그
  MIN_TAG_LENGTH: 1,
  MAX_TAG_LENGTH: 20,

  // 코드
  MIN_CODE_LENGTH: 1,
  MAX_CODE_LENGTH: 20,
} as const;

// 숫자 범위 제한
export const NUMBER_LIMITS = {
  // 가격
  MIN_PRICE: 0,
  MAX_PRICE: 999999999,

  // 수량
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999999,

  // 할인율
  MIN_DISCOUNT: 0,
  MAX_DISCOUNT: 100,

  // 세율
  MIN_TAX_RATE: 0,
  MAX_TAX_RATE: 100,

  // 페이지 크기
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,

  // 파일 크기 (MB)
  MIN_FILE_SIZE: 0,
  MAX_FILE_SIZE: 100,
  MAX_IMAGE_SIZE: 10,
  MAX_DOCUMENT_SIZE: 50,

  // 검색 결과
  MIN_SEARCH_RESULTS: 0,
  MAX_SEARCH_RESULTS: 1000,
} as const;

// 날짜 범위 제한
export const DATE_LIMITS = {
  // 최소 날짜 (1900년)
  MIN_DATE: new Date("1900-01-01"),

  // 최대 날짜 (2100년)
  MAX_DATE: new Date("2100-12-31"),

  // 기본 날짜 범위 (1년)
  DEFAULT_DATE_RANGE_DAYS: 365,

  // 최대 날짜 범위 (10년)
  MAX_DATE_RANGE_DAYS: 3650,
} as const;

// 파일 타입 제한
export const FILE_TYPES = {
  // 이미지 파일
  IMAGE: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
  ],

  // 문서 파일
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
  ],

  // 비디오 파일
  VIDEO: [
    "video/mp4",
    "video/avi",
    "video/mov",
    "video/wmv",
    "video/flv",
    "video/webm",
    "video/mkv",
  ],

  // 오디오 파일
  AUDIO: [
    "audio/mpeg",
    "audio/wav",
    "audio/flac",
    "audio/aac",
    "audio/ogg",
    "audio/wma",
  ],

  // 압축 파일
  ARCHIVE: [
    "application/zip",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/gzip",
    "application/x-tar",
  ],
} as const;

// 에러 메시지
export const VALIDATION_ERRORS = {
  // 필수 입력
  REQUIRED: "필수 입력 항목입니다.",

  // 길이 관련
  MIN_LENGTH: (min: number) => `최소 ${min}자 이상 입력해주세요.`,
  MAX_LENGTH: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
  LENGTH_RANGE: (min: number, max: number) =>
    `${min}자 이상 ${max}자 이하로 입력해주세요.`,

  // 숫자 관련
  MIN_VALUE: (min: number) => `최소값은 ${min}입니다.`,
  MAX_VALUE: (max: number) => `최대값은 ${max}입니다.`,
  VALUE_RANGE: (min: number, max: number) =>
    `${min} 이상 ${max} 이하의 값을 입력해주세요.`,
  POSITIVE_NUMBER: "양수를 입력해주세요.",
  NEGATIVE_NUMBER: "음수를 입력해주세요.",
  INTEGER: "정수를 입력해주세요.",
  DECIMAL: "소수를 입력해주세요.",

  // 형식 관련
  INVALID_EMAIL: "올바른 이메일 형식이 아닙니다.",
  INVALID_PHONE: "올바른 전화번호 형식이 아닙니다.",
  INVALID_URL: "올바른 URL 형식이 아닙니다.",
  INVALID_DATE: "올바른 날짜 형식이 아닙니다.",
  INVALID_TIME: "올바른 시간 형식이 아닙니다.",
  INVALID_PASSWORD:
    "비밀번호는 8자 이상, 대소문자, 숫자, 특수문자를 포함해야 합니다.",
  INVALID_BUSINESS_NUMBER: "올바른 사업자등록번호 형식이 아닙니다.",
  INVALID_RESIDENT_NUMBER: "올바른 주민등록번호 형식이 아닙니다.",

  // 날짜 관련
  FUTURE_DATE: "미래 날짜는 입력할 수 없습니다.",
  PAST_DATE: "과거 날짜는 입력할 수 없습니다.",
  DATE_RANGE: "날짜 범위를 확인해주세요.",

  // 파일 관련
  INVALID_FILE_TYPE: "지원하지 않는 파일 형식입니다.",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다.",
  FILE_TOO_SMALL: "파일 크기가 너무 작습니다.",
  MAX_FILES_EXCEEDED: "최대 파일 개수를 초과했습니다.",

  // 선택 관련
  SELECT_REQUIRED: "항목을 선택해주세요.",
  MIN_SELECTION: (min: number) => `최소 ${min}개 이상 선택해주세요.`,
  MAX_SELECTION: (max: number) => `최대 ${max}개까지 선택 가능합니다.`,

  // 중복 관련
  DUPLICATE_VALUE: "중복된 값입니다.",
  UNIQUE_REQUIRED: "고유한 값이어야 합니다.",

  // 네트워크 관련
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다.",
  TIMEOUT_ERROR: "요청 시간이 초과되었습니다.",

  // 권한 관련
  UNAUTHORIZED: "권한이 없습니다.",
  FORBIDDEN: "접근이 금지되었습니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",

  // 일반
  INVALID_FORMAT: "올바른 형식이 아닙니다.",
  INVALID_VALUE: "유효하지 않은 값입니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// 성공 메시지
export const VALIDATION_SUCCESS = {
  VALID_EMAIL: "유효한 이메일입니다.",
  VALID_PHONE: "유효한 전화번호입니다.",
  VALID_PASSWORD: "안전한 비밀번호입니다.",
  VALID_BUSINESS_NUMBER: "유효한 사업자등록번호입니다.",
  VALID_RESIDENT_NUMBER: "유효한 주민등록번호입니다.",
  VALID_URL: "유효한 URL입니다.",
  VALID_DATE: "유효한 날짜입니다.",
  VALID_FILE: "유효한 파일입니다.",
  VALID_FORM: "모든 입력이 올바릅니다.",
} as const;

// 유효성 검사 규칙 프리셋
export const VALIDATION_RULES = {
  // 이메일
  EMAIL: {
    required: true,
    pattern: EMAIL_REGEX,
    minLength: LENGTH_LIMITS.MIN_EMAIL_LENGTH,
    maxLength: LENGTH_LIMITS.MAX_EMAIL_LENGTH,
    message: VALIDATION_ERRORS.INVALID_EMAIL,
  },

  // 전화번호
  PHONE: {
    required: true,
    pattern: KOREAN_PHONE_REGEX,
    minLength: LENGTH_LIMITS.MIN_PHONE_LENGTH,
    maxLength: LENGTH_LIMITS.MAX_PHONE_LENGTH,
    message: VALIDATION_ERRORS.INVALID_PHONE,
  },

  // 비밀번호
  PASSWORD: {
    required: true,
    minLength: LENGTH_LIMITS.MIN_PASSWORD_LENGTH,
    maxLength: LENGTH_LIMITS.MAX_PASSWORD_LENGTH,
    pattern: PASSWORD_REGEX,
    message: VALIDATION_ERRORS.INVALID_PASSWORD,
  },

  // 이름
  NAME: {
    required: true,
    minLength: LENGTH_LIMITS.MIN_NAME_LENGTH,
    maxLength: LENGTH_LIMITS.MAX_NAME_LENGTH,
    pattern: KOREAN_REGEX,
    message: "한글로 입력해주세요.",
  },

  // 사업자등록번호
  BUSINESS_NUMBER: {
    required: false,
    pattern: BUSINESS_NUMBER_REGEX,
    message: VALIDATION_ERRORS.INVALID_BUSINESS_NUMBER,
  },

  // 주소
  ADDRESS: {
    required: true,
    minLength: LENGTH_LIMITS.MIN_ADDRESS_LENGTH,
    maxLength: LENGTH_LIMITS.MAX_ADDRESS_LENGTH,
    message: "주소를 입력해주세요.",
  },

  // 가격
  PRICE: {
    required: true,
    min: NUMBER_LIMITS.MIN_PRICE,
    max: NUMBER_LIMITS.MAX_PRICE,
    message: "올바른 가격을 입력해주세요.",
  },

  // 수량
  QUANTITY: {
    required: true,
    min: NUMBER_LIMITS.MIN_QUANTITY,
    max: NUMBER_LIMITS.MAX_QUANTITY,
    message: "올바른 수량을 입력해주세요.",
  },
} as const;
