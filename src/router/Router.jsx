import { Routes, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TransactionReviewPage from "../app/transactions/TransactionReviewPage";
import ChatPage from "../app/chat/ChatPage";
import PayrollPage from "../app/payroll/PayrollPage";
import DashboardPage from "../app/dashboard/DashboardPage";
import SettingsPage from "../app/settings/SettingsPage";
import BenchmarkPage from "../app/benchmark/BenchmarkPage";
import ComponentPreviewPage from "../dev/ComponentPreviewPage"; // ⚠️ 임시 — 커밋 전 삭제

function Router() {
  return (
    <Routes>
      {/* 카페비서 서비스: /app 하위 전부 AppLayout 공유 */}
      <Route path="/app" element={<AppLayout />}>
        {/* 아직 페이지 없음 — Phase 2~5에서 하나씩 채워질 자리 */}
        {/* <Route index element={<DashboardPage />} /> */}
        {/* <Route path="setup/business" element={<SetupBusinessPage />} /> */}
        {/* <Route path="setup/auth" element={<AuthSetupPage />} /> */}
        <Route path="settings" element={<SettingsPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="benchmark" element={<BenchmarkPage />} />
        <Route path="transactions/review" element={<TransactionReviewPage />} />
        {/* <Route path="closing/:month" element={<ClosingPage />} /> */}
        <Route path="chat" element={<ChatPage />} />
        <Route path="payroll" element={<PayrollPage />} />
      </Route>

      {/* ⚠️⚠️⚠️ 임시 라우트 — 컴포넌트 확인 끝나면 이 Route랑 위 import 삭제할 것 ⚠️⚠️⚠️ */}
      <Route path="/dev/components" element={<ComponentPreviewPage />} />
    </Routes>
  );
}

export default Router;