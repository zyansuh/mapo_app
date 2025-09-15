import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../services/api";
import { Company } from "../types";

export async function pushLocalCompaniesToBackend() {
  console.log("=== 로컬 거래처 → 백엔드 이관 시작 ===");
  try {
    const localStr = await AsyncStorage.getItem("companies");
    const localCompanies: Company[] = localStr ? JSON.parse(localStr) : [];

    if (!localCompanies.length) {
      console.log("로컬 거래처 데이터가 없습니다.");
      return { pushed: 0 };
    }

    // 최소 필드만 전송
    const payload = localCompanies.map((c) => ({
      name: c.name,
      type: c.type,
      region: c.region,
      status: c.status,
      address: c.address,
      phoneNumber: c.phoneNumber,
      email: c.email,
      businessNumber: c.businessNumber,
      contactPerson: c.contactPerson,
      contactPhone: c.contactPhone,
      memo: c.memo,
      tags: c.tags || [],
      isFavorite: Boolean((c as any).isFavorite),
      lastContactDate: c.lastContactDate || null,
      nextContactDate: c.nextContactDate || null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    const res = await apiService.bulkImportCompanies(payload);
    if (!res.success) {
      throw new Error(res.message || "벌크 임포트 실패");
    }

    console.log("이관 완료:", res.data);
    return res.data;
  } catch (error) {
    console.error("이관 중 오류:", error);
    throw error;
  }
}

// 실행 예시
pushLocalCompaniesToBackend()
  .then(() => console.log("✅ 로컬 거래처 이관 완료"))
  .catch((e) => console.error("❌ 이관 실패:", e));
