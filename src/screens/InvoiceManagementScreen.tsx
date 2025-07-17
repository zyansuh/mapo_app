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
import {
  RootStackParamList,
  Invoice,
  InvoiceStatus,
  InvoiceType,
  PaymentStatus,
} from "../types";
import { useTheme } from "../hooks/useTheme";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// 임시 계산서 데이터
const SAMPLE_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    invoiceType: "과세" as InvoiceType,
    companyId: "1",
    status: "발행완료" as InvoiceStatus,
    paymentStatus: "미결제" as PaymentStatus,
    subtotalAmount: 409090,
    discountAmount: 0,
    taxableAmount: 409090,
    totalAmount: 450000,
    totalWithTax: 450000,
    taxAmount: 40910,
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    issuedDate: new Date(),
    items: [],
    notes: "정기 거래",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    invoiceType: "과세" as InvoiceType,
    companyId: "2",
    status: "미수금" as InvoiceStatus,
    paymentStatus: "미결제" as PaymentStatus,
    subtotalAmount: 290909,
    discountAmount: 0,
    taxableAmount: 290909,
    totalAmount: 320000,
    totalWithTax: 320000,
    taxAmount: 29091,
    invoiceDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    issuedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    items: [],
    notes: "긴급 주문",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    invoiceType: "과세" as InvoiceType,
    companyId: "3",
    status: "수금완료" as InvoiceStatus,
    paymentStatus: "완료" as PaymentStatus,
    subtotalAmount: 163636,
    discountAmount: 0,
    taxableAmount: 163636,
    totalAmount: 180000,
    totalWithTax: 180000,
    taxAmount: 16364,
    invoiceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    issuedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    items: [],
    notes: "일반 주문",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const InvoiceManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 실제로는 API에서 데이터를 새로고침
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "수금완료":
        return "#10b981";
      case "발행완료":
        return "#3b82f6";
      case "미수금":
        return "#ef4444";
      case "취소됨":
        return "#6b7280";
      default:
        return "#f59e0b";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "수금완료":
        return "checkmark-circle";
      case "발행완료":
        return "document-text";
      case "미수금":
        return "time";
      case "취소됨":
        return "close-circle";
      default:
        return "document";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR").format(date);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewInvoice = (invoice: Invoice) => {
    Alert.alert(
      "계산서 보기",
      `${invoice.invoiceNumber} 계산서를 확인하시겠습니까?`
    );
  };

  const handleEditInvoice = (invoice: Invoice) => {
    Alert.alert(
      "계산서 수정",
      `${invoice.invoiceNumber} 계산서를 수정하시겠습니까?`
    );
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    Alert.alert(
      "계산서 삭제",
      `${invoice.invoiceNumber}을(를) 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => {
            setInvoices(invoices.filter((i) => i.id !== invoice.id));
          },
        },
      ]
    );
  };

  const handleSendInvoice = (invoice: Invoice) => {
    Alert.alert(
      "계산서 발송",
      `${invoice.invoiceNumber} 계산서를 고객에게 발송하시겠습니까?`
    );
  };

  const handleCreateInvoice = () => {
    Alert.alert("계산서 생성", "새 계산서를 생성하시겠습니까?");
  };

  const renderInvoiceItem = ({ item }: { item: Invoice }) => {
    const daysUntilDue = item.dueDate ? getDaysUntilDue(item.dueDate) : null;
    const isOverdue = daysUntilDue !== null && daysUntilDue < 0;

    return (
      <TouchableOpacity
        style={[
          styles.invoiceCard,
          { backgroundColor: theme.colors.card },
          isOverdue && item.status === "미수금" && styles.overdueCard,
        ]}
        onPress={() => handleViewInvoice(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.invoiceHeader}>
            <View style={styles.invoiceMainInfo}>
              <View style={styles.invoiceTitleRow}>
                <Ionicons
                  name={getStatusIcon(item.status)}
                  size={16}
                  color={getStatusColor(item.status)}
                  style={styles.statusIcon}
                />
                <Text
                  style={[styles.invoiceNumber, { color: theme.colors.text }]}
                >
                  {item.invoiceNumber}
                </Text>
              </View>
              {item.notes && (
                <Text
                  style={[
                    styles.invoiceNotes,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.notes}
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

          <View style={styles.invoiceDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={14} color="#6b7280" />
              <Text style={styles.amountText}>
                총액: {formatPrice(item.totalAmount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="receipt-outline" size={14} color="#6b7280" />
              <Text style={styles.taxText}>
                부가세: {formatPrice(item.taxAmount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text style={styles.dueDateText}>
                마감일: {item.dueDate ? formatDate(item.dueDate) : "미정"}
              </Text>
            </View>

            {isOverdue && item.status === "미수금" && (
              <View style={styles.detailRow}>
                <Ionicons name="warning" size={14} color="#ef4444" />
                <Text style={styles.overdueText}>
                  {Math.abs(daysUntilDue)}일 연체
                </Text>
              </View>
            )}

            {!isOverdue &&
              daysUntilDue !== null &&
              daysUntilDue <= 7 &&
              item.status === "발행완료" && (
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={14} color="#f59e0b" />
                  <Text style={styles.dueSoonText}>
                    {daysUntilDue}일 후 마감
                  </Text>
                </View>
              )}
          </View>

          <View style={styles.cardActions}>
            <Text
              style={[styles.issuedDate, { color: theme.colors.textSecondary }]}
            >
              발행: {item.issuedDate ? formatDate(item.issuedDate) : "미정"}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => handleSendInvoice(item)}
              >
                <Ionicons name="send" size={16} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditInvoice(item)}
              >
                <Ionicons name="create-outline" size={16} color="#10b981" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteInvoice(item)}
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
      <Ionicons name="document-text-outline" size={64} color="#9ca3af" />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        발행된 계산서가 없습니다
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        첫 번째 계산서를 생성하고{"\n"}매출 관리를 시작해보세요!
      </Text>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={handleCreateInvoice}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>계산서 생성하기</Text>
      </TouchableOpacity>
    </View>
  );

  const getInvoiceStats = () => {
    const totalInvoices = invoices.length;
    const completed = invoices.filter((i) => i.status === "수금완료").length;
    const pending = invoices.filter((i) => i.status === "발행완료").length;
    const overdue = invoices.filter((i) => i.status === "미수금").length;
    const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
    const completedAmount = invoices
      .filter((i) => i.status === "수금완료")
      .reduce((sum, i) => sum + i.totalAmount, 0);

    return {
      totalInvoices,
      completed,
      pending,
      overdue,
      totalAmount,
      completedAmount,
    };
  };

  const stats = getInvoiceStats();

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
            <Text style={styles.headerTitle}>계산서 관리</Text>
            <Text style={styles.headerSubtitle}>
              총 {stats.totalInvoices}건 • 수금완료 {stats.completed}건
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
                {stats.totalInvoices}
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
                수금완료
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statNumber, { color: "#ef4444" }]}>
                {stats.overdue}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                미수금
              </Text>
            </View>
          </View>
          <View
            style={[styles.valueCard, { backgroundColor: theme.colors.card }]}
          >
            <Text
              style={[styles.valueLabel, { color: theme.colors.textSecondary }]}
            >
              총 매출액
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
              수금: {formatPrice(stats.completedAmount)}
            </Text>
          </View>
        </View>

        {/* 계산서 목록 */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            계산서 목록
          </Text>
          <FlatList
            data={invoices}
            renderItem={renderInvoiceItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              invoices.length === 0 && styles.emptyListContainer,
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
          onPress={handleCreateInvoice}
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
  invoiceCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  cardContent: {
    padding: 16,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  invoiceMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  invoiceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusIcon: {
    marginRight: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  invoiceNotes: {
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
  invoiceDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  amountText: {
    fontSize: 14,
    color: "#1f2937",
    marginLeft: 8,
    fontWeight: "600",
  },
  taxText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  dueDateText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  overdueText: {
    fontSize: 12,
    color: "#ef4444",
    marginLeft: 8,
    fontWeight: "600",
  },
  dueSoonText: {
    fontSize: 12,
    color: "#f59e0b",
    marginLeft: 8,
    fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  issuedDate: {
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sendButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
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

export default InvoiceManagementScreen;
