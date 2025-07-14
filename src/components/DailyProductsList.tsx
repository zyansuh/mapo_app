import React, { useState } from "react";
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

interface GroupedDelivery {
  date: string;
  deliveries: ProductDelivery[];
  totalAmount: number;
}

export const DailyProductsList: React.FC<DailyProductsListProps> = ({
  companyId,
  deliveries,
  onAddDelivery,
  onEditDelivery,
  onDeleteDelivery,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜별로 배송 그룹화
  const groupedDeliveries = React.useMemo(() => {
    const groups: { [key: string]: GroupedDelivery } = {};

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
      groups[dateKey].totalAmount += delivery.totalPrice;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "배송완료":
        return "#10b981";
      case "배송중":
        return "#f59e0b";
      case "취소":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "배송완료":
        return "checkmark-circle";
      case "배송중":
        return "car";
      case "취소":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const handleDeleteDelivery = (delivery: ProductDelivery) => {
    Alert.alert(
      "배송 삭제",
      `${delivery.product.name} 배송을 삭제하시겠습니까?`,
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
          <Text style={styles.productName}>{item.product.name}</Text>
          <Text style={styles.productCategory}>{item.product.category}</Text>
        </View>
        <View style={styles.deliveryActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEditDelivery(item)}
          >
            <Ionicons name="pencil" size={16} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteDelivery(item)}
          >
            <Ionicons name="trash" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.deliveryDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>수량:</Text>
          <Text style={styles.detailValue}>
            {item.quantity} {item.product.unit}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>단가:</Text>
          <Text style={styles.detailValue}>{formatPrice(item.unitPrice)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>총액:</Text>
          <Text style={[styles.detailValue, styles.totalPrice]}>
            {formatPrice(item.totalPrice)}
          </Text>
        </View>
      </View>

      <View style={styles.deliveryFooter}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={12}
            color="#ffffff"
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        {item.memo && (
          <Text style={styles.memoText} numberOfLines={2}>
            📝 {item.memo}
          </Text>
        )}
      </View>
    </View>
  );

  const renderDateGroup = ({ item }: { item: GroupedDelivery }) => (
    <View style={styles.dateGroup}>
      <TouchableOpacity
        style={styles.dateHeader}
        onPress={() =>
          setSelectedDate(selectedDate === item.date ? null : item.date)
        }
      >
        <View style={styles.dateInfo}>
          <Text style={styles.dateTitle}>{formatDate(item.date)}</Text>
          <Text style={styles.dateSubtitle}>
            {item.deliveries.length}건 • {formatPrice(item.totalAmount)}
          </Text>
        </View>
        <Ionicons
          name={selectedDate === item.date ? "chevron-up" : "chevron-down"}
          size={20}
          color="#737373"
        />
      </TouchableOpacity>

      {selectedDate === item.date && (
        <View style={styles.deliveriesContainer}>
          <FlatList
            data={item.deliveries}
            renderItem={renderDeliveryItem}
            keyExtractor={(delivery) => delivery.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );

  if (groupedDeliveries.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyStateTitle}>배송 기록이 없습니다</Text>
        <Text style={styles.emptyStateSubtitle}>
          아직 배송된 상품이 없습니다.{"\n"}새로운 배송을 등록해보세요!
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddDelivery}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>배송 등록</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>배송 기록</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onAddDelivery}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.headerButtonText}>새 배송</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupedDeliveries}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
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
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#525252",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  list: {
    flex: 1,
  },
  dateGroup: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 4,
  },
  dateSubtitle: {
    fontSize: 14,
    color: "#737373",
  },
  deliveriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  deliveryItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#525252",
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: "#737373",
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  deliveryActions: {
    flexDirection: "row",
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  deliveryDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: "#737373",
  },
  detailValue: {
    fontSize: 14,
    color: "#171717",
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },
  deliveryFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 4,
  },
  memoText: {
    fontSize: 12,
    color: "#737373",
    fontStyle: "italic",
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    lineHeight: 20,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#525252",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});
