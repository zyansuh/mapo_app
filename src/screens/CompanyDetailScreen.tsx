import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useCompany } from "../hooks";
import { COLORS, SIZES } from "../constants";
import {
  Button,
  DailyProductsList,
  ProductSelection,
  CreditManagement,
} from "../components";
import {
  ProductDelivery,
  Product,
  CreditRecord,
  ProductSelectionFormData,
} from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "CompanyDetail">;

// 탭 타입 정의
type TabType = "info" | "products" | "selection" | "credit";

interface Tab {
  id: TabType;
  title: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: "info", title: "기본 정보", icon: "information-circle" },
  { id: "products", title: "상품 목록", icon: "calendar" },
  { id: "selection", title: "상품 선택", icon: "add-circle" },
  { id: "credit", title: "외상 관리", icon: "card" },
];

export const CompanyDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { companyId } = route.params;
  const insets = useSafeAreaInsets();

  const { getCompanyById, deleteCompany } = useCompany();
  const company = getCompanyById(companyId);

  const [activeTab, setActiveTab] = useState<TabType>("info");

  // 샘플 데이터 - 실제 앱에서는 API에서 가져와야 함
  const [deliveries, setDeliveries] = useState<ProductDelivery[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [creditRecords, setCreditRecords] = useState<CreditRecord[]>([]);

  if (!company) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>업체를 찾을 수 없습니다.</Text>
        <Button title="목록으로 돌아가기" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    navigation.navigate("CompanyEdit", { companyId: company.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "업체 삭제",
      `${company.name}을(를) 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCompany(company.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert("오류", "업체 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleCall = () => {
    const phoneNumber = company.phoneNumber.replace(/[^0-9]/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    if (company.email) {
      Linking.openURL(`mailto:${company.email}`);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "고객사":
        return "#10b981";
      case "협력업체":
        return "#3b82f6";
      case "공급업체":
        return "#f59e0b";
      case "하청업체":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 배송 관련 핸들러
  const handleAddDelivery = () => {
    Alert.alert("알림", "배송 등록 기능을 구현해주세요.");
  };

  const handleEditDelivery = (delivery: ProductDelivery) => {
    Alert.alert(
      "알림",
      `${delivery.product.name} 배송 수정 기능을 구현해주세요.`
    );
  };

  const handleDeleteDelivery = (deliveryId: string) => {
    setDeliveries((prev) => prev.filter((d) => d.id !== deliveryId));
  };

  // 상품 선택 관련 핸들러
  const handleAddProduct = () => {
    Alert.alert("알림", "상품 추가 기능을 구현해주세요.");
  };

  const handleSelectProduct = (formData: ProductSelectionFormData) => {
    Alert.alert("성공", "상품 선택이 완료되었습니다!");
    // 실제 앱에서는 API 호출로 배송 등록
  };

  // 외상 관리 관련 핸들러
  const handleAddCredit = () => {
    Alert.alert("알림", "외상 등록 기능을 구현해주세요.");
  };

  const handleAddPayment = (creditId: string, payment: any) => {
    Alert.alert("성공", "지불이 등록되었습니다!");
    // 실제 앱에서는 API 호출로 지불 등록
  };

  const handleUpdateCredit = (creditId: string, updates: any) => {
    Alert.alert("성공", "외상이 업데이트되었습니다!");
    // 실제 앱에서는 API 호출로 외상 업데이트
  };

  // 탭 렌더링
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, activeTab === tab.id && styles.activeTabItem]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Ionicons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.id ? "#ffffff" : "#737373"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 기본 정보 탭 컨텐츠
  const renderInfoTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* 연락처 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>연락처 정보</Text>

        <TouchableOpacity style={styles.infoCard} onPress={handleCall}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>전화번호</Text>
              <Text style={styles.infoValue}>{company.phoneNumber}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </View>
        </TouchableOpacity>

        {company.email && (
          <TouchableOpacity style={styles.infoCard} onPress={handleEmail}>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color="#3b82f6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>이메일</Text>
                <Text style={styles.infoValue}>{company.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>주소</Text>
              <Text style={styles.infoValue}>{company.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 업체 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>업체 정보</Text>

        {company.businessNumber && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="document-text" size={20} color="#3b82f6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>사업자등록번호</Text>
                <Text style={styles.infoValue}>{company.businessNumber}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>등록일</Text>
              <Text style={styles.infoValue}>
                {formatDate(company.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="refresh" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>최종 수정일</Text>
              <Text style={styles.infoValue}>
                {formatDate(company.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* 메모 */}
      {company.memo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메모</Text>
          <View style={styles.memoCard}>
            <Text style={styles.memoText}>{company.memo}</Text>
          </View>
        </View>
      )}

      {/* 액션 버튼들 */}
      <View style={styles.actionSection}>
        <Button
          title="수정하기"
          onPress={handleEdit}
          style={styles.actionButton}
        />
        <Button
          title="삭제하기"
          onPress={handleDelete}
          variant="secondary"
          style={[styles.actionButton, styles.deleteButton]}
        />
      </View>
    </ScrollView>
  );

  // 날짜별 상품 목록 탭 컨텐츠
  const renderProductsTab = () => (
    <View style={styles.tabContent}>
      <DailyProductsList
        companyId={company.id}
        deliveries={deliveries}
        onAddDelivery={handleAddDelivery}
        onEditDelivery={handleEditDelivery}
        onDeleteDelivery={handleDeleteDelivery}
      />
    </View>
  );

  // 상품 선택 탭 컨텐츠
  const renderSelectionTab = () => (
    <View style={styles.tabContent}>
      <ProductSelection
        companyId={company.id}
        products={products}
        onAddProduct={handleAddProduct}
        onSelectProduct={handleSelectProduct}
      />
    </View>
  );

  // 외상 관리 탭 컨텐츠
  const renderCreditTab = () => (
    <View style={styles.tabContent}>
      <CreditManagement
        companyId={company.id}
        creditRecords={creditRecords}
        onAddCredit={handleAddCredit}
        onAddPayment={handleAddPayment}
        onUpdateCredit={handleUpdateCredit}
      />
    </View>
  );

  // 탭 컨텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return renderInfoTab();
      case "products":
        return renderProductsTab();
      case "selection":
        return renderSelectionTab();
      case "credit":
        return renderCreditTab();
      default:
        return renderInfoTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 섹션 */}
      <LinearGradient
        colors={["#525252", "#404040"]}
        style={[styles.header, { paddingTop: 20 + insets.top }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.titleSection}>
            <Text style={styles.companyName}>{company.name}</Text>
            <View
              style={[
                styles.typeTag,
                { backgroundColor: getTypeColor(company.type) },
              ]}
            >
              <Text style={styles.typeText}>{company.type}</Text>
            </View>
          </View>
          {company.contactPerson && (
            <Text style={styles.contactPerson}>
              담당자: {company.contactPerson}
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* 탭 바 */}
      {renderTabBar()}

      {/* 탭 컨텐츠 */}
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: "#171717",
    marginBottom: 20,
    textAlign: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  contactPerson: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activeTabItem: {
    backgroundColor: "#525252",
  },
  tabText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 4,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#737373",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#171717",
    fontWeight: "500",
  },
  memoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memoText: {
    fontSize: 16,
    color: "#171717",
    lineHeight: 24,
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
});

export default CompanyDetailScreen;
