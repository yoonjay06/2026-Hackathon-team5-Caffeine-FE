import client from "./client";

// CODEF 수집 → 정규화 → 중복처리 → 카테고리 분류(AI) 실행
export const syncTransactions = (businessId, startDate, endDate, sources) =>
  client.post(`/transactions/sync/`, { business_id: businessId, start_date: startDate, end_date: endDate, sources });

// 거래 목록 (business_id 필수, 쿼리: transaction_type, source_type, category, expense_purpose, start_date, end_date, page 등)
export const getTransactions = (businessId, params) =>
  client.get(`/transactions/`, { params: { business_id: businessId, ...params } });

// 거래 상세
export const getTransaction = (businessId, transactionId) =>
  client.get(`/transactions/${transactionId}/`, { params: { business_id: businessId } });

// 품목 카테고리 수정 (원재료/임차료/공과금/소모품/광고비/운송배달비/수수료/시설장비/기타/미분류)
export const updateTransactionCategory = (businessId, transactionId, category) =>
  client.patch(`/transactions/${transactionId}/category/`, { category }, { params: { business_id: businessId } });

// 사업 지출/개인 지출 구분 수정
export const updateTransactionPurpose = (businessId, transactionId, expensePurpose) =>
  client.patch(`/transactions/${transactionId}/purpose/`, { expense_purpose: expensePurpose }, { params: { business_id: businessId } });

// 중복 의심 거래 목록
export const getDuplicateTransactions = (businessId) =>
  client.get(`/transactions/duplicates/`, { params: { business_id: businessId } });

// 중복 여부 확정
export const confirmDuplicate = (businessId, duplicateId, data) =>
  client.patch(`/transactions/duplicates/${duplicateId}/`, data, { params: { business_id: businessId } });

// 거래 내역 CSV 내보내기 (포맷 고정, text/csv 스트림 응답)
export const exportTransactions = (businessId, year, month) =>
  client.get(`/transactions/export/`, {
    params: { business_id: businessId, year, month },
    responseType: "blob",
  });