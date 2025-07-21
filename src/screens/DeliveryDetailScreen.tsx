import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useNavigation,
  useRoute,
  RouteProp as NavigationRouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useDelivery } from "../hooks/useDelivery";
import { useCompany } from "../hooks/useCompany";
import { COLORS } from "../styles/colors";
import { formatDate, formatCurrency } from "../utils/format";
import { DeliveryStatus } from "../types/delivery";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = NavigationRouteProp<RootStackParamList, "DeliveryDetail">;

const DeliveryDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const { deliveryId } = route.params;
  const { getDeliveryById, deleteDelivery, updateDeliveryStatus } =
    useDelivery();
  const { getCompanyById } = useCompany();

  const delivery = getDeliveryById(deliveryId);
  const company = delivery ? getCompanyById(delivery.companyId) : null;

  if (!delivery) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            배송 정보
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            배송 정보를 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert("배송 삭제", "정말로 이 배송을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const success = await deleteDelivery(deliveryId);
          if (success) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate("DeliveryEdit", { deliveryId });
  };

  const handleStatusChange = async (newStatus: DeliveryStatus) => {
    const success = await updateDeliveryStatus(deliveryId, newStatus);
    if (success) {
      Alert.alert(
        "상태 변경",
        `배송 상태가 "${newStatus}"(으)로 변경되었습니다.`
      );
    }
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

  const renderStatusActions = () => {
    const actions = [];

    if (delivery.status === "준비중") {
      actions.push(
        <TouchableOpacity
          key="start"
          style={[styles.statusButton, { backgroundColor: COLORS.primary }]}
          onPress={() => handleStatusChange("배송중")}
        >
          <Ionicons name="play" size={16} color={COLORS.white} />
          <Text style={[styles.statusButtonText, { color: COLORS.white }]}>
            배송 시작
          </Text>
        </TouchableOpacity>
      );
    }

    if (delivery.status === "배송중") {
      actions.push(
        <TouchableOpacity
          key="complete"
          style={[styles.statusButton, { backgroundColor: COLORS.success }]}
          onPress={() => handleStatusChange("배송완료")}
        >
          <Ionicons name="checkmark" size={16} color={COLORS.white} />
          <Text style={[styles.statusButtonText, { color: COLORS.white }]}>
            배송 완료
          </Text>
        </TouchableOpacity>
      );
    }

    if (delivery.status !== "배송완료" && delivery.status !== "취소") {
      actions.push(
        <TouchableOpacity
          key="cancel"
          style={[styles.statusButton, { backgroundColor: COLORS.error }]}
          onPress={() => handleStatusChange("취소")}
        >
          <Ionicons name="close" size={16} color={COLORS.white} />
          <Text style={[styles.statusButtonText, { color: COLORS.white }]}>
            배송 취소
          </Text>
        </TouchableOpacity>
      );
    }

    return actions;
  };

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === "android" ? 10 : insets.top,
          },
        ]}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>배송 상세</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 컨텐츠 */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* 배송 헤더 정보 */}
          <View style={styles.deliveryHeader}>
            <LinearGradient
              colors={[
                getStatusColor(delivery.status),
                getStatusColor(delivery.status) + "DD",
              ]}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={styles.deliveryNumberContainer}>
                  <Text
                    style={[styles.deliveryNumber, { color: COLORS.white }]}
                  >
                    {delivery.deliveryNumber}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Ionicons
                      name={getStatusIcon(delivery.status)}
                      size={16}
                      color={COLORS.white}
                    />
                    <Text style={[styles.statusText, { color: COLORS.white }]}>
                      {delivery.status}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[styles.companyName, { color: COLORS.white + "CC" }]}
                >
                  {company?.name || "알 수 없는 거래처"}
                </Text>

                <Text style={[styles.totalAmount, { color: COLORS.white }]}>
                  {formatCurrency(delivery.totalAmount)}
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* 배송 정보 */}
          <View style={styles.documentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>배송 정보</Text>
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>배송 예정일</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(delivery.deliveryDate)}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>배송 주소</Text>
                    <Text style={styles.infoValue}>
                      {delivery.deliveryAddress}
                    </Text>
                  </View>
                </View>

                {delivery.deliveryMemo && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color={COLORS.textSecondary}
                    />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>배송 메모</Text>
                      <Text style={styles.infoValue}>
                        {delivery.deliveryMemo}
                      </Text>
                    </View>
                  </View>
                )}

                {delivery.driverName && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.textSecondary}
                    />
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>배송 기사</Text>
                      <Text style={styles.infoValue}>
                        {delivery.driverName}
                        {delivery.driverPhone && ` (${delivery.driverPhone})`}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* 배송 상품 목록 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>배송 상품</Text>
              <View style={styles.sectionContent}>
                {delivery.products.map((product, index) => (
                  <View key={product.id} style={styles.productItem}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productCategory}>
                        {product.category}
                      </Text>
                      <Text style={styles.productName}>
                        {product.productItem}
                      </Text>
                      <Text style={styles.productQuantity}>
                        수량: {product.quantity}개 ×{" "}
                        {formatCurrency(product.unitPrice)}
                      </Text>
                    </View>
                    <Text style={styles.productAmount}>
                      {formatCurrency(product.totalPrice)}
                    </Text>
                  </View>
                ))}

                {/* 총 금액 */}
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>총 금액</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(delivery.totalAmount)}
                  </Text>
                </View>
              </View>
            </View>

            {/* 상태 변경 액션 */}
            {renderStatusActions().length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>배송 상태 변경</Text>
                <View style={styles.actionsContainer}>
                  {renderStatusActions()}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 삭제 버튼 */}
        <View
          style={[
            styles.deleteButtonContainer,
            {
              paddingBottom:
                Platform.OS === "android" ? 80 : Math.max(16, insets.bottom),
            },
          ]}
        >
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>배송 삭제</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  editButton: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  deliveryHeader: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerContent: {
    alignItems: "center",
  },
  deliveryNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  deliveryNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  companyName: {
    fontSize: 16,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "700",
  },
  documentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionContent: {
    paddingLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  productAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButtonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.error,
    marginLeft: 8,
  },
});

export default DeliveryDetailScreen;
