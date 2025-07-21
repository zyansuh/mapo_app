import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Delivery,
  DeliveryFormData,
  DeliveryStatus,
  DeliveryStats,
} from "../types/delivery";
import { storageService, STORAGE_KEYS } from "../services/storage";
import { generateId } from "../utils";

// 샘플 배송 데이터
const getSampleDeliveries = (): Delivery[] => [
  {
    id: "del1",
    deliveryNumber: "DEL-2024-001",
    companyId: "comp1",
    products: [
      {
        id: "prod1",
        category: "두부",
        productItem: "착한손두부",
        quantity: 10,
        unitPrice: 2000,
        totalPrice: 20000,
      },
      {
        id: "prod2",
        category: "콩나물",
        productItem: "시루콩나물",
        quantity: 5,
        unitPrice: 1500,
        totalPrice: 7500,
      },
    ],
    totalAmount: 27500,
    deliveryDate: new Date("2024-01-15"),
    deliveryAddress: "서울시 마포구 상암동 123-45",
    deliveryMemo: "1층 정문으로 배송 부탁드립니다.",
    driverName: "김배송",
    driverPhone: "010-1234-5678",
    status: "배송완료",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "del2",
    deliveryNumber: "DEL-2024-002",
    companyId: "comp2",
    products: [
      {
        id: "prod3",
        category: "묵류",
        productItem: "묵사발",
        quantity: 20,
        unitPrice: 1500,
        totalPrice: 30000,
      },
    ],
    totalAmount: 30000,
    deliveryDate: new Date(),
    deliveryAddress: "부산시 해운대구 해운대동 456-78",
    deliveryMemo: "",
    driverName: "이운송",
    driverPhone: "010-2345-6789",
    status: "배송중",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "del3",
    deliveryNumber: "DEL-2024-003",
    companyId: "comp1",
    products: [
      {
        id: "prod4",
        category: "두부",
        productItem: "순두부",
        quantity: 15,
        unitPrice: 1800,
        totalPrice: 27000,
      },
    ],
    totalAmount: 27000,
    deliveryDate: new Date(Date.now() + 86400000), // 내일
    deliveryAddress: "서울시 마포구 상암동 123-45",
    deliveryMemo: "오후 2시 이후 배송 부탁드립니다.",
    driverName: "",
    driverPhone: "",
    status: "준비중",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface UseDeliveryReturn {
  deliveries: Delivery[];
  loading: boolean;
  error: string | null;
  stats: DeliveryStats;
  addDelivery: (data: DeliveryFormData) => Promise<Delivery | null>;
  updateDelivery: (id: string, data: Partial<Delivery>) => Promise<boolean>;
  updateDeliveryStatus: (
    id: string,
    status: DeliveryStatus
  ) => Promise<boolean>;
  deleteDelivery: (id: string) => Promise<boolean>;
  getDeliveryById: (id: string) => Delivery | undefined;
  getDeliveriesByCompany: (companyId: string) => Delivery[];
  refreshData: () => Promise<void>;
}

const generateDeliveryNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `DEL-${year}${month}${day}-${random}`;
};

export const useDelivery = (): UseDeliveryReturn => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 실제로는 스토리지에서 로드하지만, 지금은 샘플 데이터 사용
      const sampleData = getSampleDeliveries();
      setDeliveries(sampleData);
    } catch (err) {
      setError("배송 데이터를 불러오는데 실패했습니다.");
      console.error("Delivery loading error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDelivery = useCallback(
    async (data: DeliveryFormData): Promise<Delivery | null> => {
      try {
        const newDelivery: Delivery = {
          id: generateId(),
          deliveryNumber: generateDeliveryNumber(),
          companyId: data.companyId,
          products: data.products.map((product, index) => ({
            ...product,
            id: generateId(),
            totalPrice: product.quantity * product.unitPrice,
          })),
          totalAmount: data.products.reduce(
            (sum, product) => sum + product.quantity * product.unitPrice,
            0
          ),
          deliveryDate: data.deliveryDate,
          deliveryAddress: data.deliveryAddress,
          deliveryMemo: data.deliveryMemo,
          driverName: data.driverName,
          driverPhone: data.driverPhone,
          status: "준비중",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setDeliveries((prev) => [newDelivery, ...prev]);
        return newDelivery;
      } catch (err) {
        setError("배송 등록에 실패했습니다.");
        console.error("Add delivery error:", err);
        return null;
      }
    },
    []
  );

  const updateDelivery = useCallback(
    async (id: string, data: Partial<Delivery>): Promise<boolean> => {
      try {
        setDeliveries((prev) =>
          prev.map((delivery) =>
            delivery.id === id
              ? { ...delivery, ...data, updatedAt: new Date() }
              : delivery
          )
        );
        return true;
      } catch (err) {
        setError("배송 정보 수정에 실패했습니다.");
        console.error("Update delivery error:", err);
        return false;
      }
    },
    []
  );

  const updateDeliveryStatus = useCallback(
    async (id: string, status: DeliveryStatus): Promise<boolean> => {
      try {
        setDeliveries((prev) =>
          prev.map((delivery) =>
            delivery.id === id
              ? { ...delivery, status, updatedAt: new Date() }
              : delivery
          )
        );
        return true;
      } catch (err) {
        setError("배송 상태 변경에 실패했습니다.");
        console.error("Update delivery status error:", err);
        return false;
      }
    },
    []
  );

  const deleteDelivery = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeliveries((prev) => prev.filter((delivery) => delivery.id !== id));
      return true;
    } catch (err) {
      setError("배송 삭제에 실패했습니다.");
      console.error("Delete delivery error:", err);
      return false;
    }
  }, []);

  const getDeliveryById = useCallback(
    (id: string): Delivery | undefined => {
      return deliveries.find((delivery) => delivery.id === id);
    },
    [deliveries]
  );

  const getDeliveriesByCompany = useCallback(
    (companyId: string): Delivery[] => {
      return deliveries.filter((delivery) => delivery.companyId === companyId);
    },
    [deliveries]
  );

  const refreshData = useCallback(async () => {
    await loadDeliveries();
  }, [loadDeliveries]);

  // 배송 통계 계산
  const stats = useMemo((): DeliveryStats => {
    const totalDeliveries = deliveries.length;
    const pendingDeliveries = deliveries.filter(
      (d) => d.status === "준비중" || d.status === "배송중"
    ).length;
    const completedDeliveries = deliveries.filter(
      (d) => d.status === "배송완료"
    ).length;
    const totalAmount = deliveries.reduce((sum, d) => sum + d.totalAmount, 0);

    return {
      totalDeliveries,
      pendingDeliveries,
      completedDeliveries,
      totalAmount,
    };
  }, [deliveries]);

  return {
    deliveries,
    loading,
    error,
    stats,
    addDelivery,
    updateDelivery,
    updateDeliveryStatus,
    deleteDelivery,
    getDeliveryById,
    getDeliveriesByCompany,
    refreshData,
  };
};
