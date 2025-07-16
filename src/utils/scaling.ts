import { Dimensions } from "react-native";

// 가이드라인 기준 화면 크기 (iPhone 12 기준)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// 화면 크기에 따른 스케일 계산
const scaleHorizontal = screenWidth / guidelineBaseWidth;
const scaleVertical = screenHeight / guidelineBaseHeight;
const scaleModerate = (scaleHorizontal + scaleVertical) / 2;

/**
 * 가로 기준 스케일링
 * @param size 기준 크기
 * @returns 스케일된 크기
 */
export const scale = (size: number): number => {
  return Math.round(size * scaleHorizontal * 100) / 100;
};

/**
 * 세로 기준 스케일링
 * @param size 기준 크기
 * @returns 스케일된 크기
 */
export const verticalScale = (size: number): number => {
  return Math.round(size * scaleVertical * 100) / 100;
};

/**
 * 적당한 스케일링 (가로+세로 평균)
 * @param size 기준 크기
 * @param factor 스케일 팩터 (기본값 0.5)
 * @returns 스케일된 크기
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return Math.round((size + (scale(size) - size) * factor) * 100) / 100;
};

/**
 * 텍스트 크기 스케일링
 * @param size 기준 텍스트 크기
 * @returns 스케일된 텍스트 크기
 */
export const textScale = (size: number): number => {
  return moderateScale(size, 0.3);
};

/**
 * 아이콘 크기 스케일링
 * @param size 기준 아이콘 크기
 * @returns 스케일된 아이콘 크기
 */
export const iconScale = (size: number): number => {
  return moderateScale(size, 0.4);
};

/**
 * 패딩/마진 스케일링
 * @param size 기준 패딩/마진 크기
 * @returns 스케일된 크기
 */
export const spacingScale = (size: number): number => {
  return scale(size);
};

// 자주 사용하는 스케일된 값들
export const scaledSizes = {
  // 텍스트 크기
  text: {
    tiny: textScale(10),
    small: textScale(12),
    normal: textScale(14),
    medium: textScale(16),
    large: textScale(18),
    xlarge: textScale(20),
    xxlarge: textScale(24),
    huge: textScale(32),
  },

  // 아이콘 크기
  icon: {
    tiny: iconScale(12),
    small: iconScale(16),
    normal: iconScale(20),
    medium: iconScale(24),
    large: iconScale(32),
    xlarge: iconScale(40),
    xxlarge: iconScale(48),
  },

  // 간격
  spacing: {
    tiny: spacingScale(4),
    small: spacingScale(8),
    normal: spacingScale(12),
    medium: spacingScale(16),
    large: spacingScale(20),
    xlarge: spacingScale(24),
    xxlarge: spacingScale(32),
    huge: spacingScale(40),
  },

  // 버튼 높이
  button: {
    small: verticalScale(32),
    normal: verticalScale(40),
    medium: verticalScale(48),
    large: verticalScale(56),
  },

  // 입력 필드 높이
  input: {
    small: verticalScale(36),
    normal: verticalScale(44),
    large: verticalScale(52),
  },

  // 보더 반지름
  radius: {
    small: scale(4),
    normal: scale(8),
    medium: scale(12),
    large: scale(16),
    xlarge: scale(20),
    round: scale(50),
  },

  // 보더 두께
  border: {
    thin: scale(0.5),
    normal: scale(1),
    thick: scale(2),
  },
};

// 화면 크기 정보
export const screenInfo = {
  width: screenWidth,
  height: screenHeight,
  isSmallScreen: screenWidth < 350,
  isMediumScreen: screenWidth >= 350 && screenWidth < 414,
  isLargeScreen: screenWidth >= 414,
  isTablet: screenWidth >= 768,
  aspectRatio: screenWidth / screenHeight,
  scale: scaleHorizontal,
  verticalScale: scaleVertical,
  moderateScale: scaleModerate,
};

// 디바이스별 스케일 조정
export const deviceScale = {
  // 아주 작은 화면 (iPhone SE 등)
  small: screenWidth < 350 ? 0.9 : 1,
  // 중간 화면 (iPhone 8, X 등)
  medium: screenWidth >= 350 && screenWidth < 414 ? 1 : 1,
  // 큰 화면 (iPhone Plus, Pro Max 등)
  large: screenWidth >= 414 ? 1.1 : 1,
  // 태블릿
  tablet: screenWidth >= 768 ? 1.2 : 1,
};

/**
 * 100을 기준으로 한 스케일링 (요청사항)
 * @param size 기준 크기
 * @returns 100 기준으로 스케일된 크기
 */
export const scale100 = (size: number): number => {
  return scale(size);
};

// 디버그용 함수
export const getScaleInfo = () => {
  return {
    screenWidth,
    screenHeight,
    guidelineBaseWidth,
    guidelineBaseHeight,
    scaleHorizontal,
    scaleVertical,
    scaleModerate,
    scaledSizes,
    screenInfo,
  };
};
