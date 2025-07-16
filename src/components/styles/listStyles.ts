import { StyleSheet } from "react-native";
import { COLORS, CATEGORY_COLORS, STATUS_COLORS } from "../../styles/colors";

export const listStyles = StyleSheet.create({
  // 기본 리스트 스타일
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  listContainer: {
    padding: 20,
  },

  // 카드 스타일
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },

  cardSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  // 리스트 아이템 스타일
  listItem: {
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  listItemLast: {
    borderBottomWidth: 0,
  },

  listItemTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },

  listItemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  listItemValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },

  // 배지 스타일
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // 상태별 배지 (동적 스타일은 별도 함수로 생성)
  badgePending: {
    backgroundColor: STATUS_COLORS.pending.background,
  },

  badgeCompleted: {
    backgroundColor: STATUS_COLORS.completed.background,
  },

  badgeCancelled: {
    backgroundColor: STATUS_COLORS.cancelled.background,
  },

  badgeProcessing: {
    backgroundColor: STATUS_COLORS.processing.background,
  },

  // 제품 카테고리별 스타일
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // 빈 상태 스타일
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 15,
  },

  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 5,
  },

  // 구분선
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },

  thickSeparator: {
    height: 8,
    backgroundColor: COLORS.surface,
    marginVertical: 15,
  },

  // 검색 스타일
  searchContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.text,
  },

  // 플로팅 액션 버튼
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // 헤더 스타일
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

// 동적 스타일 생성 함수들
export const getCategoryBadgeStyle = (
  category: keyof typeof CATEGORY_COLORS
) => {
  const categoryColor = CATEGORY_COLORS[category];
  return {
    backgroundColor: categoryColor.light,
  };
};

export const getCategoryTextStyle = (
  category: keyof typeof CATEGORY_COLORS
) => {
  const categoryColor = CATEGORY_COLORS[category];
  return {
    color: categoryColor.text,
  };
};

export const getStatusBadgeStyle = (status: keyof typeof STATUS_COLORS) => {
  const statusColor = STATUS_COLORS[status];
  return {
    backgroundColor: statusColor.background,
  };
};

export const getStatusTextStyle = (status: keyof typeof STATUS_COLORS) => {
  const statusColor = STATUS_COLORS[status];
  return {
    color: statusColor.text,
  };
};
