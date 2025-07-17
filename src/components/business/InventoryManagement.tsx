import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product, ProductCategory, ProductStatus } from "../../types";
import TextInput from "../forms/TextInput";
import Picker from "../forms/Picker";
import Button from "../forms/Button";

// 스타일 import
import {
  listStyles,
  getCategoryBadgeStyle,
  getCategoryTextStyle,
} from "../styles/listStyles";
import { formStyles } from "../styles/formStyles";
import { COLORS, CATEGORY_COLORS } from "../../styles/colors";

interface InventoryManagementProps {
  products: Product[];
  onAddProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => void;
  onUpdateProduct: (id: string, product: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

// 간단한 상품 폼 데이터 (재고 관리용)
interface SimpleProductFormData {
  name: string;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  unit: string;
  description: string;
  companyId: string;
}

const categoryOptions = [
  { label: "두부", value: "두부" as ProductCategory },
  { label: "콩나물", value: "콩나물" as ProductCategory },
  { label: "묵류", value: "묵류" as ProductCategory },
  { label: "기타", value: "기타" as ProductCategory },
];

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<SimpleProductFormData>({
    name: "",
    category: "두부",
    status: "활성",
    price: 0,
    unit: "",
    description: "",
    companyId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "전체"
  >("전체");

  const resetForm = () => {
    setFormData({
      name: "",
      category: "두부",
      status: "활성",
      price: 0,
      unit: "",
      description: "",
      companyId: "",
    });
    setEditingProduct(null);
    setIsFormVisible(false);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert("오류", "상품명을 입력해주세요.");
      return;
    }

    if (formData.price <= 0) {
      Alert.alert("오류", "올바른 가격을 입력해주세요.");
      return;
    }

    if (!formData.unit.trim()) {
      Alert.alert("오류", "단위를 입력해주세요.");
      return;
    }

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, formData);
    } else {
      onAddProduct(formData);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      category: product.category,
      status: product.status,
      price: product.price,
      unit: product.unit,
      description: product.description || "",
      companyId: product.companyId || "",
    });
    setEditingProduct(product);
    setIsFormVisible(true);
  };

  const handleDelete = (product: Product) => {
    Alert.alert("삭제 확인", `"${product.name}" 상품을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onDeleteProduct(product.id),
      },
    ]);
  };

  // 필터링된 상품 목록
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 카테고리별 통계
  const categoryStats = categoryOptions.reduce((acc, category) => {
    const categoryProducts = products.filter(
      (p) => p.category === category.value
    );
    acc[category.value] = {
      count: categoryProducts.length,
      totalValue: categoryProducts.reduce((sum, p) => sum + p.price, 0),
    };
    return acc;
  }, {} as Record<ProductCategory, { count: number; totalValue: number }>);

  return (
    <View style={listStyles.container}>
      {/* 헤더 및 통계 */}
      <View style={listStyles.header}>
        <Text style={listStyles.headerTitle}>재고 관리</Text>
        <Text style={listStyles.headerSubtitle}>
          총 {products.length}개 상품
        </Text>
      </View>

      {/* 전체 콘텐츠를 하나의 ScrollView로 통합 */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* 카테고리별 통계 카드 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          <View
            style={{ flexDirection: "row", gap: 15, paddingHorizontal: 20 }}
          >
            {categoryOptions.map((category) => {
              const stats = categoryStats[category.value];
              return (
                <View
                  key={category.value}
                  style={[
                    listStyles.card,
                    getCategoryBadgeStyle(category.value),
                    { minWidth: 140, marginBottom: 0 },
                  ]}
                >
                  <Text
                    style={[
                      listStyles.cardTitle,
                      getCategoryTextStyle(category.value),
                    ]}
                  >
                    {category.label}
                  </Text>
                  <Text
                    style={[
                      listStyles.cardSubtitle,
                      getCategoryTextStyle(category.value),
                    ]}
                  >
                    {stats.count}개 상품
                  </Text>
                  <Text
                    style={[
                      listStyles.listItemValue,
                      getCategoryTextStyle(category.value),
                    ]}
                  >
                    평균{" "}
                    {stats.count > 0
                      ? Math.round(stats.totalValue / stats.count)
                      : 0}
                    원
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* 검색 및 필터 */}
        <View style={[listStyles.searchContainer, { marginHorizontal: 0 }]}>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="상품명으로 검색..."
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              style={[
                formStyles.button,
                formStyles.buttonPrimary,
                { paddingHorizontal: 15 },
              ]}
              onPress={() => setIsFormVisible(true)}
            >
              <Text style={formStyles.buttonText}>추가</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["전체", ...categoryOptions.map((c) => c.label)].map(
                (category, index) => {
                  const isSelected =
                    (category === "전체" && selectedCategory === "전체") ||
                    (category !== "전체" &&
                      selectedCategory ===
                        categoryOptions.find((c) => c.label === category)
                          ?.value);

                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => {
                        if (category === "전체") {
                          setSelectedCategory("전체");
                        } else {
                          const categoryValue = categoryOptions.find(
                            (c) => c.label === category
                          )?.value;
                          if (categoryValue) {
                            setSelectedCategory(categoryValue);
                          }
                        }
                      }}
                      style={[
                        formStyles.button,
                        formStyles.buttonSecondary,
                        isSelected && formStyles.buttonPrimary,
                        { minWidth: 60 },
                      ]}
                    >
                      <Text
                        style={[
                          formStyles.buttonTextSecondary,
                          isSelected && formStyles.buttonText,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </ScrollView>
        </View>

        {/* 상품 목록 */}
        <View style={listStyles.listContainer}>
          {filteredProducts.length === 0 ? (
            <View style={listStyles.emptyContainer}>
              <Ionicons
                name="cube-outline"
                size={50}
                color={COLORS.textSecondary}
              />
              <Text style={listStyles.emptyText}>
                {searchQuery || selectedCategory !== "전체"
                  ? "검색 조건에 맞는 상품이 없습니다."
                  : "등록된 상품이 없습니다."}
              </Text>
              <Text style={listStyles.emptySubtext}>
                새로운 상품을 추가해보세요.
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <View key={product.id} style={listStyles.card}>
                <View style={listStyles.cardHeader}>
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
                          getCategoryBadgeStyle(product.category),
                        ]}
                      >
                        <Text
                          style={[
                            listStyles.categoryText,
                            getCategoryTextStyle(product.category),
                          ]}
                        >
                          {product.category}
                        </Text>
                      </View>
                      <Text style={listStyles.cardTitle}>{product.name}</Text>
                    </View>
                    <Text style={listStyles.cardSubtitle}>
                      {product.price.toLocaleString()}원 / {product.unit}
                    </Text>
                    {product.description && (
                      <Text style={[listStyles.cardSubtitle, { marginTop: 5 }]}>
                        {product.description}
                      </Text>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity onPress={() => handleEdit(product)}>
                      <Ionicons
                        name="pencil"
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(product)}>
                      <Ionicons name="trash" size={20} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* 상품 등록/수정 폼 */}
        {isFormVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: COLORS.overlay,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.background,
                borderRadius: 12,
                padding: 20,
                width: "100%",
                maxHeight: "80%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text style={formStyles.sectionTitle}>
                  {editingProduct ? "상품 수정" : "상품 등록"}
                </Text>
                <TouchableOpacity onPress={resetForm}>
                  <Ionicons name="close" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>상품명 *</Text>
                  <TextInput
                    value={formData.name}
                    onChangeText={(value) =>
                      setFormData({ ...formData, name: value })
                    }
                    placeholder="상품명을 입력하세요"
                  />
                </View>

                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>카테고리 *</Text>
                  <Picker
                    selectedValue={formData.category}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value as ProductCategory,
                      })
                    }
                    options={categoryOptions}
                  />
                </View>

                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>상태 *</Text>
                  <Picker
                    selectedValue={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as ProductStatus,
                      })
                    }
                    options={[
                      { label: "활성", value: "활성" as ProductStatus },
                      { label: "단종", value: "단종" as ProductStatus },
                      { label: "일시중단", value: "일시중단" as ProductStatus },
                    ]}
                  />
                </View>

                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>가격 *</Text>
                  <TextInput
                    value={formData.price.toString()}
                    onChangeText={(value) =>
                      setFormData({ ...formData, price: parseInt(value) || 0 })
                    }
                    placeholder="가격을 입력하세요"
                    keyboardType="numeric"
                  />
                </View>

                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>단위 *</Text>
                  <TextInput
                    value={formData.unit}
                    onChangeText={(value) =>
                      setFormData({ ...formData, unit: value })
                    }
                    placeholder="단위를 입력하세요 (개, kg, 박스 등)"
                  />
                </View>

                <View style={formStyles.fieldContainer}>
                  <Text style={formStyles.label}>설명</Text>
                  <TextInput
                    value={formData.description}
                    onChangeText={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    placeholder="상품 설명을 입력하세요"
                    multiline
                  />
                </View>
              </ScrollView>

              <View style={formStyles.buttonGroup}>
                <TouchableOpacity
                  style={[formStyles.button, formStyles.buttonSecondary]}
                  onPress={resetForm}
                >
                  <Text style={formStyles.buttonTextSecondary}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[formStyles.button, formStyles.buttonPrimary]}
                  onPress={handleSubmit}
                >
                  <Text style={formStyles.buttonText}>
                    {editingProduct ? "수정" : "등록"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
