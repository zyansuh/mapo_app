import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { THEME } from "../styles/themes";
import { invoiceDetailStyles } from "../styles/screens";
import { Invoice, InvoiceStatus, TaxType } from "../types";
import { formatDate, formatCurrency } from "../utils/format";
import { useInvoice } from "../hooks";

const InvoiceDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { updateInvoiceStatus, getInvoiceById, deleteInvoice } = useInvoice();

  const { invoiceId } = route.params;

  // 샘플 계산서 데이터 (실제로는 ID로 조회)
  const invoice: Invoice = {
    id: invoiceId,
    invoiceNumber: "INV-2024-001",
    companyId: "comp1",
    items: [
      {
        id: "item1",
        name: "착한손두부",
        quantity: 10,
        unitPrice: 2000,
        amount: 20000,
        taxType: "과세" as TaxType,
        taxAmount: 2000,
        totalAmount: 22000,
      },
      {
        id: "item2",
        name: "시루콩나물",
        quantity: 5,
        unitPrice: 1500,
        amount: 7500,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 7500,
      },
    ],
    totalSupplyAmount: 27500,
    totalTaxAmount: 2000,
    totalAmount: 29500,
    issueDate: new Date(),
    status: "발행" as InvoiceStatus,
    memo: "정기 납품 계산서입니다.",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const handleEdit = () => {
    navigation.navigate("InvoiceEdit", { invoiceId: invoice.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "계산서 삭제",
      `${invoice.invoiceNumber} 계산서를 삭제하시겠습니까?\n\n⚠️ 삭제된 계산서는 복구할 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            const success = await deleteInvoice(invoiceId);
            if (success) {
              Alert.alert(
                "삭제 완료",
                `${invoice.invoiceNumber} 계산서가 삭제되었습니다.`,
                [{ text: "확인", onPress: () => navigation.goBack() }]
              );
            } else {
              Alert.alert("오류", "계산서 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    const statusDescription = getStatusDescription(newStatus);

    Alert.alert(
      "상태 변경",
      `계산서 상태를 "${newStatus}"로 변경하시겠습니까?\n\n${statusDescription}`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "변경",
          onPress: async () => {
            const success = await updateInvoiceStatus(invoiceId, newStatus);
            if (success) {
              // 상태 변경 후 화면 새로고침을 위해 다시 가져오기
              const updatedInvoice = getInvoiceById(invoiceId);
              if (updatedInvoice) {
                // 인보이스 상태 업데이트 (실제로는 useState로 관리해야 하지만 여기서는 단순화)
                Alert.alert(
                  "완료",
                  `${updatedInvoice.invoiceNumber} 계산서 상태가 "${newStatus}"로 변경되었습니다.`,
                  [{ text: "확인", onPress: () => navigation.goBack() }]
                );
              }
            } else {
              Alert.alert("오류", "상태 변경에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  // 상태별 설명 함수 (계산서 생성 화면과 동일)
  const getStatusDescription = (status: InvoiceStatus): string => {
    switch (status) {
      case "임시저장":
        return "📝 작성 중인 계산서입니다. 언제든 수정할 수 있습니다.";
      case "발행":
        return "✅ 완성된 계산서입니다. 거래처에 발송할 준비가 되었습니다.";
      case "전송":
        return "📤 거래처에 발송된 계산서입니다. 승인을 기다리고 있습니다.";
      case "승인":
        return "🎉 거래처에서 승인된 계산서입니다. 거래가 확정되었습니다.";
      case "취소":
        return "❌ 취소된 계산서입니다. 더 이상 유효하지 않습니다.";
      default:
        return "";
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "임시저장":
        return THEME.colors.warning;
      case "발행":
        return THEME.colors.success;
      case "전송":
        return THEME.colors.primary;
      case "승인":
        return THEME.colors.success;
      case "취소":
        return THEME.colors.error;
      default:
        return THEME.colors.textSecondary;
    }
  };

  const getTaxTypeColor = (taxType: TaxType) => {
    switch (taxType) {
      case "과세":
        return THEME.colors.primary;
      case "면세":
        return THEME.colors.success;
      case "영세":
        return THEME.colors.warning;
      default:
        return THEME.colors.textSecondary;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={THEME.colors.primary}
        barStyle="light-content"
      />
      <SafeAreaView
        style={[
          invoiceDetailStyles.container,
          {
            paddingTop: Platform.OS === "android" ? 10 : insets.top,
          },
        ]}
      >
        <LinearGradient
          colors={[THEME.colors.primary, THEME.colors.primary]}
          style={invoiceDetailStyles.header}
        >
          <View style={invoiceDetailStyles.headerContent}>
            <TouchableOpacity
              style={invoiceDetailStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={THEME.colors.white}
              />
            </TouchableOpacity>
            <Text style={invoiceDetailStyles.headerTitle}>계산서 상세</Text>
            <TouchableOpacity
              style={invoiceDetailStyles.editButton}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={THEME.colors.white}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={invoiceDetailStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 기본 정보 */}
          <View style={invoiceDetailStyles.section}>
            <Text style={invoiceDetailStyles.sectionTitle}>기본 정보</Text>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>계산서 번호</Text>
              <Text style={invoiceDetailStyles.infoValue}>
                {invoice.invoiceNumber}
              </Text>
            </View>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>발행일</Text>
              <Text style={invoiceDetailStyles.infoValue}>
                {formatDate(invoice.issueDate)}
              </Text>
            </View>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>상태</Text>
              <View style={invoiceDetailStyles.statusContainer}>
                <View
                  style={[
                    invoiceDetailStyles.statusBadge,
                    { backgroundColor: getStatusColor(invoice.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      invoiceDetailStyles.statusText,
                      { color: getStatusColor(invoice.status) },
                    ]}
                  >
                    {invoice.status}
                  </Text>
                </View>
                <TouchableOpacity
                  style={invoiceDetailStyles.statusChangeButton}
                  onPress={() => {
                    const statusOptions = [
                      { text: "취소", style: "cancel" as const },
                      {
                        text: "📝 임시저장",
                        onPress: () => handleStatusChange("임시저장"),
                      },
                      {
                        text: "✅ 발행",
                        onPress: () => handleStatusChange("발행"),
                      },
                      {
                        text: "📤 전송",
                        onPress: () => handleStatusChange("전송"),
                      },
                      {
                        text: "🎉 승인",
                        onPress: () => handleStatusChange("승인"),
                      },
                      {
                        text: "❌ 취소",
                        onPress: () => handleStatusChange("취소"),
                      },
                    ];

                    Alert.alert(
                      "계산서 상태 변경",
                      `현재 상태: ${invoice.status}\n\n변경할 상태를 선택하세요:`,
                      statusOptions
                    );
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={THEME.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {invoice.memo && (
              <View style={invoiceDetailStyles.infoRow}>
                <Text style={invoiceDetailStyles.infoLabel}>메모</Text>
                <Text style={invoiceDetailStyles.infoValue}>
                  {invoice.memo}
                </Text>
              </View>
            )}
          </View>

          {/* 품목 정보 */}
          <View style={invoiceDetailStyles.section}>
            <Text style={invoiceDetailStyles.sectionTitle}>품목 정보</Text>

            {invoice.items.map((item, index) => (
              <View key={item.id} style={invoiceDetailStyles.itemCard}>
                <View style={invoiceDetailStyles.itemHeader}>
                  <Text style={invoiceDetailStyles.itemName}>{item.name}</Text>
                  <View
                    style={[
                      invoiceDetailStyles.taxTypeBadge,
                      { backgroundColor: getTaxTypeColor(item.taxType) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        invoiceDetailStyles.taxTypeText,
                        { color: getTaxTypeColor(item.taxType) },
                      ]}
                    >
                      {item.taxType}
                    </Text>
                  </View>
                </View>

                <View style={invoiceDetailStyles.itemDetails}>
                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      수량
                    </Text>
                    <Text
                      style={[styles.itemDetailValue, { color: COLORS.text }]}
                    >
                      {item.quantity}개
                    </Text>
                  </View>

                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      단가
                    </Text>
                    <Text
                      style={[styles.itemDetailValue, { color: COLORS.text }]}
                    >
                      {formatCurrency(item.unitPrice)}
                    </Text>
                  </View>

                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      공급가액
                    </Text>
                    <Text
                      style={[styles.itemDetailValue, { color: COLORS.text }]}
                    >
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>

                  <View style={styles.itemDetailRow}>
                    <Text
                      style={[
                        styles.itemDetailLabel,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      세액
                    </Text>
                    <Text
                      style={[styles.itemDetailValue, { color: COLORS.text }]}
                    >
                      {formatCurrency(item.taxAmount)}
                    </Text>
                  </View>

                  <View style={[styles.itemDetailRow, styles.totalRow]}>
                    <Text
                      style={[styles.itemTotalLabel, { color: COLORS.text }]}
                    >
                      합계
                    </Text>
                    <Text
                      style={[styles.itemTotalValue, { color: COLORS.primary }]}
                    >
                      {formatCurrency(item.totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 합계 금액 */}
          <View style={[styles.section, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              합계 금액
            </Text>

            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text
                  style={[styles.totalLabel, { color: COLORS.textSecondary }]}
                >
                  공급가액
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.text }]}>
                  {formatCurrency(invoice.totalSupplyAmount)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text
                  style={[styles.totalLabel, { color: COLORS.textSecondary }]}
                >
                  세액
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.text }]}>
                  {formatCurrency(invoice.totalTaxAmount)}
                </Text>
              </View>

              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={[styles.grandTotalLabel, { color: COLORS.text }]}>
                  총 합계
                </Text>
                <Text
                  style={[styles.grandTotalValue, { color: COLORS.primary }]}
                >
                  {formatCurrency(invoice.totalAmount)}
                </Text>
              </View>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                수정하기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.success }]}
              onPress={() =>
                Alert.alert(
                  "기능 준비중",
                  "PDF 내보내기 기능은 곧 제공될 예정입니다."
                )
              }
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={COLORS.white}
              />
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                PDF 내보내기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: COLORS.error }]}
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.white} />
              <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                삭제하기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  statusChangeButton: {
    padding: 4,
  },
  itemCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  taxTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taxTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  itemDetails: {
    gap: 4,
  },
  itemDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetailLabel: {
    fontSize: 14,
  },
  itemDetailValue: {
    fontSize: 14,
  },
  itemTotalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemTotalValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalContainer: {
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: "#333",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  actionSection: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 100,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default InvoiceDetailScreen;
