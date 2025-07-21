import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { useDelivery } from "../hooks/useDelivery";
import { useCompany } from "../hooks/useCompany";
import { Delivery, DeliveryStatus } from "../types/delivery";
import { formatDate, formatCurrency } from "../utils/format";

const DeliveryManagementScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { deliveries, stats, updateDeliveryStatus, deleteDelivery } =
    useDelivery();
  const { getCompanyById } = useCompany();

  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | "전체">(
    "전체"
  );

  const handleCreateDelivery = () => {
    // 새 배송 등록은 거래처에서 하도록 안내
    Alert.alert(
      "배송 등록",
      "새 배송은 거래처 상세 화면에서 등록할 수 있습니다.",
      [
        { text: "취소" },
        {
          text: "거래처로 이동",
          onPress: () => navigation.navigate("CompanyList"),
        },
      ]
    );
  };

  const handleStatusChange = async (
    deliveryId: string,
    newStatus: DeliveryStatus
  ) => {
    const success = await updateDeliveryStatus(deliveryId, newStatus);
    if (success) {
      Alert.alert(
        "상태 변경",
        `배송 상태가 "${newStatus}"(으)로 변경되었습니다.`
      );
    }
  };

  const handleDeleteDelivery = async (deliveryId: string) => {
    Alert.alert("배송 삭제", "정말로 이 배송을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteDelivery(deliveryId);
        },
      },
    ]);
  };

  const getStatusColor = (status: DeliveryStatus): string => {
    switch (status) {
      case "준비중":
        return COLORS.warning;
      case "배송중":
        return COLORS.primary;
      case "배송완료":
        return COLORS.success;
      case "취소":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status: DeliveryStatus): any => {
    switch (status) {
      case "준비중":
        return "hourglass-outline";
      case "배송중":
        return "car-outline";
      case "배송완료":
        return "checkmark-circle-outline";
      case "취소":
        return "close-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      selectedStatus === "전체" || delivery.status === selectedStatus
  );

  const renderStatusFilter = () => {
    const statuses: (DeliveryStatus | "전체")[] = [
      "전체",
      "준비중",
      "배송중",
      "배송완료",
      "취소",
    ];

    return (
      <View style={styles.statusFilter}>
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              selectedStatus === status && [
                styles.activeStatusButton,
                { backgroundColor: COLORS.primary },
              ],
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.statusButtonText,
                selectedStatus === status && { color: COLORS.white },
                { color: COLORS.text },
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const company = getCompanyById(item.companyId);

    return (
      <TouchableOpacity
        style={[styles.deliveryCard, { backgroundColor: COLORS.white }]}
        onPress={() =>
          navigation.navigate("DeliveryDetail", { deliveryId: item.id })
        }
      >
        <View style={styles.deliveryHeader}>
          <View style={styles.deliveryInfo}>
            <Text style={[styles.deliveryNumber, { color: COLORS.text }]}>
              {item.deliveryNumber}
            </Text>
            <Text style={[styles.companyName, { color: COLORS.textSecondary }]}>
              {company?.name || "알 수 없는 거래처"}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Ionicons
              name={getStatusIcon(item.status)}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.deliveryContent}>
          <View style={styles.deliveryRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text
              style={[styles.deliveryDetail, { color: COLORS.textSecondary }]}
            >
              배송일: {formatDate(item.deliveryDate)}
            </Text>
          </View>

          <View style={styles.deliveryRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text
              style={[styles.deliveryDetail, { color: COLORS.textSecondary }]}
              numberOfLines={2}
            >
              {item.deliveryAddress}
            </Text>
          </View>

          <View style={styles.deliveryRow}>
            <Ionicons
              name="cube-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text
              style={[styles.deliveryDetail, { color: COLORS.textSecondary }]}
            >
              {item.products.length}개 상품 • {formatCurrency(item.totalAmount)}
            </Text>
          </View>

          {item.driverName && (
            <View style={styles.deliveryRow}>
              <Ionicons
                name="person-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text
                style={[styles.deliveryDetail, { color: COLORS.textSecondary }]}
              >
                {item.driverName} {item.driverPhone && `(${item.driverPhone})`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.deliveryActions}>
          {item.status === "준비중" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.primary + "20" },
              ]}
              onPress={() => handleStatusChange(item.id, "배송중")}
            >
              <Text style={[styles.actionText, { color: COLORS.primary }]}>
                배송 시작
              </Text>
            </TouchableOpacity>
          )}

          {item.status === "배송중" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.success + "20" },
              ]}
              onPress={() => handleStatusChange(item.id, "배송완료")}
            >
              <Text style={[styles.actionText, { color: COLORS.success }]}>
                배송 완료
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: COLORS.error + "20" },
            ]}
            onPress={() => handleDeleteDelivery(item.id)}
          >
            <Text style={[styles.actionText, { color: COLORS.error }]}>
              삭제
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          paddingTop: insets.top,
        }}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.white }]}>
              배송 관리
            </Text>
            <TouchableOpacity onPress={handleCreateDelivery}>
              <Ionicons name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* 통계 정보 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {stats.totalDeliveries}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                총 배송
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {stats.pendingDeliveries}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                진행중
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {stats.completedDeliveries}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                완료
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {formatCurrency(stats.totalAmount)}
              </Text>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                총 금액
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 상태 필터 */}
        {renderStatusFilter()}

        {filteredDeliveries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="car-outline"
              size={80}
              color={COLORS.textSecondary}
            />
            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
              {selectedStatus === "전체"
                ? "등록된 배송이 없습니다"
                : `${selectedStatus} 상태의 배송이 없습니다`}
            </Text>
            {selectedStatus === "전체" && (
              <TouchableOpacity
                style={[
                  styles.createButton,
                  { backgroundColor: COLORS.primary },
                ]}
                onPress={handleCreateDelivery}
              >
                <Text
                  style={[styles.createButtonText, { color: COLORS.white }]}
                >
                  첫 배송 등록하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredDeliveries}
            renderItem={renderDeliveryCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statusFilter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  activeStatusButton: {
    borderWidth: 0,
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  deliveryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryNumber: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  deliveryContent: {
    marginBottom: 12,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  deliveryDetail: {
    fontSize: 14,
    flex: 1,
  },
  deliveryActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default DeliveryManagementScreen;
