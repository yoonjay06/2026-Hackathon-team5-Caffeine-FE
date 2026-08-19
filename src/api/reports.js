import client from "./client";

// 신고 준비자료 생성(질문목록 포함)
export const generateReport = (data) =>
  client.post(`/reports/`, data);

// 파일 다운로드 (format: pdf | excel | csv)
export const downloadReport = (id, format) =>
  client.get(`/reports/${id}/download/`, { params: { format } });

// 사용자 최종 승인
export const approveReport = (id) =>
  client.post(`/reports/${id}/approve/`);