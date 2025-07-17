import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Invoice, InvoiceItem } from "../../types";
import { generateInvoiceText } from "../../services/invoiceService";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import {
  listStyles,
  getCategoryBadgeStyle,
  getCategoryTextStyle,
} from "../styles/listStyles";
import { COLORS, CATEGORY_COLORS } from "../../styles/colors";

interface InvoiceViewModalProps {
  visible: boolean;
  onClose: () => void;
  invoices: Invoice[];
}

// 기간 필터 타입
type PeriodFilter =
  | "상반기"
  | "하반기"
  | "전체"
  | "월별"
  | "분기별"
  | "사용자정의";
type MonthFilter = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | null;
type QuarterFilter = 1 | 2 | 3 | 4 | null;

export const InvoiceViewModal: React.FC<InvoiceViewModalProps> = ({
  visible,
  onClose,
  invoices,
}) => {
  const [selectedTab, setSelectedTab] = useState<"과세" | "면세">("과세");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("전체");
  const [monthFilter, setMonthFilter] = useState<MonthFilter>(null);
  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>(null);
  const [customStartMonth, setCustomStartMonth] = useState<MonthFilter>(null);
  const [customEndMonth, setCustomEndMonth] = useState<MonthFilter>(null);
  const [viewMode, setViewMode] = useState<"list" | "summary">("list");

  // 기간별 필터링 함수
  const filterInvoicesByPeriod = (invoices: Invoice[]) => {
    return invoices.filter((invoice) => {
      const invoiceMonth = new Date(invoice.invoiceDate).getMonth() + 1;

      switch (periodFilter) {
        case "상반기":
          return invoiceMonth >= 1 && invoiceMonth <= 6;
        case "하반기":
          return invoiceMonth >= 7 && invoiceMonth <= 12;
        case "월별":
          return monthFilter ? invoiceMonth === monthFilter : true;
        case "분기별":
          if (quarterFilter === 1)
            return invoiceMonth >= 1 && invoiceMonth <= 3;
          if (quarterFilter === 2)
            return invoiceMonth >= 4 && invoiceMonth <= 6;
          if (quarterFilter === 3)
            return invoiceMonth >= 7 && invoiceMonth <= 9;
          if (quarterFilter === 4)
            return invoiceMonth >= 10 && invoiceMonth <= 12;
          return true;
        case "사용자정의":
          if (customStartMonth && customEndMonth) {
            return (
              invoiceMonth >= customStartMonth && invoiceMonth <= customEndMonth
            );
          }
          return true;
        case "전체":
        default:
          return true;
      }
    });
  };

  // 탭별 필터링 함수
  const filterInvoicesByTab = (invoices: Invoice[]) => {
    return invoices.filter((invoice) => {
      const hasTargetItems = invoice.items.some((item) => {
        if (selectedTab === "과세") {
          return item.category === "묵류"; // 묵류는 과세
        } else {
          return item.category === "두부" || item.category === "콩나물"; // 두부, 콩나물은 면세
        }
      });
      return hasTargetItems;
    });
  };

  // 최종 필터링된 계산서 목록
  const filteredInvoices = filterInvoicesByTab(
    filterInvoicesByPeriod(invoices)
  );

  // 회사별 요약 데이터 생성
  const generateSummaryData = () => {
    const summaryMap = new Map();

    filteredInvoices.forEach((invoice) => {
      const companyId = invoice.companyId;
      const companyName = invoice.company?.name || "회사명 없음";

      if (!summaryMap.has(companyId)) {
        summaryMap.set(companyId, {
          companyName,
          taxableQuantity: 0, // 과세 상품 수량
          taxableAmount: 0, // 과세 상품 금액
          exemptQuantity: 0, // 면세 상품 수량
          exemptAmount: 0, // 면세 상품 금액
        });
      }

      const summary = summaryMap.get(companyId);

      invoice.items.forEach((item) => {
        if (item.category === "묵류") {
          // 과세 상품
          summary.taxableQuantity += item.quantity;
          summary.taxableAmount += item.totalPrice;
        } else if (item.category === "두부" || item.category === "콩나물") {
          // 면세 상품
          summary.exemptQuantity += item.quantity;
          summary.exemptAmount += item.totalPrice;
        }
      });
    });

    return Array.from(summaryMap.values());
  };

  const summaryData = generateSummaryData();

  // 총계 계산
  const totalSummary = summaryData.reduce(
    (acc, item) => ({
      taxableQuantity: acc.taxableQuantity + item.taxableQuantity,
      taxableAmount: acc.taxableAmount + item.taxableAmount,
      exemptQuantity: acc.exemptQuantity + item.exemptQuantity,
      exemptAmount: acc.exemptAmount + item.exemptAmount,
    }),
    { taxableQuantity: 0, taxableAmount: 0, exemptQuantity: 0, exemptAmount: 0 }
  );

  const handleExport = async () => {
    try {
      // 각 계산서에 대해 텍스트 생성하고 합치기
      const exportTexts = filteredInvoices.map((invoice) =>
        generateInvoiceText(invoice)
      );
      const combinedText = exportTexts.join("\n\n");
      // 여기서 실제 내보내기 로직 구현
      Alert.alert("내보내기 완료", "계산서 데이터가 생성되었습니다.");
    } catch (error) {
      Alert.alert("오류", "내보내기 중 오류가 발생했습니다.");
    }
  };

  const renderPeriodSelector = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[modalStyles.label, { marginBottom: 10 }]}>기간 선택</Text>

      {/* 기본 기간 필터 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 4 }}>
          {["전체", "상반기", "하반기", "월별", "분기별", "사용자정의"].map(
            (period) => (
              <TouchableOpacity
                key={period}
                onPress={() => {
                  setPeriodFilter(period as PeriodFilter);
                  if (period !== "월별") setMonthFilter(null);
                  if (period !== "분기별") setQuarterFilter(null);
                  if (period !== "사용자정의") {
                    setCustomStartMonth(null);
                    setCustomEndMonth(null);
                  }
                }}
                style={[
                  modalStyles.tab,
                  periodFilter === period && modalStyles.tabActive,
                  { minWidth: 80 },
                ]}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    periodFilter === period && modalStyles.tabTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>

      {/* 월별 선택 */}
      {periodFilter === "월별" && (
        <View style={{ marginTop: 15 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View
              style={{ flexDirection: "row", gap: 8, paddingHorizontal: 4 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <TouchableOpacity
                  key={month}
                  onPress={() => setMonthFilter(month as MonthFilter)}
                  style={[
                    modalStyles.tab,
                    monthFilter === month && modalStyles.tabActive,
                    { minWidth: 50 },
                  ]}
                >
                  <Text
                    style={[
                      modalStyles.tabText,
                      monthFilter === month && modalStyles.tabTextActive,
                    ]}
                  >
                    {month}월
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}

      {/* 분기별 선택 */}
      {periodFilter === "분기별" && (
        <View style={{ marginTop: 15 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { quarter: 1, label: "1분기(1-3월)" },
              { quarter: 2, label: "2분기(4-6월)" },
              { quarter: 3, label: "3분기(7-9월)" },
              { quarter: 4, label: "4분기(10-12월)" },
            ].map(({ quarter, label }) => (
              <TouchableOpacity
                key={quarter}
                onPress={() => setQuarterFilter(quarter as QuarterFilter)}
                style={[
                  modalStyles.tab,
                  quarterFilter === quarter && modalStyles.tabActive,
                  { flex: 1 },
                ]}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    quarterFilter === quarter && modalStyles.tabTextActive,
                    { fontSize: 12 },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 사용자정의 기간 선택 */}
      {periodFilter === "사용자정의" && (
        <View style={{ marginTop: 15 }}>
          <Text style={[modalStyles.label, { fontSize: 14, marginBottom: 10 }]}>
            시작월 ~ 종료월
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={{ flexDirection: "row", gap: 5 }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <TouchableOpacity
                    key={`start-${month}`}
                    onPress={() => setCustomStartMonth(month as MonthFilter)}
                    style={[
                      modalStyles.tab,
                      customStartMonth === month && modalStyles.tabActive,
                      { minWidth: 45 },
                    ]}
                  >
                    <Text
                      style={[
                        modalStyles.tabText,
                        customStartMonth === month && modalStyles.tabTextActive,
                        { fontSize: 12 },
                      ]}
                    >
                      {month}월
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <Text style={{ color: COLORS.textSecondary }}>~</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              <View style={{ flexDirection: "row", gap: 5 }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <TouchableOpacity
                    key={`end-${month}`}
                    onPress={() => setCustomEndMonth(month as MonthFilter)}
                    style={[
                      modalStyles.tab,
                      customEndMonth === month && modalStyles.tabActive,
                      { minWidth: 45 },
                    ]}
                  >
                    <Text
                      style={[
                        modalStyles.tabText,
                        customEndMonth === month && modalStyles.tabTextActive,
                        { fontSize: 12 },
                      ]}
                    >
                      {month}월
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );

  const renderInvoiceList = () => (
    <ScrollView style={{ flex: 1 }}>
      {filteredInvoices.length === 0 ? (
        <View style={listStyles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={50}
            color={COLORS.textSecondary}
          />
          <Text style={listStyles.emptyText}>
            선택한 조건에 해당하는 계산서가 없습니다.
          </Text>
        </View>
      ) : (
        filteredInvoices.map((invoice) => (
          <View key={invoice.id} style={listStyles.card}>
            <View style={listStyles.cardHeader}>
              <Text style={listStyles.cardTitle}>
                {invoice.company?.name || "회사명 없음"}
              </Text>
              <Text style={[modalStyles.label, { fontSize: 12 }]}>
                {new Date(invoice.invoiceDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={{ marginTop: 10 }}>
              {invoice.items
                .filter((item) => {
                  if (selectedTab === "과세") {
                    return item.category === "묵류";
                  } else {
                    return (
                      item.category === "두부" || item.category === "콩나물"
                    );
                  }
                })
                .map((item, index) => (
                  <View key={index} style={listStyles.listItem}>
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <View
                          style={[
                            listStyles.categoryBadge,
                            getCategoryBadgeStyle(item.category),
                          ]}
                        >
                          <Text
                            style={[
                              listStyles.categoryText,
                              getCategoryTextStyle(item.category),
                            ]}
                          >
                            {item.category}
                          </Text>
                        </View>
                        <Text style={listStyles.listItemTitle}>
                          {item.productName}
                        </Text>
                      </View>
                      <Text style={listStyles.listItemSubtitle}>
                        {item.quantity}개 × {item.unitPrice.toLocaleString()}원
                      </Text>
                    </View>
                    <Text style={listStyles.listItemValue}>
                      {item.totalPrice.toLocaleString()}원
                    </Text>
                  </View>
                ))}
            </View>

            <View style={listStyles.separator} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[modalStyles.label, { fontWeight: "600" }]}>
                총액
              </Text>
              <Text style={[listStyles.listItemValue, { fontWeight: "600" }]}>
                {invoice.items
                  .filter((item) => {
                    if (selectedTab === "과세") {
                      return item.category === "묵류";
                    } else {
                      return (
                        item.category === "두부" || item.category === "콩나물"
                      );
                    }
                  })
                  .reduce((sum, item) => sum + item.totalPrice, 0)
                  .toLocaleString()}
                원
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderSummaryView = () => (
    <ScrollView style={{ flex: 1 }}>
      {summaryData.length === 0 ? (
        <View style={listStyles.emptyContainer}>
          <Ionicons
            name="analytics-outline"
            size={50}
            color={COLORS.textSecondary}
          />
          <Text style={listStyles.emptyText}>요약할 데이터가 없습니다.</Text>
        </View>
      ) : (
        <>
          {/* 총계 */}
          <View
            style={[
              listStyles.card,
              { backgroundColor: COLORS.primary + "10" },
            ]}
          >
            <Text
              style={[
                listStyles.cardTitle,
                { textAlign: "center", marginBottom: 15 },
              ]}
            >
              전체 요약
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flex: 1 }}>
                <Text style={[modalStyles.label, { color: COLORS.primary }]}>
                  과세상품 (묵류)
                </Text>
                <Text style={listStyles.listItemSubtitle}>
                  수량: {totalSummary.taxableQuantity.toLocaleString()}개
                </Text>
                <Text
                  style={[listStyles.listItemValue, { color: COLORS.primary }]}
                >
                  {totalSummary.taxableAmount.toLocaleString()}원
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[modalStyles.label, { color: COLORS.success }]}>
                  면세상품 (두부/콩나물)
                </Text>
                <Text style={listStyles.listItemSubtitle}>
                  수량: {totalSummary.exemptQuantity.toLocaleString()}개
                </Text>
                <Text
                  style={[listStyles.listItemValue, { color: COLORS.success }]}
                >
                  {totalSummary.exemptAmount.toLocaleString()}원
                </Text>
              </View>
            </View>
          </View>

          {/* 회사별 요약 */}
          {summaryData.map((summary, index) => (
            <View key={index} style={listStyles.card}>
              <Text style={listStyles.cardTitle}>{summary.companyName}</Text>

              <View style={{ marginTop: 10 }}>
                {summary.taxableQuantity > 0 && (
                  <View style={listStyles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[modalStyles.label, { color: COLORS.primary }]}
                      >
                        과세상품 (묵류)
                      </Text>
                      <Text style={listStyles.listItemSubtitle}>
                        수량: {summary.taxableQuantity.toLocaleString()}개
                      </Text>
                    </View>
                    <Text
                      style={[
                        listStyles.listItemValue,
                        { color: COLORS.primary },
                      ]}
                    >
                      {summary.taxableAmount.toLocaleString()}원
                    </Text>
                  </View>
                )}

                {summary.exemptQuantity > 0 && (
                  <View style={listStyles.listItem}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[modalStyles.label, { color: COLORS.success }]}
                      >
                        면세상품 (두부/콩나물)
                      </Text>
                      <Text style={listStyles.listItemSubtitle}>
                        수량: {summary.exemptQuantity.toLocaleString()}개
                      </Text>
                    </View>
                    <Text
                      style={[
                        listStyles.listItemValue,
                        { color: COLORS.success },
                      ]}
                    >
                      {summary.exemptAmount.toLocaleString()}원
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.container, { maxHeight: "90%" }]}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>계산서 조회</Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={handleExport}
                style={[
                  modalStyles.buttonSecondary,
                  { paddingVertical: 8, paddingHorizontal: 12 },
                ]}
              >
                <Text
                  style={[modalStyles.buttonTextSecondary, { fontSize: 12 }]}
                >
                  내보내기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={modalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 과세/면세 탭 */}
            <View style={modalStyles.tabContainer}>
              <TouchableOpacity
                style={[
                  modalStyles.tab,
                  selectedTab === "과세" && modalStyles.tabActive,
                ]}
                onPress={() => setSelectedTab("과세")}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    selectedTab === "과세" && modalStyles.tabTextActive,
                  ]}
                >
                  과세 (묵류)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.tab,
                  selectedTab === "면세" && modalStyles.tabActive,
                ]}
                onPress={() => setSelectedTab("면세")}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    selectedTab === "면세" && modalStyles.tabTextActive,
                  ]}
                >
                  면세 (두부/콩나물)
                </Text>
              </TouchableOpacity>
            </View>

            {/* 기간 선택 */}
            {renderPeriodSelector()}

            {/* 보기 모드 선택 */}
            <View style={modalStyles.tabContainer}>
              <TouchableOpacity
                style={[
                  modalStyles.tab,
                  viewMode === "list" && modalStyles.tabActive,
                ]}
                onPress={() => setViewMode("list")}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    viewMode === "list" && modalStyles.tabTextActive,
                  ]}
                >
                  목록 보기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.tab,
                  viewMode === "summary" && modalStyles.tabActive,
                ]}
                onPress={() => setViewMode("summary")}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    viewMode === "summary" && modalStyles.tabTextActive,
                  ]}
                >
                  요약 보기
                </Text>
              </TouchableOpacity>
            </View>

            {/* 컨텐츠 영역 */}
            <View style={{ flex: 1, minHeight: 300 }}>
              {viewMode === "list" ? renderInvoiceList() : renderSummaryView()}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
