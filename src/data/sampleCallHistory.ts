import { CallHistoryItem } from "../types/call";

export const sampleCallHistory: CallHistoryItem[] = [
  {
    id: "call_001",
    phoneNumber: "010-1234-5678",
    companyName: "착한농산",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    type: "outgoing",
    duration: 185, // 3분 5초
  },
  {
    id: "call_002",
    phoneNumber: "010-9876-5432",
    companyName: "신선마트",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    type: "incoming",
    duration: 342, // 5분 42초
  },
  {
    id: "call_003",
    phoneNumber: "010-5555-1234",
    companyName: "건강식품",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4시간 전
    type: "outgoing",
    duration: 78, // 1분 18초
  },
  {
    id: "call_004",
    phoneNumber: "010-7777-8888",
    companyName: "맛있는두부",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6시간 전
    type: "incoming",
    duration: 256, // 4분 16초
  },
  {
    id: "call_005",
    phoneNumber: "010-1111-2222",
    companyName: "프리미엄식자재",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    type: "outgoing",
    duration: 423, // 7분 3초
  },
  {
    id: "call_006",
    phoneNumber: "010-3333-4444",
    companyName: "대박마켓",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2일 전
    type: "incoming",
    duration: 145, // 2분 25초
  },
  {
    id: "call_007",
    phoneNumber: "010-6666-7777",
    companyName: "천연식품",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3일 전
    type: "outgoing",
    duration: 289, // 4분 49초
  },
  {
    id: "call_008",
    phoneNumber: "010-9999-0000",
    companyName: "우리식자재",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5일 전
    type: "incoming",
    duration: 167, // 2분 47초
  },
  {
    id: "call_009",
    phoneNumber: "010-1357-2468",
    companyName: "행복농장",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1주일 전
    type: "outgoing",
    duration: 534, // 8분 54초
  },
  {
    id: "call_010",
    phoneNumber: "010-8888-9999",
    companyName: "풍성마트",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10일 전
    type: "incoming",
    duration: 198, // 3분 18초
  },
  {
    id: "call_011",
    phoneNumber: "010-2468-1357",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 2주일 전
    type: "outgoing",
    duration: 89, // 1분 29초
    // 회사명 없음 (미등록 번호)
  },
  {
    id: "call_012",
    phoneNumber: "010-4567-8901",
    companyName: "산골식품",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15일 전
    type: "incoming",
    duration: 367, // 6분 7초
  },
];

export const sampleUnknownNumbers = [
  {
    id: "unknown_001",
    phoneNumber: "010-2468-1357",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
  },
  {
    id: "unknown_002",
    phoneNumber: "010-9999-1111",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: "unknown_003",
    phoneNumber: "010-5555-7777",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

// 통화 통계 생성을 위한 헬퍼 함수
export const generateCallAnalytics = (callHistory: CallHistoryItem[]) => {
  const totalCalls = callHistory.length;
  const incomingCalls = callHistory.filter(
    (call) => call.type === "incoming"
  ).length;
  const outgoingCalls = callHistory.filter(
    (call) => call.type === "outgoing"
  ).length;

  const totalDuration = callHistory.reduce(
    (sum, call) => sum + (call.duration || 0),
    0
  );
  const averageDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

  // 일별 통화 분포
  const callsByDay = callHistory.reduce((acc, call) => {
    const day = call.timestamp.toDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 시간별 통화 분포
  const callsByHour = callHistory.reduce((acc, call) => {
    const hour = call.timestamp.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // 회사별 통화 빈도
  const callsByCompany = callHistory.reduce((acc, call) => {
    if (call.companyName) {
      acc[call.companyName] = (acc[call.companyName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCalls,
    incomingCalls,
    outgoingCalls,
    totalDuration,
    averageDuration,
    callsByDay,
    callsByHour,
    callsByCompany,
  };
};
