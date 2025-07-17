import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
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
import { useCompany } from "../hooks";
import { useTheme } from "../hooks/useTheme";
import DeliveryRegistrationModal from "../components/modals/DeliveryRegistrationModal";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = NavigationRouteProp<RootStackParamList, "CompanyDetail">;

const CompanyDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const { companyId } = route.params;
  const { getCompanyById, deleteCompany } = useCompany();
  const company = getCompanyById(companyId);

  const [activeTab, setActiveTab] = useState<"info" | "products" | "delivery">(
    "info"
  );
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const [deliveries, setDeliveries] = useState<any[]>([]);

  if (!company) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            회사 정보
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            회사 정보를 찾을 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert("회사 삭제", "정말로 이 회사를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const success = await deleteCompany(companyId);
          if (success) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const renderTabButton = (
    tab: "info" | "products" | "delivery",
    title: string
  ) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && [
          styles.activeTab,
          { backgroundColor: theme.colors.primary },
        ],
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabText,
          {
            color:
              activeTab === tab
                ? theme.colors.white
                : theme.colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderCompanyInfo = () => (
    <View
      style={[styles.infoContainer, { backgroundColor: theme.colors.surface }]}
    >
      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
          회사명
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {company.name}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
          업체 구분
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {company.type}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
          지역
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {company.region}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
          전화번호
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {company.phoneNumber}
        </Text>
      </View>

      {company.email && (
        <View style={styles.infoRow}>
          <Text
            style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
          >
            이메일
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {company.email}
          </Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
          주소
        </Text>
        <Text style={[styles.infoValue, { color: theme.colors.text }]}>
          {company.address}
        </Text>
      </View>

      {company.contactPerson && (
        <View style={styles.infoRow}>
          <Text
            style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
          >
            담당자
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {company.contactPerson}
          </Text>
        </View>
      )}

      {company.businessNumber && (
        <View style={styles.infoRow}>
          <Text
            style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
          >
            사업자등록번호
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {company.businessNumber}
          </Text>
        </View>
      )}

      {company.memo && (
        <View style={styles.infoRow}>
          <Text
            style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
          >
            메모
          </Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {company.memo}
          </Text>
        </View>
      )}
    </View>
  );

  const handleDeliverySubmit = (deliveryData: any) => {
    setDeliveries((prev) => [...prev, deliveryData]);
    Alert.alert("성공", "배송이 등록되었습니다!");
  };

  const renderProductsTab = () => (
    <View
      style={[
        styles.tabContentContainer,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.tabHeader}>
        <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
          상품 목록 및 배송 관리
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setIsDeliveryModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={theme.colors.white} />
          <Text style={[styles.addButtonText, { color: theme.colors.white }]}>
            배송 등록
          </Text>
        </TouchableOpacity>
      </View>

      {deliveries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="cube-outline"
            size={50}
            color={theme.colors.textSecondary}
          />
          <Text
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            등록된 배송이 없습니다.
          </Text>
          <Text
            style={[styles.emptySubText, { color: theme.colors.textSecondary }]}
          >
            배송 등록 버튼을 눌러 새로운 배송을 추가해보세요.
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.deliveryList}>
          {deliveries.map((delivery, index) => (
            <View
              key={index}
              style={[
                styles.deliveryItem,
                { backgroundColor: theme.colors.background },
              ]}
            >
              <View style={styles.deliveryHeader}>
                <Text
                  style={[styles.deliveryNumber, { color: theme.colors.text }]}
                >
                  {delivery.deliveryNumber}
                </Text>
                <Text
                  style={[
                    styles.deliveryStatus,
                    { color: theme.colors.primary },
                  ]}
                >
                  {delivery.status}
                </Text>
              </View>
              <Text
                style={[
                  styles.deliveryDate,
                  { color: theme.colors.textSecondary },
                ]}
              >
                배송일: {delivery.deliveryDate}
              </Text>
              <Text
                style={[styles.deliveryAmount, { color: theme.colors.text }]}
              >
                금액: {delivery.totalAmount.toLocaleString()}원
              </Text>
              {delivery.trackingNumber && (
                <Text
                  style={[
                    styles.trackingNumber,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  송장번호: {delivery.trackingNumber}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return renderCompanyInfo();
      case "products":
        return renderProductsTab();
      case "delivery":
        return (
          <View
            style={[
              styles.emptyContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              배송 관리 기능은 곧 제공될 예정입니다.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      {/* 헤더 */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {company.name}
        </Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("CompanyEdit", { companyId })}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* 탭 메뉴 */}
      <View
        style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}
      >
        {renderTabButton("info", "기본 정보")}
        {renderTabButton("products", "상품 관리")}
        {renderTabButton("delivery", "배송 관리")}
      </View>

      {/* 컨텐츠 */}
      <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>

      {/* 삭제 버튼 */}
      <View
        style={[
          styles.deleteButtonContainer,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.white} />
          <Text
            style={[styles.deleteButtonText, { color: theme.colors.white }]}
          >
            회사 삭제
          </Text>
        </TouchableOpacity>
      </View>

      {/* 배송등록 모달 */}
      {company && (
        <DeliveryRegistrationModal
          visible={isDeliveryModalVisible}
          onClose={() => setIsDeliveryModalVisible(false)}
          onSubmit={handleDeliverySubmit}
          company={company}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  editButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  infoContainer: {
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    marginLeft: 16,
  },
  emptyContainer: {
    margin: 16,
    borderRadius: 8,
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  deleteButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tabContentContainer: {
    flex: 1,
    padding: 16,
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  emptySubText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  deliveryList: {
    flex: 1,
  },
  deliveryItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  deliveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deliveryNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  deliveryStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  deliveryDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  deliveryAmount: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 12,
  },
});

export default CompanyDetailScreen;
