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
import {
  CreditRecord,
  CreditPayment,
  CreditStatus,
  PaymentMethod,
} from "../types";

interface CreditManagementProps {
  companyId: string;
  creditRecords: CreditRecord[];
  onAddCredit: () => void;
  onAddPayment: (
    creditId: string,
    payment: Omit<CreditPayment, "id" | "createdAt">
  ) => void;
  onUpdateCredit: (creditId: string, updates: Partial<CreditRecord>) => void;
}

// 샘플 외상 데이터
const sampleCreditRecords: CreditRecord[] = [
  {
    id: "1",
    companyId: "1",
    amount: 1000000,
    paidAmount: 300000,
    remainingAmount: 700000,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
    status: "정상",
    description: "상품 공급 대금",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    companyId: "1",
    amount: 500000,
    paidAmount: 0,
    remainingAmount: 500000,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전 (연체)
    status: "연체",
    description: "제품 구매 대금",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const CreditManagement: React.FC<CreditManagementProps> = ({
  companyId,
  creditRecords,
  onAddCredit,
  onAddPayment,
  onUpdateCredit,
}) => {
  const [selectedCredit, setSelectedCredit] = useState<CreditRecord | null>(
    null
  );
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    paymentMethod: "현금" as PaymentMethod,
    memo: "",
  });
  const [filterStatus, setFilterStatus] = useState<CreditStatus | "전체">(
    "전체"
  );

  // 실제 앱에서는 props로 받은 creditRecords를 사용하지만, 데모용으로 샘플 데이터 사용
  const displayRecords =
    creditRecords.length > 0 ? creditRecords : sampleCreditRecords;

  const paymentMethods: PaymentMethod[] = [
    "현금",
    "계좌이체",
    "카드",
    "어음",
    "기타",
  ];
  const statusOptions: (CreditStatus | "전체")[] = [
    "전체",
    "정상",
    "연체",
    "상환완료",
    "취소",
  ];

  const filteredRecords = displayRecords.filter(
    (record) => filterStatus === "전체" || record.status === filterStatus
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: CreditStatus) => {
    switch (status) {
      case "정상":
        return "#10b981";
      case "연체":
        return "#ef4444";
      case "상환완료":
        return "#6b7280";
      case "취소":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: CreditStatus) => {
    switch (status) {
      case "정상":
        return "checkmark-circle";
      case "연체":
        return "warning";
      case "상환완료":
        return "checkmark-done";
      case "취소":
        return "close-circle";
      default:
        return "help-circle";
    }
  };

  const isDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePayment = (credit: CreditRecord) => {
    setSelectedCredit(credit);
    setPaymentFormData({
      amount: credit.remainingAmount.toString(),
      paymentMethod: "현금",
      memo: "",
    });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentSubmit = () => {
    if (!selectedCredit) return;

    const amount = parseInt(paymentFormData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("알림", "올바른 금액을 입력해주세요.");
      return;
    }

    if (amount > selectedCredit.remainingAmount) {
      Alert.alert("알림", "지불 금액이 잔여 금액보다 클 수 없습니다.");
      return;
    }

    const payment: Omit<CreditPayment, "id" | "createdAt"> = {
      creditRecordId: selectedCredit.id,
      amount,
      paymentMethod: paymentFormData.paymentMethod,
      paymentDate: new Date(),
      memo: paymentFormData.memo,
    };

    onAddPayment(selectedCredit.id, payment);
    setIsPaymentModalVisible(false);
    setSelectedCredit(null);
    setPaymentFormData({
      amount: "",
      paymentMethod: "현금",
      memo: "",
    });
    Alert.alert("완료", "지불이 등록되었습니다!");
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
    setSelectedCredit(null);
    setPaymentFormData({
      amount: "",
      paymentMethod: "현금",
      memo: "",
    });
  };

  const renderStatusFilter = () => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>상태 필터</Text>
      <FlatList
        data={statusOptions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterItem,
              filterStatus === item && styles.selectedFilterItem,
              {
                backgroundColor:
                  filterStatus === item
                    ? getStatusColor(item as CreditStatus)
                    : "#F5F5F5",
              },
            ]}
            onPress={() => setFilterStatus(item)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === item && styles.selectedFilterText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
      />
    </View>
  );

  const renderCreditItem = ({ item }: { item: CreditRecord }) => {
    const daysUntilDue = getDaysUntilDue(item.dueDate);
    const isOverdue = isDue(item.dueDate) && item.status !== "상환완료";
    const progressPercentage = (item.paidAmount / item.amount) * 100;

    return (
      <View style={styles.creditCard}>
        <View style={styles.creditHeader}>
          <View style={styles.creditInfo}>
            <Text style={styles.creditAmount}>{formatPrice(item.amount)}</Text>
            <Text style={styles.creditDescription}>{item.description}</Text>
          </View>
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
        </View>

        <View style={styles.creditProgress}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(progressPercentage)}% 완료
          </Text>
        </View>

        <View style={styles.creditDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>지불 완료:</Text>
            <Text style={styles.detailValue}>
              {formatPrice(item.paidAmount)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>잔여 금액:</Text>
            <Text style={[styles.detailValue, styles.remainingAmount]}>
              {formatPrice(item.remainingAmount)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>지불 기한:</Text>
            <Text style={[styles.detailValue, isOverdue && styles.overdueText]}>
              {formatDate(item.dueDate)}
              {isOverdue
                ? " (연체)"
                : daysUntilDue > 0
                ? ` (${daysUntilDue}일 후)`
                : " (오늘)"}
            </Text>
          </View>
        </View>

        {item.remainingAmount > 0 && item.status !== "상환완료" && (
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => handlePayment(item)}
          >
            <Ionicons name="card" size={16} color="#ffffff" />
            <Text style={styles.paymentButtonText}>지불하기</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPaymentModal = () => (
    <Modal
      visible={isPaymentModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handlePaymentCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>지불 등록</Text>
            <TouchableOpacity onPress={handlePaymentCancel}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          {selectedCredit && (
            <View style={styles.modalBody}>
              <View style={styles.creditSummary}>
                <Text style={styles.creditSummaryTitle}>외상 정보</Text>
                <Text style={styles.creditSummaryText}>
                  총 금액: {formatPrice(selectedCredit.amount)}
                </Text>
                <Text style={styles.creditSummaryText}>
                  잔여 금액: {formatPrice(selectedCredit.remainingAmount)}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>지불 금액</Text>
                <TextInput
                  style={styles.amountInput}
                  value={paymentFormData.amount}
                  onChangeText={(text) =>
                    setPaymentFormData((prev) => ({ ...prev, amount: text }))
                  }
                  keyboardType="numeric"
                  placeholder="지불할 금액을 입력하세요"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>지불 방법</Text>
                <FlatList
                  data={paymentMethods}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.paymentMethodItem,
                        paymentFormData.paymentMethod === item &&
                          styles.selectedPaymentMethod,
                      ]}
                      onPress={() =>
                        setPaymentFormData((prev) => ({
                          ...prev,
                          paymentMethod: item,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.paymentMethodText,
                          paymentFormData.paymentMethod === item &&
                            styles.selectedPaymentMethodText,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.paymentMethodList}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>메모 (선택사항)</Text>
                <TextInput
                  style={styles.memoInput}
                  value={paymentFormData.memo}
                  onChangeText={(text) =>
                    setPaymentFormData((prev) => ({ ...prev, memo: text }))
                  }
                  placeholder="메모를 입력하세요"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handlePaymentCancel}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handlePaymentSubmit}
                >
                  <Text style={styles.submitButtonText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const getTotalStats = () => {
    const total = displayRecords.reduce(
      (acc, record) => {
        acc.totalAmount += record.amount;
        acc.paidAmount += record.paidAmount;
        acc.remainingAmount += record.remainingAmount;
        if (record.status === "연체") acc.overdueCount++;
        return acc;
      },
      { totalAmount: 0, paidAmount: 0, remainingAmount: 0, overdueCount: 0 }
    );
    return total;
  };

  const stats = getTotalStats();

  if (displayRecords.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="card-outline" size={48} color="#9ca3af" />
        <Text style={styles.emptyStateTitle}>외상 기록이 없습니다</Text>
        <Text style={styles.emptyStateSubtitle}>
          외상 거래 기록이 없습니다.{"\n"}새로운 외상을 등록해보세요!
        </Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddCredit}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>외상 등록</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>외상 관리</Text>
        <TouchableOpacity style={styles.headerButton} onPress={onAddCredit}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.headerButtonText}>외상 등록</Text>
        </TouchableOpacity>
      </View>

      {/* 통계 요약 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatPrice(stats.totalAmount)}</Text>
          <Text style={styles.statLabel}>총 외상</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatPrice(stats.remainingAmount)}
          </Text>
          <Text style={styles.statLabel}>잔여 금액</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.overdueValue]}>
            {stats.overdueCount}건
          </Text>
          <Text style={styles.statLabel}>연체</Text>
        </View>
      </View>

      {renderStatusFilter()}

      <FlatList
        data={filteredRecords}
        renderItem={renderCreditItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.creditList}
      />

      {renderPaymentModal()}
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
    marginBottom: 20,
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 4,
  },
  overdueValue: {
    color: "#ef4444",
  },
  statLabel: {
    fontSize: 12,
    color: "#737373",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 12,
  },
  filterList: {
    maxHeight: 40,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F5F5F5",
  },
  selectedFilterItem: {
    backgroundColor: "#525252",
  },
  filterText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "500",
  },
  selectedFilterText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  creditList: {
    flex: 1,
  },
  creditCard: {
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
  creditHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  creditInfo: {
    flex: 1,
  },
  creditAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 4,
  },
  creditDescription: {
    fontSize: 14,
    color: "#737373",
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
  creditProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#737373",
    textAlign: "right",
  },
  creditDetails: {
    marginBottom: 12,
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
  remainingAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
  },
  overdueText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#525252",
    paddingVertical: 12,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
  },
  modalBody: {
    padding: 20,
  },
  creditSummary: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  creditSummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 8,
  },
  creditSummaryText: {
    fontSize: 14,
    color: "#737373",
    marginBottom: 4,
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
  amountInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#171717",
  },
  paymentMethodList: {
    maxHeight: 40,
  },
  paymentMethodItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F5F5F5",
  },
  selectedPaymentMethod: {
    backgroundColor: "#525252",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "500",
  },
  selectedPaymentMethodText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  memoInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#171717",
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
});
