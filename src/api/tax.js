import client from "./client";

// 공제 애매 거래 목록 (status=pending 등 쿼리)
export const getDeductions = (params) =>
  client.get(`/tax/deductions/`, { params });

// 특정 거래 AI 공제 추천
export const getAiSuggestDeduction = (transactionId) =>
  client.post(`/tax/deductions/${transactionId}/ai-suggest/`);

// 사용자 최종 확인(공제 여부 확정)
export const confirmDeduction = (transactionId, data) =>
  client.patch(`/tax/deductions/${transactionId}/`, data);

// 예상 부가세 조회
export const getVatForecast = (businessId, year, month) =>
  client.get(`/tax/vat-forecast/`, { params: { business_id: businessId, year, month } });

// 월 마감 요약 (마감 전이면 미리보기 요약, 마감 후면 스냅샷 - 응답의 status로 마감 여부 판단)
export const getClosingSummary = (businessId, yearMonth) =>
  client.get(`/tax/closing/${yearMonth}/`, { params: { business_id: businessId } });

// 월 마감 승인
export const approveClosing = (businessId, yearMonth) =>
  client.post(`/tax/closing/${yearMonth}/approve/`, { business_id: businessId });