// 유효성 검사 유틸리티 함수들

// 이메일 유효성 검사
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 전화번호 유효성 검사
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\-\+\(\)\s]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

// 한국 전화번호 유효성 검사
export const isValidKoreanPhone = (phone: string): boolean => {
  const koreanPhoneRegex = /^(\+82|0)[1-9]\d{1,2}\d{3,4}\d{4}$/;
  return koreanPhoneRegex.test(phone.replace(/\s/g, ""));
};

// 사업자등록번호 유효성 검사
export const isValidBusinessNumber = (businessNumber: string): boolean => {
  const cleanNumber = businessNumber.replace(/\D/g, "");
  if (cleanNumber.length !== 10) return false;

  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanNumber[i]) * weights[i];
  }

  sum += Math.floor((parseInt(cleanNumber[8]) * 5) / 10);
  const remainder = sum % 10;
  const checkDigit = remainder === 0 ? 0 : 10 - remainder;

  return checkDigit === parseInt(cleanNumber[9]);
};

// 주민등록번호 유효성 검사
export const isValidResidentNumber = (residentNumber: string): boolean => {
  const cleanNumber = residentNumber.replace(/\D/g, "");
  if (cleanNumber.length !== 13) return false;

  const weights1 = [2, 3, 4, 5, 6, 7];
  const weights2 = [8, 9, 2, 3, 4, 5];

  let sum = 0;
  for (let i = 0; i < 6; i++) {
    sum += parseInt(cleanNumber[i]) * weights1[i];
  }

  for (let i = 6; i < 12; i++) {
    sum += parseInt(cleanNumber[i]) * weights2[i - 6];
  }

  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;

  return checkDigit === parseInt(cleanNumber[12]);
};

// URL 유효성 검사
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// IP 주소 유효성 검사
export const isValidIP = (ip: string): boolean => {
  const ipRegex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

// 비밀번호 강도 검사
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    feedback.push("최소 8자 이상이어야 합니다");
  }

  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push("소문자를 포함해야 합니다");
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push("대문자를 포함해야 합니다");
  }

  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push("숫자를 포함해야 합니다");
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push("특수문자를 포함하면 더 안전합니다");
  }

  return {
    score,
    feedback,
    isValid: score >= 3,
  };
};

// 숫자 범위 검사
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// 문자열 길이 검사
export const isValidLength = (
  str: string,
  min: number,
  max: number
): boolean => {
  return str.length >= min && str.length <= max;
};

// 날짜 유효성 검사
export const isValidDate = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// 미래 날짜 검사
export const isFutureDate = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj > new Date();
};

// 과거 날짜 검사
export const isPastDate = (date: string | Date): boolean => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

// 파일 크기 검사
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// 파일 타입 검사
export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type);
};

// 이미지 파일 검사
export const isValidImageFile = (file: File): boolean => {
  const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return isValidFileType(file, imageTypes);
};

// JSON 문자열 검사
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

// 숫자 문자열 검사
export const isNumeric = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
};

// 정수 검사
export const isInteger = (value: any): boolean => {
  return Number.isInteger(value);
};

// 양수 검사
export const isPositive = (value: number): boolean => {
  return value > 0;
};

// 음수 검사
export const isNegative = (value: number): boolean => {
  return value < 0;
};

// 0 검사
export const isZero = (value: number): boolean => {
  return value === 0;
};

// 배열 검사
export const isArray = (value: any): value is any[] => {
  return Array.isArray(value);
};

// 빈 배열 검사
export const isEmptyArray = (arr: any[]): boolean => {
  return arr.length === 0;
};

// 객체 검사
export const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

// 빈 객체 검사
export const isEmptyObject = (obj: any): boolean => {
  return isObject(obj) && Object.keys(obj).length === 0;
};

// 함수 검사
export const isFunction = (value: any): value is Function => {
  return typeof value === "function";
};

// Promise 검사
export const isPromise = (value: any): value is Promise<any> => {
  return value && typeof value.then === "function";
};

// 정규식 검사
export const matchesPattern = (str: string, pattern: RegExp): boolean => {
  return pattern.test(str);
};

// 한국어 검사
export const isKorean = (str: string): boolean => {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(str);
};

// 영어 검사
export const isEnglish = (str: string): boolean => {
  const englishRegex = /[a-zA-Z]/;
  return englishRegex.test(str);
};

// 숫자만 검사
export const isDigitsOnly = (str: string): boolean => {
  return /^\d+$/.test(str);
};

// 알파벳만 검사
export const isAlphaOnly = (str: string): boolean => {
  return /^[a-zA-Z]+$/.test(str);
};

// 알파벳과 숫자만 검사
export const isAlphaNumeric = (str: string): boolean => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

// 공백 검사
export const hasWhitespace = (str: string): boolean => {
  return /\s/.test(str);
};

// 특수문자 검사
export const hasSpecialChars = (str: string): boolean => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(str);
};

// 복합 유효성 검사
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

export const validate = (
  value: any,
  rules: ValidationRule[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(rule.message || "필수 입력 항목입니다.");
      continue;
    }

    if (value === undefined || value === null || value === "") {
      continue; // 비어있는 값은 required가 아닌 경우 스킵
    }

    if (
      rule.minLength &&
      typeof value === "string" &&
      value.length < rule.minLength
    ) {
      errors.push(
        rule.message || `최소 ${rule.minLength}자 이상 입력해주세요.`
      );
    }

    if (
      rule.maxLength &&
      typeof value === "string" &&
      value.length > rule.maxLength
    ) {
      errors.push(
        rule.message || `최대 ${rule.maxLength}자까지 입력 가능합니다.`
      );
    }

    if (
      rule.min !== undefined &&
      typeof value === "number" &&
      value < rule.min
    ) {
      errors.push(rule.message || `최소값은 ${rule.min}입니다.`);
    }

    if (
      rule.max !== undefined &&
      typeof value === "number" &&
      value > rule.max
    ) {
      errors.push(rule.message || `최대값은 ${rule.max}입니다.`);
    }

    if (
      rule.pattern &&
      typeof value === "string" &&
      !rule.pattern.test(value)
    ) {
      errors.push(rule.message || "올바른 형식이 아닙니다.");
    }

    if (rule.custom) {
      const result = rule.custom(value);
      if (result !== true) {
        errors.push(
          typeof result === "string"
            ? result
            : rule.message || "유효하지 않은 값입니다."
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
