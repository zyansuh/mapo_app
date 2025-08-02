// Address search service using Kakao REST API

// Get Kakao API key from environment variables or use default value
const KAKAO_REST_API_KEY =
  process.env.KAKAO_REST_API_KEY || "79e0ebfe320bd60e62e40f9cf7bc2aa0";

export interface KakaoAddressDocument {
  address_name: string;
  address_type: string;
  x: string; // longitude
  y: string; // latitude
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null;
}

export interface KakaoAddressResponse {
  documents: KakaoAddressDocument[];
  meta: {
    is_end: boolean;
    pageable_count: number;
    total_count: number;
  };
}

export interface AddressSearchResult {
  id: string;
  addressName: string;
  roadAddressName?: string;
  x: string;
  y: string;
}

/**
 * Search addresses through Kakao address search API
 * @param query Address keyword to search
 * @param page Page number (default: 1)
 * @param size Number of documents per page (default: 10, max: 30)
 * @returns Address search results
 */
export const searchAddress = async (
  query: string,
  page: number = 1,
  size: number = 10
): Promise<AddressSearchResult[]> => {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KakaoAddressResponse = await response.json();

    return data.documents.map((doc, index) => ({
      id: `${doc.x}_${doc.y}_${index}`,
      addressName: doc.address_name,
      roadAddressName: doc.road_address?.address_name,
      x: doc.x,
      y: doc.y,
    }));
  } catch (error) {
    console.error("Address search error:", error);
    throw new Error("Address search failed. Please try again later.");
  }
};

/**
 * 카카오 키워드 검색 API를 통해 장소를 검색합니다
 * @param query 검색할 키워드
 * @param page 페이지 번호
 * @param size 페이지당 문서 수
 * @returns 장소 검색 결과
 */
export const searchKeyword = async (
  query: string,
  page: number = 1,
  size: number = 10
): Promise<AddressSearchResult[]> => {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
      query
    )}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.documents.map((doc: any, index: number) => ({
      id: `${doc.x}_${doc.y}_${index}`,
      addressName: doc.address_name,
      roadAddressName: doc.road_address_name,
      x: doc.x,
      y: doc.y,
    }));
  } catch (error) {
    console.error("키워드 검색 오류:", error);
    throw new Error("장소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
};
