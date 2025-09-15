// 간격 및 레이아웃 스타일 정의

import { ViewStyle } from "react-native";

// 기본 간격 단위 (8px 기준)
export const spacing = {
  0: 0,
  1: 4, // 0.25rem
  2: 8, // 0.5rem
  3: 12, // 0.75rem
  4: 16, // 1rem
  5: 20, // 1.25rem
  6: 24, // 1.5rem
  7: 28, // 1.75rem
  8: 32, // 2rem
  9: 36, // 2.25rem
  10: 40, // 2.5rem
  11: 44, // 2.75rem
  12: 48, // 3rem
  14: 56, // 3.5rem
  16: 64, // 4rem
  20: 80, // 5rem
  24: 96, // 6rem
  28: 112, // 7rem
  32: 128, // 8rem
  36: 144, // 9rem
  40: 160, // 10rem
  44: 176, // 11rem
  48: 192, // 12rem
  52: 208, // 13rem
  56: 224, // 14rem
  60: 240, // 15rem
  64: 256, // 16rem
  72: 288, // 18rem
  80: 320, // 20rem
  96: 384, // 24rem
} as const;

// 패딩 유틸리티
export const padding = {
  p0: { padding: spacing[0] },
  p1: { padding: spacing[1] },
  p2: { padding: spacing[2] },
  p3: { padding: spacing[3] },
  p4: { padding: spacing[4] },
  p5: { padding: spacing[5] },
  p6: { padding: spacing[6] },
  p8: { padding: spacing[8] },
  p10: { padding: spacing[10] },
  p12: { padding: spacing[12] },
  p16: { padding: spacing[16] },
  p20: { padding: spacing[20] },
  p24: { padding: spacing[24] },
  p32: { padding: spacing[32] },

  // 수직 패딩
  py0: { paddingVertical: spacing[0] },
  py1: { paddingVertical: spacing[1] },
  py2: { paddingVertical: spacing[2] },
  py3: { paddingVertical: spacing[3] },
  py4: { paddingVertical: spacing[4] },
  py5: { paddingVertical: spacing[5] },
  py6: { paddingVertical: spacing[6] },
  py8: { paddingVertical: spacing[8] },
  py10: { paddingVertical: spacing[10] },
  py12: { paddingVertical: spacing[12] },
  py16: { paddingVertical: spacing[16] },
  py20: { paddingVertical: spacing[20] },
  py24: { paddingVertical: spacing[24] },
  py32: { paddingVertical: spacing[32] },

  // 수평 패딩
  px0: { paddingHorizontal: spacing[0] },
  px1: { paddingHorizontal: spacing[1] },
  px2: { paddingHorizontal: spacing[2] },
  px3: { paddingHorizontal: spacing[3] },
  px4: { paddingHorizontal: spacing[4] },
  px5: { paddingHorizontal: spacing[5] },
  px6: { paddingHorizontal: spacing[6] },
  px8: { paddingHorizontal: spacing[8] },
  px10: { paddingHorizontal: spacing[10] },
  px12: { paddingHorizontal: spacing[12] },
  px16: { paddingHorizontal: spacing[16] },
  px20: { paddingHorizontal: spacing[20] },
  px24: { paddingHorizontal: spacing[24] },
  px32: { paddingHorizontal: spacing[32] },

  // 상단 패딩
  pt0: { paddingTop: spacing[0] },
  pt1: { paddingTop: spacing[1] },
  pt2: { paddingTop: spacing[2] },
  pt3: { paddingTop: spacing[3] },
  pt4: { paddingTop: spacing[4] },
  pt5: { paddingTop: spacing[5] },
  pt6: { paddingTop: spacing[6] },
  pt8: { paddingTop: spacing[8] },
  pt10: { paddingTop: spacing[10] },
  pt12: { paddingTop: spacing[12] },
  pt16: { paddingTop: spacing[16] },
  pt20: { paddingTop: spacing[20] },
  pt24: { paddingTop: spacing[24] },
  pt32: { paddingTop: spacing[32] },

  // 하단 패딩
  pb0: { paddingBottom: spacing[0] },
  pb1: { paddingBottom: spacing[1] },
  pb2: { paddingBottom: spacing[2] },
  pb3: { paddingBottom: spacing[3] },
  pb4: { paddingBottom: spacing[4] },
  pb5: { paddingBottom: spacing[5] },
  pb6: { paddingBottom: spacing[6] },
  pb8: { paddingBottom: spacing[8] },
  pb10: { paddingBottom: spacing[10] },
  pb12: { paddingBottom: spacing[12] },
  pb16: { paddingBottom: spacing[16] },
  pb20: { paddingBottom: spacing[20] },
  pb24: { paddingBottom: spacing[24] },
  pb32: { paddingBottom: spacing[32] },

  // 좌측 패딩
  pl0: { paddingLeft: spacing[0] },
  pl1: { paddingLeft: spacing[1] },
  pl2: { paddingLeft: spacing[2] },
  pl3: { paddingLeft: spacing[3] },
  pl4: { paddingLeft: spacing[4] },
  pl5: { paddingLeft: spacing[5] },
  pl6: { paddingLeft: spacing[6] },
  pl8: { paddingLeft: spacing[8] },
  pl10: { paddingLeft: spacing[10] },
  pl12: { paddingLeft: spacing[12] },
  pl16: { paddingLeft: spacing[16] },
  pl20: { paddingLeft: spacing[20] },
  pl24: { paddingLeft: spacing[24] },
  pl32: { paddingLeft: spacing[32] },

  // 우측 패딩
  pr0: { paddingRight: spacing[0] },
  pr1: { paddingRight: spacing[1] },
  pr2: { paddingRight: spacing[2] },
  pr3: { paddingRight: spacing[3] },
  pr4: { paddingRight: spacing[4] },
  pr5: { paddingRight: spacing[5] },
  pr6: { paddingRight: spacing[6] },
  pr8: { paddingRight: spacing[8] },
  pr10: { paddingRight: spacing[10] },
  pr12: { paddingRight: spacing[12] },
  pr16: { paddingRight: spacing[16] },
  pr20: { paddingRight: spacing[20] },
  pr24: { paddingRight: spacing[24] },
  pr32: { paddingRight: spacing[32] },
} as const;

// 마진 유틸리티
export const margin = {
  m0: { margin: spacing[0] },
  m1: { margin: spacing[1] },
  m2: { margin: spacing[2] },
  m3: { margin: spacing[3] },
  m4: { margin: spacing[4] },
  m5: { margin: spacing[5] },
  m6: { margin: spacing[6] },
  m8: { margin: spacing[8] },
  m10: { margin: spacing[10] },
  m12: { margin: spacing[12] },
  m16: { margin: spacing[16] },
  m20: { margin: spacing[20] },
  m24: { margin: spacing[24] },
  m32: { margin: spacing[32] },

  // 수직 마진
  my0: { marginVertical: spacing[0] },
  my1: { marginVertical: spacing[1] },
  my2: { marginVertical: spacing[2] },
  my3: { marginVertical: spacing[3] },
  my4: { marginVertical: spacing[4] },
  my5: { marginVertical: spacing[5] },
  my6: { marginVertical: spacing[6] },
  my8: { marginVertical: spacing[8] },
  my10: { marginVertical: spacing[10] },
  my12: { marginVertical: spacing[12] },
  my16: { marginVertical: spacing[16] },
  my20: { marginVertical: spacing[20] },
  my24: { marginVertical: spacing[24] },
  my32: { marginVertical: spacing[32] },

  // 수평 마진
  mx0: { marginHorizontal: spacing[0] },
  mx1: { marginHorizontal: spacing[1] },
  mx2: { marginHorizontal: spacing[2] },
  mx3: { marginHorizontal: spacing[3] },
  mx4: { marginHorizontal: spacing[4] },
  mx5: { marginHorizontal: spacing[5] },
  mx6: { marginHorizontal: spacing[6] },
  mx8: { marginHorizontal: spacing[8] },
  mx10: { marginHorizontal: spacing[10] },
  mx12: { marginHorizontal: spacing[12] },
  mx16: { marginHorizontal: spacing[16] },
  mx20: { marginHorizontal: spacing[20] },
  mx24: { marginHorizontal: spacing[24] },
  mx32: { marginHorizontal: spacing[32] },

  // 상단 마진
  mt0: { marginTop: spacing[0] },
  mt1: { marginTop: spacing[1] },
  mt2: { marginTop: spacing[2] },
  mt3: { marginTop: spacing[3] },
  mt4: { marginTop: spacing[4] },
  mt5: { marginTop: spacing[5] },
  mt6: { marginTop: spacing[6] },
  mt8: { marginTop: spacing[8] },
  mt10: { marginTop: spacing[10] },
  mt12: { marginTop: spacing[12] },
  mt16: { marginTop: spacing[16] },
  mt20: { marginTop: spacing[20] },
  mt24: { marginTop: spacing[24] },
  mt32: { marginTop: spacing[32] },

  // 하단 마진
  mb0: { marginBottom: spacing[0] },
  mb1: { marginBottom: spacing[1] },
  mb2: { marginBottom: spacing[2] },
  mb3: { marginBottom: spacing[3] },
  mb4: { marginBottom: spacing[4] },
  mb5: { marginBottom: spacing[5] },
  mb6: { marginBottom: spacing[6] },
  mb8: { marginBottom: spacing[8] },
  mb10: { marginBottom: spacing[10] },
  mb12: { marginBottom: spacing[12] },
  mb16: { marginBottom: spacing[16] },
  mb20: { marginBottom: spacing[20] },
  mb24: { marginBottom: spacing[24] },
  mb32: { marginBottom: spacing[32] },

  // 좌측 마진
  ml0: { marginLeft: spacing[0] },
  ml1: { marginLeft: spacing[1] },
  ml2: { marginLeft: spacing[2] },
  ml3: { marginLeft: spacing[3] },
  ml4: { marginLeft: spacing[4] },
  ml5: { marginLeft: spacing[5] },
  ml6: { marginLeft: spacing[6] },
  ml8: { marginLeft: spacing[8] },
  ml10: { marginLeft: spacing[10] },
  ml12: { marginLeft: spacing[12] },
  ml16: { marginLeft: spacing[16] },
  ml20: { marginLeft: spacing[20] },
  ml24: { marginLeft: spacing[24] },
  ml32: { marginLeft: spacing[32] },

  // 우측 마진
  mr0: { marginRight: spacing[0] },
  mr1: { marginRight: spacing[1] },
  mr2: { marginRight: spacing[2] },
  mr3: { marginRight: spacing[3] },
  mr4: { marginRight: spacing[4] },
  mr5: { marginRight: spacing[5] },
  mr6: { marginRight: spacing[6] },
  mr8: { marginRight: spacing[8] },
  mr10: { marginRight: spacing[10] },
  mr12: { marginRight: spacing[12] },
  mr16: { marginRight: spacing[16] },
  mr20: { marginRight: spacing[20] },
  mr24: { marginRight: spacing[24] },
  mr32: { marginRight: spacing[32] },
} as const;

// 자동 마진 (중앙 정렬용)
export const autoMargin = {
  mxAuto: { marginHorizontal: "auto" },
  myAuto: { marginVertical: "auto" },
  mtAuto: { marginTop: "auto" },
  mbAuto: { marginBottom: "auto" },
  mlAuto: { marginLeft: "auto" },
  mrAuto: { marginRight: "auto" },
} as const;

// 간격 유틸리티 함수
export const getSpacing = (size: keyof typeof spacing): number => spacing[size];

export const createPadding = (
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => ({
  paddingTop: top,
  paddingRight: right,
  paddingBottom: bottom,
  paddingLeft: left,
});

export const createMargin = (
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => ({
  marginTop: top,
  marginRight: right,
  marginBottom: bottom,
  marginLeft: left,
});

// 간격 조합 유틸리티
export const spacingUtils = {
  ...padding,
  ...margin,
  ...autoMargin,
} as const;
