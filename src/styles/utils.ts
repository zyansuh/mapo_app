// 스타일 유틸리티 함수들

import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { typography } from "./typography";

// 스타일 타입 정의
export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleSheet = { [key: string]: Style };

// 스타일 조합 함수
export const combineStyles = (
  ...styles: (Style | Style[] | undefined | null)[]
): Style => {
  return styles.reduce((acc, style) => {
    if (!style) return acc;
    if (Array.isArray(style)) {
      return { ...acc, ...combineStyles(...style) };
    }
    return { ...acc, ...style };
  }, {} as Style);
};

// 조건부 스타일 적용
export const conditionalStyle = (
  condition: boolean,
  trueStyle: Style,
  falseStyle?: Style
): Style => {
  return condition ? trueStyle : falseStyle || {};
};

// 반응형 스타일 (화면 크기별)
export const responsiveStyle = (breakpoints: {
  small?: Style;
  medium?: Style;
  large?: Style;
}) => {
  // 실제 구현에서는 Dimensions API를 사용하여 화면 크기에 따라 스타일 적용
  return breakpoints.medium || breakpoints.small || {};
};

// 그림자 스타일 생성
export const createShadow = (
  elevation: number = 2,
  color: string = colors.gray[900],
  opacity: number = 0.1
): ViewStyle => {
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: elevation,
    },
    shadowOpacity: opacity,
    shadowRadius: elevation * 2,
    elevation: elevation,
  };
};

// 보더 스타일 생성
export const createBorder = (
  width: number = 1,
  color: string = colors.gray[300],
  style: "solid" | "dashed" | "dotted" = "solid"
): ViewStyle => {
  return {
    borderWidth: width,
    borderColor: color,
    borderStyle: style,
  };
};

// 보더 반지름 스타일 생성
export const createBorderRadius = (
  radius: number = 8,
  topLeft?: number,
  topRight?: number,
  bottomLeft?: number,
  bottomRight?: number
): ViewStyle => {
  if (
    topLeft !== undefined ||
    topRight !== undefined ||
    bottomLeft !== undefined ||
    bottomRight !== undefined
  ) {
    return {
      borderTopLeftRadius: topLeft ?? radius,
      borderTopRightRadius: topRight ?? radius,
      borderBottomLeftRadius: bottomLeft ?? radius,
      borderBottomRightRadius: bottomRight ?? radius,
    };
  }
  return { borderRadius: radius };
};

// 그라데이션 스타일 생성 (실제 구현에서는 react-native-linear-gradient 사용)
export const createGradient = (
  colors: string[],
  direction: "vertical" | "horizontal" = "vertical"
): ViewStyle => {
  // 실제 구현에서는 LinearGradient 컴포넌트 사용
  return {
    backgroundColor: colors[0], // fallback
  };
};

// 플렉스 스타일 생성
export const createFlex = (
  direction: "row" | "column" = "column",
  justify:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly" = "flex-start",
  align:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "baseline" = "stretch",
  wrap: "nowrap" | "wrap" | "wrap-reverse" = "nowrap"
): ViewStyle => {
  return {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
  };
};

// 위치 스타일 생성
export const createPosition = (
  position: "absolute" | "relative" = "relative",
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => {
  return {
    position,
    top,
    right,
    bottom,
    left,
  };
};

// 크기 스타일 생성
export const createSize = (
  width?: number | string,
  height?: number | string
): ViewStyle => {
  return {
    width,
    height,
  };
};

// 텍스트 스타일 생성
export const createTextStyle = (
  size: keyof typeof typography = "body1",
  color: string = colors.gray[900],
  weight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900",
  align?: "left" | "center" | "right" | "justify"
): TextStyle => {
  return {
    ...typography[size],
    color,
    fontWeight: weight,
    textAlign: align,
  };
};

// 색상 유틸리티
export const colorUtils = {
  // 투명도 적용
  withOpacity: (color: string, opacity: number): string => {
    // 실제 구현에서는 color 라이브러리 사용
    return color;
  },

  // 색상 밝기 조정
  lighten: (color: string, amount: number): string => {
    // 실제 구현에서는 color 라이브러리 사용
    return color;
  },

  // 색상 어둡게 조정
  darken: (color: string, amount: number): string => {
    // 실제 구현에서는 color 라이브러리 사용
    return color;
  },

  // 색상 대비 확인
  getContrastColor: (backgroundColor: string): string => {
    // 실제 구현에서는 색상 대비 계산
    return colors.gray[900];
  },
};

// 애니메이션 유틸리티
export const animationUtils = {
  // 페이드 인
  fadeIn: {
    opacity: 1,
  },

  // 페이드 아웃
  fadeOut: {
    opacity: 0,
  },

  // 슬라이드 인 (위에서)
  slideInFromTop: {
    transform: [{ translateY: 0 }],
  },

  // 슬라이드 아웃 (위로)
  slideOutToTop: {
    transform: [{ translateY: -100 }],
  },

  // 슬라이드 인 (아래에서)
  slideInFromBottom: {
    transform: [{ translateY: 0 }],
  },

  // 슬라이드 아웃 (아래로)
  slideOutToBottom: {
    transform: [{ translateY: 100 }],
  },

  // 스케일 인
  scaleIn: {
    transform: [{ scale: 1 }],
  },

  // 스케일 아웃
  scaleOut: {
    transform: [{ scale: 0 }],
  },
};

// 레이아웃 유틸리티
export const layoutUtils = {
  // 중앙 정렬
  center: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },

  // 수직 중앙 정렬
  centerVertical: {
    justifyContent: "center" as const,
  },

  // 수평 중앙 정렬
  centerHorizontal: {
    alignItems: "center" as const,
  },

  // 공간 분배
  spaceBetween: {
    justifyContent: "space-between" as const,
  },

  // 공간 균등 분배
  spaceAround: {
    justifyContent: "space-around" as const,
  },

  // 공간 균등 분배 (양 끝 포함)
  spaceEvenly: {
    justifyContent: "space-evenly" as const,
  },

  // 시작 정렬
  alignStart: {
    alignItems: "flex-start" as const,
  },

  // 끝 정렬
  alignEnd: {
    alignItems: "flex-end" as const,
  },

  // 늘리기
  alignStretch: {
    alignItems: "stretch" as const,
  },
};

// 반응형 브레이크포인트
export const breakpoints = {
  small: 480,
  medium: 768,
  large: 1024,
  xlarge: 1280,
} as const;

// 미디어 쿼리 유틸리티
export const mediaQuery = {
  small: `@media (max-width: ${breakpoints.small}px)`,
  medium: `@media (min-width: ${breakpoints.medium}px)`,
  large: `@media (min-width: ${breakpoints.large}px)`,
  xlarge: `@media (min-width: ${breakpoints.xlarge}px)`,
} as const;

// 스타일 프리셋
export const stylePresets = {
  // 카드 스타일
  card: combineStyles(createBorderRadius(12), createShadow(2), {
    backgroundColor: colors.white,
  }),

  // 버튼 스타일
  button: combineStyles(
    createBorderRadius(8),
    createFlex("row", "center", "center"),
    { paddingHorizontal: spacing[4], paddingVertical: spacing[3] }
  ),

  // 입력 필드 스타일
  input: combineStyles(
    createBorder(1, colors.gray[300]),
    createBorderRadius(8),
    { paddingHorizontal: spacing[3], paddingVertical: spacing[2] }
  ),

  // 모달 스타일
  modal: combineStyles(createBorderRadius(16), createShadow(8), {
    backgroundColor: colors.white,
    margin: spacing[4],
  }),

  // 리스트 아이템 스타일
  listItem: combineStyles(createFlex("row", "space-between", "center"), {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  }),
} as const;
