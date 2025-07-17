import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProductDelivery } from "../types";

interface DailyProductsListProps {
  companyId: string;
  deliveries: ProductDelivery[];
  onAddDelivery: () => void;
  onEditDelivery: (delivery: ProductDelivery) => void;
  onDeleteDelivery: (deliveryId: string) => void;
}

export const DailyProductsList: React.FC<DailyProductsListProps> = ({
  companyId,
  deliveries,
  onAddDelivery,
  onEditDelivery,
  onDeleteDelivery,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜별로 배송 데이터 그룹화
  const groupedDeliveries = useMemo(() => {
    const groups: {
      [key: string]: {
        date: string;
        deliveries: ProductDelivery[];
        totalAmount: number;
      };
    } = {};

    deliveries.forEach((delivery) => {
      const dateKey = delivery.deliveryDate.toISOString().split("T")[0];

      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          deliveries: [],
          totalAmount: 0,
        };
      }

      groups[dateKey].deliveries.push(delivery);
      groups[dateKey].totalAmount += delivery.totalAmount;
    });

    return Object.values(groups).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [deliveries]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const handleDeleteDelivery = (delivery: ProductDelivery) => {
    Alert.alert(
      "배송 삭제",
      `배송번호 ${delivery.deliveryNumber}을(를) 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => onDeleteDelivery(delivery.id),
        },
      ]
    );
  };

  const renderDeliveryItem = ({ item }: { item: ProductDelivery }) => (
    <View style={styles.deliveryItem}>
      <View style={styles.deliveryHeader}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>
            배송번호: {item.deliveryNumber}
          </Text>
          <Text style={styles.productCategory}>상품 {item.items.length}개</Text>
        </View>
        <View style={styles.deliveryActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEditDelivery(item)}
          >
            <Ionicons name="create-outline" size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteDelivery(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.deliveryDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>총 수량:</Text>
          <Text style={styles.detailValue}>{item.totalQuantity}개</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>총액:</Text>
          <Text style={[styles.detailValue, styles.totalPrice]}>
            {formatPrice(item.totalAmount)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>상태:</Text>
          <Text style={styles.detailValue}>{item.status}</Text>
        </View>
      </View>

      {item.memo && (
        <View style={styles.memoContainer}>
          <Text style={styles.memoText}>{item.memo}</Text>
        </View>
      )}
    </View>
  );

  const renderDateGroup = ({ item }: { item: any }) => (
    <View style={styles.dateGroup}>
      <TouchableOpacity
        style={styles.dateHeader}
        onPress={() =>
          setSelectedDate(selectedDate === item.date ? null : item.date)
        }
      >
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <View style={styles.dateInfo}>
          <Text style={styles.countText}>{item.deliveries.length}건</Text>
          <Text style={styles.amountText}>{formatPrice(item.totalAmount)}</Text>
          <Ionicons
            name={selectedDate === item.date ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {selectedDate === item.date && (
        <FlatList
          data={item.deliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(delivery) => delivery.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>배송 목록</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddDelivery}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>배송 추가</Text>
        </TouchableOpacity>
      </View>

      {groupedDeliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>등록된 배송이 없습니다.</Text>
          <Text style={styles.emptySubtext}>새로운 배송을 추가해보세요.</Text>
        </View>
      ) : (
        <FlatList
          data={groupedDeliveries}
          renderItem={renderDateGroup}
          keyExtractor={(item) => item.date}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  dateGroup: {
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  countText: {
    fontSize: 14,
    color: "#666",
  },
  amountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007bff",
  },
  deliveryItem: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  deliveryHeader: {
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
    color: "#333",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
  },
  deliveryActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  deliveryDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  totalPrice: {
    color: "#007bff",
    fontWeight: "600",
  },
  memoContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  memoText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default DailyProductsList;
