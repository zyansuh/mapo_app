// 기존 스타일들
import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../constants";

// 공통 스타일
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shadow: {
    shadowColor: COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// 텍스트 스타일
export const textStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: SIZES.MEDIUM,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.BLACK,
    marginBottom: SIZES.SMALL,
  },
  body: {
    fontSize: 16,
    color: COLORS.BLACK,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
});

// 버튼 스타일
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SIZES.LARGE,
    paddingVertical: SIZES.MEDIUM,
    borderRadius: 8,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZES.LARGE,
    paddingVertical: SIZES.MEDIUM,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.WHITE,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
});

// 새로운 스타일 시스템 export
export * from "./globalStyles";
