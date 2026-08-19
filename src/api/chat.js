import client from "./client";

// 질문 전송 → tax/analytics 결과 조회 후 AI가 자연어로 답변
export const sendChatMessage = (data) =>
  client.post(`/chat/messages/`, data);

// 대화 이력 조회 (최신순 정렬)
export const getChatMessages = (businessId, params = {}) =>
  client.get(`/chat/messages/`, { params: { business_id: businessId, ...params } });