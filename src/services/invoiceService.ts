import {
  DeliveryFormData,
  Invoice,
  InvoiceItem,
  InvoiceType,
  Company,
  ProductStatistics,
  DashboardStats,
} from "../types";
import { generateId } from "../utils";

// 부가세율 (10%)
const VAT_RATE = 0.1;

/**
 * 배송 데이터를 기반으로 계산서를 자동 생성
 * 묵류 = 과세, 두부/콩나물 = 면세
 */
export const generateInvoiceFromDelivery = (
  deliveryData: DeliveryFormData,
  company: Company
): Invoice => {
  // 계산서 번호 생성 (YYYYMMDD-HHMMSS 형식)
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const invoiceNumber = `INV-${dateStr}-${timeStr}`;

  // 배송 아이템을 계산서 아이템으로 변환
  const invoiceItems: InvoiceItem[] = deliveryData.items.map((item) => {
    // 카테고리에 따른 과세/면세 구분
    const taxType: InvoiceType = item.category === "묵류" ? "과세" : "면세";

    return {
      productId: item.productId,
      productName: item.productName,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      taxType,
    };
  });

  // 과세 항목과 면세 항목으로 분리하여 금액 계산
  const taxableItems = invoiceItems.filter((item) => item.taxType === "과세");
  const taxFreeItems = invoiceItems.filter((item) => item.taxType === "면세");

  const taxableAmount = taxableItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const taxFreeAmount = taxFreeItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  // 부가세 계산 (과세 항목만)
  const taxAmount = Math.round(taxableAmount * VAT_RATE);

  // 총 금액 계산
  const totalAmount = taxableAmount + taxFreeAmount;
  const totalWithTax = totalAmount + taxAmount;

  const invoice: Invoice = {
    id: generateId(),
    invoiceNumber,
    companyId: company.id,
    company,
    items: invoiceItems,
    totalAmount,
    taxAmount,
    totalWithTax,
    invoiceDate: deliveryData.deliveryDate,
    status: "발행",
    memo: deliveryData.memo,
    createdAt: now,
    updatedAt: now,
  };

  return invoice;
};

/**
 * 계산서 출력용 텍스트 생성
 */
export const generateInvoiceText = (invoice: Invoice): string => {
  const {
    company,
    items,
    totalAmount,
    taxAmount,
    totalWithTax,
    invoiceNumber,
    invoiceDate,
  } = invoice;

  // 과세/면세 항목 분리
  const taxableItems = items.filter((item) => item.taxType === "과세");
  const taxFreeItems = items.filter((item) => item.taxType === "면세");

  let invoiceText = `
===========================================
            계 산 서
===========================================

계산서 번호: ${invoiceNumber}
발행일자: ${invoiceDate.toLocaleDateString("ko-KR")}

-------------------------------------------
[거래처 정보]
회사명: ${company.name}
주소: ${company.address}
전화번호: ${company.phoneNumber}
${company.businessNumber ? `사업자등록번호: ${company.businessNumber}` : ""}

-------------------------------------------
[상품 내역]
`;

  // 과세 항목
  if (taxableItems.length > 0) {
    invoiceText += `
[과세 항목] - 부가세 포함
`;
    taxableItems.forEach((item, index) => {
      invoiceText += `${index + 1}. ${item.productName} (${item.category})
   수량: ${
     item.quantity
   } × ${item.unitPrice.toLocaleString()}원 = ${item.totalPrice.toLocaleString()}원
`;
    });
  }

  // 면세 항목
  if (taxFreeItems.length > 0) {
    invoiceText += `
[면세 항목] - 부가세 면제
`;
    taxFreeItems.forEach((item, index) => {
      invoiceText += `${index + 1}. ${item.productName} (${item.category})
   수량: ${
     item.quantity
   } × ${item.unitPrice.toLocaleString()}원 = ${item.totalPrice.toLocaleString()}원
`;
    });
  }

  // 금액 합계
  const taxableTotal = taxableItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const taxFreeTotal = taxFreeItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  invoiceText += `
-------------------------------------------
[금액 계산]
과세 대상 금액: ${taxableTotal.toLocaleString()}원
면세 대상 금액: ${taxFreeTotal.toLocaleString()}원
부가세 (10%): ${taxAmount.toLocaleString()}원
-------------------------------------------
합계 금액: ${totalAmount.toLocaleString()}원
부가세 포함 총액: ${totalWithTax.toLocaleString()}원
===========================================

${invoice.memo ? `메모: ${invoice.memo}` : ""}

발행일시: ${invoice.createdAt.toLocaleString("ko-KR")}
`;

  return invoiceText;
};

/**
 * 거래처별 상품 통계 계산
 */
export const calculateProductStatistics = (
  deliveries: DeliveryFormData[],
  companies: Company[]
): ProductStatistics[] => {
  const stats: { [companyId: string]: ProductStatistics } = {};

  // 거래처별 통계 초기화
  companies.forEach((company) => {
    stats[company.id] = {
      companyId: company.id,
      companyName: company.name,
      mukQuantity: 0,
      mukAmount: 0,
      tofuBeansproutQuantity: 0,
      tofuBeansproutAmount: 0,
    };
  });

  // 배송 데이터 집계
  deliveries.forEach((delivery) => {
    if (!stats[delivery.companyId]) return;

    delivery.items.forEach((item) => {
      const stat = stats[delivery.companyId];

      if (item.category === "묵류") {
        stat.mukQuantity += item.quantity;
        stat.mukAmount += item.totalPrice;
      } else if (item.category === "두부" || item.category === "콩나물") {
        stat.tofuBeansproutQuantity += item.quantity;
        stat.tofuBeansproutAmount += item.totalPrice;
      }
    });
  });

  // 거래량이 있는 거래처만 반환
  return Object.values(stats).filter(
    (stat) => stat.mukQuantity > 0 || stat.tofuBeansproutQuantity > 0
  );
};

/**
 * 대시보드용 전체 통계 계산
 */
export const calculateDashboardStats = (
  deliveries: DeliveryFormData[],
  invoices: Invoice[],
  companies: Company[]
): DashboardStats => {
  const productStats = calculateProductStatistics(deliveries, companies);

  // 이번 달 매출 계산
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = invoices
    .filter((invoice) => {
      const invoiceDate = new Date(invoice.invoiceDate);
      return (
        invoiceDate.getMonth() === currentMonth &&
        invoiceDate.getFullYear() === currentYear &&
        invoice.status === "발행"
      );
    })
    .reduce((sum, invoice) => sum + invoice.totalWithTax, 0);

  // 상위 거래처 (거래량 기준)
  const topCompanies = productStats
    .sort((a, b) => {
      const aTotal = a.mukQuantity + a.tofuBeansproutQuantity;
      const bTotal = b.mukQuantity + b.tofuBeansproutQuantity;
      return bTotal - aTotal;
    })
    .slice(0, 5);

  return {
    totalCompanies: companies.length,
    totalDeliveries: deliveries.length,
    totalInvoices: invoices.length,
    monthlyRevenue,
    topCompanies,
  };
};
