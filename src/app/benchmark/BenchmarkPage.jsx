import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import BenchmarkHeader from "./components/BenchmarkHeader";
import BenchmarkStatCards from "./components/BenchmarkStatCards";
import AiPrescriptionSummary from "./components/AiPrescriptionSummary";
import CategoryComparisonCard from "./components/CategoryComparisonCard";
import TrendChartCard from "./components/TrendChartCard";
import Loading from "../../components/Loading";
import { useBusiness } from "../../contexts/BusinessContext";
import { getBenchmarkDashboard } from "../../api/benchmark";

const YEAR = 2026;
const MONTH = 8; // TODO: 실제로는 현재 월 기준 동적 계산 필요

function BenchmarkPage() {
  const { business } = useBusiness();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    const res = await getBenchmarkDashboard(business.businessId, YEAR, MONTH);
    setDashboard(res.data.data);
  }, [business.businessId]);

  useEffect(() => {
    const load = async () => {
      await loadData();
      setIsLoading(false);
    };
    load();
  }, [loadData]);

  if (isLoading) return <Loading />;
  if (!dashboard) return null;

  const { overview, ai_prescriptions, category_comparison, monthly_trends } = dashboard;

  return (
    <Wrapper>
      <BenchmarkHeader year={YEAR} month={MONTH} />

      <BenchmarkStatCards overview={overview} monthlyTrends={monthly_trends} />

      <AiPrescriptionSummary prescriptions={ai_prescriptions} />

      <ColumnGrid>
        <CategoryComparisonCard categoryComparison={category_comparison} totalRevenue={overview.total_revenue} />
        <TrendChartCard monthlyTrends={monthly_trends} />
      </ColumnGrid>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px; /* TODO: design token화 */
  padding: 20px 28px;
`;

const ColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 365fr 511fr;
  gap: 14px; /* TODO: design token화 */
  align-items: start;
`;

export default BenchmarkPage;
