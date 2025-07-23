import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { InvoiceItem, TaxType, InvoiceStatus, InvoiceFormData } from "../types";
import { ProductCategory, CATEGORY_ITEMS } from "../types/product";
import { useInvoice } from "../hooks";

const InvoiceEditScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { addInvoice, updateInvoice, generateInvoiceNumber } = useInvoice();

  const invoiceId = route.params?.invoiceId;
  const preselectedCompanyId = route.params?.companyId;
  const isEdit = !!invoiceId;

  const [invoiceNumber, setInvoiceNumber] = useState(
    isEdit ? "INV-2024-001" : generateInvoiceNumber()
  );
  const [status, setStatus] = useState<InvoiceStatus>("임시저장");
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      name: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxType: "과세",
      taxAmount: 0,
      totalAmount: 0,
    },
  ]);

  // 드롭다운 상태들
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: {
      showCategoryDropdown: boolean;
      showProductDropdown: boolean;
      selectedCategory: ProductCategory | null;
    };
  }>({});

  const categories: ProductCategory[] = ["두부", "콩나물", "묵류"];

  const calculateAmounts = (item: InvoiceItem) => {
    const totalAmount = item.quantity * item.unitPrice;

    if (item.taxType === "과세") {
      // 부가세 포함 가격에서 공급가액과 부가세 역산
      const amount = Math.round(totalAmount / 1.1);
      const taxAmount = totalAmount - amount;

      console.log(
        `과세품목 계산: 단가=${item.unitPrice}, 수량=${item.quantity}, 총액=${totalAmount}, 공급가액=${amount}, 세액=${taxAmount}`
      );

      return {
        ...item,
        amount,
        taxAmount,
        totalAmount,
      };
    } else {
      // 면세/영세는 기존 방식
      const amount = totalAmount;
      const taxAmount = 0;

      console.log(
        `면세품목 계산: 단가=${item.unitPrice}, 수량=${item.quantity}, 총액=${totalAmount}, 공급가액=${amount}, 세액=${taxAmount}`
      );

      return {
        ...item,
        amount,
        taxAmount,
        totalAmount,
      };
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    // 금액 계산
    if (field === "quantity" || field === "unitPrice" || field === "taxType") {
      updatedItems[index] = calculateAmounts(updatedItems[index]);
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(items.length + 1),
      name: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxType: "과세",
      taxAmount: 0,
      totalAmount: 0,
    };
    setItems([...items, newItem]);

    // 새 아이템의 드롭다운 상태 초기화
    setDropdownStates((prev) => ({
      ...prev,
      [newItem.id]: {
        showCategoryDropdown: false,
        showProductDropdown: false,
        selectedCategory: null,
      },
    }));
  };

  // 드롭다운 관련 함수들
  const getDropdownState = (itemId: string) => {
    return (
      dropdownStates[itemId] || {
        showCategoryDropdown: false,
        showProductDropdown: false,
        selectedCategory: null,
      }
    );
  };

  const updateDropdownState = (
    itemId: string,
    updates: Partial<(typeof dropdownStates)[string]>
  ) => {
    setDropdownStates((prev) => ({
      ...prev,
      [itemId]: {
        ...getDropdownState(itemId),
        ...updates,
      },
    }));
  };

  const handleCategorySelect = (itemId: string, category: ProductCategory) => {
    updateDropdownState(itemId, {
      selectedCategory: category,
      showCategoryDropdown: true, // 카테고리 선택 후에도 열린 상태 유지하여 상품 선택 가능
      showProductDropdown: false,
    });
  };

  const handleProductSelect = (
    itemId: string,
    productName: string,
    index: number
  ) => {
    updateItem(index, "name", productName);
    updateDropdownState(itemId, {
      showCategoryDropdown: false,
      showProductDropdown: false,
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const getTotals = () => {
    const totalSupplyAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const totalTaxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalAmount = totalSupplyAmount + totalTaxAmount;

    return { totalSupplyAmount, totalTaxAmount, totalAmount };
  };

  const handleSave = async () => {
    // 유효성 검사
    if (!invoiceNumber.trim()) {
      Alert.alert("오류", "계산서 번호를 입력해주세요.");
      return;
    }

    const hasEmptyItems = items.some((item) => !item.name.trim());
    if (hasEmptyItems) {
      Alert.alert("오류", "모든 품목명을 입력해주세요.");
      return;
    }

    if (!preselectedCompanyId && !isEdit) {
      Alert.alert("오류", "거래처 정보가 필요합니다.");
      return;
    }

    const totals = getTotals();

    const invoiceFormData: InvoiceFormData = {
      invoiceNumber,
      companyId: preselectedCompanyId!,
      items,
      totalSupplyAmount: totals.totalSupplyAmount,
      totalTaxAmount: totals.totalTaxAmount,
      totalAmount: totals.totalAmount,
      issueDate: new Date(),
      status,
    };

    try {
      if (isEdit) {
        const success = await updateInvoice(invoiceId, invoiceFormData);
        if (success) {
          Alert.alert("수정 완료", "계산서가 수정되었습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("오류", "계산서 수정에 실패했습니다.");
        }
      } else {
        const newInvoice = await addInvoice(invoiceFormData);
        if (newInvoice) {
          Alert.alert("생성 완료", "계산서가 생성되었습니다.", [
            { text: "확인", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("오류", "계산서 생성에 실패했습니다.");
        }
      }
    } catch (error) {
      Alert.alert("오류", "저장 중 오류가 발생했습니다.");
      console.error("Save invoice error:", error);
    }
  };

  const totals = getTotals();

  // 품목 선택 (기존 스타일 유지하면서 개선된 UI)
  const renderProductDropdownForItem = (item: InvoiceItem, index: number) => {
    const dropdownState = getDropdownState(item.id);

    return (
      <View>
        {/* 기존 input 스타일과 동일한 선택/입력 필드 */}
        <View style={styles.productInputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: COLORS.background,
                color: COLORS.text,
                borderColor: COLORS.border,
                flex: 1,
              },
            ]}
            value={item.name}
            onChangeText={(value) => updateItem(index, "name", value)}
            placeholder="품목명을 입력하거나 선택하세요"
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity
            style={styles.selectToggleButton}
            onPress={() =>
              updateDropdownState(item.id, {
                showCategoryDropdown: !dropdownState.showCategoryDropdown,
              })
            }
          >
            <Ionicons
              name={
                dropdownState.showCategoryDropdown
                  ? "chevron-up"
                  : "chevron-down"
              }
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* 기존 과세구분과 유사한 스타일의 카테고리 선택 버튼들 */}
        {dropdownState.showCategoryDropdown && (
          <View style={styles.categorySelectionContainer}>
            <Text
              style={[styles.categorySelectionLabel, { color: COLORS.text }]}
            >
              카테고리 선택:
            </Text>
            <View style={styles.categoryButtonsRow}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categorySelectionButton,
                    {
                      backgroundColor: COLORS.primary + "20",
                      borderColor: COLORS.primary,
                    },
                  ]}
                  onPress={() => handleCategorySelect(item.id, category)}
                >
                  <Text
                    style={[
                      styles.categorySelectionText,
                      { color: COLORS.primary },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 선택된 카테고리의 상품들 (기존 과세구분과 유사한 스타일) */}
        {dropdownState.selectedCategory &&
          dropdownState.showCategoryDropdown && (
            <View style={styles.productSelectionContainer}>
              <Text
                style={[styles.productSelectionLabel, { color: COLORS.text }]}
              >
                {dropdownState.selectedCategory} 상품:
              </Text>
              <View style={styles.productButtonsGrid}>
                {CATEGORY_ITEMS[dropdownState.selectedCategory].map(
                  (productName) => (
                    <TouchableOpacity
                      key={productName}
                      style={[
                        styles.productSelectionButton,
                        {
                          backgroundColor:
                            item.name === productName
                              ? COLORS.primary + "20"
                              : COLORS.background,
                          borderColor:
                            item.name === productName
                              ? COLORS.primary
                              : COLORS.border,
                        },
                      ]}
                      onPress={() =>
                        handleProductSelect(item.id, productName, index)
                      }
                    >
                      <Text
                        style={[
                          styles.productSelectionText,
                          {
                            color:
                              item.name === productName
                                ? COLORS.primary
                                : COLORS.text,
                          },
                        ]}
                      >
                        {productName}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          )}
      </View>
    );
  };

  const renderItem = (item: InvoiceItem, index: number) => (
    <View
      key={item.id}
      style={[styles.itemCard, { backgroundColor: COLORS.white }]}
    >
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTitle, { color: COLORS.text }]}>
          품목 {index + 1}
        </Text>
        {items.length > 1 && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(index)}
          >
            <Ionicons name="close-circle" size={24} color={COLORS.error} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: COLORS.text }]}>품목명</Text>
        {renderProductDropdownForItem(item, index)}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={[styles.label, { color: COLORS.text }]}>수량</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: COLORS.background,
                color: COLORS.text,
                borderColor: COLORS.border,
              },
            ]}
            value={String(item.quantity)}
            onChangeText={(value) =>
              updateItem(index, "quantity", Number(value) || 0)
            }
            keyboardType="numeric"
            placeholder="수량"
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={[styles.label, { color: COLORS.text }]}>
            {item.taxType === "과세" ? "부가세 포함 단가" : "단가"}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: COLORS.background,
                color: COLORS.text,
                borderColor: COLORS.border,
              },
            ]}
            value={String(item.unitPrice)}
            onChangeText={(value) =>
              updateItem(index, "unitPrice", Number(value) || 0)
            }
            keyboardType="numeric"
            placeholder={item.taxType === "과세" ? "부가세 포함 단가" : "단가"}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: COLORS.text }]}>과세구분</Text>
        <View style={styles.taxTypeRow}>
          {(["과세", "면세", "영세"] as TaxType[]).map((taxType) => (
            <TouchableOpacity
              key={taxType}
              style={[
                styles.taxTypeButton,
                {
                  backgroundColor:
                    item.taxType === taxType
                      ? COLORS.primary + "20"
                      : COLORS.background,
                  borderColor:
                    item.taxType === taxType ? COLORS.primary : COLORS.border,
                },
              ]}
              onPress={() => updateItem(index, "taxType", taxType)}
            >
              <Text
                style={[
                  styles.taxTypeText,
                  {
                    color:
                      item.taxType === taxType ? COLORS.primary : COLORS.text,
                  },
                ]}
              >
                {taxType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.amountInfo}>
        <Text style={[styles.amountText, { color: COLORS.textSecondary }]}>
          공급가액: {item.amount.toLocaleString()}원
        </Text>
        <Text style={[styles.amountText, { color: COLORS.textSecondary }]}>
          세액: {item.taxAmount.toLocaleString()}원
        </Text>
        <Text
          style={[styles.amountText, { color: COLORS.text, fontWeight: "600" }]}
        >
          합계: {item.totalAmount.toLocaleString()}원
        </Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
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
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.white }]}>
              {isEdit ? "계산서 수정" : "계산서 생성"}
            </Text>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="checkmark" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View
            style={[styles.basicInfoCard, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              기본 정보
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                계산서 번호
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: COLORS.background,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  },
                ]}
                value={invoiceNumber}
                onChangeText={setInvoiceNumber}
                placeholder="계산서 번호"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <View style={[styles.itemsCard, { backgroundColor: COLORS.white }]}>
            <View style={styles.itemsHeader}>
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                품목 정보
              </Text>
              <TouchableOpacity
                style={[
                  styles.addItemButton,
                  { backgroundColor: COLORS.primary },
                ]}
                onPress={addItem}
              >
                <Ionicons name="add" size={20} color={COLORS.white} />
                <Text style={[styles.addItemText, { color: COLORS.white }]}>
                  품목 추가
                </Text>
              </TouchableOpacity>
            </View>

            {items.map((item, index) => renderItem(item, index))}
          </View>

          <View style={[styles.totalCard, { backgroundColor: COLORS.white }]}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              합계 금액
            </Text>
            <View style={styles.totalRow}>
              <Text
                style={[styles.totalLabel, { color: COLORS.textSecondary }]}
              >
                공급가액
              </Text>
              <Text style={[styles.totalValue, { color: COLORS.text }]}>
                {totals.totalSupplyAmount.toLocaleString()}원
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text
                style={[styles.totalLabel, { color: COLORS.textSecondary }]}
              >
                세액
              </Text>
              <Text style={[styles.totalValue, { color: COLORS.text }]}>
                {totals.totalTaxAmount.toLocaleString()}원
              </Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={[styles.grandTotalLabel, { color: COLORS.text }]}>
                총 합계
              </Text>
              <Text style={[styles.grandTotalValue, { color: COLORS.primary }]}>
                {totals.totalAmount.toLocaleString()}원
              </Text>
            </View>
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
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  basicInfoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  totalCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  removeButton: {
    padding: 4,
  },
  row: {
    flexDirection: "row",
  },
  taxTypeRow: {
    flexDirection: "row",
    gap: 8,
  },
  taxTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  taxTypeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  amountInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  amountText: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  // 상품 선택 관련 스타일 (기존 UI와 일관성 유지)
  productInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectToggleButton: {
    padding: 8,
    borderRadius: 4,
  },
  categorySelectionContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categorySelectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  categoryButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categorySelectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 70,
    alignItems: "center",
  },
  categorySelectionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  productSelectionContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  productSelectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  productButtonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  productSelectionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    minWidth: 80,
    alignItems: "center",
    marginBottom: 4,
  },
  productSelectionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default InvoiceEditScreen;
