import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { useCompany } from "../hooks/useCompany";
import { useInvoice } from "../hooks/useInvoice";
import { Invoice, TaxType } from "../types/invoice";
import { formatCurrency, formatDate } from "../utils/format";

interface CompanySalesData {
  companyId: string;
  companyName: string;
  totalAmount: number;
  taxableAmount: number; // 과세 금액
  taxFreeAmount: number; // 면세 + 영세 금액
  invoiceCount: number;
  lastInvoiceDate: Date;
  taxableProducts: { name: string; quantity: number; amount: number }[];
  taxFreeProducts: { name: string; quantity: number; amount: number }[];
  transactions: {
    // 거래 내역 추가
    invoiceNumber: string;
    issueDate: Date;
    totalAmount: number;
    items: {
      name: string;
      quantity: number;
      amount: number;
      taxType: TaxType;
    }[];
  }[];
}

const CompanySalesAnalysisScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { companies, getCompanyById } = useCompany();
  const { invoices } = useInvoice();

  // 상태 관리
  const [searchText, setSearchText] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all"); // all, 1-6, custom
  const [startDate, setStartDate] = useState(new Date(2024, 0, 1)); // 2024년 1월
  const [endDate, setEndDate] = useState(new Date(2024, 5, 30)); // 2024년 6월
  const [sortBy, setSortBy] = useState<
    "company" | "total" | "taxable" | "taxFree"
  >("total");
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(
    null
  );
  const [dateFilterVisible, setDateFilterVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  // 거래처별 매출 통계 계산
  const companySalesData = useMemo(() => {
    // 임시: comp1-comp10을 실제 거래처명으로 매핑
    const companyMapping: { [key: string]: string } = {
      comp1: "(유)승일",
      comp2: "강진터미널마트",
      comp3: "고향맛집",
      comp4: "담양마트",
      comp5: "백제회관",
      comp6: "담양대통죽순순대",
      comp7: "담양백동숯불갈비",
      comp8: "담양갈비창고",
      comp9: "금성참숯갈비",
      comp10: "국민닭갈비",
    };

    const salesMap = new Map<string, CompanySalesData>();

    invoices.forEach((invoice) => {
      let company = getCompanyById(invoice.companyId);

      // comp1-comp10인 경우 이름으로 찾기
      if (!company && companyMapping[invoice.companyId]) {
        const companyName = companyMapping[invoice.companyId];
        company = companies.find(
          (c) => c.name.includes(companyName) || companyName.includes(c.name)
        );
      }

      if (!company) {
        return;
      }

      const invoiceDate = new Date(invoice.issueDate);

      // 기간 필터링
      if (selectedPeriod === "1-6") {
        if (
          invoiceDate < new Date(2024, 0, 1) ||
          invoiceDate > new Date(2024, 5, 30)
        ) {
          return;
        }
      } else if (selectedPeriod === "custom") {
        if (invoiceDate < startDate || invoiceDate > endDate) {
          return;
        }
      }

      let salesData = salesMap.get(invoice.companyId);
      if (!salesData) {
        salesData = {
          companyId: invoice.companyId,
          companyName: company.name,
          totalAmount: 0,
          taxableAmount: 0,
          taxFreeAmount: 0,
          invoiceCount: 0,
          lastInvoiceDate: invoiceDate,
          taxableProducts: [],
          taxFreeProducts: [],
          transactions: [],
        };
        salesMap.set(invoice.companyId, salesData);
      }

      salesData.totalAmount += invoice.totalAmount;
      salesData.invoiceCount += 1;

      if (invoiceDate > salesData.lastInvoiceDate) {
        salesData.lastInvoiceDate = invoiceDate;
      }

      // 거래 내역 추가
      salesData.transactions.push({
        invoiceNumber: invoice.invoiceNumber,
        issueDate: invoiceDate,
        totalAmount: invoice.totalAmount,
        items: invoice.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          amount: item.totalAmount,
          taxType: item.taxType,
        })),
      });

      // 과세/면세별 분류
      invoice.items.forEach((item) => {
        const productInfo = {
          name: item.name,
          quantity: item.quantity,
          amount: item.totalAmount,
        };

        if (item.taxType === "과세") {
          salesData!.taxableAmount += item.totalAmount;

          // 기존 상품 찾기
          const existingProduct = salesData!.taxableProducts.find(
            (p) => p.name === item.name
          );
          if (existingProduct) {
            existingProduct.quantity += item.quantity;
            existingProduct.amount += item.totalAmount;
          } else {
            salesData!.taxableProducts.push(productInfo);
          }
        } else {
          salesData!.taxFreeAmount += item.totalAmount;

          // 기존 상품 찾기
          const existingProduct = salesData!.taxFreeProducts.find(
            (p) => p.name === item.name
          );
          if (existingProduct) {
            existingProduct.quantity += item.quantity;
            existingProduct.amount += item.totalAmount;
          } else {
            salesData!.taxFreeProducts.push(productInfo);
          }
        }
      });
    });

    return Array.from(salesMap.values());
  }, [invoices, companies, getCompanyById, selectedPeriod, startDate, endDate]);

  // 검색 및 정렬
  const filteredAndSortedData = useMemo(() => {
    let filtered = companySalesData;

    // 검색 필터
    if (searchText) {
      filtered = filtered.filter((data) =>
        data.companyName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "company":
          return a.companyName.localeCompare(b.companyName);
        case "total":
          return b.totalAmount - a.totalAmount;
        case "taxable":
          return b.taxableAmount - a.taxableAmount;
        case "taxFree":
          return b.taxFreeAmount - a.taxFreeAmount;
        default:
          return b.totalAmount - a.totalAmount;
      }
    });

    return filtered;
  }, [companySalesData, searchText, sortBy]);

  const openDateFilter = () => {
    setTempStartDate(startDate.toISOString().split("T")[0]);
    setTempEndDate(endDate.toISOString().split("T")[0]);
    setDateFilterVisible(true);
  };

  const applyDateFilter = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(new Date(tempStartDate));
      setEndDate(new Date(tempEndDate));
      setSelectedPeriod("custom");
    }
    setDateFilterVisible(false);
  };

  const clearDateFilter = () => {
    setTempStartDate("");
    setTempEndDate("");
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
                { borderColor: "#e5e7eb", color: COLORS.text },
              ]}
              value={tempStartDate}
              onChangeText={setTempStartDate}
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
                { borderColor: "#e5e7eb", color: COLORS.text },
              ]}
              value={tempEndDate}
              onChangeText={setTempEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: COLORS.primary }]}
            onPress={applyDateFilter}
          >
            <Text style={[styles.applyButtonText, { color: COLORS.white }]}>
              적용
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCompanyItem = ({ item }: { item: CompanySalesData }) => {
    const isExpanded = expandedCompanyId === item.companyId;

    return (
      <View style={[styles.companyCard, { backgroundColor: COLORS.white }]}>
        <TouchableOpacity
          onPress={() =>
            setExpandedCompanyId(isExpanded ? null : item.companyId)
          }
        >
          <View style={styles.companyHeader}>
            <Text style={[styles.companyName, { color: COLORS.text }]}>
              {item.companyName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={[styles.invoiceCount, { color: COLORS.textSecondary }]}
              >
                {item.invoiceCount}건
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
                color={COLORS.textSecondary}
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>

          <View style={styles.salesInfo}>
            <View style={styles.salesRow}>
              <Text
                style={[styles.salesLabel, { color: COLORS.textSecondary }]}
              >
                총 매출
              </Text>
              <Text style={[styles.salesAmount, { color: COLORS.text }]}>
                {formatCurrency(item.totalAmount)}
              </Text>
            </View>

            <View style={styles.salesRow}>
              <Text
                style={[styles.salesLabel, { color: COLORS.textSecondary }]}
              >
                과세상품 (묵류)
              </Text>
              <Text style={[styles.salesAmount, { color: COLORS.primary }]}>
                {formatCurrency(item.taxableAmount)}
              </Text>
            </View>

            <View style={styles.salesRow}>
              <Text
                style={[styles.salesLabel, { color: COLORS.textSecondary }]}
              >
                면세상품 (두부,콩나물)
              </Text>
              <Text style={[styles.salesAmount, { color: COLORS.success }]}>
                {formatCurrency(item.taxFreeAmount)}
              </Text>
            </View>

            <View style={styles.salesRow}>
              <Text
                style={[styles.salesLabel, { color: COLORS.textSecondary }]}
              >
                최근 거래
              </Text>
              <Text style={[styles.salesDate, { color: COLORS.textSecondary }]}>
                {formatDate(item.lastInvoiceDate)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 거래 내역 상세 */}
        {isExpanded && (
          <View
            style={[
              styles.transactionDetail,
              { backgroundColor: COLORS.background },
            ]}
          >
            <Text style={[styles.transactionTitle, { color: COLORS.text }]}>
              거래 내역 ({item.transactions.length}건)
            </Text>
            {item.transactions
              .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
              .map((transaction, index) => (
                <View
                  key={index}
                  style={[
                    styles.transactionItem,
                    { backgroundColor: COLORS.white },
                  ]}
                >
                  <View style={styles.transactionHeader}>
                    <Text
                      style={[
                        styles.transactionInvoiceNumber,
                        { color: COLORS.primary },
                      ]}
                    >
                      {transaction.invoiceNumber}
                    </Text>
                    <Text
                      style={[
                        styles.transactionDate,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {formatDate(transaction.issueDate)}
                    </Text>
                  </View>

                  <View style={styles.transactionItems}>
                    {transaction.items.map((transItem, itemIndex) => (
                      <View key={itemIndex} style={styles.transactionItemRow}>
                        <Text
                          style={[
                            styles.transactionItemName,
                            { color: COLORS.text },
                          ]}
                        >
                          {transItem.name}
                        </Text>
                        <Text
                          style={[
                            styles.transactionItemDetail,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          {transItem.quantity}개 ×{" "}
                          {formatCurrency(
                            transItem.amount / transItem.quantity
                          )}
                        </Text>
                        <Text
                          style={[
                            styles.transactionItemAmount,
                            {
                              color:
                                transItem.taxType === "과세"
                                  ? COLORS.primary
                                  : COLORS.success,
                            },
                          ]}
                        >
                          {formatCurrency(transItem.amount)}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.transactionTotal}>
                    <Text
                      style={[
                        styles.transactionTotalText,
                        { color: COLORS.text },
                      ]}
                    >
                      합계: {formatCurrency(transaction.totalAmount)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
      </View>
    );
  };

  const handleCompanyPress = (companyData: CompanySalesData) => {
    // 기존의 상세 화면 네비게이션 대신 확장/축소 토글로 변경
    setExpandedCompanyId(
      expandedCompanyId === companyData.companyId ? null : companyData.companyId
    );
  };

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === "all" && styles.activePeriodButton,
          selectedPeriod === "all" && { backgroundColor: COLORS.primary },
        ]}
        onPress={() => setSelectedPeriod("all")}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === "all" && { color: COLORS.white },
            { color: COLORS.text },
          ]}
        >
          전체
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === "1-6" && styles.activePeriodButton,
          selectedPeriod === "1-6" && { backgroundColor: COLORS.primary },
        ]}
        onPress={() => setSelectedPeriod("1-6")}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === "1-6" && { color: COLORS.white },
            { color: COLORS.text },
          ]}
        >
          1~6월
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.periodButton,
          selectedPeriod === "custom" && styles.activePeriodButton,
          selectedPeriod === "custom" && {
            backgroundColor: COLORS.primary,
          },
        ]}
        onPress={openDateFilter}
      >
        <Text
          style={[
            styles.periodButtonText,
            selectedPeriod === "custom" && { color: COLORS.white },
            { color: COLORS.text },
          ]}
        >
          {selectedPeriod === "custom" && tempStartDate && tempEndDate
            ? `${tempStartDate} ~ ${tempEndDate}`
            : "기간설정"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSortSelector = () => (
    <View style={styles.sortSelector}>
      <Text style={[styles.sortLabel, { color: COLORS.textSecondary }]}>
        정렬:
      </Text>
      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "total" && {
            backgroundColor: COLORS.primary + "20",
          },
        ]}
        onPress={() => setSortBy("total")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "total" && { color: COLORS.primary },
            { color: COLORS.text },
          ]}
        >
          총액순
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "taxable" && {
            backgroundColor: COLORS.primary + "20",
          },
        ]}
        onPress={() => setSortBy("taxable")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "taxable" && { color: COLORS.primary },
            { color: COLORS.text },
          ]}
        >
          과세순
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "taxFree" && {
            backgroundColor: COLORS.primary + "20",
          },
        ]}
        onPress={() => setSortBy("taxFree")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "taxFree" && { color: COLORS.primary },
            { color: COLORS.text },
          ]}
        >
          면세순
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.sortButton,
          sortBy === "company" && {
            backgroundColor: COLORS.primary + "20",
          },
        ]}
        onPress={() => setSortBy("company")}
      >
        <Text
          style={[
            styles.sortButtonText,
            sortBy === "company" && { color: COLORS.primary },
            { color: COLORS.text },
          ]}
        >
          거래처명
        </Text>
      </TouchableOpacity>
    </View>
  );

  // 전체 통계 계산
  const totalStats = useMemo(() => {
    const total = filteredAndSortedData.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );
    const taxable = filteredAndSortedData.reduce(
      (sum, item) => sum + item.taxableAmount,
      0
    );
    const taxFree = filteredAndSortedData.reduce(
      (sum, item) => sum + item.taxFreeAmount,
      0
    );

    return { total, taxable, taxFree };
  }, [filteredAndSortedData]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary + "DD"]}
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
              거래처별 매출 분석
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                총 매출
              </Text>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {formatCurrency(totalStats.total)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                과세 (묵류)
              </Text>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {formatCurrency(totalStats.taxable)}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: COLORS.white + "CC" }]}>
                면세 (두부,콩나물)
              </Text>
              <Text style={[styles.statValue, { color: COLORS.white }]}>
                {formatCurrency(totalStats.taxFree)}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.content, { backgroundColor: COLORS.background }]}>
          {/* 검색 */}
          <View
            style={[styles.searchContainer, { backgroundColor: COLORS.white }]}
          >
            <Ionicons name="search" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: COLORS.text }]}
              placeholder="거래처명 검색..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* 기간 선택 */}
          {renderPeriodSelector()}

          {/* 정렬 선택 */}
          {renderSortSelector()}

          {/* 거래처 목록 */}
          <FlatList
            data={filteredAndSortedData}
            renderItem={renderCompanyItem}
            keyExtractor={(item) => item.companyId}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>

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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 15,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activePeriodButton: {
    borderWidth: 0,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sortSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 20,
  },
  companyCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  invoiceCount: {
    fontSize: 14,
  },
  salesInfo: {
    marginBottom: 10,
  },
  salesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  salesLabel: {
    fontSize: 14,
  },
  salesAmount: {
    fontSize: 14,
    fontWeight: "600",
  },
  salesDate: {
    fontSize: 14,
  },
  productSummary: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  productSummaryText: {
    fontSize: 12,
    textAlign: "center",
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
  transactionDetail: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionItem: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionInvoiceNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionItems: {
    marginBottom: 8,
  },
  transactionItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
  },
  transactionItemName: {
    flex: 2,
    fontSize: 13,
  },
  transactionItemDetail: {
    flex: 2,
    fontSize: 11,
    textAlign: "center",
  },
  transactionItemAmount: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  transactionTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 6,
    alignItems: "flex-end",
  },
  transactionTotalText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CompanySalesAnalysisScreen;
