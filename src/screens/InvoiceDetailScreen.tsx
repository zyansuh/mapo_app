import React from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { COLORS } from "../styles/colors";
import { Invoice, InvoiceStatus, TaxType } from "../types";
import { formatDate, formatCurrency } from "../utils/format";

const InvoiceDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

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

  const handleStatusChange = (newStatus: InvoiceStatus) => {
    Alert.alert(
      "상태 변경",
      `계산서 상태를 "${newStatus}"로 변경하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "변경",
          onPress: () => {
            Alert.alert("완료", `상태가 "${newStatus}"로 변경되었습니다.`);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: InvoiceStatus) => {
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

  const getTaxTypeColor = (taxType: TaxType) => {
    switch (taxType) {
      case "과세":
        return COLORS.primary;
      case "면세":
        return COLORS.success;
      case "영세":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={COLORS.primary}
        barStyle="light-content"
      />
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: COLORS.background,
            paddingTop: Platform.OS === "android" ? 10 : insets.top,
          },
        ]}
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
              <Ionicons
                name="arrow-back"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.white }]}>
              계산서 상세
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons
                name="create-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 기본 정보 */}
          <View
            style={[styles.section, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              기본 정보
            </Text>

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: COLORS.textSecondary },
                ]}
              >
                계산서 번호
              </Text>
              <Text style={[styles.infoValue, { color: COLORS.text }]}>
                {invoice.invoiceNumber}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: COLORS.textSecondary },
                ]}
              >
                발행일
              </Text>
              <Text style={[styles.infoValue, { color: COLORS.text }]}>
                {formatDate(invoice.issueDate)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text
                style={[
                  styles.infoLabel,
                  { color: COLORS.textSecondary },
                ]}
              >
                상태
              </Text>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(invoice.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(invoice.status) },
                    ]}
                  >
                    {invoice.status}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.statusChangeButton}
                  onPress={() => {
                    Alert.alert("상태 변경", "변경할 상태를 선택하세요", [
                      { text: "취소", style: "cancel" },
                      {
                        text: "임시저장",
                        onPress: () => handleStatusChange("임시저장"),
                      },
                      {
                        text: "발행",
                        onPress: () => handleStatusChange("발행"),
                      },
                      {
                        text: "전송",
                        onPress: () => handleStatusChange("전송"),
                      },
                      {
                        text: "승인",
                        onPress: () => handleStatusChange("승인"),
                      },
                    ]);
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {invoice.memo && (
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.infoLabel,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  메모
                </Text>
                <Text style={[styles.infoValue, { color: COLORS.text }]}>
                  {invoice.memo}
                </Text>
              </View>
            )}
          </View>

          {/* 품목 정보 */}
          <View
            style={[styles.section, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              품목 정보
            </Text>

            {invoice.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  { backgroundColor: COLORS.background },
                ]}
              >
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemName, { color: COLORS.text }]}>
                    {item.name}
                  </Text>
                  <View
                    style={[
                      styles.taxTypeBadge,
                      { backgroundColor: getTaxTypeColor(item.taxType) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.taxTypeText,
                        { color: getTaxTypeColor(item.taxType) },
                      ]}
                    >
                      {item.taxType}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemDetails}>
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
                      style={[
                        styles.itemDetailValue,
                        { color: COLORS.text },
                      ]}
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
                      style={[
                        styles.itemDetailValue,
                        { color: COLORS.text },
                      ]}
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
                      style={[
                        styles.itemDetailValue,
                        { color: COLORS.text },
                      ]}
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
                      style={[
                        styles.itemDetailValue,
                        { color: COLORS.text },
                      ]}
                    >
                      {formatCurrency(item.taxAmount)}
                    </Text>
                  </View>

                  <View style={[styles.itemDetailRow, styles.totalRow]}>
                    <Text
                      style={[
                        styles.itemTotalLabel,
                        { color: COLORS.text },
                      ]}
                    >
                      합계
                    </Text>
                    <Text
                      style={[
                        styles.itemTotalValue,
                        { color: COLORS.primary },
                      ]}
                    >
                      {formatCurrency(item.totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 합계 금액 */}
          <View
            style={[styles.section, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              합계 금액
            </Text>

            <View style={styles.totalContainer}>
              <View style={styles.totalRow}>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  공급가액
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.text }]}>
                  {formatCurrency(invoice.totalSupplyAmount)}
                </Text>
              </View>

              <View style={styles.totalRow}>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: COLORS.textSecondary },
                  ]}
                >
                  세액
                </Text>
                <Text style={[styles.totalValue, { color: COLORS.text }]}>
                  {formatCurrency(invoice.totalTaxAmount)}
                </Text>
              </View>

              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text
                  style={[styles.grandTotalLabel, { color: COLORS.text }]}
                >
                  총 합계
                </Text>
                <Text
                  style={[
                    styles.grandTotalValue,
                    { color: COLORS.primary },
                  ]}
                >
                  {formatCurrency(invoice.totalAmount)}
                </Text>
              </View>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={COLORS.white}
              />
              <Text
                style={[styles.actionButtonText, { color: COLORS.white }]}
              >
                수정하기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: COLORS.success },
              ]}
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
              <Text
                style={[styles.actionButtonText, { color: COLORS.white }]}
              >
                PDF 내보내기
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
