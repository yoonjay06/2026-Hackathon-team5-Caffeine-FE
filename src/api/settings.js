import client from "./client";

// 사업장 기본정보 조회
export const getBusinessSettings = (businessId) =>
  client.get(`/businesses/${businessId}/settings/business/`);

// 사업장 기본정보 수정 (⚠️ tax_type은 이 API로 수정 불가 - businesses.js의 syncTaxType 사용)
export const updateBusinessSettings = (businessId, data) =>
  client.patch(`/businesses/${businessId}/settings/business/`, data);

// 구독 정보 조회
export const getSubscription = (businessId) =>
  client.get(`/businesses/${businessId}/settings/subscription/`);

// 결제 수단 변경
export const updatePaymentMethod = (businessId, paymentToken) =>
  client.patch(`/businesses/${businessId}/settings/subscription/payment-method/`, { payment_token: paymentToken });

// 구독 취소
export const cancelSubscription = (businessId) =>
  client.post(`/businesses/${businessId}/settings/subscription/cancel/`);
