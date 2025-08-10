import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../styles/colors";
import { useCall } from "../providers/CallProvider";
import { CallHistoryItem } from "../types/call";

type FilterType = "all" | "incoming" | "outgoing" | "missed";

const CallHistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    callHistory,
    clearCallHistory,
    deleteCallRecord,
    makeCall,
    permissionStatus,
    requestPermissions,
  } = useCall();

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // 필터링된 통화 기록
  const filteredCallHistory = useMemo(() => {
    if (activeFilter === "all") return callHistory;
    return callHistory.filter((call) => call.type === activeFilter);
  }, [callHistory, activeFilter]);

  // 통화 시간 포맷팅
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0초";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    }
    return `${remainingSeconds}초`;
  };

  // 시간 포맷팅
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return (
        "어제 " +
        date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // 통화 타입 아이콘
  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case "incoming":
        return { name: "call-outline", color: COLORS.success };
      case "outgoing":
        return { name: "call-outline", color: COLORS.primary };
      case "missed":
        return { name: "call-outline", color: COLORS.error };
      default:
        return { name: "call-outline", color: COLORS.textSecondary };
    }
  };

  // 전화 걸기
  const handleMakeCall = async (phoneNumber: string, companyName?: string) => {
    if (!permissionStatus.callPhone) {
      Alert.alert("권한 필요", "전화 걸기 권한이 필요합니다.", [
        { text: "취소", style: "cancel" },
        {
          text: "권한 허용",
          onPress: () => requestPermissions(),
        },
      ]);
      return;
    }

    await makeCall(phoneNumber, companyName);
  };

  // 통화 기록 삭제
  const handleDeleteRecord = (id: string) => {
    Alert.alert("통화 기록 삭제", "이 통화 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deleteCallRecord(id),
      },
    ]);
  };

  // 모든 기록 삭제
  const handleClearAll = () => {
    Alert.alert("모든 기록 삭제", "모든 통화 기록을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: clearCallHistory,
      },
    ]);
  };

  // 필터 버튼 렌더링
  const renderFilterButton = (
    type: FilterType,
    label: string,
    count: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === type && [
          styles.activeFilterButton,
          { backgroundColor: COLORS.primary },
        ],
      ]}
      onPress={() => setActiveFilter(type)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: activeFilter === type ? COLORS.white : COLORS.textSecondary,
          },
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  // 통화 기록 아이템 렌더링
  const renderCallItem = ({ item }: { item: CallHistoryItem }) => {
    const callIcon = getCallTypeIcon(item.type);

    return (
      <TouchableOpacity
        style={[styles.callItem, { backgroundColor: COLORS.white }]}
        onPress={() => handleMakeCall(item.phoneNumber, item.companyName)}
        onLongPress={() => handleDeleteRecord(item.id)}
      >
        <View style={styles.callItemLeft}>
          <View
            style={[
              styles.callTypeIcon,
              { backgroundColor: callIcon.color + "20" },
            ]}
          >
            <Ionicons
              name={callIcon.name as any}
              size={20}
              color={callIcon.color}
            />
          </View>
          <View style={styles.callInfo}>
            <Text style={[styles.companyName, { color: COLORS.text }]}>
              {item.companyName || "알 수 없음"}
            </Text>
            <Text style={[styles.phoneNumber, { color: COLORS.textSecondary }]}>
              {item.phoneNumber}
            </Text>
            {item.duration && (
              <Text style={[styles.duration, { color: COLORS.textSecondary }]}>
                통화시간: {formatDuration(item.duration)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.callItemRight}>
          <Text style={[styles.timestamp, { color: COLORS.textSecondary }]}>
            {formatTime(item.timestamp)}
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => handleMakeCall(item.phoneNumber, item.companyName)}
          >
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // 빈 상태 렌더링
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="call-outline" size={64} color={COLORS.textSecondary} />
      <Text style={[styles.emptyTitle, { color: COLORS.text }]}>
        통화 기록이 없습니다
      </Text>
      <Text style={[styles.emptySubtitle, { color: COLORS.textSecondary }]}>
        거래처와 통화하면 기록이 여기에 표시됩니다
      </Text>
    </View>
  );

  const incomingCount = callHistory.filter(
    (call) => call.type === "incoming"
  ).length;
  const outgoingCount = callHistory.filter(
    (call) => call.type === "outgoing"
  ).length;
  const missedCount = callHistory.filter(
    (call) => call.type === "missed"
  ).length;

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            통화 기록
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            disabled={callHistory.length === 0}
          >
            <Ionicons
              name="trash-outline"
              size={24}
              color={callHistory.length > 0 ? COLORS.error : COLORS.border}
            />
          </TouchableOpacity>
        </View>

        {/* 권한 상태 알림 */}
        {!permissionStatus.allGranted && (
          <View
            style={[styles.permissionBanner, { backgroundColor: "#fff3cd" }]}
          >
            <Ionicons name="warning-outline" size={20} color="#856404" />
            <Text style={[styles.permissionText, { color: "#856404" }]}>
              일부 기능을 사용하려면 권한이 필요합니다
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Text
                style={[styles.permissionButtonText, { color: COLORS.primary }]}
              >
                허용
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 통계 */}
        <View
          style={[styles.statsContainer, { backgroundColor: COLORS.white }]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.text }]}>
              {callHistory.length}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
              총 통화
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.success }]}>
              {incomingCount}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
              수신
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.primary }]}>
              {outgoingCount}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
              발신
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: COLORS.error }]}>
              {missedCount}
            </Text>
            <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
              부재중
            </Text>
          </View>
        </View>

        {/* 필터 */}
        <View
          style={[
            styles.filterContainer,
            { backgroundColor: COLORS.background },
          ]}
        >
          {renderFilterButton("all", "전체", callHistory.length)}
          {renderFilterButton("incoming", "수신", incomingCount)}
          {renderFilterButton("outgoing", "발신", outgoingCount)}
          {renderFilterButton("missed", "부재중", missedCount)}
        </View>

        {/* 통화 목록 */}
        <FlatList
          data={filteredCallHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderCallItem}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    padding: 4,
  },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ffeaa7",
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  permissionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  callItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  callItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  callTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  callInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
  },
  callItemRight: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 8,
  },
  callButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default CallHistoryScreen;
