import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Linking } from "react-native";
import { useCompany } from "../hooks/useCompany";
import { usePhoneCall } from "../hooks/usePhoneCall";
import { useCallDetection } from "../hooks/useCallDetection";
import { RootStackParamList } from "../navigation/AppNavigator";
import { DeliveryRegistrationModal, InvoiceViewModal } from "../components";
import {
  generateInvoiceFromDelivery,
  generateInvoiceText,
  calculateProductStatistics,
  calculateDashboardStats,
} from "../services/invoiceService";
import { generateId } from "../utils";
import {
  DeliveryFormData,
  Invoice,
  ProductStatistics,
  DashboardStats,
} from "../types";

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { companies, getStats } = useCompany();
  const { callHistory, addSampleCallHistory } = usePhoneCall();
  const {
    isDetectionActive,
    unknownNumberCount,
    isAndroidSupported,
    startDetection,
    stopDetection,
    addTestUnknownNumber,
  } = useCallDetection();

  const [isBusinessTypeModalVisible, setIsBusinessTypeModalVisible] =
    useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const [isInvoiceModalVisible, setIsInvoiceModalVisible] = useState(false);
  const [deliveries, setDeliveries] = useState<DeliveryFormData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([
    // 샘플 계산서 데이터
    {
      id: "sample1",
      invoiceNumber: "INV-20241220-001",
      companyId: "1",
      company: {
        id: "1",
        name: "순창농협",
        type: "고객사",
        region: "순창",
        address: "전북 순창군 순창읍",
        phoneNumber: "063-650-1234",
        contactPerson: "김순창",
        email: "",
        businessNumber: "",
        memo: "",
        createdAt: new Date(2024, 11, 1),
        updatedAt: new Date(2024, 11, 1),
      },
      items: [
        {
          productId: "11",
          productName: "도토리묵",
          category: "묵류",
          quantity: 10,
          unitPrice: 3000,
          totalPrice: 30000,
          taxType: "과세",
        },
        {
          productId: "12",
          productName: "청포묵",
          category: "묵류",
          quantity: 5,
          unitPrice: 3500,
          totalPrice: 17500,
          taxType: "과세",
        },
      ],
      totalAmount: 47500,
      taxAmount: 4750,
      totalWithTax: 52250,
      invoiceDate: new Date(2024, 11, 20),
      status: "발행",
      createdAt: new Date(2024, 11, 20),
      updatedAt: new Date(2024, 11, 20),
      memo: "샘플 과세 계산서",
    },
    {
      id: "sample2",
      invoiceNumber: "INV-20241220-002",
      companyId: "2",
      company: {
        id: "2",
        name: "담양마트",
        type: "고객사",
        region: "담양",
        address: "전남 담양군 담양읍",
        phoneNumber: "061-380-5678",
        contactPerson: "박담양",
        email: "",
        businessNumber: "",
        memo: "",
        createdAt: new Date(2024, 11, 1),
        updatedAt: new Date(2024, 11, 1),
      },
      items: [
        {
          productId: "1",
          productName: "순두부",
          category: "두부",
          quantity: 20,
          unitPrice: 1500,
          totalPrice: 30000,
          taxType: "면세",
        },
        {
          productId: "8",
          productName: "콩나물",
          category: "콩나물",
          quantity: 15,
          unitPrice: 2000,
          totalPrice: 30000,
          taxType: "면세",
        },
      ],
      totalAmount: 60000,
      taxAmount: 0,
      totalWithTax: 60000,
      invoiceDate: new Date(2024, 11, 19),
      status: "발행",
      createdAt: new Date(2024, 11, 19),
      updatedAt: new Date(2024, 11, 19),
      memo: "샘플 면세 계산서",
    },
  ]);

  const stats = getStats();

  // 상품 통계 계산
  const productStats = calculateProductStatistics(deliveries, companies);
  const dashboardStats = calculateDashboardStats(
    deliveries,
    invoices,
    companies
  );

  // 배송 등록 처리
  const handleDeliverySubmit = (deliveryData: DeliveryFormData) => {
    // 배송 데이터 저장
    setDeliveries((prev) => [...prev, deliveryData]);

    // 자동으로 계산서 생성
    const company = companies.find((c) => c.id === deliveryData.companyId);
    if (company) {
      const invoice = generateInvoiceFromDelivery(deliveryData, company);
      setInvoices((prev) => [...prev, invoice]);

      // 외상 처리인 경우 외상 기록 생성
      if (deliveryData.isCredit) {
        const creditRecord = {
          id: generateId(),
          companyId: deliveryData.companyId,
          amount: deliveryData.totalAmount,
          paidAmount: 0,
          remainingAmount: deliveryData.totalAmount,
          dueDate:
            deliveryData.dueDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 기본 30일
          status: "정상" as const,
          description: deliveryData.creditMemo || `${company.name} 배송 외상`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // TODO: 외상 기록 저장 로직 추가 (현재는 상태 관리가 없음)
        console.log("외상 기록 생성:", creditRecord);

        // 외상 처리 완료 알림
        Alert.alert(
          "배송 등록 완료 (외상)",
          `배송이 등록되고 외상 처리되었습니다.\n\n거래처: ${
            company.name
          }\n외상 금액: ${deliveryData.totalAmount.toLocaleString()}원\n지불 기한: ${
            deliveryData.dueDate
              ? new Date(deliveryData.dueDate).toLocaleDateString()
              : new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ).toLocaleDateString()
          }`,
          [
            { text: "확인", style: "default" },
            {
              text: "계산서 보기",
              onPress: () => {
                const invoiceText = generateInvoiceText(invoice);
                Alert.alert("계산서", invoiceText, [{ text: "확인" }]);
              },
            },
          ]
        );
      } else {
        // 즉시 결제 완료 알림
        const invoiceText = generateInvoiceText(invoice);
        Alert.alert(
          "배송 등록 완료",
          `배송이 등록되었고 계산서가 자동 생성되었습니다.\n\n계산서 번호: ${
            invoice.invoiceNumber
          }\n총액: ${invoice.totalWithTax.toLocaleString()}원`,
          [
            { text: "확인", style: "default" },
            {
              text: "계산서 보기",
              onPress: () =>
                Alert.alert("계산서", invoiceText, [{ text: "확인" }]),
            },
          ]
        );
      }
    }
  };

  // 전화 감지 토글
  const toggleCallDetection = () => {
    if (isDetectionActive) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  // 거래처 등록 화면으로 이동
  const handleAddCompany = () => {
    navigation.navigate("CompanyEdit", {});
  };

  // 비즈니스 타입 카드 클릭 핸들러
  const handleBusinessTypePress = (type: string) => {
    setSelectedBusinessType(type);
    setIsBusinessTypeModalVisible(true);
  };

  // 지역별 카드 클릭 핸들러
  const handleRegionPress = (region: string) => {
    setSelectedBusinessType(region);
    setIsBusinessTypeModalVisible(true);
  };

  // 거래처 상세 페이지로 이동
  const handleCompanyPress = (companyId: string) => {
    navigation.navigate("CompanyDetail", { companyId });
  };

  // 거래처 타입별 필터링
  const getCompaniesByType = (type: string) => {
    return companies.filter((company) => company.type === type);
  };

  // 거래처 지역별 필터링
  const getCompaniesByRegion = (region: string) => {
    return companies.filter((company) => company.region === region);
  };

  // 거래처 타입 아이콘 가져오기
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "고객사":
        return "people";
      case "협력업체":
        return "people";
      case "공급업체":
        return "cube";
      default:
        return "business";
    }
  };

  // 거래처 타입 색상 가져오기
  const getTypeColor = (type: string) => {
    switch (type) {
      case "고객사":
        return "#10b981";
      case "협력업체":
        return "#3b82f6";
      case "공급업체":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  // 비즈니스 인사이트 제공
  const showBusinessInsights = () => {
    const favoriteCompanies = companies.filter((c) => c.isFavorite).length;
    const clientCompanies = stats.byType.고객사;
    const supplierCompanies = stats.byType.공급업체 + stats.byType.협력업체;

    Alert.alert(
      "비즈니스 인사이트",
      `📊 현재 현황 분석
      
💼 총 거래처: ${stats.total}개
• 고객사: ${clientCompanies}개
• 공급업체/협력업체: ${supplierCompanies}개
• 즐겨찾기: ${favoriteCompanies}개

📞 통화 활동
• 총 통화: ${callHistory.length}건
• 미처리 번호: ${unknownNumberCount}개

💡 추천 사항:
${clientCompanies === 0 ? "• 고객사 정보를 추가해보세요" : ""}
${callHistory.length < 10 ? "• 통화 기록이 부족합니다" : ""}
${unknownNumberCount > 0 ? "• 미지의 번호를 처리해주세요" : ""}`,
      [{ text: "확인" }]
    );
  };

  // 빠른 연락처 관리
  const quickContactActions = () => {
    Alert.alert("빠른 연락처 관리", "어떤 작업을 수행하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "즐겨찾기 연락처",
        onPress: () => {
          const favorites = companies.filter((c) => c.isFavorite);
          if (favorites.length === 0) {
            Alert.alert("알림", "즐겨찾기한 연락처가 없습니다.");
          } else {
            const list = favorites
              .map((c) => `• ${c.name} (${c.type})`)
              .join("\n");
            Alert.alert("즐겨찾기 연락처", list);
          }
        },
      },
      {
        text: "최근 통화 내역",
        onPress: () => {
          if (callHistory.length === 0) {
            Alert.alert("알림", "통화 기록이 없습니다.");
          } else {
            const recent = callHistory
              .slice(0, 5)
              .map((c) => `• ${c.companyName || "알 수 없음"} (${c.type})`)
              .join("\n");
            Alert.alert("최근 통화 내역", recent);
          }
        },
      },
    ]);
  };

  // 비즈니스 타입 모달 렌더링
  const renderBusinessTypeModal = () => {
    const regions = ["순창", "담양", "장성", "기타"];
    const isRegionFilter = regions.includes(selectedBusinessType);

    const filteredCompanies = isRegionFilter
      ? getCompaniesByRegion(selectedBusinessType)
      : getCompaniesByType(selectedBusinessType);

    const typeColor = getTypeColor(selectedBusinessType);
    const typeIcon = getTypeIcon(selectedBusinessType);

    const renderCompanyItem = ({ item }: { item: any }) => (
      <TouchableOpacity
        style={styles.companyItem}
        onPress={() => {
          setIsBusinessTypeModalVisible(false);
          handleCompanyPress(item.id);
        }}
      >
        <View style={styles.companyInfo}>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{item.name}</Text>
            {item.isFavorite && (
              <Ionicons name="star" size={16} color="#f59e0b" />
            )}
          </View>
          <Text style={styles.companyPhone}>{item.phoneNumber}</Text>
          <Text style={styles.companyAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <View style={styles.companyActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: typeColor }]}
            onPress={() => {
              if (item.phoneNumber) {
                Linking.openURL(`tel:${item.phoneNumber}`);
              }
            }}
          >
            <Ionicons name="call" size={16} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );

    return (
      <Modal
        visible={isBusinessTypeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBusinessTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons
                  name={isRegionFilter ? "location" : (typeIcon as any)}
                  size={24}
                  color={typeColor}
                />
                <Text style={styles.modalTitle}>
                  {isRegionFilter
                    ? `${selectedBusinessType} 지역`
                    : selectedBusinessType}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsBusinessTypeModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#737373" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {filteredCompanies.length}
                </Text>
                <Text style={styles.statLabel}>총 거래처</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {filteredCompanies.filter((c) => c.isFavorite).length}
                </Text>
                <Text style={styles.statLabel}>즐겨찾기</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {
                    callHistory.filter((call) =>
                      filteredCompanies.some(
                        (c) => c.phoneNumber === call.phoneNumber
                      )
                    ).length
                  }
                </Text>
                <Text style={styles.statLabel}>통화 기록</Text>
              </View>
            </View>

            <View style={styles.modalBody}>
              {filteredCompanies.length > 0 ? (
                <FlatList
                  data={filteredCompanies}
                  renderItem={renderCompanyItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.companyList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="business-outline" size={64} color="#9ca3af" />
                  <Text style={styles.emptyTitle}>
                    {isRegionFilter
                      ? `${selectedBusinessType} 지역에 등록된 거래처가 없습니다`
                      : `등록된 ${selectedBusinessType}가 없습니다`}
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    새로운 {selectedBusinessType}를 등록해보세요
                  </Text>
                  <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: typeColor }]}
                    onPress={() => {
                      setIsBusinessTypeModalVisible(false);
                      handleAddCompany();
                    }}
                  >
                    <Ionicons name="add" size={20} color="#ffffff" />
                    <Text style={styles.addButtonText}>거래처 등록</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <LinearGradient
          colors={["#525252", "#404040"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.header, { paddingTop: 20 + insets.top }]}
        >
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>비즈니스 관리</Text>
            <Text style={styles.appTitle}>Mapo</Text>
            <Text style={styles.subtitle}>스마트 연락처 및 통화 관리</Text>
          </View>
        </LinearGradient>

        {/* 비즈니스 대시보드 */}
        <View style={styles.dashboardContainer}>
          <Text style={styles.sectionTitle}>오늘의 현황</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={showBusinessInsights}
            >
              <Ionicons name="business" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>총 거래처</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={quickContactActions}
            >
              <Ionicons name="call" size={24} color="#06b6d4" />
              <Text style={styles.statNumber}>{callHistory.length}</Text>
              <Text style={styles.statLabel}>통화 기록</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: "#10b981" }]}
              onPress={() => setIsDeliveryModalVisible(true)}
            >
              <Ionicons name="cube" size={24} color="#ffffff" />
              <Text style={[styles.statNumber, { color: "#ffffff" }]}>
                {deliveries.length}
              </Text>
              <Text style={[styles.statLabel, { color: "#ffffff" }]}>
                배송 등록
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => setIsInvoiceModalVisible(true)}
            >
              <Ionicons name="document-text" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>{invoices.length}</Text>
              <Text style={styles.statLabel}>계산서</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 상품 통계 대시보드 */}
        {productStats.length > 0 && (
          <View style={styles.dashboardContainer}>
            <Text style={styles.sectionTitle}>거래처별 상품 현황</Text>
            {productStats.slice(0, 5).map((stat) => (
              <View key={stat.companyId} style={styles.productStatCard}>
                <View style={styles.productStatHeader}>
                  <Text style={styles.productStatCompany}>
                    {stat.companyName}
                  </Text>
                  <Text style={styles.productStatTotal}>
                    {(
                      stat.mukQuantity + stat.tofuBeansproutQuantity
                    ).toLocaleString()}
                    개
                  </Text>
                </View>
                <View style={styles.productStatDetails}>
                  <View style={styles.productStatItem}>
                    <View style={styles.productStatIcon}>
                      <Ionicons name="cube" size={16} color="#8b5cf6" />
                    </View>
                    <Text style={styles.productStatLabel}>묵류</Text>
                    <Text style={styles.productStatValue}>
                      {stat.mukQuantity.toLocaleString()}개
                    </Text>
                  </View>
                  <View style={styles.productStatItem}>
                    <View style={styles.productStatIcon}>
                      <Ionicons name="leaf" size={16} color="#10b981" />
                    </View>
                    <Text style={styles.productStatLabel}>두부/콩나물</Text>
                    <Text style={styles.productStatValue}>
                      {stat.tofuBeansproutQuantity.toLocaleString()}개
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 거래처 유형별 현황 */}
        <View style={styles.businessTypeContainer}>
          <Text style={styles.sectionTitle}>거래처 유형별 현황</Text>
          <View style={styles.businessTypeGrid}>
            <TouchableOpacity
              style={styles.businessTypeCard}
              onPress={() => handleBusinessTypePress("고객사")}
            >
              <View style={styles.businessTypeHeader}>
                <Ionicons name="people" size={20} color="#10b981" />
                <Text style={styles.businessTypeTitle}>고객사</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.고객사}
              </Text>
              <Text style={styles.businessTypeDesc}>매출 창출 고객</Text>
              <View style={styles.cardIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.businessTypeCard}
              onPress={() => handleBusinessTypePress("협력업체")}
            >
              <View style={styles.businessTypeHeader}>
                <Ionicons name="people" size={20} color="#3b82f6" />
                <Text style={styles.businessTypeTitle}>협력업체</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.협력업체}
              </Text>
              <Text style={styles.businessTypeDesc}>파트너 업체</Text>
              <View style={styles.cardIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.businessTypeCard}
              onPress={() => handleBusinessTypePress("공급업체")}
            >
              <View style={styles.businessTypeHeader}>
                <Ionicons name="cube" size={20} color="#f59e0b" />
                <Text style={styles.businessTypeTitle}>공급업체</Text>
              </View>
              <Text style={styles.businessTypeNumber}>
                {stats.byType.공급업체}
              </Text>
              <Text style={styles.businessTypeDesc}>자재/서비스</Text>
              <View style={styles.cardIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 업체별 영수증 현황 */}
        {invoices.length > 0 && (
          <View style={styles.businessTypeContainer}>
            <Text style={styles.sectionTitle}>업체별 영수증 현황</Text>
            <View style={styles.invoiceStatsGrid}>
              {/* 과세 영수증 현황 */}
              <TouchableOpacity
                style={[styles.invoiceStatCard, { backgroundColor: "#f3e8ff" }]}
                onPress={() => {
                  setIsInvoiceModalVisible(true);
                }}
              >
                <View style={styles.invoiceStatHeader}>
                  <View
                    style={[
                      styles.invoiceStatIcon,
                      { backgroundColor: "#8b5cf6" },
                    ]}
                  >
                    <Ionicons name="cube" size={24} color="#ffffff" />
                  </View>
                  <Text style={[styles.invoiceStatTitle, { color: "#8b5cf6" }]}>
                    과세 영수증
                  </Text>
                </View>
                <Text style={[styles.invoiceStatNumber, { color: "#8b5cf6" }]}>
                  {
                    invoices.filter((invoice) =>
                      invoice.items.some((item) => item.taxType === "과세")
                    ).length
                  }
                  건
                </Text>
                <Text style={styles.invoiceStatDesc}>묵류 (부가세 포함)</Text>
                <View style={styles.invoiceStatAmount}>
                  <Text
                    style={[styles.invoiceStatAmountText, { color: "#8b5cf6" }]}
                  >
                    {invoices
                      .filter((invoice) =>
                        invoice.items.some((item) => item.taxType === "과세")
                      )
                      .reduce((sum, invoice) => sum + invoice.taxAmount, 0)
                      .toLocaleString()}
                    원 세액
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 면세 영수증 현황 */}
              <TouchableOpacity
                style={[styles.invoiceStatCard, { backgroundColor: "#f0fdf4" }]}
                onPress={() => {
                  setIsInvoiceModalVisible(true);
                }}
              >
                <View style={styles.invoiceStatHeader}>
                  <View
                    style={[
                      styles.invoiceStatIcon,
                      { backgroundColor: "#10b981" },
                    ]}
                  >
                    <Ionicons name="leaf" size={24} color="#ffffff" />
                  </View>
                  <Text style={[styles.invoiceStatTitle, { color: "#10b981" }]}>
                    면세 영수증
                  </Text>
                </View>
                <Text style={[styles.invoiceStatNumber, { color: "#10b981" }]}>
                  {
                    invoices.filter((invoice) =>
                      invoice.items.some((item) => item.taxType === "면세")
                    ).length
                  }
                  건
                </Text>
                <Text style={styles.invoiceStatDesc}>두부, 콩나물 (면세)</Text>
                <View style={styles.invoiceStatAmount}>
                  <Text
                    style={[styles.invoiceStatAmountText, { color: "#10b981" }]}
                  >
                    {invoices
                      .filter((invoice) =>
                        invoice.items.some((item) => item.taxType === "면세")
                      )
                      .reduce((sum, invoice) => {
                        const taxFreeAmount = invoice.items
                          .filter((item) => item.taxType === "면세")
                          .reduce(
                            (itemSum, item) => itemSum + item.totalPrice,
                            0
                          );
                        return sum + taxFreeAmount;
                      }, 0)
                      .toLocaleString()}
                    원 매출
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 업체별 상세 */}
            <View style={styles.companyInvoiceList}>
              {productStats.slice(0, 3).map((stat) => {
                const companyInvoices = invoices.filter(
                  (inv) => inv.companyId === stat.companyId
                );
                const taxableCount = companyInvoices.filter((inv) =>
                  inv.items.some((item) => item.taxType === "과세")
                ).length;
                const taxFreeCount = companyInvoices.filter((inv) =>
                  inv.items.some((item) => item.taxType === "면세")
                ).length;

                return (
                  <View key={stat.companyId} style={styles.companyInvoiceCard}>
                    <View style={styles.companyInvoiceHeader}>
                      <Text style={styles.companyInvoiceName}>
                        {stat.companyName}
                      </Text>
                      <Text style={styles.companyInvoiceTotal}>
                        총 {companyInvoices.length}건
                      </Text>
                    </View>
                    <View style={styles.companyInvoiceDetails}>
                      <View style={styles.companyInvoiceItem}>
                        <View
                          style={[
                            styles.companyInvoiceBadge,
                            { backgroundColor: "#f3e8ff" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.companyInvoiceBadgeText,
                              { color: "#8b5cf6" },
                            ]}
                          >
                            과세
                          </Text>
                        </View>
                        <Text style={styles.companyInvoiceCount}>
                          {taxableCount}건
                        </Text>
                        <Text style={styles.companyInvoiceProduct}>묵류</Text>
                      </View>
                      <View style={styles.companyInvoiceItem}>
                        <View
                          style={[
                            styles.companyInvoiceBadge,
                            { backgroundColor: "#f0fdf4" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.companyInvoiceBadgeText,
                              { color: "#10b981" },
                            ]}
                          >
                            면세
                          </Text>
                        </View>
                        <Text style={styles.companyInvoiceCount}>
                          {taxFreeCount}건
                        </Text>
                        <Text style={styles.companyInvoiceProduct}>
                          두부/콩나물
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* 비즈니스 도구 */}
        <View style={styles.toolsContainer}>
          <Text style={styles.sectionTitle}>비즈니스 도구</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity
              style={styles.toolCard}
              onPress={showBusinessInsights}
            >
              <Ionicons name="analytics" size={28} color="#8b5cf6" />
              <Text style={styles.toolTitle}>비즈니스 분석</Text>
              <Text style={styles.toolDesc}>거래처 현황 및 인사이트</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={quickContactActions}
            >
              <Ionicons name="person" size={28} color="#06b6d4" />
              <Text style={styles.toolTitle}>연락처 관리</Text>
              <Text style={styles.toolDesc}>즐겨찾기 및 통화 내역</Text>
            </TouchableOpacity>
          </View>

          {/* 거래처 등록 버튼 */}
          <TouchableOpacity
            style={styles.addCompanyButton}
            onPress={handleAddCompany}
          >
            <Ionicons name="add-circle" size={24} color="#ffffff" />
            <Text style={styles.addCompanyButtonText}>새 거래처 등록</Text>
          </TouchableOpacity>
        </View>

        {/* 통화 감지 설정 */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>통화 감지 설정</Text>
          <View
            style={[
              styles.settingsCard,
              isDetectionActive && styles.settingsCardActive,
            ]}
          >
            <View style={styles.settingsContent}>
              <View style={styles.settingsInfo}>
                <Ionicons
                  name={isDetectionActive ? "call" : "call-outline"}
                  size={24}
                  color={isDetectionActive ? "#10b981" : "#6b7280"}
                />
                <View style={styles.settingsText}>
                  <Text style={styles.settingsTitle}>자동 통화 감지</Text>
                  <Text style={styles.settingsSubtitle}>
                    {isAndroidSupported
                      ? isDetectionActive
                        ? "활성화됨"
                        : "비활성화됨"
                      : "Android에서만 지원"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.settingsToggle,
                  isDetectionActive && styles.settingsToggleActive,
                  !isAndroidSupported && styles.settingsToggleDisabled,
                ]}
                onPress={toggleCallDetection}
                disabled={!isAndroidSupported}
              >
                <Text
                  style={[
                    styles.settingsToggleText,
                    isDetectionActive && styles.settingsToggleTextActive,
                  ]}
                >
                  {isDetectionActive ? "ON" : "OFF"}
                </Text>
              </TouchableOpacity>
            </View>

            {unknownNumberCount > 0 && (
              <View style={styles.alertBanner}>
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text style={styles.alertText}>
                  {unknownNumberCount}개의 미등록 번호가 있습니다
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.bottomSpacer, { height: 80 + insets.bottom }]} />
      </ScrollView>

      {/* 비즈니스 타입 모달 */}
      {renderBusinessTypeModal()}

      {/* 배송등록 모달 */}
      <DeliveryRegistrationModal
        visible={isDeliveryModalVisible}
        onClose={() => setIsDeliveryModalVisible(false)}
        onSubmit={handleDeliverySubmit}
        companies={companies}
      />

      {/* 계산서 조회 모달 */}
      <InvoiceViewModal
        visible={isInvoiceModalVisible}
        onClose={() => setIsInvoiceModalVisible(false)}
        invoices={invoices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA", // NEUTRAL_50
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // paddingTop은 동적으로 설정됨
  },
  headerContent: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#ffffff",
    opacity: 0.8,
    textAlign: "center",
  },
  dashboardContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F5F5F5", // NEUTRAL_100
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#737373", // NEUTRAL_500
    textAlign: "center",
  },
  businessTypeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  businessTypeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  businessTypeCard: {
    flex: 1,
    backgroundColor: "#F5F5F5", // NEUTRAL_100
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  businessTypeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#404040", // NEUTRAL_700
    marginLeft: 6,
  },
  businessTypeNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717", // NEUTRAL_900
    marginBottom: 4,
  },
  businessTypeDesc: {
    fontSize: 10,
    color: "#737373", // NEUTRAL_500
  },
  toolsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  toolsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  toolCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  toolDesc: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  settingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsCardActive: {
    backgroundColor: "#f0fdf4",
    borderColor: "#10b981",
    borderWidth: 1,
  },
  settingsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingsInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsText: {
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  settingsToggle: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  settingsToggleActive: {
    backgroundColor: "#10b981",
  },
  settingsToggleDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.5,
  },
  settingsToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
  },
  settingsToggleTextActive: {
    color: "#ffffff",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  alertText: {
    fontSize: 12,
    color: "#f59e0b",
    marginLeft: 6,
    fontWeight: "500",
  },
  bottomSpacer: {
    // height는 동적으로 설정됨
  },
  addCompanyButton: {
    backgroundColor: "#737373", // NEUTRAL_500 - 톤 다운된 회색
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    gap: 8,
  },
  addCompanyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardIndicator: {
    position: "absolute",
    bottom: 8,
    right: 8,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#171717",
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  modalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  statItem: {
    alignItems: "center",
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  companyList: {
    paddingBottom: 16,
  },
  companyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  companyInfo: {
    flex: 1,
    marginRight: 12,
  },
  companyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginRight: 8,
  },
  companyPhone: {
    fontSize: 14,
    color: "#737373",
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 12,
    color: "#9ca3af",
  },
  companyActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#f3f4f6",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#171717",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#737373",
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  // 상품 통계 스타일
  productStatCard: {
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
  productStatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  productStatCompany: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  productStatTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10b981",
  },
  productStatDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productStatItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  productStatIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  productStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    flex: 1,
  },
  productStatValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  // 영수증 현황 스타일
  invoiceStatsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  invoiceStatCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  invoiceStatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  invoiceStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceStatTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  invoiceStatNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  invoiceStatDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  invoiceStatAmount: {
    alignItems: "flex-end",
  },
  invoiceStatAmountText: {
    fontSize: 11,
    fontWeight: "600",
  },
  // 업체별 영수증 리스트
  companyInvoiceList: {
    gap: 8,
  },
  companyInvoiceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  companyInvoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  companyInvoiceName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  companyInvoiceTotal: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  companyInvoiceDetails: {
    flexDirection: "row",
    gap: 16,
  },
  companyInvoiceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  companyInvoiceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  companyInvoiceBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  companyInvoiceCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#171717",
  },
  companyInvoiceProduct: {
    fontSize: 11,
    color: "#6b7280",
  },
});

export default HomeScreen;
