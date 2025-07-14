import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductCategory } from "../types";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  currentStock: number;
  minStock: number;
  unit: string;
  lastRestocked: Date;
  movements: InventoryMovement[];
}

interface InventoryMovement {
  id: string;
  type: "입고" | "출고";
  quantity: number;
  date: Date;
  reason?: string;
  remainingStock: number;
}

interface InventoryManagementProps {
  companyId: string;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  companyId,
}) => {
  const [isMovementModalVisible, setIsMovementModalVisible] = useState(false);
  const [isStockAlertModalVisible, setIsStockAlertModalVisible] =
    useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [movementType, setMovementType] = useState<"입고" | "출고">("출고");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // 샘플 재고 데이터
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      productId: "1",
      productName: "착한손두부",
      category: "두부",
      currentStock: 25,
      minStock: 10,
      unit: "모",
      lastRestocked: new Date(2024, 0, 15),
      movements: [
        {
          id: "1",
          type: "입고",
          quantity: 50,
          date: new Date(2024, 0, 15),
          reason: "신규 입고",
          remainingStock: 50,
        },
        {
          id: "2",
          type: "출고",
          quantity: 25,
          date: new Date(2024, 0, 16),
          reason: "고객사 배송",
          remainingStock: 25,
        },
      ],
    },
    {
      id: "2",
      productId: "8",
      productName: "시루콩나물",
      category: "콩나물",
      currentStock: 5,
      minStock: 15,
      unit: "봉지",
      lastRestocked: new Date(2024, 0, 10),
      movements: [
        {
          id: "3",
          type: "입고",
          quantity: 30,
          date: new Date(2024, 0, 10),
          reason: "정기 입고",
          remainingStock: 30,
        },
        {
          id: "4",
          type: "출고",
          quantity: 25,
          date: new Date(2024, 0, 17),
          reason: "대량 주문 배송",
          remainingStock: 5,
        },
      ],
    },
    {
      id: "3",
      productId: "11",
      productName: "도토리묵小",
      category: "묵류",
      currentStock: 0,
      minStock: 5,
      unit: "개",
      lastRestocked: new Date(2024, 0, 5),
      movements: [
        {
          id: "5",
          type: "입고",
          quantity: 20,
          date: new Date(2024, 0, 5),
          reason: "신규 입고",
          remainingStock: 20,
        },
        {
          id: "6",
          type: "출고",
          quantity: 20,
          date: new Date(2024, 0, 18),
          reason: "완판 출고",
          remainingStock: 0,
        },
      ],
    },
  ]);

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case "두부":
        return "#10b981";
      case "콩나물":
        return "#3b82f6";
      case "묵류":
        return "#ec4899";
      default:
        return "#6b7280";
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { status: "품절", color: "#dc2626", icon: "close-circle" };
    } else if (item.currentStock <= item.minStock) {
      return { status: "부족", color: "#f59e0b", icon: "warning" };
    } else {
      return { status: "충분", color: "#10b981", icon: "checkmark-circle" };
    }
  };

  const getLowStockItems = () => {
    return inventoryItems.filter((item) => item.currentStock <= item.minStock);
  };

  const handleMovementPress = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementType("출고");
    setQuantity("");
    setReason("");
    setIsMovementModalVisible(true);
  };

  const handleStockAlert = () => {
    const lowStockItems = getLowStockItems();
    if (lowStockItems.length === 0) {
      Alert.alert("알림", "현재 재고 부족 품목이 없습니다.");
      return;
    }
    setIsStockAlertModalVisible(true);
  };

  const handleMovementSubmit = () => {
    if (!selectedItem) return;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert("알림", "수량을 올바르게 입력해주세요.");
      return;
    }

    if (movementType === "출고" && qty > selectedItem.currentStock) {
      Alert.alert("알림", "출고 수량이 현재 재고량을 초과합니다.");
      return;
    }

    const newMovement: InventoryMovement = {
      id: Date.now().toString(),
      type: movementType,
      quantity: qty,
      date: new Date(),
      reason: reason || (movementType === "입고" ? "재고 입고" : "재고 출고"),
      remainingStock:
        movementType === "입고"
          ? selectedItem.currentStock + qty
          : selectedItem.currentStock - qty,
    };

    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              currentStock: newMovement.remainingStock,
              lastRestocked:
                movementType === "입고" ? new Date() : item.lastRestocked,
              movements: [newMovement, ...item.movements],
            }
          : item
      )
    );

    setIsMovementModalVisible(false);
    Alert.alert(
      "완료",
      `${selectedItem.productName}의 ${movementType}이 완료되었습니다.`
    );
  };

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const renderInventoryItem = ({ item }: { item: InventoryItem }) => {
    const stockStatus = getStockStatus(item);

    return (
      <TouchableOpacity
        style={styles.inventoryCard}
        onPress={() => handleMovementPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.category) },
              ]}
            >
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
          <View style={styles.stockStatus}>
            <Ionicons
              name={stockStatus.icon as any}
              size={20}
              color={stockStatus.color}
            />
            <Text style={[styles.statusText, { color: stockStatus.color }]}>
              {stockStatus.status}
            </Text>
          </View>
        </View>

        <View style={styles.stockInfo}>
          <View style={styles.stockNumbers}>
            <Text style={styles.currentStock}>
              {item.currentStock} {item.unit}
            </Text>
            <Text style={styles.minStock}>
              최소: {item.minStock} {item.unit}
            </Text>
          </View>
          <Text style={styles.lastRestocked}>
            마지막 입고: {formatDate(item.lastRestocked)}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.footerText}>재고 이동 기록</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderMovementModal = () => (
    <Modal
      visible={isMovementModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setIsMovementModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>재고 이동</Text>
            <TouchableOpacity onPress={() => setIsMovementModalVisible(false)}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          {selectedItem && (
            <View style={styles.modalBody}>
              <View style={styles.selectedProduct}>
                <Text style={styles.selectedProductName}>
                  {selectedItem.productName}
                </Text>
                <Text style={styles.selectedProductStock}>
                  현재 재고: {selectedItem.currentStock} {selectedItem.unit}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>이동 유형</Text>
                <View style={styles.typeSelector}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      movementType === "입고" && styles.typeButtonActive,
                    ]}
                    onPress={() => setMovementType("입고")}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        movementType === "입고" && styles.typeButtonTextActive,
                      ]}
                    >
                      입고
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      movementType === "출고" && styles.typeButtonActive,
                    ]}
                    onPress={() => setMovementType("출고")}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        movementType === "출고" && styles.typeButtonTextActive,
                      ]}
                    >
                      출고
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>수량</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="수량을 입력하세요"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>사유 (선택사항)</Text>
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="이동 사유를 입력하세요"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsMovementModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleMovementSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {movementType} 처리
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderStockAlertModal = () => {
    const lowStockItems = getLowStockItems();

    return (
      <Modal
        visible={isStockAlertModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsStockAlertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>재고 부족 알림</Text>
              <TouchableOpacity
                onPress={() => setIsStockAlertModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#737373" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.alertInfo}>
                <Ionicons name="warning" size={48} color="#f59e0b" />
                <Text style={styles.alertTitle}>
                  {lowStockItems.length}개 품목의 재고가 부족합니다
                </Text>
                <Text style={styles.alertSubtitle}>
                  빠른 입고 처리가 필요합니다
                </Text>
              </View>

              <FlatList
                data={lowStockItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <View style={styles.alertItem}>
                      <View style={styles.alertItemInfo}>
                        <Text style={styles.alertItemName}>
                          {item.productName}
                        </Text>
                        <View style={styles.alertItemStock}>
                          <Ionicons
                            name={stockStatus.icon as any}
                            size={16}
                            color={stockStatus.color}
                          />
                          <Text
                            style={[
                              styles.alertItemStockText,
                              { color: stockStatus.color },
                            ]}
                          >
                            {item.currentStock}/{item.minStock} {item.unit}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.quickActionButton}
                        onPress={() => {
                          setIsStockAlertModalVisible(false);
                          handleMovementPress(item);
                        }}
                      >
                        <Text style={styles.quickActionText}>입고</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                style={styles.alertList}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const lowStockCount = getLowStockItems().length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>재고 관리</Text>
        <TouchableOpacity style={styles.alertButton} onPress={handleStockAlert}>
          <Ionicons name="notifications" size={20} color="#ffffff" />
          {lowStockCount > 0 && (
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>{lowStockCount}</Text>
            </View>
          )}
          <Text style={styles.alertButtonText}>재고 알림</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{inventoryItems.length}</Text>
          <Text style={styles.summaryLabel}>관리 품목</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text
            style={[
              styles.summaryNumber,
              lowStockCount > 0 && { color: "#f59e0b" },
            ]}
          >
            {lowStockCount}
          </Text>
          <Text style={styles.summaryLabel}>부족 품목</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {inventoryItems.filter((item) => item.currentStock === 0).length}
          </Text>
          <Text style={styles.summaryLabel}>품절 품목</Text>
        </View>
      </View>

      <FlatList
        data={inventoryItems}
        renderItem={renderInventoryItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>관리할 재고가 없습니다</Text>
            <Text style={styles.emptyStateSubtitle}>
              제품을 추가하고 재고를 관리해보세요
            </Text>
          </View>
        }
      />

      {renderMovementModal()}
      {renderStockAlertModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717",
  },
  alertButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    position: "relative",
  },
  alertBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#dc2626",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alertBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
  alertButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#737373",
  },
  list: {
    flex: 1,
  },
  inventoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  stockStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  stockInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stockNumbers: {
    flex: 1,
  },
  currentStock: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 2,
  },
  minStock: {
    fontSize: 12,
    color: "#737373",
  },
  lastRestocked: {
    fontSize: 12,
    color: "#737373",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  footerText: {
    fontSize: 12,
    color: "#737373",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  alertModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
  },
  modalBody: {
    padding: 20,
  },
  selectedProduct: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 4,
  },
  selectedProductStock: {
    fontSize: 14,
    color: "#737373",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  typeButtonActive: {
    backgroundColor: "#ffffff",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#737373",
  },
  typeButtonTextActive: {
    color: "#171717",
  },
  quantityInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#171717",
  },
  reasonInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#171717",
    height: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#737373",
    textAlign: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#525252",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  // 알림 모달 스타일
  alertInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  alertSubtitle: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
  },
  alertList: {
    maxHeight: 200,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    marginBottom: 8,
  },
  alertItemInfo: {
    flex: 1,
  },
  alertItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 4,
  },
  alertItemStock: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertItemStockText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  quickActionButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickActionText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
});
