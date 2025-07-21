import { useMemo } from "react";
import { useInvoice } from "./useInvoice";
import { useCompany } from "./useCompany";
import {
  CompanySalesStats,
  SalesAnalytics,
  SalesSearchFilter,
  SalesSortOptions,
  SalesSortBy,
  SortOrder,
} from "../types/analytics";
import { TaxType, Invoice, InvoiceItem } from "../types/invoice";

export const useSalesAnalytics = (
  filter?: SalesSearchFilter,
  sortOptions?: SalesSortOptions
) => {
  const { invoices } = useInvoice();
  const { companies, getCompanyById } = useCompany();

  // 기본 필터링 및 정렬 옵션
  const defaultFilter: SalesSearchFilter = {
    taxType: "all",
    startDate: new Date(new Date().getFullYear(), 0, 1), // 올해 1월 1일
    endDate: new Date(), // 오늘
    ...filter,
  };

  const defaultSortOptions: SalesSortOptions = {
    sortBy: "totalAmount",
    order: "desc",
    ...sortOptions,
  };

  // 필터링된 인보이스
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice: Invoice) => {
      // 기간 필터
      const invoiceDate = new Date(invoice.issueDate);
      if (defaultFilter.startDate && invoiceDate < defaultFilter.startDate)
        return false;
      if (defaultFilter.endDate && invoiceDate > defaultFilter.endDate)
        return false;

      // 거래처 이름 필터
      if (defaultFilter.companyName) {
        const company = getCompanyById(invoice.companyId);
        if (
          !company?.name
            .toLowerCase()
            .includes(defaultFilter.companyName.toLowerCase())
        ) {
          return false;
        }
      }

      // 금액 필터
      if (
        defaultFilter.minAmount &&
        invoice.totalAmount < defaultFilter.minAmount
      )
        return false;
      if (
        defaultFilter.maxAmount &&
        invoice.totalAmount > defaultFilter.maxAmount
      )
        return false;

      // 상품명 필터
      if (defaultFilter.productName) {
        const hasProduct = invoice.items.some((item) =>
          item.name
            .toLowerCase()
            .includes(defaultFilter.productName!.toLowerCase())
        );
        if (!hasProduct) return false;
      }

      // 과세구분 필터
      if (defaultFilter.taxType && defaultFilter.taxType !== "all") {
        const hasTaxType = invoice.items.some(
          (item) => item.taxType === defaultFilter.taxType
        );
        if (!hasTaxType) return false;
      }

      return true;
    });
  }, [invoices, defaultFilter, getCompanyById]);

  // 거래처별 매출 통계 계산
  const companySalesStats = useMemo(() => {
    const statsMap = new Map<string, CompanySalesStats>();

    filteredInvoices.forEach((invoice) => {
      const company = getCompanyById(invoice.companyId);
      if (!company) return;

      let companyStats = statsMap.get(invoice.companyId);
      if (!companyStats) {
        companyStats = {
          companyId: invoice.companyId,
          company,
          totalAmount: 0,
          totalSupplyAmount: 0,
          totalTaxAmount: 0,
          salesByTaxType: {
            과세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
            면세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
            영세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
          },
          salesByMonth: [],
          salesByProduct: [],
          invoiceCount: 0,
          lastInvoiceDate: undefined,
        };
        statsMap.set(invoice.companyId, companyStats);
      }

      // 기본 통계 업데이트
      companyStats.totalAmount += invoice.totalAmount;
      companyStats.totalSupplyAmount += invoice.totalSupplyAmount;
      companyStats.totalTaxAmount += invoice.totalTaxAmount;
      companyStats.invoiceCount += 1;

      // 마지막 계산서 날짜 업데이트
      const invoiceDate = new Date(invoice.issueDate);
      if (
        !companyStats.lastInvoiceDate ||
        invoiceDate > companyStats.lastInvoiceDate
      ) {
        companyStats.lastInvoiceDate = invoiceDate;
      }

      // 과세구분별 통계 업데이트
      invoice.items.forEach((item) => {
        const taxStats = companyStats.salesByTaxType[item.taxType];
        taxStats.count += item.quantity;
        taxStats.totalAmount += item.totalAmount;
        taxStats.totalSupplyAmount += item.amount;
        taxStats.totalTaxAmount += item.taxAmount;
      });

      // 월별 통계 업데이트
      const monthKey = `${invoiceDate.getFullYear()}-${String(
        invoiceDate.getMonth() + 1
      ).padStart(2, "0")}`;
      let monthStats = companyStats.salesByMonth.find(
        (m) => m.month === monthKey
      );
      if (!monthStats) {
        monthStats = {
          month: monthKey,
          totalAmount: 0,
          totalSupplyAmount: 0,
          totalTaxAmount: 0,
          salesByTaxType: {
            과세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
            면세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
            영세: {
              count: 0,
              totalAmount: 0,
              totalSupplyAmount: 0,
              totalTaxAmount: 0,
            },
          },
        };
        companyStats.salesByMonth.push(monthStats);
      }

      monthStats.totalAmount += invoice.totalAmount;
      monthStats.totalSupplyAmount += invoice.totalSupplyAmount;
      monthStats.totalTaxAmount += invoice.totalTaxAmount;

      invoice.items.forEach((item) => {
        const monthTaxStats = monthStats.salesByTaxType[item.taxType];
        monthTaxStats.count += item.quantity;
        monthTaxStats.totalAmount += item.totalAmount;
        monthTaxStats.totalSupplyAmount += item.amount;
        monthTaxStats.totalTaxAmount += item.taxAmount;
      });

      // 상품별 통계 업데이트
      invoice.items.forEach((item) => {
        let productStats = companyStats.salesByProduct.find(
          (p) => p.productName === item.name && p.taxType === item.taxType
        );
        if (!productStats) {
          productStats = {
            productName: item.name,
            taxType: item.taxType,
            quantity: 0,
            totalAmount: 0,
            averagePrice: 0,
          };
          companyStats.salesByProduct.push(productStats);
        }

        productStats.quantity += item.quantity;
        productStats.totalAmount += item.totalAmount;
        productStats.averagePrice =
          productStats.totalAmount / productStats.quantity;
      });
    });

    // 월별 통계 정렬
    statsMap.forEach((stats) => {
      stats.salesByMonth.sort((a, b) => a.month.localeCompare(b.month));
      stats.salesByProduct.sort((a, b) => b.totalAmount - a.totalAmount);
    });

    return Array.from(statsMap.values());
  }, [filteredInvoices, getCompanyById]);

  // 정렬된 거래처별 통계
  const sortedCompanySalesStats = useMemo(() => {
    const sorted = [...companySalesStats];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (defaultSortOptions.sortBy) {
        case "company":
          comparison = a.company.name.localeCompare(b.company.name);
          break;
        case "totalAmount":
          comparison = a.totalAmount - b.totalAmount;
          break;
        case "invoiceCount":
          comparison = a.invoiceCount - b.invoiceCount;
          break;
        case "lastInvoiceDate":
          const aDate = a.lastInvoiceDate?.getTime() || 0;
          const bDate = b.lastInvoiceDate?.getTime() || 0;
          comparison = aDate - bDate;
          break;
        case "taxableAmount":
          comparison =
            a.salesByTaxType["과세"].totalAmount -
            b.salesByTaxType["과세"].totalAmount;
          break;
        case "taxFreeAmount":
          const aTaxFree =
            a.salesByTaxType["면세"].totalAmount +
            a.salesByTaxType["영세"].totalAmount;
          const bTaxFree =
            b.salesByTaxType["면세"].totalAmount +
            b.salesByTaxType["영세"].totalAmount;
          comparison = aTaxFree - bTaxFree;
          break;
        default:
          comparison = a.totalAmount - b.totalAmount;
      }

      return defaultSortOptions.order === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [companySalesStats, defaultSortOptions]);

  // 전체 매출 분석
  const salesAnalytics = useMemo((): SalesAnalytics => {
    const totalAmount = companySalesStats.reduce(
      (sum, stats) => sum + stats.totalAmount,
      0
    );
    const totalSupplyAmount = companySalesStats.reduce(
      (sum, stats) => sum + stats.totalSupplyAmount,
      0
    );
    const totalTaxAmount = companySalesStats.reduce(
      (sum, stats) => sum + stats.totalTaxAmount,
      0
    );

    // 과세구분별 전체 통계
    const totalSalesByTaxType = {
      과세: {
        count: 0,
        totalAmount: 0,
        totalSupplyAmount: 0,
        totalTaxAmount: 0,
        companies: 0,
      },
      면세: {
        count: 0,
        totalAmount: 0,
        totalSupplyAmount: 0,
        totalTaxAmount: 0,
        companies: 0,
      },
      영세: {
        count: 0,
        totalAmount: 0,
        totalSupplyAmount: 0,
        totalTaxAmount: 0,
        companies: 0,
      },
    } as const;

    companySalesStats.forEach((stats) => {
      (["과세", "면세", "영세"] as const).forEach((taxType) => {
        const taxStats = stats.salesByTaxType[taxType];
        if (taxStats.totalAmount > 0) {
          totalSalesByTaxType[taxType].count += taxStats.count;
          totalSalesByTaxType[taxType].totalAmount += taxStats.totalAmount;
          totalSalesByTaxType[taxType].totalSupplyAmount +=
            taxStats.totalSupplyAmount;
          totalSalesByTaxType[taxType].totalTaxAmount +=
            taxStats.totalTaxAmount;
          totalSalesByTaxType[taxType].companies += 1;
        }
      });
    });

    // 월별 전체 통계
    const monthlyStatsMap = new Map<string, any>();

    companySalesStats.forEach((stats) => {
      stats.salesByMonth.forEach((monthStats) => {
        let totalMonthStats = monthlyStatsMap.get(monthStats.month);
        if (!totalMonthStats) {
          totalMonthStats = {
            month: monthStats.month,
            totalAmount: 0,
            totalSupplyAmount: 0,
            totalTaxAmount: 0,
            companiesCount: 0,
            invoicesCount: 0,
            salesByTaxType: {
              과세: {
                count: 0,
                totalAmount: 0,
                totalSupplyAmount: 0,
                totalTaxAmount: 0,
              },
              면세: {
                count: 0,
                totalAmount: 0,
                totalSupplyAmount: 0,
                totalTaxAmount: 0,
              },
              영세: {
                count: 0,
                totalAmount: 0,
                totalSupplyAmount: 0,
                totalTaxAmount: 0,
              },
            },
            companiesSet: new Set<string>(),
          };
          monthlyStatsMap.set(monthStats.month, totalMonthStats);
        }

        totalMonthStats.totalAmount += monthStats.totalAmount;
        totalMonthStats.totalSupplyAmount += monthStats.totalSupplyAmount;
        totalMonthStats.totalTaxAmount += monthStats.totalTaxAmount;
        totalMonthStats.companiesSet.add(stats.companyId);

        (["과세", "면세", "영세"] as const).forEach((taxType) => {
          const taxStats = monthStats.salesByTaxType[taxType];
          totalMonthStats.salesByTaxType[taxType].count += taxStats.count;
          totalMonthStats.salesByTaxType[taxType].totalAmount +=
            taxStats.totalAmount;
          totalMonthStats.salesByTaxType[taxType].totalSupplyAmount +=
            taxStats.totalSupplyAmount;
          totalMonthStats.salesByTaxType[taxType].totalTaxAmount +=
            taxStats.totalTaxAmount;
        });
      });
    });

    const totalSalesByMonth = Array.from(monthlyStatsMap.values())
      .map((stats) => ({
        month: stats.month,
        totalAmount: stats.totalAmount,
        totalSupplyAmount: stats.totalSupplyAmount,
        totalTaxAmount: stats.totalTaxAmount,
        companiesCount: stats.companiesSet.size,
        invoicesCount: filteredInvoices.filter((invoice) => {
          const invoiceDate = new Date(invoice.issueDate);
          const monthKey = `${invoiceDate.getFullYear()}-${String(
            invoiceDate.getMonth() + 1
          ).padStart(2, "0")}`;
          return monthKey === stats.month;
        }).length,
        salesByTaxType: stats.salesByTaxType,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalCompanies: companySalesStats.length,
      totalAmount,
      totalSupplyAmount,
      totalTaxAmount,
      period: {
        startDate: defaultFilter.startDate!,
        endDate: defaultFilter.endDate!,
      },
      companySales: sortedCompanySalesStats,
      totalSalesByTaxType,
      totalSalesByMonth,
    };
  }, [
    companySalesStats,
    sortedCompanySalesStats,
    filteredInvoices,
    defaultFilter,
  ]);

  return {
    salesAnalytics,
    companySalesStats: sortedCompanySalesStats,
    filteredInvoices,
    isLoading: false,
    error: null,
  };
};
