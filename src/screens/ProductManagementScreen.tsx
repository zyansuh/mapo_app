import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList, Product } from "../types";
import { useTheme } from "../hooks/useTheme";

type NavigationProp = StackNavigationProp<RootStackParamList>;

// 임시 상품 데이터
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "프리미엄 두부",
    category: "두부",
    price: 1200,
    currentStock: 15,
    unit: "모",
    description: "최고급 국산 콩으로 만든 두부",
    status: "활성",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "유기농 콩나물",
    category: "콩나물",
    price: 1300,
    currentStock: 10,
    unit: "봉",
    description: "유기농 콩나물",
    status: "활성",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "도토리묵",
    category: "묵류",
    price: 1500,
    currentStock: 25,
    unit: "개",
    description: "천연 도토리로 만든 묵",
    status: "단종",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const ProductManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 실제로는 API에서 데이터를 새로고침
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "활성":
        return "#10b981";
      case "단종":
        return "#ef4444";
      case "일시중단":
        return "#6b7280";
      default:
        return "#f59e0b";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "전자제품":
        return "phone-portrait";
      case "액세서리":
        return "headset";
      case "가전제품":
        return "tv";
      case "가구":
        return "home";
      default:
        return "cube";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  const handleEditProduct = (product: Product) => {
    Alert.alert("상품 수정", `${product.name} 상품을 수정하시겠습니까?`);
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert("상품 삭제", `${product.name}을(를) 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          setProducts(products.filter((p) => p.id !== product.id));
        },
      },
    ]);
  };

  const handleAddProduct = () => {
    Alert.alert("상품 등록", "새 상품을 등록하시겠습니까?");
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleEditProduct(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={styles.productHeader}>
          <View style={styles.productMainInfo}>
            <View style={styles.productTitleRow}>
              <Ionicons
                name={getCategoryIcon(item.category)}
                size={16}
                color={theme.colors.primary}
                style={styles.categoryIcon}
              />
              <Text style={[styles.productName, { color: theme.colors.text }]}>
                {item.name}
              </Text>
            </View>
            <Text
              style={[
                styles.productCategory,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.category}
            </Text>
          </View>

          <View
            style={[
              styles.statusTag,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.productDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={14} color="#6b7280" />
            <Text style={styles.priceText}>{formatPrice(item.price)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="cube-outline" size={14} color="#6b7280" />
            <Text style={styles.quantityText}>
              재고: {item.currentStock || 0}
              {item.unit}
            </Text>
          </View>

          {item.description && (
            <View style={styles.detailRow}>
              <Ionicons
                name="document-text-outline"
                size={14}
                color="#6b7280"
              />
              <Text style={styles.descriptionText} numberOfLines={1}>
                {item.description}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <Text
            style={[styles.createdDate, { color: theme.colors.textSecondary }]}
          >
            등록: {new Date(item.createdAt).toLocaleDateString("ko-KR")}
          </Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditProduct(item)}
            >
              <Ionicons name="create-outline" size={16} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteProduct(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color="#9ca3af" />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        등록된 상품이 없습니다
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}
      >
        첫 번째 상품을 등록하고{"\n"}재고 관리를 시작해보세요!
      </Text>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: theme.colors.primary },
        ]}
        onPress={handleAddProduct}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.primaryButtonText}>상품 등록하기</Text>
      </TouchableOpacity>
    </View>
  );

  const getInventoryStats = () => {
    const totalProducts = products.length;
    const inStock = products.filter((p) => p.status === "활성").length;
    const outOfStock = products.filter((p) => p.status === "단종").length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * (p.currentStock || 0),
      0
    );

    return { totalProducts, inStock, outOfStock, totalValue };
  };

  const stats = getInventoryStats();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primary]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>상품 관리</Text>
            <Text style={styles.headerSubtitle}>
              총 {stats.totalProducts}개 상품 • {stats.inStock}개 판매중
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 통계 카드 */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text
                style={[styles.statNumber, { color: theme.colors.primary }]}
              >
                {stats.totalProducts}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                총 상품
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statNumber, { color: "#10b981" }]}>
                {stats.inStock}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                판매중
              </Text>
            </View>
            <View
              style={[styles.statCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.statNumber, { color: "#ef4444" }]}>
                {stats.outOfStock}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                품절
              </Text>
            </View>
          </View>
          <View
            style={[styles.valueCard, { backgroundColor: theme.colors.card }]}
          >
            <Text
              style={[styles.valueLabel, { color: theme.colors.textSecondary }]}
            >
              총 재고 가치
            </Text>
            <Text style={[styles.valueAmount, { color: theme.colors.text }]}>
              {formatPrice(stats.totalValue)}
            </Text>
          </View>
        </View>

        {/* 상품 목록 */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            상품 목록
          </Text>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContainer,
              products.length === 0 && styles.emptyListContainer,
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={renderEmptyState}
          />
        </View>
      </ScrollView>

      <View style={[styles.fab, { bottom: 80 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddProduct}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  valueCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  valueLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },
  productCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  productTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryIcon: {
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  productCategory: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  productDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 14,
    color: "#1f2937",
    marginLeft: 8,
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: "#6b7280",
    marginLeft: 8,
    flex: 1,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  createdDate: {
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ProductManagementScreen;
