// 네비게이션 관련 타입 정의

export type RootStackParamList = {
  Main: undefined;
  CompanyDetail: { companyId: string };
  CompanyEdit: { companyId?: string };
  CompanyImport: undefined;
  DirectImport: undefined;
  InvoiceManagement: undefined;
  InvoiceEdit: { invoiceId?: string };
  InvoiceDetail: { invoiceId: string };
  CompanySalesAnalysis: undefined;
  CompanySalesDetail: { companyData: any };
  DeliveryManagement: undefined;
  DeliveryDetail: { deliveryId: string };
  DeliveryEdit: { deliveryId: string };
};

export type TabParamList = {
  Home: undefined;
  CompanyList: undefined;
};

// 네비게이션 액션
export interface NavigationActions {
  goHome?: () => void;
  goBack?: () => void;
  goForward?: () => void;
  goBackward?: () => void;
  openSearch?: () => void;
  openSettings?: () => void;
  refresh?: () => void;
  save?: () => void;
  cancel?: () => void;
  delete?: () => void;
  edit?: () => void;
  add?: () => void;
}
