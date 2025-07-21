import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  importCompaniesToDatabase,
  getImportStats,
} from "./bulkImportCompanies";

// 임포트 플래그 리셋 및 데이터 재임포트
export async function resetAndReimportCompanies() {
  try {
    console.log("=== 데이터 재임포트 시작 ===");

    // 기존 임포트 플래그 제거
    await AsyncStorage.removeItem("companies_imported");

    // 기존 거래처 데이터 제거
    await AsyncStorage.removeItem("companies");

    console.log("기존 데이터 삭제 완료");

    // 통계 확인
    const stats = getImportStats();
    console.log(`총 ${stats.total}개의 거래처를 다시 임포트합니다.`);
    console.log("지역별 분포:", stats.byRegion);
    console.log("유형별 분포:", stats.byType);

    // 새로운 데이터 임포트
    const result = await importCompaniesToDatabase();

    if (result.success > 0) {
      // 임포트 완료 플래그 설정
      await AsyncStorage.setItem("companies_imported", "true");

      console.log(
        `✅ ${result.success}개의 거래처가 성공적으로 재임포트되었습니다!`
      );

      if (result.errors.length > 0) {
        console.log(
          `⚠️ ${result.errors.length}개의 항목에서 오류가 발생했습니다.`
        );
        console.log("오류 목록:", result.errors);
      }

      return {
        success: true,
        count: result.success,
        errors: result.errors,
      };
    } else {
      console.log("❌ 재임포트 실패");
      return {
        success: false,
        count: 0,
        errors: result.errors,
      };
    }
  } catch (error) {
    console.error("재임포트 중 오류 발생:", error);
    return {
      success: false,
      count: 0,
      errors: [`재임포트 실패: ${error}`],
    };
  }
}
