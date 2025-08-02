import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Invoice,
  InvoiceFormData,
  InvoiceStatus,
  TaxType,
} from "../types/invoice";
import { storageService, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils";

// 샘플 계산서 데이터
const getSampleInvoices = (): Invoice[] => [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    companyId: "comp1",
    items: [
      {
        id: "item1",
        name: "착한손두부",
        quantity: 10,
        unitPrice: 2000,
        amount: 20000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 20000,
      },
      {
        id: "item2",
        name: "순두부",
        quantity: 5,
        unitPrice: 1800,
        amount: 9000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 9000,
      },
    ],
    totalSupplyAmount: 29000,
    totalTaxAmount: 0,
    totalAmount: 29000,
    issueDate: new Date("2024-01-15"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    companyId: "comp2",
    items: [
      {
        id: "item3",
        name: "묵사발",
        quantity: 20,
        unitPrice: 1500,
        amount: 30000,
        taxType: "과세" as TaxType,
        taxAmount: 3000,
        totalAmount: 33000,
      },
    ],
    totalSupplyAmount: 30000,
    totalTaxAmount: 3000,
    totalAmount: 33000,
    issueDate: new Date("2024-02-10"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    companyId: "comp1",
    items: [
      {
        id: "item4",
        name: "콩나물",
        quantity: 15,
        unitPrice: 1200,
        amount: 18000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 18000,
      },
      {
        id: "item5",
        name: "도토리묵",
        quantity: 8,
        unitPrice: 2500,
        amount: 20000,
        taxType: "과세" as TaxType,
        taxAmount: 2000,
        totalAmount: 22000,
      },
    ],
    totalSupplyAmount: 38000,
    totalTaxAmount: 2000,
    totalAmount: 40000,
    issueDate: new Date("2024-03-05"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    companyId: "comp3",
    items: [
      {
        id: "item6",
        name: "청포묵",
        quantity: 12,
        unitPrice: 2200,
        amount: 26400,
        taxType: "과세" as TaxType,
        taxAmount: 2640,
        totalAmount: 29040,
      },
    ],
    totalSupplyAmount: 26400,
    totalTaxAmount: 2640,
    totalAmount: 29040,
    issueDate: new Date("2024-04-12"),
    status: "전송" as InvoiceStatus,
    createdAt: new Date("2024-04-12"),
    updatedAt: new Date("2024-04-12"),
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    companyId: "comp2",
    items: [
      {
        id: "item7",
        name: "두부",
        quantity: 25,
        unitPrice: 1800,
        amount: 45000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 45000,
      },
    ],
    totalSupplyAmount: 45000,
    totalTaxAmount: 0,
    totalAmount: 45000,
    issueDate: new Date("2024-05-20"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    companyId: "comp1",
    items: [
      {
        id: "item8",
        name: "콩나물",
        quantity: 30,
        unitPrice: 1200,
        amount: 36000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 36000,
      },
      {
        id: "item9",
        name: "메밀묵",
        quantity: 6,
        unitPrice: 3000,
        amount: 18000,
        taxType: "과세" as TaxType,
        taxAmount: 1800,
        totalAmount: 19800,
      },
    ],
    totalSupplyAmount: 54000,
    totalTaxAmount: 1800,
    totalAmount: 55800,
    issueDate: new Date("2024-06-15"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-06-15"),
  },
  // 추가 샘플 데이터 - 매출분석을 위한 다양한 거래처 데이터
  {
    id: "7",
    invoiceNumber: "INV-2024-007",
    companyId: "comp4", // (유)승일
    items: [
      {
        id: "item10",
        name: "착한손두부",
        quantity: 50,
        unitPrice: 2000,
        amount: 100000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 100000,
      },
    ],
    totalSupplyAmount: 100000,
    totalTaxAmount: 0,
    totalAmount: 100000,
    issueDate: new Date("2024-01-20"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "8",
    invoiceNumber: "INV-2024-008",
    companyId: "comp5", // 강진터미널마트
    items: [
      {
        id: "item11",
        name: "도토리묵",
        quantity: 25,
        unitPrice: 2500,
        amount: 62500,
        taxType: "과세" as TaxType,
        taxAmount: 6250,
        totalAmount: 68750,
      },
      {
        id: "item12",
        name: "청포묵",
        quantity: 15,
        unitPrice: 2200,
        amount: 33000,
        taxType: "과세" as TaxType,
        taxAmount: 3300,
        totalAmount: 36300,
      },
    ],
    totalSupplyAmount: 95500,
    totalTaxAmount: 9550,
    totalAmount: 105050,
    issueDate: new Date("2024-02-25"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-02-25"),
  },
  {
    id: "9",
    invoiceNumber: "INV-2024-009",
    companyId: "comp6", // 고향맛집
    items: [
      {
        id: "item13",
        name: "시루콩나물",
        quantity: 40,
        unitPrice: 1500,
        amount: 60000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 60000,
      },
      {
        id: "item14",
        name: "순두부",
        quantity: 20,
        unitPrice: 1800,
        amount: 36000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 36000,
      },
    ],
    totalSupplyAmount: 96000,
    totalTaxAmount: 0,
    totalAmount: 96000,
    issueDate: new Date("2024-03-10"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "10",
    invoiceNumber: "INV-2024-010",
    companyId: "comp7", // 담양마트
    items: [
      {
        id: "item15",
        name: "묵사발",
        quantity: 100,
        unitPrice: 1500,
        amount: 150000,
        taxType: "과세" as TaxType,
        taxAmount: 15000,
        totalAmount: 165000,
      },
    ],
    totalSupplyAmount: 150000,
    totalTaxAmount: 15000,
    totalAmount: 165000,
    issueDate: new Date("2024-04-05"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
  },
  {
    id: "11",
    invoiceNumber: "INV-2024-011",
    companyId: "comp1", // 마포종합식품 (추가 거래)
    items: [
      {
        id: "item16",
        name: "착한손두부",
        quantity: 35,
        unitPrice: 2000,
        amount: 70000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 70000,
      },
      {
        id: "item17",
        name: "대파콩나물",
        quantity: 25,
        unitPrice: 1200,
        amount: 30000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 30000,
      },
    ],
    totalSupplyAmount: 100000,
    totalTaxAmount: 0,
    totalAmount: 100000,
    issueDate: new Date("2024-05-15"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-05-15"),
  },
  {
    id: "12",
    invoiceNumber: "INV-2024-012",
    companyId: "comp8", // 백제회관
    items: [
      {
        id: "item18",
        name: "도토리묵",
        quantity: 12,
        unitPrice: 2500,
        amount: 30000,
        taxType: "과세" as TaxType,
        taxAmount: 3000,
        totalAmount: 33000,
      },
      {
        id: "item19",
        name: "메밀묵",
        quantity: 8,
        unitPrice: 3000,
        amount: 24000,
        taxType: "과세" as TaxType,
        taxAmount: 2400,
        totalAmount: 26400,
      },
      {
        id: "item20",
        name: "순두부",
        quantity: 15,
        unitPrice: 1800,
        amount: 27000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 27000,
      },
    ],
    totalSupplyAmount: 81000,
    totalTaxAmount: 5400,
    totalAmount: 86400,
    issueDate: new Date("2024-06-20"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-06-20"),
    updatedAt: new Date("2024-06-20"),
  },
  {
    id: "13",
    invoiceNumber: "INV-2024-013",
    companyId: "comp2", // (유)승일 (추가 거래)
    items: [
      {
        id: "item21",
        name: "청포묵",
        quantity: 30,
        unitPrice: 2200,
        amount: 66000,
        taxType: "과세" as TaxType,
        taxAmount: 6600,
        totalAmount: 72600,
      },
    ],
    totalSupplyAmount: 66000,
    totalTaxAmount: 6600,
    totalAmount: 72600,
    issueDate: new Date("2024-07-01"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-01"),
  },
  {
    id: "14",
    invoiceNumber: "INV-2024-014",
    companyId: "comp9", // 담양대통죽순순대
    items: [
      {
        id: "item22",
        name: "시루콩나물",
        quantity: 60,
        unitPrice: 1500,
        amount: 90000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 90000,
      },
      {
        id: "item23",
        name: "착한손두부",
        quantity: 10,
        unitPrice: 2000,
        amount: 20000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 20000,
      },
    ],
    totalSupplyAmount: 110000,
    totalTaxAmount: 0,
    totalAmount: 110000,
    issueDate: new Date("2024-07-10"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-10"),
  },
  {
    id: "15",
    invoiceNumber: "INV-2024-015",
    companyId: "comp10", // 담양백동숯불갈비
    items: [
      {
        id: "item24",
        name: "묵사발",
        quantity: 45,
        unitPrice: 1500,
        amount: 67500,
        taxType: "과세" as TaxType,
        taxAmount: 6750,
        totalAmount: 74250,
      },
      {
        id: "item25",
        name: "도토리묵",
        quantity: 18,
        unitPrice: 2500,
        amount: 45000,
        taxType: "과세" as TaxType,
        taxAmount: 4500,
        totalAmount: 49500,
      },
    ],
    totalSupplyAmount: 112500,
    totalTaxAmount: 11250,
    totalAmount: 123750,
    issueDate: new Date("2024-07-15"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-15"),
  },
];

interface UseInvoiceReturn {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;

  // CRUD 작업
  addInvoice: (data: InvoiceFormData) => Promise<Invoice | null>;
  updateInvoice: (
    id: string,
    data: Partial<InvoiceFormData>
  ) => Promise<boolean>;
  deleteInvoice: (id: string) => Promise<boolean>;
  getInvoiceById: (id: string) => Invoice | undefined;

  // 상태 관리
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<boolean>;

  // 유틸리티
  refreshData: () => Promise<void>;
  generateInvoiceNumber: () => string;
}

export const useInvoice = (): UseInvoiceReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 스토리지에서 데이터 로드
      const storedData = await storageService.getItem<Invoice[]>(
        STORAGE_KEYS.INVOICES
      );

      if (storedData && Array.isArray(storedData)) {
        // 날짜 객체 복원
        const restoredData = storedData.map((invoice) => ({
          ...invoice,
          issueDate: new Date(invoice.issueDate),
          dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt),
        }));
        setInvoices(restoredData);
      } else {
        // 초기 샘플 데이터 로드
        const sampleData = getSampleInvoices();
        setInvoices(sampleData);
        // 샘플 데이터 저장
        await saveToStorage(sampleData);
      }
    } catch (err) {
      setError("계산서 데이터를 불러오는데 실패했습니다.");
      console.error("계산서 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 스토리지에 저장
  const saveToStorage = useCallback(async (data: Invoice[]): Promise<void> => {
    try {
      await storageService.setItem(STORAGE_KEYS.INVOICES, data);
    } catch (error) {
      console.error("계산서 데이터 저장 실패:", error);
      throw new Error("데이터 저장에 실패했습니다.");
    }
  }, []);

  const addInvoice = useCallback(
    async (data: InvoiceFormData): Promise<Invoice | null> => {
      try {
        const newInvoice: Invoice = {
          id: generateId(),
          invoiceNumber: data.invoiceNumber || generateInvoiceNumber(),
          companyId: data.companyId,
          items: data.items,
          totalSupplyAmount: data.totalSupplyAmount,
          totalTaxAmount: data.totalTaxAmount,
          totalAmount: data.totalAmount,
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          status: data.status,
          memo: data.memo,
          attachments: data.attachments,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedInvoices = [newInvoice, ...invoices];
        setInvoices(updatedInvoices);
        await saveToStorage(updatedInvoices);

        return newInvoice;
      } catch (err) {
        setError("계산서 추가에 실패했습니다.");
        console.error("계산서 추가 오류:", err);
        return null;
      }
    },
    [invoices, saveToStorage]
  );

  const updateInvoice = useCallback(
    async (id: string, data: Partial<InvoiceFormData>): Promise<boolean> => {
      try {
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === id
            ? { ...invoice, ...data, updatedAt: new Date() }
            : invoice
        );

        setInvoices(updatedInvoices);
        await saveToStorage(updatedInvoices);
        return true;
      } catch (err) {
        setError("계산서 수정에 실패했습니다.");
        console.error("계산서 수정 오류:", err);
        return false;
      }
    },
    [invoices, saveToStorage]
  );

  const deleteInvoice = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
        setInvoices(updatedInvoices);
        await saveToStorage(updatedInvoices);
        return true;
      } catch (err) {
        setError("계산서 삭제에 실패했습니다.");
        console.error("계산서 삭제 오류:", err);
        return false;
      }
    },
    [invoices, saveToStorage]
  );

  const getInvoiceById = useCallback(
    (id: string): Invoice | undefined => {
      return invoices.find((invoice) => invoice.id === id);
    },
    [invoices]
  );

  const updateInvoiceStatus = useCallback(
    async (id: string, status: InvoiceStatus): Promise<boolean> => {
      try {
        const updatedInvoices = invoices.map((invoice) =>
          invoice.id === id
            ? { ...invoice, status, updatedAt: new Date() }
            : invoice
        );

        setInvoices(updatedInvoices);
        await saveToStorage(updatedInvoices);
        return true;
      } catch (err) {
        setError("계산서 상태 변경에 실패했습니다.");
        console.error("계산서 상태 수정 오류:", err);
        return false;
      }
    },
    [invoices, saveToStorage]
  );

  const refreshData = useCallback(async () => {
    await loadInvoices();
  }, [loadInvoices]);

  const generateInvoiceNumber = useCallback((): string => {
    const year = new Date().getFullYear();
    const existingNumbers = invoices
      .filter((inv) => inv.invoiceNumber.includes(year.toString()))
      .map((inv) => {
        const match = inv.invoiceNumber.match(/-(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });

    const nextNumber =
      existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `INV-${year}-${String(nextNumber).padStart(3, "0")}`;
  }, [invoices]);

  return {
    invoices,
    loading,
    error,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    updateInvoiceStatus,
    refreshData,
    generateInvoiceNumber,
  };
};
