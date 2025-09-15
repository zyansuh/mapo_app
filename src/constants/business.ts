// 비즈니스 관련 상수들

// 회사 타입
export const COMPANY_TYPES = [
  { value: "공급업체", label: "공급업체" },
  { value: "고객", label: "고객" },
  { value: "파트너", label: "파트너" },
  { value: "기타", label: "기타" },
] as const;

// 지역
export const REGIONS = [
  { value: "서울", label: "서울" },
  { value: "부산", label: "부산" },
  { value: "대구", label: "대구" },
  { value: "인천", label: "인천" },
  { value: "광주", label: "광주" },
  { value: "대전", label: "대전" },
  { value: "울산", label: "울산" },
  { value: "세종", label: "세종" },
  { value: "경기", label: "경기" },
  { value: "강원", label: "강원" },
  { value: "충북", label: "충북" },
  { value: "충남", label: "충남" },
  { value: "전북", label: "전북" },
  { value: "전남", label: "전남" },
  { value: "경북", label: "경북" },
  { value: "경남", label: "경남" },
  { value: "제주", label: "제주" },
] as const;

// 회사 상태
export const COMPANY_STATUS = [
  { value: "활성", label: "활성" },
  { value: "비활성", label: "비활성" },
  { value: "보류", label: "보류" },
  { value: "종료", label: "종료" },
] as const;

// 배송 상태
export const DELIVERY_STATUS = [
  { value: "준비중", label: "준비중" },
  { value: "배송중", label: "배송중" },
  { value: "배송완료", label: "배송완료" },
  { value: "배송취소", label: "배송취소" },
  { value: "배송지연", label: "배송지연" },
] as const;

// 계산서 상태
export const INVOICE_STATUS = [
  { value: "발행", label: "발행" },
  { value: "발송", label: "발송" },
  { value: "확인", label: "확인" },
  { value: "승인", label: "승인" },
  { value: "거부", label: "거부" },
  { value: "지급완료", label: "지급완료" },
  { value: "지급지연", label: "지급지연" },
] as const;

// 세금 타입
export const TAX_TYPES = [
  { value: "과세", label: "과세" },
  { value: "면세", label: "면세" },
  { value: "영세", label: "영세" },
] as const;

// 결제 방법
export const PAYMENT_METHODS = [
  { value: "현금", label: "현금" },
  { value: "계좌이체", label: "계좌이체" },
  { value: "카드", label: "카드" },
  { value: "어음", label: "어음" },
  { value: "외상", label: "외상" },
  { value: "기타", label: "기타" },
] as const;

// 결제 상태
export const PAYMENT_STATUS = [
  { value: "미결제", label: "미결제" },
  { value: "부분결제", label: "부분결제" },
  { value: "완료", label: "완료" },
  { value: "연체", label: "연체" },
  { value: "취소", label: "취소" },
] as const;

// 상품 카테고리
export const PRODUCT_CATEGORIES = [
  { value: "두부", label: "두부" },
  { value: "콩나물", label: "콩나물" },
  { value: "계란", label: "계란" },
  { value: "우유", label: "우유" },
  { value: "치즈", label: "치즈" },
  { value: "요거트", label: "요거트" },
  { value: "버터", label: "버터" },
  { value: "기타", label: "기타" },
] as const;

// 단위
export const UNITS = [
  { value: "개", label: "개" },
  { value: "박스", label: "박스" },
  { value: "팩", label: "팩" },
  { value: "kg", label: "kg" },
  { value: "g", label: "g" },
  { value: "L", label: "L" },
  { value: "ml", label: "ml" },
  { value: "m", label: "m" },
  { value: "cm", label: "cm" },
  { value: "mm", label: "mm" },
] as const;

// 우선순위
export const PRIORITIES = [
  { value: "낮음", label: "낮음", color: "#10B981" },
  { value: "보통", label: "보통", color: "#F59E0B" },
  { value: "높음", label: "높음", color: "#EF4444" },
  { value: "긴급", label: "긴급", color: "#DC2626" },
] as const;

// 알림 타입
export const NOTIFICATION_TYPES = [
  { value: "info", label: "정보", color: "#3B82F6" },
  { value: "success", label: "성공", color: "#10B981" },
  { value: "warning", label: "경고", color: "#F59E0B" },
  { value: "error", label: "오류", color: "#EF4444" },
] as const;

// 사용자 역할
export const USER_ROLES = [
  { value: "user", label: "사용자" },
  { value: "admin", label: "관리자" },
  { value: "manager", label: "매니저" },
  { value: "viewer", label: "조회자" },
] as const;

// 사용자 상태
export const USER_STATUS = [
  { value: "active", label: "활성" },
  { value: "inactive", label: "비활성" },
  { value: "pending", label: "대기" },
  { value: "suspended", label: "정지" },
] as const;

// 정렬 옵션
export const SORT_OPTIONS = [
  { value: "createdAt", label: "생성일" },
  { value: "updatedAt", label: "수정일" },
  { value: "name", label: "이름" },
  { value: "type", label: "타입" },
  { value: "status", label: "상태" },
  { value: "priority", label: "우선순위" },
] as const;

// 정렬 순서
export const SORT_ORDERS = [
  { value: "asc", label: "오름차순" },
  { value: "desc", label: "내림차순" },
] as const;

// 페이지 크기 옵션
export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: "10개씩" },
  { value: 20, label: "20개씩" },
  { value: 50, label: "50개씩" },
  { value: 100, label: "100개씩" },
] as const;

// 날짜 범위 옵션
export const DATE_RANGE_OPTIONS = [
  { value: "today", label: "오늘" },
  { value: "yesterday", label: "어제" },
  { value: "thisWeek", label: "이번 주" },
  { value: "lastWeek", label: "지난 주" },
  { value: "thisMonth", label: "이번 달" },
  { value: "lastMonth", label: "지난 달" },
  { value: "thisYear", label: "올해" },
  { value: "lastYear", label: "작년" },
  { value: "custom", label: "사용자 정의" },
] as const;

// 통계 기간
export const STATS_PERIODS = [
  { value: "day", label: "일별" },
  { value: "week", label: "주별" },
  { value: "month", label: "월별" },
  { value: "quarter", label: "분기별" },
  { value: "year", label: "연별" },
] as const;

// 차트 타입
export const CHART_TYPES = [
  { value: "line", label: "선 그래프" },
  { value: "bar", label: "막대 그래프" },
  { value: "pie", label: "원형 그래프" },
  { value: "doughnut", label: "도넛 그래프" },
  { value: "area", label: "영역 그래프" },
  { value: "scatter", label: "산점도" },
] as const;

// 테마 옵션
export const THEME_OPTIONS = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "auto", label: "자동" },
] as const;

// 언어 옵션
export const LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "English" },
] as const;

// 시간대 옵션
export const TIMEZONE_OPTIONS = [
  { value: "Asia/Seoul", label: "한국 표준시 (KST)" },
  { value: "UTC", label: "협정 세계시 (UTC)" },
  { value: "America/New_York", label: "미국 동부 시간 (EST)" },
  { value: "Europe/London", label: "영국 시간 (GMT)" },
  { value: "Asia/Tokyo", label: "일본 표준시 (JST)" },
] as const;

// 통화 옵션
export const CURRENCY_OPTIONS = [
  { value: "KRW", label: "원 (₩)" },
  { value: "USD", label: "달러 ($)" },
  { value: "EUR", label: "유로 (€)" },
  { value: "JPY", label: "엔 (¥)" },
  { value: "CNY", label: "위안 (¥)" },
] as const;

// 숫자 형식 옵션
export const NUMBER_FORMAT_OPTIONS = [
  { value: "comma", label: "쉼표 구분 (1,000)" },
  { value: "space", label: "공백 구분 (1 000)" },
  { value: "none", label: "구분자 없음 (1000)" },
] as const;

// 날짜 형식 옵션
export const DATE_FORMAT_OPTIONS = [
  { value: "YYYY-MM-DD", label: "2024-01-01" },
  { value: "MM/DD/YYYY", label: "01/01/2024" },
  { value: "DD/MM/YYYY", label: "01/01/2024" },
  { value: "YYYY년 MM월 DD일", label: "2024년 01월 01일" },
] as const;

// 시간 형식 옵션
export const TIME_FORMAT_OPTIONS = [
  { value: "24", label: "24시간 형식 (14:30)" },
  { value: "12", label: "12시간 형식 (2:30 PM)" },
] as const;

// 백업 주기
export const BACKUP_FREQUENCIES = [
  { value: "daily", label: "매일" },
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
  { value: "manual", label: "수동" },
] as const;

// 동기화 주기
export const SYNC_FREQUENCIES = [
  { value: 30000, label: "30초" },
  { value: 60000, label: "1분" },
  { value: 300000, label: "5분" },
  { value: 600000, label: "10분" },
  { value: 1800000, label: "30분" },
  { value: 3600000, label: "1시간" },
] as const;

// 알림 주기
export const NOTIFICATION_FREQUENCIES = [
  { value: "immediate", label: "즉시" },
  { value: "daily", label: "매일" },
  { value: "weekly", label: "매주" },
  { value: "monthly", label: "매월" },
  { value: "never", label: "알림 안함" },
] as const;

// 데이터 보존 기간
export const DATA_RETENTION_PERIODS = [
  { value: 30, label: "30일" },
  { value: 90, label: "90일" },
  { value: 180, label: "180일" },
  { value: 365, label: "1년" },
  { value: 730, label: "2년" },
  { value: 1095, label: "3년" },
  { value: -1, label: "영구 보존" },
] as const;
