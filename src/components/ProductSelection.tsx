import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductCategory, ProductSelectionFormData } from "../types";

interface ProductSelectionProps {
  companyId: string;
  products: Product[];
  onAddProduct: () => void;
  onSelectProduct: (formData: ProductSelectionFormData) => void;
}

// 샘플 상품 데이터
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "사과",
    category: "식품",
    price: 5000,
    unit: "kg",
    description: "신선한 사과",
    companyId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "노트북",
    category: "전자제품",
    price: 1500000,
    unit: "대",
    description: "고성능 노트북",
    companyId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "셔츠",
    category: "의류",
    price: 30000,
    unit: "벌",
    description: "면 셔츠",
    companyId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "쌀",
    category: "식품",
    price: 50000,
    unit: "포",
    description: "국산 쌀 20kg",
    companyId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "우유",
    category: "식품",
    price: 3000,
    unit: "개",
    description: "신선한 우유 1L",
    companyId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  companyId,
  products,
  onAddProduct,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "전체"
  >("전체");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [customCategories, setCustomCategories] = useState<ProductCategory[]>(
    []
  );
  const [formData, setFormData] = useState<ProductSelectionFormData>({
    productId: "",
    quantity: 1,
    unitPrice: 0,
    deliveryDate: new Date(),
    memo: "",
  });

  // 실제 앱에서는 props로 받은 products를 사용하지만, 데모용으로 샘플 데이터 사용
  const displayProducts = products.length > 0 ? products : sampleProducts;

  const defaultCategories: (ProductCategory | "전체")[] = [
    "전체",
    "식품",
    "전자제품",
    "의류",
    "가구",
    "화장품",
    "서비스",
    "기타",
  ];

  // 기본 카테고리 + 사용자 추가 카테고리
  const allCategories = [...defaultCategories, ...customCategories];

  const filteredProducts = displayProducts.filter(
    (product) =>
      selectedCategory === "전체" || product.category === selectedCategory
  );

  const getCategoryColor = (category: ProductCategory | "전체") => {
    switch (category) {
      case "식품":
        return "#10b981";
      case "전자제품":
        return "#3b82f6";
      case "의류":
        return "#ec4899";
      case "가구":
        return "#f59e0b";
      case "화장품":
        return "#ef4444";
      case "서비스":
        return "#8b5cf6";
      case "기타":
        return "#6b7280";
      default:
        return "#525252";
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      productId: product.id,
      quantity: 1,
      unitPrice: product.price,
      deliveryDate: new Date(),
      memo: "",
    });
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    if (!selectedProduct) return;

    if (formData.quantity <= 0) {
      Alert.alert("알림", "수량을 올바르게 입력해주세요.");
      return;
    }

    if (formData.unitPrice <= 0) {
      Alert.alert("알림", "단가를 올바르게 입력해주세요.");
      return;
    }

    onSelectProduct(formData);
    setIsModalVisible(false);
    setSelectedProduct(null);
    Alert.alert("완료", "상품 배송이 등록되었습니다!");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setFormData({
      productId: "",
      quantity: 1,
      unitPrice: 0,
      deliveryDate: new Date(),
      memo: "",
    });
  };

  const handleAddCategory = () => {
    setIsCategoryModalVisible(true);
  };

  const handleCategorySubmit = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("알림", "카테고리 이름을 입력해주세요.");
      return;
    }

    if (allCategories.includes(newCategoryName as ProductCategory)) {
      Alert.alert("알림", "이미 존재하는 카테고리입니다.");
      return;
    }

    setCustomCategories((prev) => [
      ...prev,
      newCategoryName as ProductCategory,
    ]);
    setNewCategoryName("");
    setIsCategoryModalVisible(false);
    Alert.alert("완료", `'${newCategoryName}' 카테고리가 추가되었습니다!`);
  };

  const handleCategoryCancel = () => {
    setIsCategoryModalVisible(false);
    setNewCategoryName("");
  };

  const renderCategoryItem = ({ item }: { item: ProductCategory | "전체" }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
        {
          backgroundColor:
            selectedCategory === item ? getCategoryColor(item) : "#F5F5F5",
        },
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderAddCategoryButton = () => (
    <TouchableOpacity
      style={styles.addCategoryButton}
      onPress={handleAddCategory}
    >
      <Ionicons name="add" size={16} color="#525252" />
      <Text style={styles.addCategoryText}>카테고리 추가</Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductSelect(item)}
    >
      <View style={styles.productHeader}>
        <Text style={styles.productName}>{item.name}</Text>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) },
          ]}
        >
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.productUnit}>/{item.unit}</Text>
      </View>

      {item.description && (
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.productFooter}>
        <Ionicons name="add-circle" size={24} color="#525252" />
        <Text style={styles.selectText}>선택</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryModal = () => (
    <Modal
      visible={isCategoryModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleCategoryCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.categoryModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>카테고리 추가</Text>
            <TouchableOpacity onPress={handleCategoryCancel}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryModalBody}>
            <Text style={styles.categoryModalLabel}>새 카테고리 이름</Text>
            <TextInput
              style={styles.categoryInput}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="카테고리 이름을 입력하세요"
              autoFocus
            />

            <Text style={styles.categoryHint}>
              💡 힌트: 문구용품, 건강식품, 생활용품 등
            </Text>

            <View style={styles.categoryModalActions}>
              <TouchableOpacity
                style={styles.categoryCancelButton}
                onPress={handleCategoryCancel}
              >
                <Text style={styles.categoryCancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categorySubmitButton}
                onPress={handleCategorySubmit}
              >
                <Text style={styles.categorySubmitButtonText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSelectionModal = () => (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>상품 선택</Text>
            <TouchableOpacity onPress={handleCancel}>
              <Ionicons name="close" size={24} color="#737373" />
            </TouchableOpacity>
          </View>

          {selectedProduct && (
            <View style={styles.modalBody}>
              <View style={styles.selectedProductInfo}>
                <Text style={styles.selectedProductName}>
                  {selectedProduct.name}
                </Text>
                <Text style={styles.selectedProductPrice}>
                  {formatPrice(selectedProduct.price)} / {selectedProduct.unit}
                </Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>수량</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: Math.max(1, prev.quantity - 1),
                      }))
                    }
                  >
                    <Ionicons name="remove" size={20} color="#525252" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{formData.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() =>
                      setFormData((prev) => ({
                        ...prev,
                        quantity: prev.quantity + 1,
                      }))
                    }
                  >
                    <Ionicons name="add" size={20} color="#525252" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>단가</Text>
                <TextInput
                  style={styles.priceInput}
                  value={formData.unitPrice.toString()}
                  onChangeText={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      unitPrice: parseInt(text) || 0,
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="단가를 입력하세요"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>메모 (선택사항)</Text>
                <TextInput
                  style={styles.memoInput}
                  value={formData.memo}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, memo: text }))
                  }
                  placeholder="메모를 입력하세요"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>총 금액</Text>
                <Text style={styles.totalPrice}>
                  {formatPrice(formData.quantity * formData.unitPrice)}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>등록</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>상품 선택</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAddProduct}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>상품 추가</Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 필터 */}
      <View style={styles.categorySection}>
        <View style={styles.categorySectionHeader}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <TouchableOpacity
            style={styles.addCategoryHeaderButton}
            onPress={handleAddCategory}
          >
            <Ionicons name="add-circle-outline" size={16} color="#525252" />
            <Text style={styles.addCategoryHeaderText}>추가</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <FlatList
            data={allCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
        </View>
      </View>

      {/* 상품 목록 */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        style={styles.productList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>상품이 없습니다</Text>
            <Text style={styles.emptyStateSubtitle}>
              등록된 상품이 없습니다.{"\n"}새로운 상품을 추가해보세요!
            </Text>
          </View>
        }
      />

      {renderCategoryModal()}
      {renderSelectionModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#525252",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  categorySection: {
    marginBottom: 20,
  },
  categorySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  addCategoryHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addCategoryHeaderText: {
    fontSize: 12,
    color: "#525252",
    fontWeight: "600",
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryList: {
    maxHeight: 40,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F5F5F5",
  },
  selectedCategoryItem: {
    backgroundColor: "#525252",
  },
  categoryText: {
    fontSize: 14,
    color: "#737373",
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  addCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    marginLeft: 8,
  },
  addCategoryText: {
    fontSize: 12,
    color: "#525252",
    fontWeight: "500",
    marginLeft: 4,
  },
  productList: {
    flex: 1,
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "600",
  },
  productDetails: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#dc2626",
  },
  productUnit: {
    fontSize: 14,
    color: "#737373",
    marginLeft: 4,
  },
  productDescription: {
    fontSize: 12,
    color: "#737373",
    lineHeight: 16,
    marginBottom: 12,
  },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  selectText: {
    fontSize: 14,
    color: "#525252",
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
    lineHeight: 20,
  },
  // 카테고리 추가 모달 스타일
  categoryModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "85%",
    maxWidth: 400,
  },
  categoryModalBody: {
    padding: 24,
  },
  categoryModalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 12,
  },
  categoryInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#171717",
    marginBottom: 12,
  },
  categoryHint: {
    fontSize: 14,
    color: "#737373",
    marginBottom: 24,
    lineHeight: 20,
  },
  categoryModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#737373",
    textAlign: "center",
  },
  categorySubmitButton: {
    flex: 1,
    backgroundColor: "#525252",
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
  },
  categorySubmitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
  },
  modalBody: {
    padding: 20,
  },
  selectedProductInfo: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 4,
  },
  selectedProductPrice: {
    fontSize: 14,
    color: "#737373",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 8,
    margin: 4,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
    marginHorizontal: 20,
  },
  priceInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#171717",
  },
  memoInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#171717",
    minHeight: 80,
    textAlignVertical: "top",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#dc2626",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#737373",
    textAlign: "center",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#525252",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
  },
});
