import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Company,
  DeliveryFormData,
  DeliveryItem,
  ProductCategory,
  DeliveryStatus,
} from "../types";
import { useTheme } from "../hooks";
import { generateId } from "../utils";
import TextInput from "./TextInput";
import Button from "./Button";
import Select from "./Select";

interface DeliveryRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (deliveryData: DeliveryFormData) => void;
  companies: Company[];
}

interface ProductOption {
  id: string;
  name: string;
  category: ProductCategory;
  defaultPrice: number;
  unit: string;
}

// 기본 상품 목록
const DEFAULT_PRODUCTS: ProductOption[] = [
  { id: "1", name: "순두부", category: "두부", defaultPrice: 3000, unit: "모" },
  { id: "2", name: "모두부", category: "두부", defaultPrice: 2500, unit: "모" },
  {
    id: "3",
    name: "콩나물",
    category: "콩나물",
    defaultPrice: 2000,
    unit: "봉지",
  },
  {
    id: "4",
    name: "숙주나물",
    category: "콩나물",
    defaultPrice: 2200,
    unit: "봉지",
  },
  {
    id: "5",
    name: "도토리묵",
    category: "묵류",
    defaultPrice: 4000,
    unit: "개",
  },
  { id: "6", name: "청포묵", category: "묵류", defaultPrice: 3500, unit: "개" },
  { id: "7", name: "메밀묵", category: "묵류", defaultPrice: 4500, unit: "개" },
];

export const DeliveryRegistrationModal: React.FC<
  DeliveryRegistrationModalProps
> = ({ visible, onClose, onSubmit, companies }) => {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<DeliveryFormData>({
    companyId: "",
    companyName: "",
    deliveryDate: new Date(),
    items: [],
    totalAmount: 0,
    memo: "",
    status: "배송준비",
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentItem, setCurrentItem] = useState<DeliveryItem>({
    productId: "",
    productName: "",
    category: "두부",
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
  });

  // 거래처 옵션 생성
  const companyOptions = companies.map((company) => ({
    label: `${company.name} (${company.region})`,
    value: company.id,
  }));

  // 상품 옵션 생성
  const productOptions = DEFAULT_PRODUCTS.map((product) => ({
    label: `${product.name} (${product.unit})`,
    value: product.id,
  }));

  // 배송상태 옵션
  const statusOptions: Array<{ label: string; value: DeliveryStatus }> = [
    { label: "배송준비", value: "배송준비" },
    { label: "배송중", value: "배송중" },
    { label: "배송완료", value: "배송완료" },
  ];

  // 거래처 선택 시
  const handleCompanySelect = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      setFormData((prev) => ({
        ...prev,
        companyId: company.id,
        companyName: company.name,
      }));
    }
  };

  // 상품 선택 시
  const handleProductSelect = (productId: string) => {
    const product = DEFAULT_PRODUCTS.find((p) => p.id === productId);
    if (product) {
      setCurrentItem({
        productId: product.id,
        productName: product.name,
        category: product.category,
        quantity: 1,
        unitPrice: product.defaultPrice,
        totalPrice: product.defaultPrice,
      });
    }
  };

  // 수량 변경 시 총액 계산
  const handleQuantityChange = (quantity: string) => {
    const qty = parseInt(quantity) || 0;
    setCurrentItem((prev) => ({
      ...prev,
      quantity: qty,
      totalPrice: qty * prev.unitPrice,
    }));
  };

  // 단가 변경 시 총액 계산
  const handlePriceChange = (price: string) => {
    const unitPrice = parseInt(price) || 0;
    setCurrentItem((prev) => ({
      ...prev,
      unitPrice,
      totalPrice: prev.quantity * unitPrice,
    }));
  };

  // 상품 추가
  const handleAddItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      Alert.alert("오류", "상품과 수량을 정확히 입력해주세요.");
      return;
    }

    const newItems = [...formData.items, { ...currentItem }];
    const totalAmount = newItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
    }));

    // 현재 아이템 초기화
    setCurrentItem({
      productId: "",
      productName: "",
      category: "두부",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  // 상품 삭제
  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      totalAmount,
    }));
  };

  // 배송 등록 제출
  const handleSubmit = () => {
    if (!formData.companyId) {
      Alert.alert("오류", "거래처를 선택해주세요.");
      return;
    }

    if (formData.items.length === 0) {
      Alert.alert("오류", "배송할 상품을 추가해주세요.");
      return;
    }

    onSubmit(formData);
    handleReset();
    onClose();
  };

  // 폼 초기화
  const handleReset = () => {
    setFormData({
      companyId: "",
      companyName: "",
      deliveryDate: new Date(),
      items: [],
      totalAmount: 0,
      memo: "",
      status: "배송준비",
    });
    setSelectedCompany(null);
    setCurrentItem({
      productId: "",
      productName: "",
      category: "두부",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* 헤더 */}
        <View
          style={[styles.header, { borderBottomColor: theme.colors.border }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            배송 등록
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 거래처 선택 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              거래처 정보
            </Text>
            <Select
              label="거래처 선택 *"
              value={formData.companyId}
              options={companyOptions}
              onValueChange={handleCompanySelect}
              placeholder="거래처를 선택하세요"
            />
            {selectedCompany && (
              <View
                style={[
                  styles.companyInfo,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Text style={[styles.infoText, { color: theme.colors.text }]}>
                  📍 {selectedCompany.address}
                </Text>
                <Text style={[styles.infoText, { color: theme.colors.text }]}>
                  📞 {selectedCompany.phoneNumber}
                </Text>
              </View>
            )}
          </View>

          {/* 상품 추가 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              상품 추가
            </Text>

            <Select
              label="상품 선택"
              value={currentItem.productId}
              options={productOptions}
              onValueChange={handleProductSelect}
              placeholder="상품을 선택하세요"
            />

            {currentItem.productId && (
              <View style={styles.itemContainer}>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="수량"
                      value={currentItem.quantity.toString()}
                      onChangeText={handleQuantityChange}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="단가"
                      value={currentItem.unitPrice.toString()}
                      onChangeText={handlePriceChange}
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.totalContainer,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <Text
                    style={[
                      styles.totalLabel,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    총액
                  </Text>
                  <Text
                    style={[styles.totalValue, { color: theme.colors.primary }]}
                  >
                    {currentItem.totalPrice.toLocaleString()}원
                  </Text>
                </View>
                <Button
                  title="상품 추가"
                  onPress={handleAddItem}
                  style={styles.addButton}
                />
              </View>
            )}
          </View>

          {/* 추가된 상품 목록 */}
          {formData.items.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                배송 상품 목록
              </Text>
              {formData.items.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.itemCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  <View style={styles.itemHeader}>
                    <Text
                      style={[styles.itemName, { color: theme.colors.text }]}
                    >
                      {item.productName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons
                        name="trash"
                        size={18}
                        color={theme.colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text
                      style={[
                        styles.itemDetailText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {item.category} | 수량: {item.quantity} | 단가:{" "}
                      {item.unitPrice.toLocaleString()}원
                    </Text>
                    <Text
                      style={[
                        styles.itemPrice,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {item.totalPrice.toLocaleString()}원
                    </Text>
                  </View>
                </View>
              ))}

              {/* 총 금액 */}
              <View
                style={[
                  styles.grandTotal,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[styles.grandTotalText, { color: theme.colors.white }]}
                >
                  총 배송금액: {formData.totalAmount.toLocaleString()}원
                </Text>
              </View>
            </View>
          )}

          {/* 배송 정보 */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              배송 정보
            </Text>

            <Select
              label="배송 상태"
              value={formData.status}
              options={statusOptions}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as DeliveryStatus,
                }))
              }
            />

            <TextInput
              label="메모"
              value={formData.memo}
              onChangeText={(value) =>
                setFormData((prev) => ({ ...prev, memo: value }))
              }
              multiline
              numberOfLines={3}
              placeholder="배송 관련 메모를 입력하세요"
            />
          </View>

          {/* 제출 버튼 */}
          <View style={styles.submitSection}>
            <Button
              title="배송 등록"
              onPress={handleSubmit}
              disabled={!formData.companyId || formData.items.length === 0}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
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
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  companyInfo: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemContainer: {
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    flex: 0.48,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    marginTop: 8,
  },
  itemCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    padding: 4,
  },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDetailText: {
    fontSize: 12,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  grandTotal: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  grandTotalText: {
    fontSize: 18,
    fontWeight: "700",
  },
  submitSection: {
    marginTop: 24,
    marginBottom: 32,
  },
});

export default DeliveryRegistrationModal;
