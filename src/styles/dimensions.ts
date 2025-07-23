import {
  scale,
  verticalScale,
  moderateScale,
  scaledSizes,
  screenInfo,
} from "../utils/scaling";

// 레이아웃 차원
export const DIMENSIONS = {
  // 화면 관련
  screen: {
    width: screenInfo.width,
    height: screenInfo.height,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },

  // 헤더
  header: {
    height: verticalScale(56),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },

  // 네비게이션
  navigation: {
    height: verticalScale(60),
    tabHeight: verticalScale(49),
  },

  // 카드
  card: {
    borderRadius: scale(12),
    padding: scale(16),
    margin: scale(8),
    minHeight: verticalScale(80),
  },

  // 리스트 아이템
  listItem: {
    height: verticalScale(60),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
  },

  // 버튼
  button: {
    height: {
      small: verticalScale(36),
      medium: verticalScale(44),
      large: verticalScale(52),
    },
    borderRadius: scale(8),
    paddingHorizontal: scale(16),
  },

  // 입력 필드
  input: {
    height: verticalScale(44),
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
    borderWidth: scale(1),
  },

  // 모달
  modal: {
    borderRadius: scale(16),
    padding: scale(20),
    maxHeight: screenInfo.height * 0.8,
  },

  // 아이콘
  icon: {
    tiny: scale(12),
    small: scale(16),
    medium: scale(20),
    large: scale(24),
    xlarge: scale(32),
  },

  // 이미지
  image: {
    thumbnail: scale(60),
    small: scale(80),
    medium: scale(120),
    large: scale(200),
  },

  // 폼 요소
  form: {
    fieldSpacing: verticalScale(16),
    sectionSpacing: verticalScale(24),
    labelSpacing: verticalScale(8),
  },

  // 테이블
  table: {
    rowHeight: verticalScale(48),
    headerHeight: verticalScale(40),
    cellPadding: scale(12),
  },
} as const;

// 반응형 차원
export const RESPONSIVE_DIMENSIONS = {
  // 화면 크기에 따른 조건부 값
  screenPadding: screenInfo.isSmallScreen ? scale(12) : scale(16),
  cardPadding: screenInfo.isSmallScreen ? scale(12) : scale(16),
  sectionSpacing: screenInfo.isSmallScreen
    ? verticalScale(16)
    : verticalScale(24),

  // 태블릿용 크기
  tablet: {
    cardWidth: scale(400),
    maxContentWidth: scale(800),
    sidebarWidth: scale(280),
  },
} as const;

// 그리드 시스템
export const GRID = {
  // 컬럼 시스템
  columns: 12,
  gutterWidth: scale(16),
  marginWidth: scale(16),

  // 브레이크포인트
  breakpoints: {
    small: 0,
    medium: 350,
    large: 414,
    tablet: 768,
  },

  // 컨테이너 최대 너비
  containerMaxWidth: {
    small: "100%",
    medium: scale(400),
    large: scale(500),
    tablet: scale(800),
  },
} as const;

// 애니메이션 차원
export const ANIMATION_DIMENSIONS = {
  // 이동 거리
  slideDistance: scale(300),
  dropdownMaxHeight: verticalScale(200),

  // 스케일
  scaleUp: 1.05,
  scaleDown: 0.95,

  // 회전
  rotation: 180,
} as const;

export default DIMENSIONS;
