export const ROUTES = {
  SETUP_BUSINESS: "/app/setup/business", // TODO: 향후 온보딩(CODEF 인증) 페이지용으로 유지, 아직 미구현
  SETUP_AUTH: "/app/setup/auth", // TODO: 위와 동일
  SETTINGS: "/app/settings",
  DASHBOARD: "/app/dashboard",
  BENCHMARK: "/app/benchmark",
  TRANSACTIONS: "/app/transactions",
  TRANSACTIONS_REVIEW: "/app/transactions/review",
  CLOSING: (month) => `/app/closing/${month}`,
  CLOSING_EXPORT: (month) => `/app/closing/${month}/export`,
  CHAT: "/app/chat",
  PAYROLL: "/app/payroll",
}; 