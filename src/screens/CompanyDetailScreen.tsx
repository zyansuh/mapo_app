import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
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
import { RootStackParamList, DeliveryFormData } from "../types";
import { QRCodeGenerator } from "../components/QRCodeGenerator";
import { useCompany } from "../hooks";
import { COLORS } from "../styles/colors";
import { formatPhoneNumber } from "../utils/format";
import DeliveryRegistrationModal from "../components/modals/DeliveryRegistrationModal";
import ProductSelection, {
  SelectedProduct,
} from "../components/ProductSelection";
import { useInvoice } from "../hooks/useInvoice";
import { useDelivery } from "../hooks/useDelivery";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = NavigationRouteProp<RootStackParamList, "CompanyDetail">;

const CompanyDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const insets = useSafeAreaInsets();

  const { companyId } = route.params;
  const { getCompanyById, deleteCompany } = useCompany();
  const { invoices } = useInvoice();
  const { deliveries, addDelivery, getDeliveriesByCompany } = useDelivery();
  const company = getCompanyById(companyId);

  const [activeTab, setActiveTab] = useState<
    "info" | "invoices" | "products" | "deliveries"
  >("info");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [showProductSelection, setShowProductSelection] = useState(false);

  // 해당 거래처의 계산서 필터링
  const companyInvoices = React.useMemo(() => {
    return invoices.filter((invoice) => invoice.companyId === companyId);
  }, [invoices, companyId]);

  // 해당 거래처의 배송 필터링
  const companyDeliveries = React.useMemo(() => {
    return getDeliveriesByCompany(companyId);
  }, [getDeliveriesByCompany, companyId]);

  if (!company) {
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
            회사 정보
          </Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: COLORS.error }]}>
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

  const handleDeliveryRegister = async (deliveryData: DeliveryFormData) => {
    const delivery = await addDelivery(deliveryData);
    if (delivery) {
      Alert.alert(
        "배송 등록 완료",
        `${company?.name}에 대한 배송이 등록되었습니다.\n\n` +
          `배송번호: ${delivery.deliveryNumber}\n` +
          `상품 수: ${deliveryData.products.length}개\n` +
          `배송 예정일: ${deliveryData.deliveryDate.toLocaleDateString(
            "ko-KR"
          )}`,
        [{ text: "확인" }]
      );
    }
    setShowDeliveryModal(false);
  };

  const handleProductConfirm = (products: SelectedProduct[]) => {
    // 선택된 상품으로 계산서 생성 화면으로 이동
    Alert.alert(
      "계산서 생성",
      `${products.length}개 상품이 선택되었습니다.\n계산서 생성 화면으로 이동합니다.`,
      [
        { text: "취소" },
        {
          text: "확인",
          onPress: () =>
            navigation.navigate("InvoiceEdit" as any, { companyId }),
        },
      ]
    );
  };

  const renderInvoicesList = () => (
    <View style={styles.documentContainer}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>계산서 목록</Text>
        <Text style={styles.documentSubtitle}>
          총 {companyInvoices.length}건의 계산서
        </Text>
      </View>

      {companyInvoices.length > 0 ? (
        <View style={styles.section}>
          {companyInvoices.map((invoice, index) => (
            <TouchableOpacity
              key={invoice.id}
              style={[styles.invoiceItem, { backgroundColor: "#f9fafb" }]}
              onPress={() =>
                navigation.navigate("InvoiceDetail" as any, {
                  invoiceId: invoice.id,
                })
              }
            >
              <View style={styles.invoiceHeader}>
                <Text style={[styles.invoiceNumber, { color: COLORS.text }]}>
                  {invoice.invoiceNumber}
                </Text>
                <Text
                  style={[styles.invoiceDate, { color: COLORS.textSecondary }]}
                >
                  {invoice.issueDate.toLocaleDateString("ko-KR")}
                </Text>
              </View>
              <Text style={[styles.invoiceAmount, { color: COLORS.primary }]}>
                {invoice.totalAmount.toLocaleString()}원
              </Text>
              <View style={styles.invoiceItems}>
                {invoice.items.slice(0, 2).map((item, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.invoiceItemText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    {item.name} {item.quantity}개 ({item.taxType})
                  </Text>
                ))}
                {invoice.items.length > 2 && (
                  <Text
                    style={[
                      styles.invoiceItemText,
                      { color: COLORS.textSecondary },
                    ]}
                  >
                    외 {invoice.items.length - 2}개 항목
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={[styles.noDataText, { color: COLORS.textSecondary }]}>
            등록된 계산서가 없습니다.
          </Text>
          <TouchableOpacity
            style={[
              styles.createInvoiceButton,
              { backgroundColor: COLORS.primary },
            ]}
            onPress={() =>
              navigation.navigate("InvoiceEdit" as any, { companyId })
            }
          >
            <Text style={[styles.createInvoiceText, { color: COLORS.white }]}>
              첫 계산서 만들기
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderProductsTab = () => (
    <View style={styles.documentContainer}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>상품 선택</Text>
        <Text style={styles.documentSubtitle}>
          계산서에 포함할 상품을 선택하세요
        </Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.productSelectionButton,
            { backgroundColor: COLORS.primary },
          ]}
          onPress={() =>
            navigation.navigate("InvoiceEdit" as any, { companyId })
          }
        >
          <Ionicons name="add-outline" size={24} color={COLORS.white} />
          <Text style={[styles.productSelectionText, { color: COLORS.white }]}>
            계산서 생성
          </Text>
        </TouchableOpacity>

        <View style={[styles.infoCard, { backgroundColor: "#f0f9ff" }]}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={[styles.infoText, { color: COLORS.text }]}>
            상품을 선택하면 자동으로 계산서 생성 화면으로 이동합니다.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDeliveriesTab = () => (
    <View style={styles.documentContainer}>
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>배송 관리</Text>
        <Text style={styles.documentSubtitle}>{company.name}의 배송 내역</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.productSelectionButton,
            { backgroundColor: COLORS.success },
          ]}
          onPress={() => setShowDeliveryModal(true)}
        >
          <Ionicons name="car-outline" size={24} color={COLORS.white} />
          <Text style={[styles.productSelectionText, { color: COLORS.white }]}>
            새 배송 등록
          </Text>
        </TouchableOpacity>

        {companyDeliveries.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              배송 내역 ({companyDeliveries.length}건)
            </Text>
            {companyDeliveries.map((delivery) => (
              <TouchableOpacity
                key={delivery.id}
                style={[styles.invoiceItem, { backgroundColor: COLORS.white }]}
                onPress={() =>
                  navigation.navigate("DeliveryDetail", {
                    deliveryId: delivery.id,
                  })
                }
              >
                <View style={styles.invoiceHeader}>
                  <Text style={[styles.invoiceNumber, { color: COLORS.text }]}>
                    {delivery.deliveryNumber}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          delivery.status === "배송완료"
                            ? COLORS.success + "20"
                            : delivery.status === "배송중"
                            ? COLORS.primary + "20"
                            : delivery.status === "준비중"
                            ? COLORS.warning + "20"
                            : COLORS.error + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            delivery.status === "배송완료"
                              ? COLORS.success
                              : delivery.status === "배송중"
                              ? COLORS.primary
                              : delivery.status === "준비중"
                              ? COLORS.warning
                              : COLORS.error,
                        },
                      ]}
                    >
                      {delivery.status}
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.invoiceDate, { color: COLORS.textSecondary }]}
                >
                  배송일: {delivery.deliveryDate.toLocaleDateString("ko-KR")}
                </Text>
                <Text style={[styles.invoiceAmount, { color: COLORS.primary }]}>
                  {delivery.totalAmount.toLocaleString()}원
                </Text>
                <View style={styles.invoiceItems}>
                  {delivery.products.slice(0, 2).map((product, idx) => (
                    <Text
                      key={idx}
                      style={[
                        styles.invoiceItemText,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      {product.category} {product.productItem}{" "}
                      {product.quantity}개
                    </Text>
                  ))}
                  {delivery.products.length > 2 && (
                    <Text
                      style={[
                        styles.invoiceItemText,
                        { color: COLORS.textSecondary },
                      ]}
                    >
                      외 {delivery.products.length - 2}개 상품
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={[styles.infoCard, { backgroundColor: "#f0f9ff" }]}>
            <Ionicons name="car-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.infoText, { color: COLORS.text }]}>
              아직 등록된 배송이 없습니다. 새 배송을 등록해보세요.
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderCompanyInfo = () => (
    <View style={styles.documentContainer}>
      {/* 회사명 헤더 */}
      <View style={styles.documentHeader}>
        <Text style={styles.documentTitle}>{company.name}</Text>
        <Text style={styles.documentSubtitle}>거래처 정보</Text>
      </View>

      {/* 기본 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기본 정보</Text>
        <View style={styles.sectionContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>회사명</Text>
            <Text style={styles.infoValue}>{company.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>업체 구분</Text>
            <Text style={styles.infoValue}>{company.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>지역</Text>
            <Text style={styles.infoValue}>{company.region}</Text>
          </View>
        </View>
      </View>

      {/* 연락처 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>연락처 정보</Text>
        <View style={styles.sectionContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>전화번호</Text>
            <Text style={styles.infoValue}>
              {formatPhoneNumber(company.phoneNumber)}
            </Text>
          </View>
          {company.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>이메일</Text>
              <Text style={styles.infoValue}>{company.email}</Text>
            </View>
          )}
          {company.contactPerson && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>담당자</Text>
              <Text style={styles.infoValue}>{company.contactPerson}</Text>
            </View>
          )}
        </View>
      </View>

      {/* 주소 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>주소 정보</Text>
        <View style={styles.sectionContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>주소</Text>
            <Text style={styles.infoValue}>{company.address}</Text>
          </View>
        </View>
      </View>

      {/* 사업자 정보 섹션 */}
      {company.businessNumber && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사업자 정보</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>사업자등록번호</Text>
              <Text style={styles.infoValue}>{company.businessNumber}</Text>
            </View>
          </View>
        </View>
      )}

      {/* 추가 정보 섹션 */}
      {company.memo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가 정보</Text>
          <View style={styles.sectionContent}>
            <View style={styles.memoRow}>
              <Text style={styles.infoLabel}>메모</Text>
              <Text style={styles.memoValue}>{company.memo}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderTabButtons = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "info" && [
            styles.activeTab,
            { backgroundColor: COLORS.primary },
          ],
        ]}
        onPress={() => setActiveTab("info")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color: activeTab === "info" ? COLORS.white : COLORS.textSecondary,
            },
          ]}
        >
          기본 정보
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "invoices" && [
            styles.activeTab,
            { backgroundColor: COLORS.primary },
          ],
        ]}
        onPress={() => setActiveTab("invoices")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === "invoices" ? COLORS.white : COLORS.textSecondary,
            },
          ]}
        >
          계산서 ({companyInvoices.length})
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "products" && [
            styles.activeTab,
            { backgroundColor: COLORS.primary },
          ],
        ]}
        onPress={() => setActiveTab("products")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === "products" ? COLORS.white : COLORS.textSecondary,
            },
          ]}
        >
          상품 선택
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === "deliveries" && [
            styles.activeTab,
            { backgroundColor: COLORS.primary },
          ],
        ]}
        onPress={() => setActiveTab("deliveries")}
      >
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === "deliveries"
                  ? COLORS.white
                  : COLORS.textSecondary,
            },
          ]}
        >
          배송 ({companyDeliveries.length})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return renderCompanyInfo();
      case "invoices":
        return renderInvoicesList();
      case "products":
        return renderProductsTab();
      case "deliveries":
        return renderDeliveriesTab();
      default:
        return null;
    }
  };

  return (
    <>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView
        style={[
          styles.container,
          {
            paddingTop: Platform.OS === "android" ? 10 : insets.top,
          },
        ]}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{company.name}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={() => setQrModalVisible(true)}
            >
              <Ionicons name="qr-code-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("CompanyEdit", { companyId })}
            >
              <Ionicons name="create-outline" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 탭 네비게이션 */}
        {renderTabButtons()}

        {/* 컨텐츠 */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>

        {/* 삭제 버튼 */}
        <View
          style={[
            styles.deleteButtonContainer,
            {
              paddingBottom:
                Platform.OS === "android" ? 80 : Math.max(16, insets.bottom),
            },
          ]}
        >
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            <Text style={styles.deleteButtonText}>회사 삭제</Text>
          </TouchableOpacity>
        </View>

        {/* QR 코드 모달 */}
        {company && (
          <QRCodeGenerator
            visible={qrModalVisible}
            onClose={() => setQrModalVisible(false)}
            data={company}
            type="company"
          />
        )}

        {/* 배송 등록 모달 */}
        <DeliveryRegistrationModal
          visible={showDeliveryModal}
          onClose={() => setShowDeliveryModal(false)}
          onConfirm={handleDeliveryRegister}
          preselectedCompanyId={companyId}
        />

        {/* 상품 선택 모달 */}
        <ProductSelection
          visible={showProductSelection}
          onClose={() => setShowProductSelection(false)}
          onConfirm={handleProductConfirm}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  qrButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  documentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  documentHeader: {
    marginBottom: 40,
    alignItems: "center",
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  documentTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  documentSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionContent: {
    paddingLeft: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    minHeight: 24,
  },
  infoLabel: {
    width: 120,
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  memoRow: {
    flexDirection: "column",
    marginBottom: 12,
  },
  memoValue: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginTop: 8,
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  deleteButtonContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.error,
    marginLeft: 8,
  },
  // 탭 네비게이션 스타일
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  activeTab: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // 계산서 목록 스타일
  invoiceItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  invoiceDate: {
    fontSize: 14,
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  invoiceItems: {
    marginTop: 4,
  },
  invoiceItemText: {
    fontSize: 12,
    marginBottom: 2,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  createInvoiceButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  createInvoiceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // 상품 선택 스타일
  productSelectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
  },
  productSelectionText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default CompanyDetailScreen;
