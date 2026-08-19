import client from "./client";

// 카테고리별 비용 비율 (원재료비율 등)
export const getCostRatio = (month) =>
  client.get(`/analytics/cost-ratio/`, { params: { month } });

// 특정 카테고리 전월 대비 증감 추이
export const getCategoryTrend = (category) =>
  client.get(`/analytics/trend/`, { params: { category } });

// 매출·비용 종합 요약
export const getAnalyticsSummary = (month) =>
  client.get(`/analytics/summary/`, { params: { month } });

// 월별 세무 현황 결산 (홈 화면 상단부 통합)
export const getMonthlySummary = (businessId, year, month) =>
  client.get(`/analytics/monthly-summary/`, { params: { business_id: businessId, year, month } });

// 부가세 공제 구조 분석
export const getDeductionBreakdown = (businessId, year, month) =>
  client.get(`/analytics/deduction-breakdown/`, { params: { business_id: businessId, year, month } });

// 세무사 전달용 클린데이터 다운로드 (file_type 기본값 csv, pdf 선택 가능)
export const exportCleanData = (businessId, year, month, fileType) =>
  client.get(`/businesses/${businessId}/analytics/export/`, {
    params: { year, month, file_type: fileType },
    responseType: "blob",
  });

// 월별 장부 마감 승인/조회는 tax.js의 approveClosing() / getClosingSummary()를 사용한다.
// (백엔드 인수인계 문서 기준 마감 상태의 단일 원본은 Tax의 MonthlyClose이고,
//  이 analytics 경로는 호환용으로만 남아있는 레거시 경로라 여기서는 제거함 - 2026-08-19)