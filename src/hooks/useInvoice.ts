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
      // 실제로는 스토리지에서 로드하지만, 지금은 샘플 데이터 사용
      const sampleData = getSampleInvoices();
      setInvoices(sampleData);
    } catch (err) {
      setError("계산서 데이터를 불러오는데 실패했습니다.");
      console.error("Invoice loading error:", err);
    } finally {
      setLoading(false);
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

        setInvoices((prev) => [newInvoice, ...prev]);
        return newInvoice;
      } catch (err) {
        setError("계산서 추가에 실패했습니다.");
        console.error("Add invoice error:", err);
        return null;
      }
    },
    []
  );

  const updateInvoice = useCallback(
    async (id: string, data: Partial<InvoiceFormData>): Promise<boolean> => {
      try {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === id
              ? { ...invoice, ...data, updatedAt: new Date() }
              : invoice
          )
        );
        return true;
      } catch (err) {
        setError("계산서 수정에 실패했습니다.");
        console.error("Update invoice error:", err);
        return false;
      }
    },
    []
  );

  const deleteInvoice = useCallback(async (id: string): Promise<boolean> => {
    try {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
      return true;
    } catch (err) {
      setError("계산서 삭제에 실패했습니다.");
      console.error("Delete invoice error:", err);
      return false;
    }
  }, []);

  const getInvoiceById = useCallback(
    (id: string): Invoice | undefined => {
      return invoices.find((invoice) => invoice.id === id);
    },
    [invoices]
  );

  const updateInvoiceStatus = useCallback(
    async (id: string, status: InvoiceStatus): Promise<boolean> => {
      try {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === id
              ? { ...invoice, status, updatedAt: new Date() }
              : invoice
          )
        );
        return true;
      } catch (err) {
        setError("계산서 상태 변경에 실패했습니다.");
        console.error("Update invoice status error:", err);
        return false;
      }
    },
    []
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
