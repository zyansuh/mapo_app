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
import {
  Company,
  DeliveryFormData,
  DeliveryItem,
  ProductCategory,
  PaymentMethod,
} from "../../types";

import { generateId } from "../../utils";
import TextInput from "../forms/TextInput";
import Button from "../forms/Button";
import Select from "../forms/Select";

// 스타일 import
import { modalStyles } from "../styles/modalStyles";
import { formStyles } from "../styles/formStyles";
import { COLORS, CATEGORY_COLORS } from "../../styles/colors";

interface DeliveryRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: DeliveryFormData) => void;
  companies: Company[];
}

interface ProductOption {
  id: string;
  name: string;
  category: ProductCategory;
  defaultPrice: number;
  unit: string;
}

// 제품 옵션 데이터
const PRODUCT_OPTIONS: ProductOption[] = [
  // 두부류
  {
    id: "tofu1",
    name: "착한손두부",
    category: "두부",
    defaultPrice: 1200,
    unit: "모",
  },
  {
    id: "tofu2",
    name: "고소한손두부",
    category: "두부",
    defaultPrice: 1300,
    unit: "모",
  },
  {
    id: "tofu3",
    name: "순두부",
    category: "두부",
    defaultPrice: 1500,
    unit: "모",
  },
  {
    id: "tofu4",
    name: "맛두부",
    category: "두부",
    defaultPrice: 1400,
    unit: "모",
  },
  {
    id: "tofu5",
    name: "판두부",
    category: "두부",
    defaultPrice: 2000,
    unit: "판",
  },
  {
    id: "tofu6",
    name: "모두부",
    category: "두부",
    defaultPrice: 1800,
    unit: "모",
  },
  {
    id: "tofu7",
    name: "콩물",
    category: "두부",
    defaultPrice: 3000,
    unit: "통",
  },

  // 콩나물류
  {
    id: "sprout1",
    name: "시루콩나물",
    category: "콩나물",
    defaultPrice: 2500,
    unit: "시루",
  },
  {
    id: "sprout2",
    name: "박스콩나물",
    category: "콩나물",
    defaultPrice: 5000,
    unit: "박스",
  },
  {
    id: "sprout3",
    name: "두절콩나물",
    category: "콩나물",
    defaultPrice: 3000,
    unit: "봉지",
  },

  // 묵류
  {
    id: "muk1",
    name: "도토리묵小",
    category: "묵류",
    defaultPrice: 2000,
    unit: "개",
  },
  {
    id: "muk2",
    name: "도토리묵大",
    category: "묵류",
    defaultPrice: 3500,
    unit: "개",
  },
  {
    id: "muk3",
    name: "도토리420",
    category: "묵류",
    defaultPrice: 4200,
    unit: "개",
  },
  {
    id: "muk4",
    name: "검정깨묵",
    category: "묵류",
    defaultPrice: 3000,
    unit: "개",
  },
  {
    id: "muk5",
    name: "우뭇가사리",
    category: "묵류",
    defaultPrice: 2800,
    unit: "개",
  },
  {
    id: "muk6",
    name: "청포묵",
    category: "묵류",
    defaultPrice: 2500,
    unit: "개",
  },
];

const paymentMethodOptions = [
  { label: "현금", value: "현금" as PaymentMethod },
  { label: "카드", value: "카드" as PaymentMethod },
  { label: "계좌이체", value: "계좌이체" as PaymentMethod },
];

export const DeliveryRegistrationModal: React.FC<
  DeliveryRegistrationModalProps
> = ({ visible, onClose, onSubmit, companies }) => {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([]);
  const [formData, setFormData] = useState<DeliveryFormData>({
    id: "",
    companyId: "",
    items: [],
    totalAmount: 0,
    paymentMethod: "현금",
    isCredit: false,
    dueDate: "",
    creditMemo: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [items, setItems] = useState<DeliveryItem[]>([]);

  const categoryOptions = [
    { label: "두부", value: "두부" as ProductCategory },
    { label: "콩나물", value: "콩나물" as ProductCategory },
    { label: "묵류", value: "묵류" as ProductCategory },
  ];

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.id,
  }));

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedProducts([]);
    setFormData({
      id: "",
      companyId: "",
      items: [],
      totalAmount: 0,
      paymentMethod: "현금",
      isCredit: false,
      dueDate: "",
      creditMemo: "",
      date: new Date().toISOString().split("T")[0],
    });
    setItems([]);
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    const categoryProducts = PRODUCT_OPTIONS.filter(
      (product) => product.category === category
    );
    setSelectedProducts(categoryProducts);
  };

  const addItem = (product: ProductOption) => {
    const newItem: DeliveryItem = {
      id: generateId(),
      productId: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
      price: product.defaultPrice,
      category: product.category,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (
    itemId: string,
    field: keyof DeliveryItem,
    value: any
  ) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleSubmit = () => {
    if (!formData.companyId) {
      Alert.alert("오류", "회사를 선택해주세요.");
      return;
    }

    if (items.length === 0) {
      Alert.alert("오류", "최소 하나의 상품을 추가해주세요.");
      return;
    }

    if (formData.isCredit && !formData.dueDate) {
      Alert.alert("오류", "외상 처리 시 마감일을 입력해주세요.");
      return;
    }

    const deliveryData: DeliveryFormData = {
      ...formData,
      id: generateId(),
      items: items,
      totalAmount: calculateTotal(),
    };

    onSubmit(deliveryData);
    resetForm();
    onClose();
  };

  const getCategoryColor = (category: ProductCategory) => {
    return CATEGORY_COLORS[category]?.primary || COLORS.primary;
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>배송 등록</Text>
            <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* 회사 선택 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>회사 선택 *</Text>
              <Select
                value={formData.companyId}
                onValueChange={(value) =>
                  setFormData({ ...formData, companyId: value })
                }
                options={companyOptions}
                placeholder="회사를 선택하세요"
              />
            </View>

            {/* 배송일 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>배송일 *</Text>
              <TextInput
                value={formData.date}
                onChangeText={(value) =>
                  setFormData({ ...formData, date: value })
                }
                placeholder="YYYY-MM-DD"
              />
            </View>

            {/* 제품 카테고리 선택 */}
            <View style={formStyles.fieldContainer}>
              <Text style={formStyles.label}>제품 카테고리 선택</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {categoryOptions.map((category) => (
                  <TouchableOpacity
                    key={category.value}
                    onPress={() => handleCategorySelect(category.value)}
                    style={[
                      formStyles.button,
                      selectedCategory === category.value
                        ? { backgroundColor: getCategoryColor(category.value) }
                        : formStyles.buttonSecondary,
                    ]}
                  >
                    <Text
                      style={[
                        selectedCategory === category.value
                          ? formStyles.buttonText
                          : formStyles.buttonTextSecondary,
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 제품 선택 */}
            {selectedCategory && (
              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>
                  {selectedCategory} 제품 선택
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {selectedProducts.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        onPress={() => addItem(product)}
                        style={[
                          formStyles.button,
                          formStyles.buttonSecondary,
                          {
                            backgroundColor:
                              getCategoryColor(product.category) + "20",
                          },
                        ]}
                      >
                        <Text style={formStyles.buttonTextSecondary}>
                          {product.name}
                        </Text>
                        <Text
                          style={[
                            formStyles.buttonTextSecondary,
                            { fontSize: 12 },
                          ]}
                        >
                          {product.defaultPrice.toLocaleString()}원
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* 선택된 상품 목록 */}
            {items.length > 0 && (
              <View style={formStyles.section}>
                <Text style={formStyles.sectionTitle}>선택된 상품</Text>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      formStyles.fieldContainer,
                      {
                        backgroundColor: COLORS.surface,
                        padding: 15,
                        borderRadius: 8,
                        borderLeftWidth: 4,
                        borderLeftColor: getCategoryColor(item.category),
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[formStyles.label, { marginBottom: 0 }]}>
                        {item.name}
                      </Text>
                      <TouchableOpacity onPress={() => removeItem(item.id)}>
                        <Ionicons name="trash" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{ flexDirection: "row", gap: 10, marginTop: 10 }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[formStyles.label, { fontSize: 12 }]}>
                          수량
                        </Text>
                        <TextInput
                          value={item.quantity.toString()}
                          onChangeText={(value) =>
                            updateItem(
                              item.id,
                              "quantity",
                              parseInt(value) || 0
                            )
                          }
                          keyboardType="numeric"
                          placeholder="수량"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[formStyles.label, { fontSize: 12 }]}>
                          단가
                        </Text>
                        <TextInput
                          value={item.price.toString()}
                          onChangeText={(value) =>
                            updateItem(item.id, "price", parseInt(value) || 0)
                          }
                          keyboardType="numeric"
                          placeholder="단가"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[formStyles.label, { fontSize: 12 }]}>
                          소계
                        </Text>
                        <View
                          style={[
                            formStyles.input,
                            { justifyContent: "center" },
                          ]}
                        >
                          <Text style={{ color: COLORS.text }}>
                            {(item.quantity * item.price).toLocaleString()}원
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* 결제 정보 */}
            <View style={formStyles.section}>
              <Text style={formStyles.sectionTitle}>결제 정보</Text>

              <View style={formStyles.fieldContainer}>
                <Text style={formStyles.label}>결제 방법</Text>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      paymentMethod: value as PaymentMethod,
                    })
                  }
                  options={paymentMethodOptions}
                  placeholder="결제 방법 선택"
                />
              </View>

              <View style={formStyles.checkboxContainer}>
                <TouchableOpacity
                  style={[
                    formStyles.checkbox,
                    formData.isCredit && formStyles.checkboxChecked,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, isCredit: !formData.isCredit })
                  }
                >
                  {formData.isCredit && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </TouchableOpacity>
                <Text style={formStyles.checkboxLabel}>외상 처리</Text>
              </View>

              {formData.isCredit && (
                <>
                  <View style={formStyles.fieldContainer}>
                    <Text style={formStyles.label}>마감일 *</Text>
                    <TextInput
                      value={formData.dueDate}
                      onChangeText={(value) =>
                        setFormData({ ...formData, dueDate: value })
                      }
                      placeholder="YYYY-MM-DD"
                    />
                  </View>

                  <View style={formStyles.fieldContainer}>
                    <Text style={formStyles.label}>메모</Text>
                    <TextInput
                      value={formData.creditMemo}
                      onChangeText={(value) =>
                        setFormData({ ...formData, creditMemo: value })
                      }
                      placeholder="외상 관련 메모"
                      multiline
                    />
                  </View>
                </>
              )}
            </View>

            {/* 총액 표시 */}
            {items.length > 0 && (
              <View
                style={[
                  formStyles.section,
                  {
                    backgroundColor: COLORS.surface,
                    padding: 15,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[formStyles.sectionTitle, { textAlign: "center" }]}
                >
                  총 금액: {calculateTotal().toLocaleString()}원
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={modalStyles.footer}>
            <TouchableOpacity
              style={[modalStyles.buttonSecondary]}
              onPress={() => {
                resetForm();
                onClose();
              }}
            >
              <Text style={modalStyles.buttonTextSecondary}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.buttonPrimary]}
              onPress={handleSubmit}
            >
              <Text style={modalStyles.buttonText}>등록</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
