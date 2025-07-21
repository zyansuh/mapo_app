import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
// DateTimePicker는 실제 환경에서는 설치 필요: @react-native-community/datetimepicker
import { COLORS } from "../../styles/colors";
import { useCompany } from "../../hooks/useCompany";
import { Company, DeliveryFormData } from "../../types";
import ProductSelection, { SelectedProduct } from "../ProductSelection";
import Select from "../forms/Select";

interface DeliveryRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (delivery: DeliveryFormData) => void;
  preselectedCompanyId?: string;
}

const DeliveryRegistrationModal: React.FC<DeliveryRegistrationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  preselectedCompanyId,
}) => {
  const { companies } = useCompany();

  const [selectedCompanyId, setSelectedCompanyId] = useState(
    preselectedCompanyId || ""
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [deliveryMemo, setDeliveryMemo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showProductSelection, setShowProductSelection] = useState(false);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleProductsSelect = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeliveryDate(selectedDate);
    }
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (!selectedCompanyId) {
      Alert.alert("알림", "거래처를 선택해주세요.");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("알림", "상품을 선택해주세요.");
      return;
    }

    const deliveryData: DeliveryFormData = {
      companyId: selectedCompanyId,
      products: selectedProducts.map((product) => ({
        category: product.category,
        productItem: product.productItem,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
      })),
      deliveryDate,
      deliveryMemo: deliveryMemo.trim() || undefined,
    };

    onConfirm(deliveryData);
    handleClose();
  };

  const handleClose = () => {
    // 초기화
    setSelectedCompanyId(preselectedCompanyId || "");
    setSelectedProducts([]);
    setDeliveryDate(new Date());
    setDeliveryMemo("");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const companyOptions = companies.map((company) => ({
    label: `${company.name} (${company.region})`,
    value: company.id,
  }));

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View
          style={[styles.container, { backgroundColor: COLORS.background }]}
        >
          {/* Header */}
          <View style={[styles.header, { backgroundColor: COLORS.white }]}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>
              배송 등록
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={[styles.submitText, { color: COLORS.primary }]}>
                등록
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 거래처 선택 */}
            <View style={[styles.section, { backgroundColor: COLORS.white }]}>
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                거래처 정보
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  거래처 선택
                </Text>
                <Select
                  value={selectedCompanyId}
                  onValueChange={handleCompanySelect}
                  options={companyOptions}
                  placeholder="거래처를 선택하세요"
                />
              </View>

              {selectedCompany && (
                <View style={styles.companyInfo}>
                  <Text style={[styles.companyName, { color: COLORS.text }]}>
                    {selectedCompany.name}
                  </Text>
                  <Text
                    style={[
                      styles.companyDetail,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {selectedCompany.type} • {selectedCompany.region}
                  </Text>
                  {selectedCompany.phoneNumber && (
                    <Text
                      style={[
                        styles.companyDetail,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      📞 {selectedCompany.phoneNumber}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* 상품 선택 */}
            <View style={[styles.section, { backgroundColor: COLORS.white }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                  상품 정보
                </Text>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    { backgroundColor: COLORS.primary },
                  ]}
                  onPress={() => setShowProductSelection(true)}
                >
                  <Ionicons name="add" size={20} color={COLORS.white} />
                  <Text
                    style={[styles.selectButtonText, { color: COLORS.white }]}
                  >
                    상품 선택
                  </Text>
                </TouchableOpacity>
              </View>

              {selectedProducts.length > 0 ? (
                <View style={styles.productsContainer}>
                  {selectedProducts.map((product, index) => (
                    <View
                      key={`${product.category}-${product.productItem}-${index}`}
                      style={styles.productItem}
                    >
                      <View style={styles.productInfo}>
                        <Text
                          style={[
                            styles.productCategory,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          {product.category}
                        </Text>
                        <Text
                          style={[styles.productName, { color: COLORS.text }]}
                        >
                          {product.productItem}
                        </Text>
                        <Text
                          style={[
                            styles.productQuantity,
                            { color: COLORS.textSecondary },
                          ]}
                        >
                          {product.quantity}개 ×{" "}
                          {formatCurrency(product.unitPrice)}
                        </Text>
                      </View>
                      <Text
                        style={[styles.productTotal, { color: COLORS.text }]}
                      >
                        {formatCurrency(product.quantity * product.unitPrice)}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.totalSection}>
                    <Text style={[styles.totalLabel, { color: COLORS.text }]}>
                      총 금액
                    </Text>
                    <Text
                      style={[styles.totalAmount, { color: COLORS.primary }]}
                    >
                      {formatCurrency(getTotalAmount())}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.emptyProducts}>
                  <Ionicons
                    name="cube-outline"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                  <Text
                    style={[styles.emptyText, { color: COLORS.textSecondary }]}
                  >
                    선택된 상품이 없습니다
                  </Text>
                </View>
              )}
            </View>

            {/* 배송 정보 */}
            <View style={[styles.section, { backgroundColor: COLORS.white }]}>
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                배송 정보
              </Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  배송 예정일
                </Text>
                <TouchableOpacity
                  style={[styles.dateInput, { borderColor: COLORS.border }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateText, { color: COLORS.text }]}>
                    {formatDate(deliveryDate)}
                  </Text>
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  배송 메모
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: COLORS.border, color: COLORS.text },
                  ]}
                  value={deliveryMemo}
                  onChangeText={setDeliveryMemo}
                  placeholder="배송 시 주의사항 등 (선택사항)"
                  placeholderTextColor={COLORS.textSecondary}
                  multiline
                />
              </View>
            </View>
          </ScrollView>

          {/* Date Picker - 임시 구현 */}
          {showDatePicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerModal}>
                <Text style={[styles.datePickerTitle, { color: COLORS.text }]}>
                  배송 예정일 선택
                </Text>
                <TextInput
                  style={[
                    styles.datePickerInput,
                    { borderColor: COLORS.border, color: COLORS.text },
                  ]}
                  value={deliveryDate.toISOString().split("T")[0]}
                  onChangeText={(text) => {
                    try {
                      const newDate = new Date(text);
                      if (!isNaN(newDate.getTime())) {
                        setDeliveryDate(newDate);
                      }
                    } catch (error) {
                      // 잘못된 날짜 형식은 무시
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={COLORS.textSecondary}
                />
                <View style={styles.datePickerButtons}>
                  <TouchableOpacity
                    style={[
                      styles.datePickerButton,
                      { backgroundColor: COLORS.textSecondary },
                    ]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text
                      style={[
                        styles.datePickerButtonText,
                        { color: COLORS.white },
                      ]}
                    >
                      닫기
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Product Selection Modal */}
      <ProductSelection
        visible={showProductSelection}
        onClose={() => setShowProductSelection(false)}
        onConfirm={handleProductsSelect}
        selectedProducts={selectedProducts}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  submitButton: {
    padding: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    height: 48,
  },
  dateText: {
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
  },
  companyInfo: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  productsContainer: {
    marginTop: 8,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  productInfo: {
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  productQuantity: {
    fontSize: 12,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
  },
  emptyProducts: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  // Date Picker 스타일
  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerModal: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    margin: 20,
    minWidth: 280,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  datePickerInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  datePickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DeliveryRegistrationModal;
