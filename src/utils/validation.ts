import { REGEX_PATTERNS } from "../constants/app";

// 검증 결과 타입
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// 기본 검증 함수들
export const validators = {
  // 필수 입력 검증
  required: (value: any, fieldName: string = "필드"): ValidationResult => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);

    return {
      isValid: !isEmpty,
      error: isEmpty ? `${fieldName}은(는) 필수 입력 항목입니다.` : undefined,
    };
  },

  // 이메일 검증
  email: (value: string): ValidationResult => {
    if (!value) return { isValid: true }; // 선택적 필드인 경우

    const isValid = REGEX_PATTERNS.EMAIL.test(value);
    return {
      isValid,
      error: isValid ? undefined : "올바른 이메일 주소를 입력해주세요.",
    };
  },

  // 전화번호 검증
  phone: (value: string): ValidationResult => {
    if (!value) return { isValid: true }; // 선택적 필드인 경우

    // 하이픈, 공백 제거 후 검증
    const cleanValue = value.replace(/[\s-]/g, "");
    const isValid = REGEX_PATTERNS.PHONE.test(cleanValue);

    return {
      isValid,
      error: isValid
        ? undefined
        : "올바른 전화번호를 입력해주세요. (예: 010-1234-5678)",
    };
  },

  // 사업자등록번호 검증
  businessNumber: (value: string): ValidationResult => {
    if (!value) return { isValid: true }; // 선택적 필드인 경우

    const isValid = REGEX_PATTERNS.BUSINESS_NUMBER.test(value);
    return {
      isValid,
      error: isValid
        ? undefined
        : "올바른 사업자등록번호를 입력해주세요. (예: 123-45-67890)",
    };
  },

  // 숫자 검증
  number: (
    value: string | number,
    options?: {
      min?: number;
      max?: number;
      integer?: boolean;
    }
  ): ValidationResult => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: "올바른 숫자를 입력해주세요.",
      };
    }

    if (options?.integer && !Number.isInteger(numValue)) {
      return {
        isValid: false,
        error: "정수를 입력해주세요.",
      };
    }

    if (options?.min !== undefined && numValue < options.min) {
      return {
        isValid: false,
        error: `${options.min} 이상의 값을 입력해주세요.`,
      };
    }

    if (options?.max !== undefined && numValue > options.max) {
      return {
        isValid: false,
        error: `${options.max} 이하의 값을 입력해주세요.`,
      };
    }

    return { isValid: true };
  },

  // 문자열 길이 검증
  length: (
    value: string,
    options: {
      min?: number;
      max?: number;
    }
  ): ValidationResult => {
    const length = value ? value.length : 0;

    if (options.min !== undefined && length < options.min) {
      return {
        isValid: false,
        error: `최소 ${options.min}자 이상 입력해주세요.`,
      };
    }

    if (options.max !== undefined && length > options.max) {
      return {
        isValid: false,
        error: `최대 ${options.max}자까지 입력 가능합니다.`,
      };
    }

    return { isValid: true };
  },

  // 날짜 검증
  date: (
    value: string | Date,
    options?: {
      future?: boolean;
      past?: boolean;
      minDate?: Date;
      maxDate?: Date;
    }
  ): ValidationResult => {
    let date: Date;

    if (typeof value === "string") {
      date = new Date(value);
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: "올바른 날짜를 입력해주세요.",
      };
    }

    const now = new Date();

    if (options?.future && date <= now) {
      return {
        isValid: false,
        error: "미래 날짜를 입력해주세요.",
      };
    }

    if (options?.past && date >= now) {
      return {
        isValid: false,
        error: "과거 날짜를 입력해주세요.",
      };
    }

    if (options?.minDate && date < options.minDate) {
      return {
        isValid: false,
        error: `${options.minDate.toLocaleDateString()} 이후 날짜를 입력해주세요.`,
      };
    }

    if (options?.maxDate && date > options.maxDate) {
      return {
        isValid: false,
        error: `${options.maxDate.toLocaleDateString()} 이전 날짜를 입력해주세요.`,
      };
    }

    return { isValid: true };
  },

  // URL 검증
  url: (value: string): ValidationResult => {
    if (!value) return { isValid: true }; // 선택적 필드인 경우

    try {
      new URL(value);
      return { isValid: true };
    } catch {
      return {
        isValid: false,
        error: "올바른 URL을 입력해주세요.",
      };
    }
  },
};

// 복합 검증 함수
export const validateField = (
  value: any,
  rules: Array<(value: any) => ValidationResult>
): ValidationResult => {
  for (const rule of rules) {
    const result = rule(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};

// 객체 전체 검증
export const validateObject = <T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, Array<(value: any) => ValidationResult>>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [key, rules] of Object.entries(schema) as Array<[keyof T, any]>) {
    const result = validateField(obj[key], rules);
    if (!result.isValid) {
      errors[key] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};

// 회사 데이터 검증 스키마
export const companyValidationSchema = {
  name: [
    (value: string) => validators.required(value, "회사명"),
    (value: string) => validators.length(value, { min: 1, max: 100 }),
  ],
  type: [(value: string) => validators.required(value, "업체 구분")],
  region: [(value: string) => validators.required(value, "지역")],
  address: [
    (value: string) => validators.required(value, "주소"),
    (value: string) => validators.length(value, { max: 200 }),
  ],
  phoneNumber: [(value: string) => validators.phone(value)],
  email: [(value: string) => validators.email(value)],
  businessNumber: [(value: string) => validators.businessNumber(value)],
  contactPerson: [(value: string) => validators.length(value, { max: 50 })],
};

// 상품 데이터 검증 스키마
export const productValidationSchema = {
  name: [
    (value: string) => validators.required(value, "상품명"),
    (value: string) => validators.length(value, { min: 1, max: 100 }),
  ],
  category: [(value: string) => validators.required(value, "카테고리")],
  price: [
    (value: number) => validators.required(value, "가격"),
    (value: number) => validators.number(value, { min: 0 }),
  ],
  unit: [
    (value: string) => validators.required(value, "단위"),
    (value: string) => validators.length(value, { max: 20 }),
  ],
};

// 폼 검증 헬퍼 함수
export const createFormValidator = <T extends Record<string, any>>(
  schema: Record<keyof T, Array<(value: any) => ValidationResult>>
) => {
  return (data: T) => validateObject(data, schema);
};
