import React, { useState, useMemo } from "react";
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
  TextInput,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { useInvoice } from "../hooks/useInvoice";
import { Invoice, InvoiceStatus, TaxType } from "../types";
import { formatDate, formatCurrency } from "../utils/format";

const InvoiceManagementScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const { invoices, deleteInvoice } = useInvoice();

  // 라우트에서 필터 파라미터 받기
  const filterType = route.params?.filter as TaxType | undefined;

  // 필터 상태
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productFilter, setProductFilter] = useState<string[]>([]);

  // 과세/면세에 따른 기본 상품 필터 설정
  const defaultProductFilters = useMemo(() => {
    if (filterType === "과세") {
      return ["묵사발", "도토리묵", "청포묵"]; // 묵류
    } else if (filterType === "면세") {
      return ["착한손두부", "순두부", "시루콩나물", "대파콩나물"]; // 두부, 콩나물
    }
    return [];
  }, [filterType]);

  // 필터링된 계산서 목록
  const filteredInvoices = useMemo(() => {
    let filtered = [...invoices];

    // 과세/면세 필터 적용
    if (filterType) {
      filtered = filtered.filter((invoice) =>
        invoice.items.some((item) => item.taxType === filterType)
      );
    }

    // 기간 필터 적용
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.issueDate);
        return invoiceDate >= start && invoiceDate <= end;
      });
    }

    // 상품 필터 적용 (과세: 묵류만, 면세: 두부/콩나물만)
    if (productFilter.length > 0) {
      filtered = filtered.filter((invoice) =>
        invoice.items.some(
          (item) =>
            productFilter.includes(item.name) &&
            (!filterType || item.taxType === filterType)
        )
      );
    } else if (defaultProductFilters.length > 0) {
      // 기본 상품 필터 적용
      filtered = filtered.filter((invoice) =>
        invoice.items.some(
          (item) =>
            defaultProductFilters.includes(item.name) &&
            (!filterType || item.taxType === filterType)
        )
      );
    }

    return filtered;
  }, [
    invoices,
    filterType,
    startDate,
    endDate,
    productFilter,
    defaultProductFilters,
  ]);

  const handleCreateInvoice = () => {
    navigation.navigate("InvoiceEdit");
  };

  const handleEditInvoice = (invoice: Invoice) => {
    navigation.navigate("InvoiceEdit", { invoiceId: invoice.id });
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    Alert.alert("계산서 삭제", "정말로 이 계산서를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteInvoice(invoiceId);
        },
      },
    ]);
  };

  const getStatusColor = (status: InvoiceStatus): string => {
    switch (status) {
      case "임시저장":
        return COLORS.warning;
      case "발행":
        return COLORS.success;
      case "전송":
        return COLORS.primary;
      case "승인":
        return COLORS.success;
      case "취소":
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const toggleProductFilter = (productName: string) => {
    setProductFilter((prev) =>
      prev.includes(productName)
        ? prev.filter((name) => name !== productName)
        : [...prev, productName]
    );
  };

  const resetAllFilters = () => {
    setStartDate("");
    setEndDate("");
    setProductFilter([]);
  };

  const renderDateFilterModal = () => (
    <Modal
      visible={dateFilterVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: COLORS.background }]}
      >
        <View style={[styles.modalHeader, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity onPress={() => setDateFilterVisible(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: COLORS.text }]}>
            기간 설정
          </Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={[styles.clearText, { color: COLORS.primary }]}>
              초기화
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: COLORS.text }]}>
              시작일
            </Text>
            <TextInput
              style={[
                styles.dateInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: COLORS.text }]}>
              종료일
            </Text>
            <TextInput
              style={[
                styles.dateInput,
                { borderColor: COLORS.border, color: COLORS.text },
              ]}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: COLORS.primary }]}
            onPress={() => setDateFilterVisible(false)}
          >
            <Text style={[styles.applyButtonText, { color: COLORS.white }]}>
              적용
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderFilterBar = () => (
    <View style={[styles.filterBar, { backgroundColor: COLORS.white }]}>
      {/* 타입 표시 */}
      {filterType && (
        <View
          style={[
            styles.filterChip,
            {
              backgroundColor:
                filterType === "과세"
                  ? COLORS.error + "20"
                  : COLORS.success + "20",
              borderColor:
                filterType === "과세" ? COLORS.error : COLORS.success,
            },
          ]}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filterType === "과세" ? COLORS.error : COLORS.success },
            ]}
          >
            {filterType} 계산서
          </Text>
        </View>
      )}

      {/* 기간 필터 버튼 */}
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor:
              startDate && endDate ? COLORS.primary + "20" : COLORS.background,
            borderColor: startDate && endDate ? COLORS.primary : COLORS.border,
          },
        ]}
        onPress={() => setDateFilterVisible(true)}
      >
        <Ionicons
          name="calendar-outline"
          size={16}
          color={startDate && endDate ? COLORS.primary : COLORS.textSecondary}
        />
        <Text
          style={[
            styles.filterButtonText,
            {
              color:
                startDate && endDate ? COLORS.primary : COLORS.textSecondary,
            },
          ]}
        >
          {startDate && endDate ? `${startDate} ~ ${endDate}` : "기간 설정"}
        </Text>
      </TouchableOpacity>

      {/* 상품 필터 (과세: 묵류, 면세: 두부/콩나물) */}
      {filterType && (
        <View style={styles.productFilterContainer}>
          <Text
            style={[styles.productFilterLabel, { color: COLORS.textSecondary }]}
          >
            {filterType === "과세" ? "묵류" : "두부/콩나물"}:
          </Text>
          <View style={styles.productFilterButtons}>
            {defaultProductFilters.map((product) => {
              const isSelected =
                productFilter.length === 0 || productFilter.includes(product);
              return (
                <TouchableOpacity
                  key={product}
                  style={[
                    styles.productFilterChip,
                    {
                      backgroundColor: isSelected
                        ? COLORS.primary + "20"
                        : COLORS.background,
                      borderColor: isSelected ? COLORS.primary : COLORS.border,
                    },
                  ]}
                  onPress={() => toggleProductFilter(product)}
                >
                  <Text
                    style={[
                      styles.productFilterChipText,
                      {
                        color: isSelected
                          ? COLORS.primary
                          : COLORS.textSecondary,
                      },
                    ]}
                  >
                    {product}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* 필터 초기화 버튼 */}
      {(startDate || endDate || productFilter.length > 0) && (
        <TouchableOpacity
          style={[styles.resetButton, { borderColor: COLORS.textSecondary }]}
          onPress={resetAllFilters}
        >
          <Ionicons
            name="refresh-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text
            style={[styles.resetButtonText, { color: COLORS.textSecondary }]}
          >
            초기화
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInvoiceCard = ({ item }: { item: Invoice }) => (
    <View style={[styles.invoiceCard, { backgroundColor: COLORS.white }]}>
      <View style={styles.invoiceHeader}>
        <Text style={[styles.invoiceNumber, { color: COLORS.text }]}>
          {item.invoiceNumber}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
        <Text style={[styles.issueDate, { color: COLORS.textSecondary }]}>
          {formatDate(item.issueDate)}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amountLabel, { color: COLORS.textSecondary }]}>
          과세 금액
        </Text>
        <Text style={[styles.amountLabel, { color: COLORS.textSecondary }]}>
          {formatCurrency(item.totalSupplyAmount)}
        </Text>
        <Text style={[styles.totalAmount, { color: COLORS.text }]}>
          총 {formatCurrency(item.totalAmount)}
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: COLORS.primary + "20" },
          ]}
          onPress={() => handleEditInvoice(item)}
        >
          <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
          <Text style={[styles.actionText, { color: COLORS.primary }]}>
            수정
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: COLORS.error + "20" },
          ]}
          onPress={() => deleteInvoice(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          <Text style={[styles.actionText, { color: COLORS.error }]}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
              {filterType ? `${filterType} 계산서 관리` : "계산서 관리"}
            </Text>
            <TouchableOpacity onPress={handleCreateInvoice}>
              <Ionicons name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* 필터 바 */}
        {renderFilterBar()}

        {/* 통계 정보 */}
        {filterType && (
          <View
            style={[styles.statsContainer, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.statsText, { color: COLORS.textSecondary }]}>
              총 {filteredInvoices.length}건의 {filterType} 계산서
            </Text>
            {defaultProductFilters.length > 0 && (
              <Text
                style={[styles.statsSubText, { color: COLORS.textSecondary }]}
              >
                ({filterType === "과세" ? "묵류" : "두부/콩나물"} 상품 기준)
              </Text>
            )}
          </View>
        )}

        {filteredInvoices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={80}
              color={COLORS.textSecondary}
            />
            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
              등록된 계산서가 없습니다
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: COLORS.primary }]}
              onPress={handleCreateInvoice}
            >
              <Text style={[styles.createButtonText, { color: COLORS.white }]}>
                첫 계산서 등록하기
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredInvoices}
            renderItem={renderInvoiceCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* 기간 설정 모달 */}
        {renderDateFilterModal()}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
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
    paddingBottom: 100,
  },
  invoiceCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  issueDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // 필터 바 스타일
  filterBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  productFilterContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 8,
    width: "100%",
  },
  productFilterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  productFilterButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  productFilterChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  productFilterChipText: {
    fontSize: 11,
    fontWeight: "500",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: "500",
  },
  // 통계 컨테이너
  statsContainer: {
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsSubText: {
    fontSize: 12,
    marginTop: 2,
  },
  // 모달 스타일
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  clearText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InvoiceManagementScreen;
