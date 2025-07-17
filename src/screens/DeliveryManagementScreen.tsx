import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, ProductDelivery } from "../types";
import { useTheme } from "../hooks/useTheme";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// 임시 배송 데이터
const SAMPLE_DELIVERIES: ProductDelivery[] = [
  {
    id: "1",
    deliveryNumber: "DEL-2024-001",
    companyId: "1",
    items: [],
    totalQuantity: 50,
    subtotalAmount: 450000,
    discountAmount: 0,
    taxAmount: 45000,
    totalAmount: 495000,
    deliveryDate: new Date(),
    requestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: "배송중",
    driverName: "김기사",
    driverPhone: "010-1234-5678",
    vehicleNumber: "12가3456",
    trackingNumber: "TRK001",
    memo: "정문 출입",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    deliveryNumber: "DEL-2024-002",
    companyId: "2",
    items: [],
    totalQuantity: 30,
    subtotalAmount: 320000,
    discountAmount: 10000,
    taxAmount: 31000,
    totalAmount: 341000,
    deliveryDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    requestedDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: "배송완료",
    driverName: "이기사",
    driverPhone: "010-2345-6789",
    vehicleNumber: "34나5678",
    trackingNumber: "TRK002",
    memo: "후문 출입",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    deliveryNumber: "DEL-2024-003",
    companyId: "3",
    items: [],
    totalQuantity: 20,
    subtotalAmount: 180000,
    discountAmount: 5000,
    taxAmount: 17500,
    totalAmount: 192500,
    deliveryDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
    status: "배송준비",
    memo: "깨지기 쉬운 상품",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const DeliveryManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [deliveries, setDeliveries] =
    useState<ProductDelivery[]>(SAMPLE_DELIVERIES);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 실제로는 API에서 데이터를 새로고침
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "배송완료":
        return "#10b981";
      case "배송중":
        return "#3b82f6";
      case "배송준비":
        return "#f59e0b";
      case "취소":
        return "#ef4444";
      case "반품":
        return "#6b7280";
      default:
        return "#9ca3af";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "배송완료":
        return "checkmark-circle";
      case "배송중":
        return "car";
      case "배송준비":
        return "cube";
      case "취소":
        return "close-circle";
      case "반품":
        return "return-up-back";
      default:
        return "ellipse";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR").format(date);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleViewDelivery = (delivery: ProductDelivery) => {
    Alert.alert(
      "배송 상세",
      `${delivery.deliveryNumber} 배송 정보를 확인하시겠습니까?`
    );
  };

  const handleUpdateStatus = (delivery: ProductDelivery) => {
    Alert.alert("배송 상태 변경", "배송 상태를 변경하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "배송준비",
        onPress: () => updateDeliveryStatus(delivery.id, "배송준비"),
      },
      {
        text: "배송중",
        onPress: () => updateDeliveryStatus(delivery.id, "배송중"),
      },
      {
        text: "배송완료",
        onPress: () => updateDeliveryStatus(delivery.id, "배송완료"),
      },
    ]);
  };

  const updateDeliveryStatus = (id: string, status: string) => {
    setDeliveries(
      deliveries.map((d) => (d.id === id ? { ...d, status: status as any } : d))
    );
    Alert.alert("상태 변경 완료", `배송 상태가 "${status}"로 변경되었습니다.`);
  };

  const handleTrackDelivery = (delivery: ProductDelivery) => {
    if (delivery.trackingNumber) {
      Alert.alert(
        "배송 추적",
        `송장번호: ${delivery.trackingNumber}\n\n실제 앱에서는 택배사 추적 페이지로 연결됩니다.`
      );
    } else {
      Alert.alert("알림", "송장번호가 등록되지 않았습니다.");
    }
  };

  const handleDeleteDelivery = (delivery: ProductDelivery) => {
    Alert.alert(
      "배송 삭제",
      `${delivery.deliveryNumber}을(를) 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            setDeliveries(deliveries.filter((d) => d.id !== delivery.id));
          },
        },
      ]
    );
  };

  const handleCreateDelivery = () => {
    Alert.alert("배송 등록", "새 배송을 등록하시겠습니까?");
  };

  const renderDeliveryItem = ({ item }: { item: ProductDelivery }) => {
    const isUrgent = item.status === "배송중" || item.status === "배송준비";

    return (
      <TouchableOpacity
        style={[
          styles.deliveryCard,
          { backgroundColor: theme.colors.card },
          isUrgent && styles.urgentCard,
        ]}
        onPress={() => handleViewDelivery(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.deliveryHeader}>
            <View style={styles.deliveryMainInfo}>
              <View style={styles.deliveryTitleRow}>
                <Ionicons
                  name={getStatusIcon(item.status)}
                  size={16}
                  color={getStatusColor(item.status)}
                  style={styles.statusIcon}
                />
                <Text
                  style={[styles.deliveryNumber, { color: theme.colors.text }]}
                >
                  {item.deliveryNumber}
                </Text>
              </View>
              {item.memo && (
                <Text
                  style={[
                    styles.deliveryMemo,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.memo}
                </Text>
              )}
            </View>

            <View
              style={[
                styles.statusTag,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.deliveryDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cube-outline" size={14} color="#6b7280" />
              <Text style={styles.quantityText}>
                수량: {item.totalQuantity}개
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={14} color="#6b7280" />
              <Text style={styles.amountText}>
                금액: {formatPrice(item.totalAmount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text style={styles.dateText}>
                배송일: {formatDate(item.deliveryDate)}
              </Text>
            </View>

            {item.driverName && (
              <View style={styles.detailRow}>
                <Ionicons name="person-outline" size={14} color="#6b7280" />
                <Text style={styles.driverText}>기사: {item.driverName}</Text>
                {item.driverPhone && (
                  <Text style={styles.phoneText}>({item.driverPhone})</Text>
                )}
              </View>
            )}

            {item.vehicleNumber && (
              <View style={styles.detailRow}>
                <Ionicons name="car-outline" size={14} color="#6b7280" />
                <Text style={styles.vehicleText}>
                  차량: {item.vehicleNumber}
                </Text>
              </View>
            )}

            {item.trackingNumber && (
              <View style={styles.detailRow}>
                <Ionicons name="barcode-outline" size={14} color="#6b7280" />
                <Text style={styles.trackingText}>
                  송장: {item.trackingNumber}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <Text
              style={[
                styles.createdDate,
                { color: theme.colors.textSecondary },
              ]}
            >
              등록: {formatDateTime(item.createdAt)}
            </Text>
            <View style={styles.actionButtons}>
              {item.trackingNumber && (
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => handleTrackDelivery(item)}
                >
                  <Ionicons name="location" size={16} color="#8b5cf6" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleUpdateStatus(item)}
              >
                <Ionicons name="sync" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDelivery(item)}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color="#9ca3af" />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        등록된 배송이 없습니다
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        첫 번째 배송을 등록하고{"\n"}배송 관리를 시작해보세요!
      </Text>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={handleCreateDelivery}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>배송 등록하기</Text>
      </TouchableOpacity>
    </View>
  );

  const getDeliveryStats = () => {
    const totalDeliveries = deliveries.length;
    const completed = deliveries.filter((d) => d.status === "배송완료").length;
    const inProgress = deliveries.filter((d) => d.status === "배송중").length;
    const preparing = deliveries.filter((d) => d.status === "배송준비").length;
    const totalAmount = deliveries.reduce((sum, d) => sum + d.totalAmount, 0);
    const totalQuantity = deliveries.reduce(
      (sum, d) => sum + d.totalQuantity,
      0
    );

    return {
      totalDeliveries,
      completed,
      inProgress,
      preparing,
      totalAmount,
      totalQuantity,
    };
  };

  const stats = getDeliveryStats();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>배송 관리</Text>
            <Text style={styles.headerSubtitle}>
              총 {stats.totalDeliveries}건 • 진행중{" "}
              {stats.inProgress + stats.preparing}건
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 통계 카드 */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text
                style={[styles.statNumber, { color: theme.colors.primary }]}
              >
                {stats.totalDeliveries}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                총 건수
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statNumber, { color: "#10b981" }]}>
                {stats.completed}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                완료
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statNumber, { color: "#3b82f6" }]}>
                {stats.inProgress}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                배송중
              </Text>
            </View>
          </View>
          <View
            style={[styles.valueCard, { backgroundColor: theme.colors.card }]}
          >
            <Text
              style={[styles.valueLabel, { color: theme.colors.textSecondary }]}
            >
              총 배송액
            </Text>
            <Text style={[styles.valueAmount, { color: theme.colors.text }]}>
              {formatPrice(stats.totalAmount)}
            </Text>
            <Text
              style={[
                styles.valueSubtext,
                { color: theme.colors.textSecondary },
              ]}
            >
              총 수량: {stats.totalQuantity}개
            </Text>
          </View>
        </View>

        {/* 배송 목록 */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            배송 목록
          </Text>
          <FlatList
            data={deliveries}
            renderItem={renderDeliveryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              deliveries.length === 0 && styles.emptyListContainer,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      </ScrollView>

      <View style={[styles.fab, { bottom: 80 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCreateDelivery}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  valueCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  valueLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  valueSubtext: {
    fontSize: 12,
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  deliveryCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  cardContent: {
    padding: 16,
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deliveryMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  deliveryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 8,
  },
  deliveryNumber: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  deliveryMemo: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  deliveryDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  amountText: {
    fontSize: 14,
    color: "#1f2937",
    marginLeft: 8,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  driverText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  phoneText: {
    fontSize: 12,
    color: "#9ca3af",
    marginLeft: 4,
  },
  vehicleText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  trackingText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
    fontFamily: "monospace",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  createdDate: {
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  trackButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statusButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default DeliveryManagementScreen;
