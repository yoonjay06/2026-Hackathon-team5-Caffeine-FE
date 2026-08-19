import { useState, useEffect } from "react";
import styled from "styled-components";
import { getMonthlySummary, getDeductionBreakdown } from "../../api/analytics";
import { getClosingSummary, approveClosing } from "../../api/tax";
import { useBusiness } from "../../contexts/BusinessContext";
import SummaryHeader from "./components/SummaryHeader";
import VatReserveCard from "./components/VatReserveCard";
import SalesExpenseCard from "./components/SalesExpenseCard";
import CleanDataExport from "./components/CleanDataExport";
import DeductionAnalysisCard from "./components/DeductionAnalysisCard";
import Loading from "../../components/Loading";

const now = new Date();
const YEAR = now.getFullYear();
const MONTH = now.getMonth() + 1;
const YEAR_MONTH = `${YEAR}-${String(MONTH).padStart(2, "0")}`;

function DashboardPage() {
  const { business } = useBusiness();
  const businessId = business.businessId;

  const [summary, setSummary] = useState(null);
  const [deduction, setDeduction] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!businessId) return;

    const loadData = async () => {
      setIsLoading(true);
      setLoadError(false);
      try {
        const [summaryRes, deductionRes] = await Promise.all([
          getMonthlySummary(businessId, YEAR, MONTH),
          getDeductionBreakdown(businessId, YEAR, MONTH),
        ]);
        setSummary(summaryRes.data.data);
        setDeduction(deductionRes.data.data);
      } catch {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [businessId]);

  // 마감 상태 초기 조회: GET /tax/closing/{year_month}/ 응답의 status로 판단 (summary/deduction과 별개로 실제 연동)
  useEffect(() => {
    if (!businessId) return;

    const loadClosingStatus = async () => {
      try {
        const res = await getClosingSummary(businessId, YEAR_MONTH);
        setIsClosed(res.data.data.status === "CLOSED");
      } catch {
        // 조회 실패 시 마감 전 상태로 간주 (다운로드/승인 버튼은 비활성 유지)
      }
    };
    loadClosingStatus();
  }, [businessId]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await approveClosing(businessId, YEAR_MONTH);
      setIsClosed(true);
    } catch (err) {
      if (err.response?.status === 409) {
        window.alert("이미 마감 승인된 월입니다.");
      } else if (err.response?.status === 422) {
        window.alert("확인되지 않은 거래가 있어 마감할 수 없습니다.");
      } else {
        window.alert("마감 승인 중 오류가 발생했습니다.");
      }
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) return <Loading />;
  if (loadError) return <ErrorMessage>데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.</ErrorMessage>;
  if (!summary || !deduction) return null;

  return (
    <Wrapper>
      <SummaryHeader
        year={summary.year}
        month={summary.month}
        isClosed={isClosed}
        isApproving={isApproving}
        onApprove={handleApprove}
      />

      <ColumnGrid>
        <LeftColumn>
          <VatReserveCard summary={summary} />
          <SalesExpenseCard summary={summary} />
        </LeftColumn>
        <RightColumn>
          <CleanDataExport year={YEAR} month={MONTH} isClosed={isClosed} />
          <DeductionAnalysisCard deduction={deduction} />
        </RightColumn>
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
  gap: 20px; /* TODO: design token화 */
  padding: 24px 32px;
`;

const ColumnGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; /* TODO: design token화 */
  align-items: start;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* TODO: design token화 */
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* TODO: design token화 */
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 14px;
`;

export default DashboardPage;