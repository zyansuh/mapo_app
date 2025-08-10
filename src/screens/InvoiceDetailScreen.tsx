import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { THEME } from "../styles/themes";
import { invoiceDetailStyles } from "../styles/screens";
import { Invoice, InvoiceStatus, TaxType } from "../types";
import { formatDate, formatCurrency } from "../utils/format";
import { useInvoice } from "../hooks";
import { useCompany } from "../hooks";

const InvoiceDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { updateInvoiceStatus, getInvoiceById, deleteInvoice } = useInvoice();
  const { getCompanyById } = useCompany();

  const { invoiceId } = route.params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [company, setCompany] = useState<any>(null);

  // 실제 계산서 데이터 로드
  useEffect(() => {
    const invoiceData = getInvoiceById(invoiceId);
    if (invoiceData) {
      setInvoice(invoiceData);
      const companyData = getCompanyById(invoiceData.companyId);
      setCompany(companyData);
    } else {
      Alert.alert("오류", "계산서를 찾을 수 없습니다.", [
        { text: "확인", onPress: () => navigation.goBack() }
      ]);
    }
  }, [invoiceId, getInvoiceById, getCompanyById, navigation]);

  if (!invoice) {
    return (
      <SafeAreaView style={[invoiceDetailStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>로딩 중...</Text>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    navigation.navigate("InvoiceEdit", { invoiceId: invoice.id });
  };

  const handleDelete = () => {
    Alert.alert(
      "계산서 삭제",
      `${invoice.invoiceNumber} 계산서를 삭제하시겠습니까?\n\n⚠️ 삭제된 계산서는 복구할 수 없습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            const success = await deleteInvoice(invoiceId);
            if (success) {
              Alert.alert(
                "삭제 완료",
                `${invoice.invoiceNumber} 계산서가 삭제되었습니다.`,
                [{ text: "확인", onPress: () => navigation.goBack() }]
              );
            } else {
              Alert.alert("오류", "계산서 삭제에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    const statusDescription = getStatusDescription(newStatus);

    Alert.alert(
      "상태 변경",
      `계산서 상태를 "${newStatus}"로 변경하시겠습니까?\n\n${statusDescription}`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "변경",
          onPress: async () => {
            const success = await updateInvoiceStatus(invoiceId, newStatus);
            if (success) {
              // 상태 변경 후 화면 새로고침을 위해 다시 가져오기
              const updatedInvoice = getInvoiceById(invoiceId);
              if (updatedInvoice) {
                // 인보이스 상태 업데이트 (실제로는 useState로 관리해야 하지만 여기서는 단순화)
                Alert.alert(
                  "완료",
                  `${updatedInvoice.invoiceNumber} 계산서 상태가 "${newStatus}"로 변경되었습니다.`,
                  [{ text: "확인", onPress: () => navigation.goBack() }]
                );
              }
            } else {
              Alert.alert("오류", "상태 변경에 실패했습니다.");
            }
          },
        },
      ]
    );
  };

  // 상태별 설명 함수 (계산서 생성 화면과 동일)
  const getStatusDescription = (status: InvoiceStatus): string => {
    switch (status) {
      case "임시저장":
        return "📝 작성 중인 계산서입니다. 언제든 수정할 수 있습니다.";
      case "발행":
        return "✅ 완성된 계산서입니다. 거래처에 발송할 준비가 되었습니다.";
      case "전송":
        return "📤 거래처에 발송된 계산서입니다. 승인을 기다리고 있습니다.";
      case "승인":
        return "🎉 거래처에서 승인된 계산서입니다. 거래가 확정되었습니다.";
      case "취소":
        return "❌ 취소된 계산서입니다. 더 이상 유효하지 않습니다.";
      default:
        return "";
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "임시저장":
        return THEME.colors.warning;
      case "발행":
        return THEME.colors.success;
      case "전송":
        return THEME.colors.primary;
      case "승인":
        return THEME.colors.success;
      case "취소":
        return THEME.colors.error;
      default:
        return THEME.colors.textSecondary;
    }
  };

  const getTaxTypeColor = (taxType: TaxType) => {
    switch (taxType) {
      case "과세":
        return THEME.colors.primary;
      case "면세":
        return THEME.colors.success;
      case "영세":
        return THEME.colors.warning;
      default:
        return THEME.colors.textSecondary;
    }
  };

  // PDF 내보내기 기능
  const handleExportPDF = async () => {
    try {
      const companyName = company?.name || "거래처명 없음";
      const companyAddress = company?.address || "";
      const companyPhone = company?.contactPhone || "";
      
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>계산서 - ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 40px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #007AFF;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #007AFF;
              margin: 0;
              font-size: 28px;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .info-section {
              flex: 1;
            }
            .info-section h3 {
              color: #007AFF;
              margin-bottom: 10px;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              width: 100px;
              color: #666;
            }
            .info-value {
              flex: 1;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            .items-table th,
            .items-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .items-table th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #007AFF;
            }
            .items-table .text-right {
              text-align: right;
            }
            .tax-badge {
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
            }
            .tax-taxable {
              background-color: #007AFF20;
              color: #007AFF;
            }
            .tax-exempt {
              background-color: #34C75920;
              color: #34C759;
            }
            .total-section {
              margin-top: 30px;
              padding: 20px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .grand-total {
              font-size: 18px;
              font-weight: bold;
              color: #007AFF;
              border-top: 2px solid #007AFF;
              padding-top: 10px;
              margin-top: 10px;
            }
            .memo-section {
              margin-top: 30px;
              padding: 15px;
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              border-radius: 4px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>계 산 서</h1>
            <p>Invoice</p>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>계산서 정보</h3>
              <div class="info-row">
                <span class="info-label">계산서 번호:</span>
                <span class="info-value">${invoice.invoiceNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">발행일:</span>
                <span class="info-value">${formatDate(invoice.issueDate)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">상태:</span>
                <span class="info-value">${invoice.status}</span>
              </div>
            </div>
            
            <div class="info-section">
              <h3>거래처 정보</h3>
              <div class="info-row">
                <span class="info-label">거래처명:</span>
                <span class="info-value">${companyName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">주소:</span>
                <span class="info-value">${companyAddress}</span>
              </div>
              <div class="info-row">
                <span class="info-label">연락처:</span>
                <span class="info-value">${companyPhone}</span>
              </div>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>품목명</th>
                <th>수량</th>
                <th>단가</th>
                <th>공급가액</th>
                <th>세구분</th>
                <th>세액</th>
                <th class="text-right">합계</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">${item.quantity}개</td>
                  <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                  <td class="text-right">${formatCurrency(item.amount)}</td>
                  <td>
                    <span class="tax-badge ${item.taxType === '과세' ? 'tax-taxable' : 'tax-exempt'}">
                      ${item.taxType}
                    </span>
                  </td>
                  <td class="text-right">${formatCurrency(item.taxAmount)}</td>
                  <td class="text-right">${formatCurrency(item.totalAmount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>공급가액:</span>
              <span>${formatCurrency(invoice.totalSupplyAmount)}</span>
            </div>
            <div class="total-row">
              <span>세액:</span>
              <span>${formatCurrency(invoice.totalTaxAmount)}</span>
            </div>
            <div class="total-row grand-total">
              <span>총 합계:</span>
              <span>${formatCurrency(invoice.totalAmount)}</span>
            </div>
          </div>

          ${invoice.memo ? `
            <div class="memo-section">
              <h4>메모</h4>
              <p>${invoice.memo}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p>마포 비즈니스 매니저에서 생성된 계산서입니다.</p>
            <p>생성일시: ${new Date().toLocaleString('ko-KR')}</p>
          </div>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `계산서 공유 - ${invoice.invoiceNumber}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          "PDF 생성 완료",
          `계산서 PDF가 생성되었습니다.\n경로: ${uri}`
        );
      }
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      Alert.alert(
        "오류",
        "PDF 생성 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={THEME.colors.primary}
        barStyle="light-content"
      />
      <SafeAreaView
        style={[
          invoiceDetailStyles.container,
          {
            paddingTop: Platform.OS === "android" ? 10 : insets.top,
          },
        ]}
      >
        <LinearGradient
          colors={[THEME.colors.primary, THEME.colors.primary]}
          style={invoiceDetailStyles.header}
        >
          <View style={invoiceDetailStyles.headerContent}>
            <TouchableOpacity
              style={invoiceDetailStyles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={THEME.colors.white}
              />
            </TouchableOpacity>
            <Text style={invoiceDetailStyles.headerTitle}>계산서 상세</Text>
            <TouchableOpacity
              style={invoiceDetailStyles.editButton}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={THEME.colors.white}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={invoiceDetailStyles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* 기본 정보 */}
          <View style={invoiceDetailStyles.section}>
            <Text style={invoiceDetailStyles.sectionTitle}>기본 정보</Text>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>계산서 번호</Text>
              <Text style={invoiceDetailStyles.infoValue}>
                {invoice.invoiceNumber}
              </Text>
            </View>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>발행일</Text>
              <Text style={invoiceDetailStyles.infoValue}>
                {formatDate(invoice.issueDate)}
              </Text>
            </View>

            <View style={invoiceDetailStyles.infoRow}>
              <Text style={invoiceDetailStyles.infoLabel}>상태</Text>
              <View style={invoiceDetailStyles.statusContainer}>
                <View
                  style={[
                    invoiceDetailStyles.statusBadge,
                    { backgroundColor: getStatusColor(invoice.status) + "20" },
                  ]}
                >
                  <Text
                    style={[
                      invoiceDetailStyles.statusText,
                      { color: getStatusColor(invoice.status) },
                    ]}
                  >
                    {invoice.status}
                  </Text>
                </View>
                <TouchableOpacity
                  style={invoiceDetailStyles.statusChangeButton}
                  onPress={() => {
                    const statusOptions = [
                      { text: "취소", style: "cancel" as const },
                      {
                        text: "📝 임시저장",
                        onPress: () => handleStatusChange("임시저장"),
                      },
                      {
                        text: "✅ 발행",
                        onPress: () => handleStatusChange("발행"),
                      },
                      {
                        text: "📤 전송",
                        onPress: () => handleStatusChange("전송"),
                      },
                      {
                        text: "🎉 승인",
                        onPress: () => handleStatusChange("승인"),
                      },
                      {
                        text: "❌ 취소",
                        onPress: () => handleStatusChange("취소"),
                      },
                    ];

                    Alert.alert(
                      "계산서 상태 변경",
                      `현재 상태: ${invoice.status}\n\n변경할 상태를 선택하세요:`,
                      statusOptions
                    );
                  }}
                >
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color={THEME.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {invoice.memo && (
              <View style={invoiceDetailStyles.infoRow}>
                <Text style={invoiceDetailStyles.infoLabel}>메모</Text>
                <Text style={invoiceDetailStyles.infoValue}>
                  {invoice.memo}
                </Text>
              </View>
            )}
          </View>

          {/* 품목 정보 */}
          <View style={invoiceDetailStyles.section}>
            <Text style={invoiceDetailStyles.sectionTitle}>품목 정보</Text>

            {invoice.items.map((item, index) => (
              <View key={item.id} style={invoiceDetailStyles.itemCard}>
                <View style={invoiceDetailStyles.itemHeader}>
                  <Text style={invoiceDetailStyles.itemName}>{item.name}</Text>
                  <View
                    style={[
                      invoiceDetailStyles.taxTypeBadge,
                      { backgroundColor: getTaxTypeColor(item.taxType) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        invoiceDetailStyles.taxTypeText,
                        { color: getTaxTypeColor(item.taxType) },
                      ]}
                    >
                      {item.taxType}
                    </Text>
                  </View>
                </View>

                <View style={invoiceDetailStyles.itemDetails}>
                  <View style={invoiceDetailStyles.itemDetailRow}>
                    <Text style={invoiceDetailStyles.itemDetailLabel}>
                      수량
                    </Text>
                    <Text style={invoiceDetailStyles.itemDetailValue}>
                      {item.quantity}개
                    </Text>
                  </View>

                  <View style={invoiceDetailStyles.itemDetailRow}>
                    <Text style={invoiceDetailStyles.itemDetailLabel}>
                      단가
                    </Text>
                    <Text style={invoiceDetailStyles.itemDetailValue}>
                      {formatCurrency(item.unitPrice)}
                    </Text>
                  </View>

                  <View style={invoiceDetailStyles.itemDetailRow}>
                    <Text style={invoiceDetailStyles.itemDetailLabel}>
                      공급가액
                    </Text>
                    <Text style={invoiceDetailStyles.itemDetailValue}>
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>

                  <View style={invoiceDetailStyles.itemDetailRow}>
                    <Text style={invoiceDetailStyles.itemDetailLabel}>
                      세액
                    </Text>
                    <Text style={invoiceDetailStyles.itemDetailValue}>
                      {formatCurrency(item.taxAmount)}
                    </Text>
                  </View>

                  <View
                    style={[
                      invoiceDetailStyles.itemDetailRow,
                      invoiceDetailStyles.totalRow,
                    ]}
                  >
                    <Text style={invoiceDetailStyles.itemTotalLabel}>합계</Text>
                    <Text style={invoiceDetailStyles.itemTotalValue}>
                      {formatCurrency(item.totalAmount)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* 합계 금액 */}
          <View style={invoiceDetailStyles.section}>
            <Text style={invoiceDetailStyles.sectionTitle}>합계 금액</Text>

            <View style={invoiceDetailStyles.totalContainer}>
              <View style={invoiceDetailStyles.totalRow}>
                <Text style={invoiceDetailStyles.totalLabel}>공급가액</Text>
                <Text style={invoiceDetailStyles.totalValue}>
                  {formatCurrency(invoice.totalSupplyAmount)}
                </Text>
              </View>

              <View style={invoiceDetailStyles.totalRow}>
                <Text style={invoiceDetailStyles.totalLabel}>세액</Text>
                <Text style={invoiceDetailStyles.totalValue}>
                  {formatCurrency(invoice.totalTaxAmount)}
                </Text>
              </View>

              <View
                style={[
                  invoiceDetailStyles.totalRow,
                  invoiceDetailStyles.grandTotalRow,
                ]}
              >
                <Text style={invoiceDetailStyles.grandTotalLabel}>총 합계</Text>
                <Text style={invoiceDetailStyles.grandTotalValue}>
                  {formatCurrency(invoice.totalAmount)}
                </Text>
              </View>
            </View>
          </View>

          {/* 액션 버튼들 */}
          <View style={invoiceDetailStyles.actionSection}>
            <TouchableOpacity
              style={[
                invoiceDetailStyles.actionButton,
                { backgroundColor: THEME.colors.primary },
              ]}
              onPress={handleEdit}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={THEME.colors.white}
              />
              <Text style={invoiceDetailStyles.actionButtonText}>수정하기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                invoiceDetailStyles.actionButton,
                { backgroundColor: THEME.colors.success },
              ]}
              onPress={handleExportPDF}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={THEME.colors.white}
              />
              <Text style={invoiceDetailStyles.actionButtonText}>
                PDF 내보내기
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                invoiceDetailStyles.actionButton,
                { backgroundColor: THEME.colors.error },
              ]}
              onPress={handleDelete}
            >
              <Ionicons
                name="trash-outline"
                size={20}
                color={THEME.colors.white}
              />
              <Text style={invoiceDetailStyles.actionButtonText}>삭제하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default InvoiceDetailScreen;
