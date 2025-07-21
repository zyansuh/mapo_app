import {
  importCompaniesToDatabase,
  getImportStats,
} from "../utils/bulkImportCompanies";

export async function executeCompanyImport() {
  console.log("=== 거래처 데이터 임포트 시작 ===");

  // 통계 먼저 확인
  const stats = getImportStats();
  console.log(`총 ${stats.total}개의 거래처 데이터를 처리합니다.`);
  console.log("지역별 분포:", stats.byRegion);
  console.log("유형별 분포:", stats.byType);

  try {
    // 실제 데이터베이스에 저장
    const result = await importCompaniesToDatabase();

    console.log("\n=== 임포트 완료 ===");
    console.log(`성공: ${result.success}개`);

    if (result.errors.length > 0) {
      console.log(`실패: ${result.errors.length}개`);
      console.log("실패 목록:", result.errors);
    }

    return result;
  } catch (error) {
    console.error("임포트 중 오류 발생:", error);
    throw error;
  }
}

// 즉시 실행
executeCompanyImport()
  .then((result) => {
    console.log("✅ 거래처 데이터 임포트가 완료되었습니다!");
  })
  .catch((error) => {
    console.error("❌ 임포트 실패:", error);
  });
