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
  // 추가 테스트 데이터 - 거래처별 매출 분석을 위한 풍부한 데이터
  {
    id: "16",
    invoiceNumber: "INV-2024-016",
    companyId: "comp1", // 마포종합식품 (추가 거래)
    items: [
      {
        id: "item26",
        name: "검정깨묵",
        quantity: 20,
        unitPrice: 2800,
        amount: 56000,
        taxType: "과세" as TaxType,
        taxAmount: 5600,
        totalAmount: 61600,
      },
      {
        id: "item27",
        name: "박스콩나물",
        quantity: 35,
        unitPrice: 1400,
        amount: 49000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 49000,
      },
    ],
    totalSupplyAmount: 105000,
    totalTaxAmount: 5600,
    totalAmount: 110600,
    issueDate: new Date("2024-08-05"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-08-05"),
    updatedAt: new Date("2024-08-05"),
  },
  {
    id: "17",
    invoiceNumber: "INV-2024-017",
    companyId: "comp4", // (유)승일 (대량 주문)
    items: [
      {
        id: "item28",
        name: "착한손두부",
        quantity: 80,
        unitPrice: 2000,
        amount: 160000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 160000,
      },
      {
        id: "item29",
        name: "고소한손두부",
        quantity: 50,
        unitPrice: 2200,
        amount: 110000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 110000,
      },
      {
        id: "item30",
        name: "도토리420",
        quantity: 25,
        unitPrice: 2600,
        amount: 65000,
        taxType: "과세" as TaxType,
        taxAmount: 6500,
        totalAmount: 71500,
      },
    ],
    totalSupplyAmount: 335000,
    totalTaxAmount: 6500,
    totalAmount: 341500,
    issueDate: new Date("2024-08-12"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-08-12"),
    updatedAt: new Date("2024-08-12"),
  },
  {
    id: "18",
    invoiceNumber: "INV-2024-018",
    companyId: "comp5", // 강진터미널마트 (정기 주문)
    items: [
      {
        id: "item31",
        name: "우뭇가사리",
        quantity: 40,
        unitPrice: 3200,
        amount: 128000,
        taxType: "과세" as TaxType,
        taxAmount: 12800,
        totalAmount: 140800,
      },
      {
        id: "item32",
        name: "두절콩나물",
        quantity: 30,
        unitPrice: 1600,
        amount: 48000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 48000,
      },
    ],
    totalSupplyAmount: 176000,
    totalTaxAmount: 12800,
    totalAmount: 188800,
    issueDate: new Date("2024-08-20"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-08-20"),
  },
  {
    id: "19",
    invoiceNumber: "INV-2024-019",
    companyId: "comp6", // 고향맛집 (여름 성수기)
    items: [
      {
        id: "item33",
        name: "시루콩나물",
        quantity: 70,
        unitPrice: 1500,
        amount: 105000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 105000,
      },
      {
        id: "item34",
        name: "맛두부",
        quantity: 25,
        unitPrice: 2100,
        amount: 52500,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 52500,
      },
      {
        id: "item35",
        name: "청포묵",
        quantity: 15,
        unitPrice: 2200,
        amount: 33000,
        taxType: "과세" as TaxType,
        taxAmount: 3300,
        totalAmount: 36300,
      },
    ],
    totalSupplyAmount: 190500,
    totalTaxAmount: 3300,
    totalAmount: 193800,
    issueDate: new Date("2024-08-25"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
  },
  {
    id: "20",
    invoiceNumber: "INV-2024-020",
    companyId: "comp7", // 담양마트 (월말 정산)
    items: [
      {
        id: "item36",
        name: "묵사발",
        quantity: 120,
        unitPrice: 1500,
        amount: 180000,
        taxType: "과세" as TaxType,
        taxAmount: 18000,
        totalAmount: 198000,
      },
      {
        id: "item37",
        name: "판두부",
        quantity: 40,
        unitPrice: 2500,
        amount: 100000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 100000,
      },
    ],
    totalSupplyAmount: 280000,
    totalTaxAmount: 18000,
    totalAmount: 298000,
    issueDate: new Date("2024-08-31"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-08-31"),
    updatedAt: new Date("2024-08-31"),
  },
  {
    id: "21",
    invoiceNumber: "INV-2024-021",
    companyId: "comp8", // 백제회관 (가을 시즌)
    items: [
      {
        id: "item38",
        name: "도토리묵",
        quantity: 35,
        unitPrice: 2500,
        amount: 87500,
        taxType: "과세" as TaxType,
        taxAmount: 8750,
        totalAmount: 96250,
      },
      {
        id: "item39",
        name: "메밀묵",
        quantity: 20,
        unitPrice: 3000,
        amount: 60000,
        taxType: "과세" as TaxType,
        taxAmount: 6000,
        totalAmount: 66000,
      },
      {
        id: "item40",
        name: "콩물",
        quantity: 10,
        unitPrice: 1800,
        amount: 18000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 18000,
      },
    ],
    totalSupplyAmount: 165500,
    totalTaxAmount: 14750,
    totalAmount: 180250,
    issueDate: new Date("2024-09-10"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-09-10"),
    updatedAt: new Date("2024-09-10"),
  },
  {
    id: "22",
    invoiceNumber: "INV-2024-022",
    companyId: "comp9", // 담양대통죽순순대 (추가 주문)
    items: [
      {
        id: "item41",
        name: "시루콩나물",
        quantity: 90,
        unitPrice: 1500,
        amount: 135000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 135000,
      },
      {
        id: "item42",
        name: "모두부",
        quantity: 30,
        unitPrice: 2400,
        amount: 72000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 72000,
      },
    ],
    totalSupplyAmount: 207000,
    totalTaxAmount: 0,
    totalAmount: 207000,
    issueDate: new Date("2024-09-15"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-09-15"),
  },
  {
    id: "23",
    invoiceNumber: "INV-2024-023",
    companyId: "comp10", // 담양백동숯불갈비 (가을 특별 주문)
    items: [
      {
        id: "item43",
        name: "검정깨묵",
        quantity: 25,
        unitPrice: 2800,
        amount: 70000,
        taxType: "과세" as TaxType,
        taxAmount: 7000,
        totalAmount: 77000,
      },
      {
        id: "item44",
        name: "우뭇가사리",
        quantity: 15,
        unitPrice: 3200,
        amount: 48000,
        taxType: "과세" as TaxType,
        taxAmount: 4800,
        totalAmount: 52800,
      },
      {
        id: "item45",
        name: "고소한손두부",
        quantity: 20,
        unitPrice: 2200,
        amount: 44000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 44000,
      },
    ],
    totalSupplyAmount: 162000,
    totalTaxAmount: 11800,
    totalAmount: 173800,
    issueDate: new Date("2024-09-20"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-09-20"),
    updatedAt: new Date("2024-09-20"),
  },
  {
    id: "24",
    invoiceNumber: "INV-2024-024",
    companyId: "comp1", // 마포종합식품 (월간 정기 주문)
    items: [
      {
        id: "item46",
        name: "착한손두부",
        quantity: 100,
        unitPrice: 2000,
        amount: 200000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 200000,
      },
      {
        id: "item47",
        name: "시루콩나물",
        quantity: 80,
        unitPrice: 1500,
        amount: 120000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 120000,
      },
      {
        id: "item48",
        name: "도토리묵",
        quantity: 30,
        unitPrice: 2500,
        amount: 75000,
        taxType: "과세" as TaxType,
        taxAmount: 7500,
        totalAmount: 82500,
      },
    ],
    totalSupplyAmount: 395000,
    totalTaxAmount: 7500,
    totalAmount: 402500,
    issueDate: new Date("2024-10-05"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-10-05"),
    updatedAt: new Date("2024-10-05"),
  },
  {
    id: "25",
    invoiceNumber: "INV-2024-025",
    companyId: "comp2", // (유)승일 (연말 특수)
    items: [
      {
        id: "item49",
        name: "청포묵",
        quantity: 50,
        unitPrice: 2200,
        amount: 110000,
        taxType: "과세" as TaxType,
        taxAmount: 11000,
        totalAmount: 121000,
      },
      {
        id: "item50",
        name: "메밀묵",
        quantity: 30,
        unitPrice: 3000,
        amount: 90000,
        taxType: "과세" as TaxType,
        taxAmount: 9000,
        totalAmount: 99000,
      },
      {
        id: "item51",
        name: "순두부",
        quantity: 40,
        unitPrice: 1800,
        amount: 72000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 72000,
      },
    ],
    totalSupplyAmount: 272000,
    totalTaxAmount: 20000,
    totalAmount: 292000,
    issueDate: new Date("2024-10-15"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "26",
    invoiceNumber: "INV-2024-026",
    companyId: "comp3", // 대형 주문
    items: [
      {
        id: "item52",
        name: "묵사발",
        quantity: 200,
        unitPrice: 1500,
        amount: 300000,
        taxType: "과세" as TaxType,
        taxAmount: 30000,
        totalAmount: 330000,
      },
      {
        id: "item53",
        name: "박스콩나물",
        quantity: 100,
        unitPrice: 1400,
        amount: 140000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 140000,
      },
    ],
    totalSupplyAmount: 440000,
    totalTaxAmount: 30000,
    totalAmount: 470000,
    issueDate: new Date("2024-10-25"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-10-25"),
  },
  {
    id: "27",
    invoiceNumber: "INV-2024-027",
    companyId: "comp4", // (유)승일 (연말 마감)
    items: [
      {
        id: "item54",
        name: "도토리420",
        quantity: 40,
        unitPrice: 2600,
        amount: 104000,
        taxType: "과세" as TaxType,
        taxAmount: 10400,
        totalAmount: 114400,
      },
      {
        id: "item55",
        name: "맛두부",
        quantity: 35,
        unitPrice: 2100,
        amount: 73500,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 73500,
      },
      {
        id: "item56",
        name: "두절콩나물",
        quantity: 50,
        unitPrice: 1600,
        amount: 80000,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 80000,
      },
    ],
    totalSupplyAmount: 257500,
    totalTaxAmount: 10400,
    totalAmount: 267900,
    issueDate: new Date("2024-11-10"),
    status: "승인" as InvoiceStatus,
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-11-10"),
  },
  {
    id: "28",
    invoiceNumber: "INV-2024-028",
    companyId: "comp5", // 강진터미널마트 (겨울 시즌)
    items: [
      {
        id: "item57",
        name: "우뭇가사리",
        quantity: 60,
        unitPrice: 3200,
        amount: 192000,
        taxType: "과세" as TaxType,
        taxAmount: 19200,
        totalAmount: 211200,
      },
      {
        id: "item58",
        name: "판두부",
        quantity: 25,
        unitPrice: 2500,
        amount: 62500,
        taxType: "면세" as TaxType,
        taxAmount: 0,
        totalAmount: 62500,
      },
    ],
    totalSupplyAmount: 254500,
    totalTaxAmount: 19200,
    totalAmount: 273700,
    issueDate: new Date("2024-11-20"),
    status: "발행" as InvoiceStatus,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-20"),
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
