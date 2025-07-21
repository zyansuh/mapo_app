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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../styles/colors";
import { ProductCategory, CATEGORY_ITEMS, ProductItem } from "../types/product";

export interface SelectedProduct {
  category: ProductCategory;
  productItem: ProductItem;
  quantity: number;
  unitPrice: number;
}

interface ProductSelectionProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (products: SelectedProduct[]) => void;
  selectedProducts?: SelectedProduct[];
}

const ProductSelection: React.FC<ProductSelectionProps> = ({
  visible,
  onClose,
  onConfirm,
  selectedProducts = [],
}) => {
  const [products, setProducts] = useState<SelectedProduct[]>(selectedProducts);

  // 드롭다운 관련 상태
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [selectedProductItem, setSelectedProductItem] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState<string>("1");
  const [unitPrice, setUnitPrice] = useState<string>("");

  // 드롭다운 표시 상태
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const categories: ProductCategory[] = ["두부", "콩나물", "묵류"];

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setSelectedProductItem(null);
    setShowCategoryDropdown(false);
    setShowProductDropdown(false);
  };

  const handleProductItemSelect = (productItem: string) => {
    setSelectedProductItem(productItem);
    setShowProductDropdown(false);
  };

  const handleAddProduct = () => {
    if (!selectedCategory) {
      Alert.alert("알림", "카테고리를 선택해주세요.");
      return;
    }

    if (!selectedProductItem) {
      Alert.alert("알림", "상품을 선택해주세요.");
      return;
    }

    const qty = parseInt(quantity);
    const price = parseFloat(unitPrice);

    if (isNaN(qty) || qty <= 0) {
      Alert.alert("알림", "올바른 수량을 입력해주세요.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      Alert.alert("알림", "올바른 단가를 입력해주세요.");
      return;
    }

    // 이미 선택된 같은 상품이 있는지 확인
    const existingIndex = products.findIndex(
      (p) =>
        p.category === selectedCategory && p.productItem === selectedProductItem
    );

    if (existingIndex >= 0) {
      // 기존 상품의 수량과 단가 업데이트
      const updated = [...products];
      updated[existingIndex].quantity += qty;
      updated[existingIndex].unitPrice = price;
      setProducts(updated);
    } else {
      // 새로운 상품 추가
      const newProduct: SelectedProduct = {
        category: selectedCategory,
        productItem: selectedProductItem as ProductItem,
        quantity: qty,
        unitPrice: price,
      };
      setProducts([...products, newProduct]);
    }

    // 폼 초기화
    setSelectedCategory(null);
    setSelectedProductItem(null);
    setQuantity("1");
    setUnitPrice("");
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setProducts(products.filter((_, i) => i !== index));
    } else {
      const updated = [...products];
      updated[index].quantity = newQuantity;
      setProducts(updated);
    }
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...products];
    updated[index].unitPrice = price;
    setProducts(updated);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    if (products.length === 0) {
      Alert.alert("알림", "상품을 추가해주세요.");
      return;
    }

    onConfirm(products);
    onClose();
  };

  const getTotalAmount = () => {
    return products.reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );
  };

  const renderCategoryDropdown = () => (
    <View style={styles.dropdownContainer}>
      <Text style={[styles.label, { color: COLORS.text }]}>카테고리 선택</Text>
      <TouchableOpacity
        style={[styles.dropdown, { borderColor: COLORS.border }]}
        onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
      >
        <Text
          style={[
            styles.dropdownText,
            { color: selectedCategory ? COLORS.text : COLORS.textSecondary },
          ]}
        >
          {selectedCategory || "카테고리를 선택하세요"}
        </Text>
        <Ionicons
          name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {showCategoryDropdown && (
        <View
          style={[styles.dropdownOptions, { backgroundColor: COLORS.white }]}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.dropdownOption}
              onPress={() => handleCategorySelect(category)}
            >
              <Text style={[styles.dropdownOptionText, { color: COLORS.text }]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderProductDropdown = () => {
    if (!selectedCategory) return null;

    const products = CATEGORY_ITEMS[selectedCategory];

    return (
      <View style={styles.dropdownContainer}>
        <Text style={[styles.label, { color: COLORS.text }]}>상품 선택</Text>
        <TouchableOpacity
          style={[styles.dropdown, { borderColor: COLORS.border }]}
          onPress={() => setShowProductDropdown(!showProductDropdown)}
        >
          <Text
            style={[
              styles.dropdownText,
              {
                color: selectedProductItem ? COLORS.text : COLORS.textSecondary,
              },
            ]}
          >
            {selectedProductItem || "상품을 선택하세요"}
          </Text>
          <Ionicons
            name={showProductDropdown ? "chevron-up" : "chevron-down"}
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {showProductDropdown && (
          <View
            style={[styles.dropdownOptions, { backgroundColor: COLORS.white }]}
          >
            {products.map((productItem) => (
              <TouchableOpacity
                key={productItem}
                style={styles.dropdownOption}
                onPress={() => handleProductItemSelect(productItem)}
              >
                <Text
                  style={[styles.dropdownOptionText, { color: COLORS.text }]}
                >
                  {productItem}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderAddProductForm = () => (
    <View style={[styles.addProductForm, { backgroundColor: COLORS.white }]}>
      <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
        상품 추가
      </Text>

      {renderCategoryDropdown()}
      {renderProductDropdown()}

      <View style={styles.quantityPriceRow}>
        <View style={styles.quantityContainer}>
          <Text style={[styles.label, { color: COLORS.text }]}>수량</Text>
          <TextInput
            style={[
              styles.quantityInput,
              { borderColor: COLORS.border, color: COLORS.text },
            ]}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="1"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.label, { color: COLORS.text }]}>단가 (원)</Text>
          <TextInput
            style={[
              styles.priceInput,
              { borderColor: COLORS.border, color: COLORS.text },
            ]}
            value={unitPrice}
            onChangeText={setUnitPrice}
            placeholder="단가 입력"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: COLORS.primary }]}
        onPress={handleAddProduct}
        disabled={!selectedCategory || !selectedProductItem}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={[styles.addButtonText, { color: COLORS.white }]}>
          상품 추가
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedProducts = () => {
    if (products.length === 0) {
      return (
        <View style={styles.emptySelected}>
          <Ionicons
            name="cube-outline"
            size={48}
            color={COLORS.textSecondary}
          />
          <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
            추가된 상품이 없습니다
          </Text>
          <Text style={[styles.emptySubText, { color: COLORS.textSecondary }]}>
            위에서 상품을 선택하여 추가해보세요
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.selectedProducts}
        showsVerticalScrollIndicator={false}
      >
        {products.map((product, index) => (
          <View
            key={`${product.category}-${product.productItem}-${index}`}
            style={[styles.selectedProductItem, { backgroundColor: "#f9fafb" }]}
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
              <Text style={[styles.productName, { color: COLORS.text }]}>
                {product.productItem}
              </Text>
            </View>

            <View style={styles.productControls}>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: COLORS.white },
                  ]}
                  onPress={() =>
                    handleQuantityChange(index, product.quantity - 1)
                  }
                >
                  <Ionicons name="remove" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={[styles.quantityText, { color: COLORS.text }]}>
                  {product.quantity}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: COLORS.white },
                  ]}
                  onPress={() =>
                    handleQuantityChange(index, product.quantity + 1)
                  }
                >
                  <Ionicons name="add" size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <TextInput
                style={[
                  styles.editPriceInput,
                  { borderColor: COLORS.border, color: COLORS.text },
                ]}
                value={String(product.unitPrice)}
                onChangeText={(text) =>
                  handlePriceChange(index, Number(text) || 0)
                }
                placeholder="단가"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="numeric"
              />

              <Text style={[styles.totalText, { color: COLORS.primary }]}>
                {(product.quantity * product.unitPrice).toLocaleString()}원
              </Text>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveProduct(index)}
              >
                <Ionicons name="trash" size={16} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* 전체 합계 */}
        <View style={[styles.totalSection, { backgroundColor: COLORS.white }]}>
          <Text style={[styles.totalLabel, { color: COLORS.text }]}>
            총 금액
          </Text>
          <Text style={[styles.totalAmount, { color: COLORS.primary }]}>
            {getTotalAmount().toLocaleString()}원
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: COLORS.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.white }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            상품 선택
          </Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            <Text style={[styles.confirmText, { color: COLORS.primary }]}>
              완료 ({products.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* 상품 추가 폼 */}
          {renderAddProductForm()}

          {/* 선택된 상품 목록 */}
          <View
            style={[styles.selectedSection, { backgroundColor: COLORS.white }]}
          >
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
              선택된 상품 ({products.length})
            </Text>
            {renderSelectedProducts()}
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
    borderBottomColor: "#e5e7eb",
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  confirmButton: {
    padding: 8,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addProductForm: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  selectedSection: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownOptions: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    maxHeight: 200,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1001,
  },
  dropdownOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  quantityPriceRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  quantityContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 2,
  },
  quantityInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emptySelected: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 4,
  },
  selectedProducts: {
    flex: 1,
  },
  selectedProductItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    marginBottom: 12,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
  },
  productControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    padding: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  quantityText: {
    minWidth: 30,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  editPriceInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    backgroundColor: "#ffffff",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
  removeButton: {
    padding: 4,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
  },
});

export default ProductSelection;
