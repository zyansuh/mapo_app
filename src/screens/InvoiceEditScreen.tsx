import React, { useState, useEffect } from "react";
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
  FlatList,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../styles/colors";
import { InvoiceItem, TaxType, InvoiceStatus, InvoiceFormData } from "../types";
import { ProductCategory, CATEGORY_ITEMS } from "../types/product";
import { useInvoice, useCompany } from "../hooks";

const InvoiceEditScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { addInvoice, updateInvoice, generateInvoiceNumber, getInvoiceById } =
    useInvoice();
  const { companies, getCompanyById } = useCompany();

  const invoiceId = route.params?.invoiceId;
  const preselectedCompanyId = route.params?.companyId;
  const isEdit = !!invoiceId;

  const [invoiceNumber, setInvoiceNumber] = useState(
    isEdit ? "INV-2024-001" : generateInvoiceNumber()
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    preselectedCompanyId || ""
  );
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
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

  // 기존 계산서 데이터 로드 (편집 모드일 때)
  useEffect(() => {
    if (isEdit && invoiceId) {
      const existingInvoice = getInvoiceById(invoiceId);
      if (existingInvoice) {
        setSelectedCompanyId(existingInvoice.companyId);
        setInvoiceNumber(existingInvoice.invoiceNumber);
        setItems(existingInvoice.items);
        setStatus(existingInvoice.status);
      }
    }
  }, [isEdit, invoiceId, getInvoiceById]);

  // 드롭다운 상태들
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: {
      showCategoryDropdown: boolean;
      showProductDropdown: boolean;
      selectedCategory: ProductCategory | null;
    };
  }>({});

  const categories: ProductCategory[] = ["두부", "콩나물", "묵류"];

  // 거래처 선택 함수
  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setCompanyModalVisible(false);
    setCompanySearchQuery(""); // 선택 후 검색어 초기화
  };

  const getSelectedCompanyName = () => {
    if (!selectedCompanyId) return "거래처를 선택하세요";
    const company = getCompanyById(selectedCompanyId);
    return company?.name || "거래처를 선택하세요";
  };

  // 거래처 검색 함수
  const getFilteredCompanies = () => {
    if (!companySearchQuery.trim()) {
      return companies;
    }

    const query = companySearchQuery.toLowerCase();
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(query) ||
        company.type.toLowerCase().includes(query) ||
        company.region.toLowerCase().includes(query) ||
        company.address.toLowerCase().includes(query) ||
        company.contactPerson?.toLowerCase().includes(query) ||
        company.phoneNumber.includes(query)
    );
  };

  // 거래처 모달 열기
  const openCompanyModal = () => {
    setCompanySearchQuery(""); // 모달 열 때 검색어 초기화
    setCompanyModalVisible(true);
  };

  const calculateAmounts = (item: InvoiceItem) => {
    const totalAmount = item.quantity * item.unitPrice;

    if (item.taxType === "과세") {
      // 부가세 포함 가격에서 공급가액과 부가세 역산
      const amount = Math.round(totalAmount / 1.1);
      const taxAmount = totalAmount - amount;

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

    if (!selectedCompanyId) {
      Alert.alert("오류", "거래처를 선택해주세요.");
      return;
    }

    const totals = getTotals();

    const invoiceFormData: InvoiceFormData = {
      invoiceNumber,
      companyId: selectedCompanyId,
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
          const selectedCompany = getCompanyById(selectedCompanyId);
          Alert.alert(
            "수정 완료",
            `${selectedCompany?.name}의 계산서가 수정되었습니다.`,
            [{ text: "확인", onPress: () => navigation.goBack() }]
          );
        } else {
          Alert.alert("오류", "계산서 수정에 실패했습니다.");
        }
      } else {
        const newInvoice = await addInvoice(invoiceFormData);
        if (newInvoice) {
          const selectedCompany = getCompanyById(selectedCompanyId);
          Alert.alert(
            "생성 완료",
            `${selectedCompany?.name}의 계산서가 생성되었습니다.\n계산서 번호: ${invoiceNumber}`,
            [{ text: "확인", onPress: () => navigation.goBack() }]
          );
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

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                거래처 * {!selectedCompanyId && "(필수)"}
              </Text>
              <TouchableOpacity
                style={[
                  styles.companySelectButton,
                  {
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.border,
                  },
                ]}
                onPress={openCompanyModal}
              >
                <Text
                  style={[
                    styles.companySelectText,
                    {
                      color: selectedCompanyId
                        ? COLORS.text
                        : COLORS.textSecondary,
                    },
                  ]}
                >
                  {getSelectedCompanyName()}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
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

        {/* 거래처 선택 모달 */}
        <Modal
          visible={companyModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCompanyModalVisible(false)}
        >
          <View style={styles.companyModalContainer}>
            <View
              style={[
                styles.companyModalContent,
                { backgroundColor: COLORS.white },
              ]}
            >
              <View
                style={[
                  styles.companyModalHeader,
                  { borderBottomColor: COLORS.border },
                ]}
              >
                <Text
                  style={[styles.companyModalTitle, { color: COLORS.text }]}
                >
                  거래처 선택{" "}
                  {companySearchQuery.trim() &&
                    `(${getFilteredCompanies().length}개)`}
                </Text>
                <TouchableOpacity onPress={() => setCompanyModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {/* 검색 입력 필드 */}
              <View
                style={[
                  styles.searchContainer,
                  { backgroundColor: COLORS.background },
                ]}
              >
                <View style={styles.searchInputContainer}>
                  <Ionicons
                    name="search"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={[
                      styles.searchInput,
                      {
                        color: COLORS.text,
                        backgroundColor: COLORS.white,
                        borderColor: COLORS.border,
                      },
                    ]}
                    value={companySearchQuery}
                    onChangeText={setCompanySearchQuery}
                    placeholder="거래처명, 유형, 지역으로 검색..."
                    placeholderTextColor={COLORS.textSecondary}
                  />
                  {companySearchQuery.length > 0 && (
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setCompanySearchQuery("")}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={COLORS.textSecondary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <FlatList
                data={getFilteredCompanies()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.companyItem,
                      { borderBottomColor: COLORS.border },
                    ]}
                    onPress={() => handleCompanySelect(item.id)}
                  >
                    <Text
                      style={[styles.companyItemName, { color: COLORS.text }]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.companyItemType,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {item.type} • {item.region}
                    </Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: COLORS.textSecondary }}>
                      {companySearchQuery.trim()
                        ? `"${companySearchQuery}"에 대한 검색 결과가 없습니다.`
                        : "등록된 거래처가 없습니다."}
                    </Text>
                    {companySearchQuery.trim() && (
                      <TouchableOpacity
                        style={{ marginTop: 10, padding: 8 }}
                        onPress={() => setCompanySearchQuery("")}
                      >
                        <Text style={{ color: COLORS.primary, fontSize: 14 }}>
                          전체 목록 보기
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                }
              />
            </View>
          </View>
        </Modal>
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
  // 거래처 선택 관련 스타일
  companySelectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  companySelectText: {
    fontSize: 16,
    flex: 1,
  },
  // 거래처 모달 스타일
  companyModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  companyModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    margin: 20,
    maxHeight: "80%",
    width: "90%",
  },
  companyModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  companyModalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  companyItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  companyItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  companyItemType: {
    fontSize: 14,
    color: "#666",
  },
  // 검색 관련 스타일
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: "relative",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default InvoiceEditScreen;
