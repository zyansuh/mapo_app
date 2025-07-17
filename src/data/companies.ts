import { Company } from "../types";

// 실제 회사 데이터 (기존 useCompany.ts에서 분리)
export const initialCompaniesData: Omit<
  Company,
  "status" | "tags" | "lastContactDate" | "nextContactDate"
>[] = [
  {
    id: "1",
    name: "(라)이랴꿍꿍",
    type: "고객사",
    region: "기타",
    address: "익산시 영등동 851-4",
    phoneNumber: "",
    contactPerson: "송형규",
    businessNumber: "403-03-86421",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "(유)승일",
    type: "공급업체",
    region: "담양",
    address: "담양읍 중앙로 98-1",
    phoneNumber: "1034886700",
    contactPerson: "김갑례",
    businessNumber: "266-88-00933",
    email: "kangbok1@hanmail.net",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "(주) 죽향산업개발",
    type: "공급업체",
    region: "담양",
    address: "담양읍 지침1길 18 101호(대동파라시티)",
    phoneNumber: "",
    contactPerson: "정광성",
    businessNumber: "409-86-20167",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "(주)다농",
    type: "공급업체",
    region: "기타",
    address: "전주시 덕진구 시천로 96-14(송천동2가)",
    phoneNumber: "",
    contactPerson: "이동호",
    businessNumber: "418-81-08731",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "(주)덕인관",
    type: "고객사",
    region: "담양",
    address: "담양군 죽향대로1121",
    phoneNumber: "1085977882",
    contactPerson: "박규완",
    businessNumber: "409-86-27345",
    email: "whang77@chol.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // 200개 회사 데이터 중 처음 5개만 표시 (실제로는 모든 데이터가 들어가야 함)
  // 나머지 195개 데이터는 동일한 형식으로 계속...
];

// 회사 데이터를 Company 타입으로 변환하는 함수
export const transformToCompanyData = (
  data: (typeof initialCompaniesData)[0]
): Company => {
  return {
    ...data,
    status: "활성",
    tags: [],
    lastContactDate: undefined,
    nextContactDate: undefined,
  };
};

// 모든 회사 데이터를 변환
export const getInitialCompanies = (): Company[] => {
  return initialCompaniesData.map(transformToCompanyData);
};
