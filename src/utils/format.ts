import { DATE_FORMATS, CURRENCY } from "../constants/app";

// 날짜 포맷팅
export const formatDate = (
  date: Date | string | number,
  format: keyof typeof DATE_FORMATS = "DISPLAY"
): string => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const formatString = DATE_FORMATS[format];

  return formatString
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, month)
    .replace(/DD/g, day)
    .replace(/HH/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
};

// 상대적 시간 포맷팅 (예: "2시간 전", "3일 전")
export const formatRelativeTime = (date: Date | string | number): string => {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffWeek < 4) return `${diffWeek}주 전`;
  if (diffMonth < 12) return `${diffMonth}개월 전`;
  return `${diffYear}년 전`;
};

// 통화 포맷팅
export const formatCurrency = (
  amount: number,
  currencyCode: keyof typeof CURRENCY = "KRW",
  options?: {
    showSymbol?: boolean;
    compact?: boolean;
    decimals?: number;
  }
): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return "0";

  const currency = CURRENCY[currencyCode];
  const {
    showSymbol = true,
    compact = false,
    decimals = currency.decimals,
  } = options || {};

  let formattedAmount: string;

  if (compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1_000_000_000) {
      formattedAmount = (amount / 1_000_000_000).toFixed(1) + "억";
    } else if (Math.abs(amount) >= 10_000) {
      formattedAmount = (amount / 10_000).toFixed(1) + "만";
    } else if (Math.abs(amount) >= 1_000) {
      formattedAmount = (amount / 1_000).toFixed(1) + "K";
    } else {
      formattedAmount = amount.toLocaleString("ko-KR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }
  } else {
    formattedAmount = amount.toLocaleString("ko-KR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  return showSymbol ? `${currency.symbol}${formattedAmount}` : formattedAmount;
};

// 전화번호 포맷팅
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // 숫자만 추출
  const cleaned = phoneNumber.replace(/\D/g, "");

  // 휴대폰 번호 (010-0000-0000)
  if (cleaned.length === 11 && cleaned.startsWith("010")) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  // 일반 전화번호 (02-0000-0000, 031-000-0000)
  if (cleaned.length === 10) {
    if (cleaned.startsWith("02")) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    } else {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  // 그 외의 경우 원본 반환
  return phoneNumber;
};

// 사업자등록번호 포맷팅
export const formatBusinessNumber = (businessNumber: string): string => {
  if (!businessNumber) return "";

  const cleaned = businessNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
  }

  return businessNumber;
};

// 파일 크기 포맷팅
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// 백분율 포맷팅
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  if (isNaN(value)) return "0%";
  return `${(value * 100).toFixed(decimals)}%`;
};

// 텍스트 자르기
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = "..."
): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// 카멜케이스를 사람이 읽기 쉬운 텍스트로 변환
export const camelCaseToText = (text: string): string => {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// 이름 마스킹 (개인정보 보호)
export const maskName = (name: string): string => {
  if (!name || name.length < 2) return name;

  if (name.length === 2) {
    return name[0] + "*";
  }

  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
};

// 전화번호 마스킹
export const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  const formatted = formatPhoneNumber(phoneNumber);

  // 010-****-1234 형태로 마스킹
  return formatted.replace(/(\d{3})-(\d{4})-(\d{4})/, "$1-****-$3");
};

// 이메일 마스킹
export const maskEmail = (email: string): string => {
  if (!email || !email.includes("@")) return email;

  const [username, domain] = email.split("@");

  if (username.length <= 2) {
    return `${username[0]}*@${domain}`;
  }

  const maskedUsername =
    username[0] +
    "*".repeat(username.length - 2) +
    username[username.length - 1];
  return `${maskedUsername}@${domain}`;
};

// 주소 단축 표시
export const formatAddress = (
  address: string,
  maxLength: number = 30
): string => {
  if (!address) return "";

  // 도로명주소 패턴 감지
  const roadPattern = /(.+?)\s+(.+로|.+길)\s+(\d+)/;
  const match = address.match(roadPattern);

  if (match && address.length > maxLength) {
    const [, city, road, number] = match;
    return `${city} ${road} ${number}`;
  }

  return truncateText(address, maxLength);
};

// 숫자를 한글로 변환 (간단한 버전)
export const numberToKorean = (num: number): string => {
  const units = ["", "만", "억", "조"];
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];

  if (num === 0) return "영";

  let result = "";
  let unitIndex = 0;

  while (num > 0) {
    const chunk = num % 10000;
    if (chunk > 0) {
      result = convertChunk(chunk, digits) + units[unitIndex] + result;
    }
    num = Math.floor(num / 10000);
    unitIndex++;
  }

  return result;
};

// 숫자 청크를 한글로 변환하는 헬퍼 함수
const convertChunk = (num: number, digits: string[]): string => {
  const thousands = Math.floor(num / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const tens = Math.floor((num % 100) / 10);
  const ones = num % 10;

  let result = "";

  if (thousands > 0) result += digits[thousands] + "천";
  if (hundreds > 0) result += digits[hundreds] + "백";
  if (tens > 0) result += digits[tens] + "십";
  if (ones > 0) result += digits[ones];

  return result;
};

// 검색어 하이라이트
export const highlightSearchTerm = (
  text: string,
  searchTerm: string,
  highlightTag: string = "mark"
): string => {
  if (!searchTerm || !text) return text;

  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.replace(regex, `<${highlightTag}>$1</${highlightTag}>`);
};
