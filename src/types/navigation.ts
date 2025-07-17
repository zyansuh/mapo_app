// 네비게이션 관련 타입 정의

export type RootStackParamList = {
  Main: undefined;
  CompanyDetail: { companyId: string };
  CompanyEdit: { companyId?: string };
  ProductDetail: { productId: string };
  ProductEdit: { productId?: string };
  InvoiceDetail: { invoiceId: string };
  InvoiceEdit: { invoiceId?: string };
  DeliveryDetail: { deliveryId: string };
  DeliveryEdit: { deliveryId?: string };
  Settings: undefined;
  Statistics: undefined;
  Search: { initialQuery?: string };
  CreditManagement: { companyId?: string };
  InventoryManagement: undefined;
  ProductManagement: undefined;
  InvoiceManagement: undefined;
  DeliveryManagement: undefined;
};

export type TabParamList = {
  Home: undefined;
  CompanyList: undefined;
  Search: undefined;
  Statistics: undefined;
  Settings: undefined;
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
