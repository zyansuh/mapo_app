import { useMemo } from "react";
import { CallAnalytics, Company } from "../types";

interface CallHistoryItem {
  id: string;
  phoneNumber: string;
  companyName?: string;
  timestamp: Date;
  duration?: number;
  type: "outgoing" | "incoming" | "missed";
}

export const useCallAnalytics = (
  callHistory: CallHistoryItem[],
  companies: Company[]
) => {
  // 기본 통계 분석
  const analytics = useMemo<CallAnalytics>(() => {
    const totalCalls = callHistory.length;
    const outgoingCalls = callHistory.filter(
      (call) => call.type === "outgoing"
    ).length;
    const incomingCalls = callHistory.filter(
      (call) => call.type === "incoming"
    ).length;
    const missedCalls = callHistory.filter(
      (call) => call.type === "missed"
    ).length;

    // 회사별 통화 횟수
    const callsByCompany: { [companyId: string]: number } = {};
    callHistory.forEach((call) => {
      if (call.companyName) {
        const company = companies.find((c) => c.name === call.companyName);
        if (company) {
          callsByCompany[company.id] = (callsByCompany[company.id] || 0) + 1;
        }
      }
    });

    // 월별 통화 횟수
    const callsByMonth: { [month: string]: number } = {};
    callHistory.forEach((call) => {
      const date = new Date(call.timestamp);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      callsByMonth[monthKey] = (callsByMonth[monthKey] || 0) + 1;
    });

    // 즐겨찾기 회사들
    const favoriteCompanies = companies.filter((company) => company.isFavorite);

    // 가장 많이 연락한 회사들
    const mostContactedCompanies = companies
      .map((company) => ({
        company,
        callCount: callsByCompany[company.id] || 0,
      }))
      .filter((item) => item.callCount > 0)
      .sort((a, b) => b.callCount - a.callCount)
      .slice(0, 10);

    return {
      totalCalls,
      outgoingCalls,
      incomingCalls,
      missedCalls,
      callsByCompany,
      callsByDate: {},
      callsByWeek: {},
      callsByMonth,
      favoriteCompanies,
      mostContactedCompanies,
    };
  }, [callHistory, companies]);

  return {
    analytics,
  };
};

export default useCallAnalytics;
