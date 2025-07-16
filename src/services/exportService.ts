import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import {
  Company,
  CreditRecord,
  ProductDelivery,
  ExportFormat,
  ExportDataType,
  ExportOptions,
  ExportResult,
} from "../types";

export class ExportService {
  private static instance: ExportService;

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  // 메인 내보내기 함수
  async exportData(
    companies: Company[],
    credits: CreditRecord[],
    deliveries: ProductDelivery[],
    options: ExportOptions
  ): Promise<ExportResult> {
    try {
      let fileName: string;
      let fileContent: string;

      // 데이터 필터링
      const filteredData = this.filterDataByOptions(
        { companies, credits, deliveries },
        options
      );

      switch (options.format) {
        case "excel":
          return await this.exportToExcel(filteredData, options);
        case "csv":
          return await this.exportToCSV(filteredData, options);
        case "json":
          return await this.exportToJSON(filteredData, options);
        default:
          throw new Error("지원하지 않는 내보내기 형식입니다.");
      }
    } catch (error) {
      console.error("데이터 내보내기 실패:", error);
      return {
        success: false,
        recordCount: 0,
        error:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  }

  // CSV 내보내기
  private async exportToCSV(
    data: {
      companies: Company[];
      credits: CreditRecord[];
      deliveries: ProductDelivery[];
    },
    options: ExportOptions
  ): Promise<ExportResult> {
    const timestamp = this.getTimestamp();
    let fileName: string;
    let csvContent: string;
    let recordCount = 0;

    switch (options.dataType) {
      case "companies":
        fileName = `업체목록_${timestamp}.csv`;
        csvContent = this.generateCompaniesCSV(data.companies);
        recordCount = data.companies.length;
        break;
      case "credits":
        fileName = `외상관리_${timestamp}.csv`;
        csvContent = this.generateCreditsCSV(data.credits);
        recordCount = data.credits.length;
        break;
      case "deliveries":
        fileName = `배송내역_${timestamp}.csv`;
        csvContent = this.generateDeliveriesCSV(data.deliveries);
        recordCount = data.deliveries.length;
        break;
      case "all":
        fileName = `전체데이터_${timestamp}.csv`;
        csvContent = this.generateAllDataCSV(data);
        recordCount =
          data.companies.length + data.credits.length + data.deliveries.length;
        break;
      default:
        throw new Error("지원하지 않는 데이터 타입입니다.");
    }

    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 파일 공유
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("알림", `파일이 저장되었습니다: ${fileName}`);
    }

    return {
      success: true,
      filePath,
      fileName,
      recordCount,
    };
  }

  // JSON 내보내기
  private async exportToJSON(
    data: {
      companies: Company[];
      credits: CreditRecord[];
      deliveries: ProductDelivery[];
    },
    options: ExportOptions
  ): Promise<ExportResult> {
    const timestamp = this.getTimestamp();
    let fileName = "";
    let jsonContent = "";
    let recordCount = 0;

    const exportData = {
      exportDate: new Date().toISOString(),
      options,
      data: {} as any,
    };

    switch (options.dataType) {
      case "companies":
        fileName = `업체목록_${timestamp}.json`;
        exportData.data = { companies: data.companies };
        recordCount = data.companies.length;
        break;
      case "credits":
        fileName = `외상관리_${timestamp}.json`;
        exportData.data = { credits: data.credits };
        recordCount = data.credits.length;
        break;
      case "deliveries":
        fileName = `배송내역_${timestamp}.json`;
        exportData.data = { deliveries: data.deliveries };
        recordCount = data.deliveries.length;
        break;
      case "all":
        fileName = `전체데이터_${timestamp}.json`;
        exportData.data = data;
        recordCount =
          data.companies.length + data.credits.length + data.deliveries.length;
        break;
    }

    jsonContent = JSON.stringify(exportData, null, 2);

    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("알림", `파일이 저장되었습니다: ${fileName}`);
    }

    return {
      success: true,
      filePath,
      fileName,
      recordCount,
    };
  }

  // Excel 내보내기 (CSV 형식으로 대체)
  private async exportToExcel(
    data: {
      companies: Company[];
      credits: CreditRecord[];
      deliveries: ProductDelivery[];
    },
    options: ExportOptions
  ): Promise<ExportResult> {
    const timestamp = this.getTimestamp();
    let fileName = "";
    let csvContent = "";
    let recordCount = 0;

    // Excel 파일은 CSV로 생성하되 .xlsx 확장자 사용
    switch (options.dataType) {
      case "companies":
        fileName = `업체목록_${timestamp}.xlsx`;
        csvContent = this.generateCompaniesCSV(data.companies);
        recordCount = data.companies.length;
        break;
      case "credits":
        fileName = `외상관리_${timestamp}.xlsx`;
        csvContent = this.generateCreditsCSV(data.credits);
        recordCount = data.credits.length;
        break;
      case "deliveries":
        fileName = `배송내역_${timestamp}.xlsx`;
        csvContent = this.generateDeliveriesCSV(data.deliveries);
        recordCount = data.deliveries.length;
        break;
      case "all":
        fileName = `전체데이터_${timestamp}.xlsx`;
        csvContent = this.generateAllDataCSV(data);
        recordCount =
          data.companies.length + data.credits.length + data.deliveries.length;
        break;
      default:
        throw new Error("지원하지 않는 데이터 타입입니다.");
    }

    const filePath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(filePath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("알림", `파일이 저장되었습니다: ${fileName}`);
    }

    return {
      success: true,
      filePath,
      fileName,
      recordCount,
    };
  }

  // 업체 데이터를 CSV로 변환
  private generateCompaniesCSV(companies: Company[]): string {
    const headers = [
      "ID",
      "업체명",
      "업체구분",
      "지역",
      "주소",
      "전화번호",
      "이메일",
      "사업자등록번호",
      "담당자",
      "메모",
      "즐겨찾기",
      "생성일",
      "수정일",
    ];

    const rows = companies.map((company) => [
      company.id,
      company.name,
      company.type,
      company.region,
      company.address,
      company.phoneNumber,
      company.email || "",
      company.businessNumber || "",
      company.contactPerson || "",
      company.memo || "",
      company.isFavorite ? "예" : "아니오",
      company.createdAt.toLocaleDateString(),
      company.updatedAt.toLocaleDateString(),
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  // 외상 데이터를 CSV로 변환
  private generateCreditsCSV(credits: CreditRecord[]): string {
    const headers = [
      "ID",
      "업체ID",
      "외상금액",
      "지불금액",
      "잔여금액",
      "만료일",
      "상태",
      "설명",
      "생성일",
      "수정일",
    ];

    const rows = credits.map((credit) => [
      credit.id,
      credit.companyId,
      credit.amount.toLocaleString(),
      credit.paidAmount.toLocaleString(),
      credit.remainingAmount.toLocaleString(),
      credit.dueDate.toLocaleDateString(),
      credit.status,
      credit.description || "",
      credit.createdAt.toLocaleDateString(),
      credit.updatedAt.toLocaleDateString(),
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  // 배송 데이터를 CSV로 변환
  private generateDeliveriesCSV(deliveries: ProductDelivery[]): string {
    const headers = [
      "ID",
      "상품ID",
      "상품명",
      "업체ID",
      "수량",
      "단가",
      "총가격",
      "배송일",
      "상태",
      "메모",
      "생성일",
    ];

    const rows = deliveries.map((delivery) => [
      delivery.id,
      delivery.productId,
      delivery.product.name,
      delivery.companyId,
      delivery.quantity.toString(),
      delivery.unitPrice.toLocaleString(),
      delivery.totalPrice.toLocaleString(),
      delivery.deliveryDate.toLocaleDateString(),
      delivery.status,
      delivery.memo || "",
      delivery.createdAt.toLocaleDateString(),
    ]);

    return this.arrayToCSV([headers, ...rows]);
  }

  // 전체 데이터를 CSV로 변환
  private generateAllDataCSV(data: {
    companies: Company[];
    credits: CreditRecord[];
    deliveries: ProductDelivery[];
  }): string {
    const sections = [
      "=== 업체 목록 ===",
      this.generateCompaniesCSV(data.companies),
      "",
      "=== 외상 관리 ===",
      this.generateCreditsCSV(data.credits),
      "",
      "=== 배송 내역 ===",
      this.generateDeliveriesCSV(data.deliveries),
    ];

    return sections.join("\n");
  }

  // 배열을 CSV 문자열로 변환
  private arrayToCSV(data: string[][]): string {
    return data
      .map((row) =>
        row
          .map((cell) =>
            // 셀에 쉼표나 따옴표가 있으면 따옴표로 감싸기
            cell.includes(",") || cell.includes('"') || cell.includes("\n")
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(",")
      )
      .join("\n");
  }

  // 옵션에 따른 데이터 필터링
  private filterDataByOptions(
    data: {
      companies: Company[];
      credits: CreditRecord[];
      deliveries: ProductDelivery[];
    },
    options: ExportOptions
  ) {
    let { companies, credits, deliveries } = data;

    // 날짜 범위 필터링
    if (options.dateRange) {
      const { startDate, endDate } = options.dateRange;

      companies = companies.filter(
        (c) => c.createdAt >= startDate && c.createdAt <= endDate
      );

      credits = credits.filter(
        (c) => c.createdAt >= startDate && c.createdAt <= endDate
      );

      deliveries = deliveries.filter(
        (d) => d.deliveryDate >= startDate && d.deliveryDate <= endDate
      );
    }

    // 특정 업체만 필터링
    if (options.companyIds && options.companyIds.length > 0) {
      companies = companies.filter((c) => options.companyIds!.includes(c.id));
      credits = credits.filter((c) =>
        options.companyIds!.includes(c.companyId)
      );
      deliveries = deliveries.filter((d) =>
        options.companyIds!.includes(d.companyId)
      );
    }

    return { companies, credits, deliveries };
  }

  // 타임스탬프 생성
  private getTimestamp(): string {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
  }

  // 통계 데이터 내보내기
  async exportStatistics(
    companies: Company[],
    credits: CreditRecord[],
    deliveries: ProductDelivery[]
  ): Promise<ExportResult> {
    const timestamp = this.getTimestamp();
    const fileName = `통계데이터_${timestamp}.json`;

    // 통계 계산
    const stats = {
      exportDate: new Date().toISOString(),
      summary: {
        totalCompanies: companies.length,
        totalCredits: credits.length,
        totalDeliveries: deliveries.length,
        totalCreditAmount: credits.reduce((sum, c) => sum + c.amount, 0),
        totalPaidAmount: credits.reduce((sum, c) => sum + c.paidAmount, 0),
        totalRemainingAmount: credits.reduce(
          (sum, c) => sum + c.remainingAmount,
          0
        ),
      },
      companiesByType: this.groupBy(companies, "type"),
      companiesByRegion: this.groupBy(companies, "region"),
      creditsByStatus: this.groupBy(credits, "status"),
      deliveriesByStatus: this.groupBy(deliveries, "status"),
      monthlyDeliveries: this.groupByMonth(deliveries),
      monthlyCredits: this.groupByMonth(credits),
    };

    const jsonContent = JSON.stringify(stats, null, 2);
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, jsonContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("알림", `통계 파일이 저장되었습니다: ${fileName}`);
    }

    return {
      success: true,
      filePath,
      fileName,
      recordCount: Object.keys(stats).length,
    };
  }

  // 그룹핑 헬퍼 함수
  private groupBy<T>(array: T[], key: keyof T): Record<string, number> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
  }

  // 월별 그룹핑 헬퍼 함수
  private groupByMonth<T extends { createdAt: Date } | { deliveryDate: Date }>(
    array: T[]
  ): Record<string, number> {
    return array.reduce((groups, item) => {
      const date =
        "createdAt" in item ? item.createdAt : (item as any).deliveryDate;
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      groups[month] = (groups[month] || 0) + 1;
      return groups;
    }, {} as Record<string, number>);
  }
}

// 싱글톤 인스턴스 내보내기
export const exportService = ExportService.getInstance();
