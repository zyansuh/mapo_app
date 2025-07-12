// 문자열 유틸리티
export const formatString = (str: string): string => {
  return str.trim().toLowerCase();
};

// 날짜 유틸리티
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("ko-KR");
};

// 검증 유틸리티
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
  return phoneRegex.test(phone);
};

// 숫자 유틸리티
export const formatNumber = (num: number): string => {
  return num.toLocaleString("ko-KR");
};

// 디바운스 함수
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
