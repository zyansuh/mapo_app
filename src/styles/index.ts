// 스타일 관련 통합 Export
export * from "./colors";

// Scaling utilities from utils
export {
  scale,
  verticalScale,
  moderateScale,
  textScale,
  iconScale,
  spacingScale,
  scaledSizes,
  screenInfo,
  deviceScale,
} from "../utils/scaling";

// 공통 스타일 유틸리티
import { StyleSheet } from "react-native";
import { COLORS } from "./colors";
import { scaledSizes } from "../utils/scaling";

// 기본 공통 스타일들 - scale을 적용한 버전
export const commonStyles = StyleSheet.create({
  // Container 스타일
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // 카드 스타일
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scaledSizes.radius.medium,
    padding: scaledSizes.spacing.medium,
    marginBottom: scaledSizes.spacing.medium,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: scaledSizes.border.normal,
    },
    shadowOpacity: 0.1,
    shadowRadius: scaledSizes.spacing.small,
    elevation: 2,
  },

  // 헤더 스타일
  header: {
    paddingHorizontal: scaledSizes.spacing.large,
    paddingVertical: scaledSizes.spacing.medium,
    borderBottomWidth: scaledSizes.border.normal,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    fontSize: scaledSizes.text.xlarge,
    fontWeight: "700",
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: scaledSizes.text.small,
    color: COLORS.textSecondary,
    marginTop: scaledSizes.spacing.tiny,
  },

  // 섹션 스타일
  section: {
    backgroundColor: COLORS.white,
    borderRadius: scaledSizes.radius.medium,
    padding: scaledSizes.spacing.medium,
    marginBottom: scaledSizes.spacing.medium,
  },

  sectionTitle: {
    fontSize: scaledSizes.text.medium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: scaledSizes.spacing.small,
  },

  // 입력 필드 스타일
  input: {
    borderWidth: scaledSizes.border.normal,
    borderColor: COLORS.border,
    borderRadius: scaledSizes.radius.normal,
    paddingHorizontal: scaledSizes.spacing.normal,
    paddingVertical: scaledSizes.spacing.small,
    fontSize: scaledSizes.text.medium,
    backgroundColor: COLORS.white,
    color: COLORS.text,
    minHeight: scaledSizes.input.normal,
  },

  inputFocused: {
    borderColor: COLORS.primary,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  // 라벨 스타일
  label: {
    fontSize: scaledSizes.text.normal,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: scaledSizes.spacing.tiny,
  },

  // 버튼 스타일
  button: {
    borderRadius: scaledSizes.radius.normal,
    paddingHorizontal: scaledSizes.spacing.medium,
    paddingVertical: scaledSizes.spacing.small,
    alignItems: "center",
    justifyContent: "center",
    minHeight: scaledSizes.button.normal,
  },

  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },

  buttonSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: scaledSizes.border.normal,
    borderColor: COLORS.border,
  },

  buttonText: {
    fontSize: scaledSizes.text.medium,
    fontWeight: "600",
  },

  buttonTextPrimary: {
    color: COLORS.white,
  },

  buttonTextSecondary: {
    color: COLORS.text,
  },

  // 리스트 스타일
  listContainer: {
    paddingHorizontal: scaledSizes.spacing.medium,
  },

  listItem: {
    backgroundColor: COLORS.white,
    borderRadius: scaledSizes.radius.medium,
    padding: scaledSizes.spacing.medium,
    marginBottom: scaledSizes.spacing.small,
    borderWidth: scaledSizes.border.normal,
    borderColor: COLORS.border,
  },

  // 텍스트 스타일
  textTitle: {
    fontSize: scaledSizes.text.large,
    fontWeight: "700",
    color: COLORS.text,
  },

  textSubtitle: {
    fontSize: scaledSizes.text.medium,
    fontWeight: "600",
    color: COLORS.text,
  },

  textBody: {
    fontSize: scaledSizes.text.normal,
    color: COLORS.text,
    lineHeight: scaledSizes.text.normal * 1.5,
  },

  textCaption: {
    fontSize: scaledSizes.text.small,
    color: COLORS.textSecondary,
  },

  textError: {
    fontSize: scaledSizes.text.small,
    color: COLORS.error,
    marginTop: scaledSizes.spacing.tiny,
  },

  // 간격 유틸리티
  marginTop: {
    marginTop: scaledSizes.spacing.medium,
  },

  marginBottom: {
    marginBottom: scaledSizes.spacing.medium,
  },

  paddingHorizontal: {
    paddingHorizontal: scaledSizes.spacing.medium,
  },

  paddingVertical: {
    paddingVertical: scaledSizes.spacing.medium,
  },

  // 플렉스 유틸리티
  row: {
    flexDirection: "row",
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  // 빈 상태 스타일
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scaledSizes.spacing.xxlarge,
  },

  emptyTitle: {
    fontSize: scaledSizes.text.large,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: scaledSizes.spacing.medium,
    marginBottom: scaledSizes.spacing.small,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: scaledSizes.text.normal,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: scaledSizes.text.normal * 1.5,
    marginBottom: scaledSizes.spacing.large,
  },
});

// 그림자 유틸리티
export const shadowStyles = StyleSheet.create({
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: scaledSizes.border.normal,
    },
    shadowOpacity: 0.1,
    shadowRadius: scaledSizes.spacing.tiny,
    elevation: 2,
  },

  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: scaledSizes.border.thick,
    },
    shadowOpacity: 0.15,
    shadowRadius: scaledSizes.spacing.small,
    elevation: 4,
  },

  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: scaledSizes.spacing.tiny,
    },
    shadowOpacity: 0.2,
    shadowRadius: scaledSizes.spacing.normal,
    elevation: 8,
  },
});

// 상태별 스타일 생성기
export const createStatusStyle = (
  status: keyof typeof import("./colors").STATUS_COLORS
) => {
  const statusColors = require("./colors").STATUS_COLORS[status];
  return StyleSheet.create({
    container: {
      backgroundColor: statusColors.background,
      borderColor: statusColors.border,
      borderWidth: scaledSizes.border.normal,
      borderRadius: scaledSizes.radius.normal,
      paddingHorizontal: scaledSizes.spacing.small,
      paddingVertical: scaledSizes.spacing.tiny,
    },
    text: {
      color: statusColors.text,
      fontSize: scaledSizes.text.small,
      fontWeight: "600",
    },
  });
};

// 카테고리별 스타일 생성기
export const createCategoryStyle = (
  category: keyof typeof import("./colors").CATEGORY_COLORS
) => {
  const categoryColors = require("./colors").CATEGORY_COLORS[category];
  return StyleSheet.create({
    container: {
      backgroundColor: categoryColors.light,
      borderColor: categoryColors.primary,
      borderWidth: scaledSizes.border.normal,
      borderRadius: scaledSizes.radius.normal,
      paddingHorizontal: scaledSizes.spacing.small,
      paddingVertical: scaledSizes.spacing.tiny,
    },
    text: {
      color: categoryColors.text,
      fontSize: scaledSizes.text.small,
      fontWeight: "600",
    },
  });
};
