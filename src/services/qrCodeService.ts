import { Company, QRCodeData, QRCodeOptions, QRCodeType } from "../types";

export class QRCodeService {
  private static instance: QRCodeService;

  static getInstance(): QRCodeService {
    if (!QRCodeService.instance) {
      QRCodeService.instance = new QRCodeService();
    }
    return QRCodeService.instance;
  }

  // 업체 정보를 QR 코드 데이터로 변환
  generateCompanyQRData(company: Company): QRCodeData {
    return {
      type: "company",
      company: company,
    };
  }

  // 연락처 정보를 QR 코드 데이터로 변환
  generateContactQRData(
    name: string,
    phone: string,
    email?: string,
    address?: string
  ): QRCodeData {
    return {
      type: "contact",
      contactInfo: {
        name,
        phone,
        email,
        address,
      },
    };
  }

  // 웹사이트 URL을 QR 코드 데이터로 변환
  generateWebsiteQRData(url: string): QRCodeData {
    return {
      type: "website",
      website: url,
    };
  }

  // 텍스트를 QR 코드 데이터로 변환
  generateTextQRData(text: string): QRCodeData {
    return {
      type: "text",
      text: text,
    };
  }

  // QR 코드 데이터를 문자열로 변환
  qrDataToString(qrData: QRCodeData): string {
    switch (qrData.type) {
      case "company":
        return this.companyToString(qrData.company!);
      case "contact":
        return this.contactToVCard(qrData.contactInfo!);
      case "website":
        return qrData.website!;
      case "text":
        return qrData.text!;
      default:
        return "";
    }
  }

  // 업체 정보를 문자열로 변환
  private companyToString(company: Company): string {
    return `업체명: ${company.name}
업체구분: ${company.type}
지역: ${company.region}
주소: ${company.address}
전화번호: ${company.phoneNumber}
${company.email ? `이메일: ${company.email}\n` : ""}${
      company.businessNumber
        ? `사업자등록번호: ${company.businessNumber}\n`
        : ""
    }${company.contactPerson ? `담당자: ${company.contactPerson}\n` : ""}${
      company.memo ? `메모: ${company.memo}` : ""
    }`;
  }

  // 연락처 정보를 vCard 형식으로 변환
  private contactToVCard(contact: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  }): string {
    let vcard = "BEGIN:VCARD\n";
    vcard += "VERSION:3.0\n";
    vcard += `FN:${contact.name}\n`;
    vcard += `TEL:${contact.phone}\n`;

    if (contact.email) {
      vcard += `EMAIL:${contact.email}\n`;
    }

    if (contact.address) {
      vcard += `ADR:;;${contact.address};;;;\n`;
    }

    vcard += "END:VCARD";
    return vcard;
  }

  // 기본 QR 코드 옵션
  getDefaultOptions(): QRCodeOptions {
    return {
      size: 200,
      backgroundColor: "#FFFFFF",
      foregroundColor: "#000000",
      errorCorrectionLevel: "M",
      includeMargin: true,
    };
  }

  // 업체별 맞춤 QR 코드 옵션
  getCompanyQROptions(company: Company): QRCodeOptions {
    const defaultOptions = this.getDefaultOptions();

    // 지역별 색상 적용
    let foregroundColor = "#000000";
    switch (company.region) {
      case "순창":
        foregroundColor = "#1E40AF"; // 파란색
        break;
      case "담양":
        foregroundColor = "#059669"; // 초록색
        break;
      case "장성":
        foregroundColor = "#DC2626"; // 빨간색
        break;
      default:
        foregroundColor = "#6B7280"; // 회색
        break;
    }

    return {
      ...defaultOptions,
      foregroundColor,
      size: 250, // 업체 정보는 조금 더 크게
    };
  }

  // QR 코드에서 업체 정보 추출
  parseCompanyFromQRData(qrString: string): Company | null {
    try {
      // 간단한 파싱 로직 (실제로는 더 정교해야 함)
      const lines = qrString.split("\n");
      const companyData: any = {};

      lines.forEach((line) => {
        if (line.startsWith("업체명: ")) {
          companyData.name = line.replace("업체명: ", "");
        } else if (line.startsWith("업체구분: ")) {
          companyData.type = line.replace("업체구분: ", "");
        } else if (line.startsWith("지역: ")) {
          companyData.region = line.replace("지역: ", "");
        } else if (line.startsWith("주소: ")) {
          companyData.address = line.replace("주소: ", "");
        } else if (line.startsWith("전화번호: ")) {
          companyData.phoneNumber = line.replace("전화번호: ", "");
        } else if (line.startsWith("이메일: ")) {
          companyData.email = line.replace("이메일: ", "");
        } else if (line.startsWith("사업자등록번호: ")) {
          companyData.businessNumber = line.replace("사업자등록번호: ", "");
        } else if (line.startsWith("담당자: ")) {
          companyData.contactPerson = line.replace("담당자: ", "");
        } else if (line.startsWith("메모: ")) {
          companyData.memo = line.replace("메모: ", "");
        }
      });

      // 필수 필드 확인
      if (
        companyData.name &&
        companyData.type &&
        companyData.region &&
        companyData.address &&
        companyData.phoneNumber
      ) {
        return {
          id: "", // QR 코드에서는 ID가 없으므로 빈 문자열
          name: companyData.name,
          type: companyData.type,
          region: companyData.region,
          address: companyData.address,
          phoneNumber: companyData.phoneNumber,
          email: companyData.email,
          businessNumber: companyData.businessNumber,
          contactPerson: companyData.contactPerson,
          memo: companyData.memo,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Company;
      }

      return null;
    } catch (error) {
      console.error("QR 코드 파싱 실패:", error);
      return null;
    }
  }

  // vCard에서 연락처 정보 추출
  parseContactFromVCard(
    vcard: string
  ): { name: string; phone: string; email?: string; address?: string } | null {
    try {
      const lines = vcard.split("\n");
      const contact: any = {};

      lines.forEach((line) => {
        if (line.startsWith("FN:")) {
          contact.name = line.replace("FN:", "");
        } else if (line.startsWith("TEL:")) {
          contact.phone = line.replace("TEL:", "");
        } else if (line.startsWith("EMAIL:")) {
          contact.email = line.replace("EMAIL:", "");
        } else if (line.startsWith("ADR:")) {
          // ADR 포맷: ;;주소;;;;
          const addressParts = line.replace("ADR:", "").split(";");
          if (addressParts.length >= 3) {
            contact.address = addressParts[2];
          }
        }
      });

      if (contact.name && contact.phone) {
        return contact;
      }

      return null;
    } catch (error) {
      console.error("vCard 파싱 실패:", error);
      return null;
    }
  }

  // QR 코드 공유를 위한 텍스트 생성
  generateShareText(company: Company): string {
    return `${company.name} 업체 정보

📞 ${company.phoneNumber}
📍 ${company.address}
🏢 ${company.type} (${company.region})
${company.email ? `📧 ${company.email}\n` : ""}${
      company.contactPerson ? `👤 담당자: ${company.contactPerson}\n` : ""
    }
QR 코드로 연락처를 쉽게 저장하세요!`;
  }

  // 배치 QR 코드 생성 (여러 업체 한번에)
  generateBatchQRData(companies: Company[]): QRCodeData[] {
    return companies.map((company) => this.generateCompanyQRData(company));
  }

  // QR 코드 검증
  validateQRData(qrData: QRCodeData): boolean {
    switch (qrData.type) {
      case "company":
        return !!(qrData.company?.name && qrData.company?.phoneNumber);
      case "contact":
        return !!(qrData.contactInfo?.name && qrData.contactInfo?.phone);
      case "website":
        return !!(qrData.website && this.isValidUrl(qrData.website));
      case "text":
        return !!(qrData.text && qrData.text.length > 0);
      default:
        return false;
    }
  }

  // URL 유효성 검사
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const qrCodeService = QRCodeService.getInstance();
