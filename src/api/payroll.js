import client from "./client";

// 직원 목록 조회
export const getEmployees = (businessId) =>
  client.get(`/businesses/${businessId}/payroll/employees/`);

// 직원 등록
export const createEmployee = (businessId, data) =>
  client.post(`/businesses/${businessId}/payroll/employees/`, data);

// 직원 정보 수정
export const updateEmployee = (businessId, employeeId, data) =>
  client.patch(`/businesses/${businessId}/payroll/employees/${employeeId}/`, data);

// 직원 삭제
export const deleteEmployee = (businessId, employeeId) =>
  client.delete(`/businesses/${businessId}/payroll/employees/${employeeId}/`);

// 월별 노무 요약 (이번 달 총 인건비 지출, 원천세 합계 등 - 요약 카드용)
export const getPayrollSummary = (businessId, year, month) =>
  client.get(`/businesses/${businessId}/payroll/summary/`, { params: { year, month } });

// 월별 급여 정보 조회 (직원별 gross_pay·withholding_tax 등 계산 결과 - work_hours 기반 서버 계산)
export const getPayments = (businessId, year, month) =>
  client.get(`/businesses/${businessId}/payroll/payments/`, { params: { year, month } });

// 급여 정보 등록 (work_hours 입력 시 gross_pay·원천세 자동 계산)
export const createPayment = (businessId, data) =>
  client.post(`/businesses/${businessId}/payroll/payments/`, data);

// 급여 정보 수정
export const updatePayment = (businessId, paymentId, data) =>
  client.patch(`/businesses/${businessId}/payroll/payments/${paymentId}/`, data);

// 임금명세서/지급내역서 개별 PDF 다운로드
export const getPayslip = (businessId, paymentId) =>
  client.get(`/businesses/${businessId}/payroll/payments/${paymentId}/payslip/`, {
    responseType: "blob",
  });

// 임금명세서 일괄 내보내기 (PDF 또는 XLSX)
export const exportPayslips = (businessId, year, month, format) =>
  client.post(
    `/businesses/${businessId}/payroll/payments/export/`,
    { year, month, format },
    { responseType: "blob" }
  );