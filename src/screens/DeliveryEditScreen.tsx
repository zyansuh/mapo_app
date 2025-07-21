import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useNavigation,
  useRoute,
  RouteProp as NavigationRouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../types";
import { useDelivery } from "../hooks/useDelivery";
import { useCompany } from "../hooks/useCompany";
import { COLORS } from "../styles/colors";
import { formatDate, formatCurrency } from "../utils/format";
import { DeliveryProduct } from "../types/delivery";
import ProductSelection, {
  SelectedProduct,
} from "../components/ProductSelection";
import { Select } from "../components";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = NavigationRouteProp<RootStackParamList, "DeliveryEdit">;

const DeliveryEditScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const { deliveryId } = route.params;
  const { getDeliveryById, updateDelivery } = useDelivery();
  const { companies } = useCompany();

  const delivery = getDeliveryById(deliveryId);

  // 폼 상태
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    delivery?.companyId || ""
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [deliveryDate, setDeliveryDate] = useState(
    delivery?.deliveryDate || new Date()
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    delivery?.deliveryAddress || ""
  );
  const [deliveryMemo, setDeliveryMemo] = useState(
    delivery?.deliveryMemo || ""
  );
  const [driverName, setDriverName] = useState(delivery?.driverName || "");
  const [driverPhone, setDriverPhone] = useState(delivery?.driverPhone || "");
  const [showProductSelection, setShowProductSelection] = useState(false);

  // 기존 배송 데이터로 초기화
  useEffect(() => {
    if (delivery) {
      setSelectedCompanyId(delivery.companyId);
      setDeliveryDate(delivery.deliveryDate);
      setDeliveryAddress(delivery.deliveryAddress);
      setDeliveryMemo(delivery.deliveryMemo || "");
      setDriverName(delivery.driverName || "");
      setDriverPhone(delivery.driverPhone || "");

      // 배송 상품을 SelectedProduct 형태로 변환
      const products: SelectedProduct[] = delivery.products.map((product) => ({
        category: product.category,
        productItem: product.productItem,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
      }));
      setSelectedProducts(products);
    }
  }, [delivery]);

  if (!delivery) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            배송 수정
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: COLORS.error }]}>
            배송 정보를 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    // 유효성 검사
    if (!selectedCompanyId) {
      Alert.alert("알림", "거래처를 선택해주세요.");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("알림", "상품을 선택해주세요.");
      return;
    }

    if (!deliveryAddress.trim()) {
      Alert.alert("알림", "배송 주소를 입력해주세요.");
      return;
    }

    const updatedData = {
      companyId: selectedCompanyId,
      products: selectedProducts.map((product) => ({
        id: `${product.category}-${product.productItem}-${Date.now()}`,
        category: product.category,
        productItem: product.productItem,
        quantity: product.quantity,
        unitPrice: product.unitPrice,
        totalPrice: product.quantity * product.unitPrice,
      })) as DeliveryProduct[],
      totalAmount: selectedProducts.reduce(
        (sum, product) => sum + product.quantity * product.unitPrice,
        0
      ),
      deliveryDate,
      deliveryAddress: deliveryAddress.trim(),
      deliveryMemo: deliveryMemo.trim() || undefined,
      driverName: driverName.trim() || undefined,
      driverPhone: driverPhone.trim() || undefined,
    };

    const success = await updateDelivery(deliveryId, updatedData);
    if (success) {
      Alert.alert("수정 완료", "배송 정보가 수정되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "수정 취소",
      "변경사항이 저장되지 않습니다. 정말 취소하시겠습니까?",
      [
        { text: "계속 수정" },
        { text: "취소", onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId);
    const company = companies.find((c) => c.id === companyId);
    if (company?.address) {
      setDeliveryAddress(company.address);
    }
  };

  const handleProductsSelect = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
  };

  const getTotalAmount = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity * product.unitPrice,
      0
    );
  };

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const companyOptions = companies.map((company) => ({
    label: `${company.name} (${company.region})`,
    value: company.id,
  }));

  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.background,
          paddingTop: insets.top,
        }}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primary]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: COLORS.white }]}>
              배송 수정
            </Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={[styles.saveText, { color: COLORS.white }]}>
                저장
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                <Ionicons name="create" size={20} color={COLORS.white} />
                <Text
                  style={[styles.selectButtonText, { color: COLORS.white }]}
                >
                  상품 수정
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
                    <Text style={[styles.productTotal, { color: COLORS.text }]}>
                      {formatCurrency(product.quantity * product.unitPrice)}
                    </Text>
                  </View>
                ))}

                <View style={styles.totalSection}>
                  <Text style={[styles.totalLabel, { color: COLORS.text }]}>
                    총 금액
                  </Text>
                  <Text style={[styles.totalAmount, { color: COLORS.primary }]}>
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
              <TextInput
                style={[
                  styles.dateInput,
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
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                배송 주소
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  { borderColor: COLORS.border, color: COLORS.text },
                ]}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="배송 주소를 입력하세요"
                placeholderTextColor={COLORS.textSecondary}
                multiline
              />
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

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  배송 기사명
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: COLORS.border, color: COLORS.text },
                  ]}
                  value={driverName}
                  onChangeText={setDriverName}
                  placeholder="기사명 (선택사항)"
                  placeholderTextColor={COLORS.textSecondary}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.label, { color: COLORS.text }]}>
                  기사 연락처
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    { borderColor: COLORS.border, color: COLORS.text },
                  ]}
                  value={driverPhone}
                  onChangeText={setDriverPhone}
                  placeholder="연락처 (선택사항)"
                  placeholderTextColor={COLORS.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Product Selection Modal */}
        <ProductSelection
          visible={showProductSelection}
          onClose={() => setShowProductSelection(false)}
          onConfirm={handleProductsSelect}
          selectedProducts={selectedProducts}
        />
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
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    height: 48,
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
});

export default DeliveryEditScreen;
