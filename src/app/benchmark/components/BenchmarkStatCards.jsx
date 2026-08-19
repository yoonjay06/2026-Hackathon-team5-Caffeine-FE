import styled from "styled-components";

const toManwon = (won) => Math.round(won / 10000).toLocaleString();

function BenchmarkStatCards({ overview, monthlyTrends }) {
  const { total_revenue, total_expense, revenue_diff_pct, vat_deduction_estimate } = overview;
  const netProfit = total_revenue - total_expense;
  const profitMargin = total_revenue > 0 ? (netProfit / total_revenue) * 100 : 0;

  // 최근 2개월 영업이익률 차이로 "%p" 증감 표시 (benchmark API의 monthly_trends 기반)
  const lastTwo = monthlyTrends.slice(-2);
  const profitDeltaP = lastTwo.length === 2 ? lastTwo[1].my_profit_ratio - lastTwo[0].my_profit_ratio : null;

  return (
    <Grid>
      <Card>
        <Label>총 매출</Label>
        <Value>{toManwon(total_revenue)}만 원</Value>
        <DeltaBadge $positive={revenue_diff_pct >= 0}>
          {revenue_diff_pct >= 0 ? "+" : ""}{revenue_diff_pct}% {revenue_diff_pct >= 0 ? "▲" : "▼"}
        </DeltaBadge>
      </Card>

      <Card>
        <Label>총 지출</Label>
        <Value>{toManwon(total_expense)}만 원</Value>
        <SubText>식자재 + 인건비 + 고정비 + @</SubText>
      </Card>

      <Card>
        <Label>순 영업이익</Label>
        <Value>{toManwon(netProfit)}만 원</Value>
        <SubRow>
          <MarginPill>이익률 {profitMargin.toFixed(1)}%</MarginPill>
          {profitDeltaP != null && (
            <DeltaInline $positive={profitDeltaP >= 0}>
              {profitDeltaP >= 0 ? "+" : ""}
              {profitDeltaP.toFixed(1)}%p {profitDeltaP >= 0 ? "▲" : "▼"}
            </DeltaInline>
          )}
        </SubRow>
      </Card>

      <Card>
        <Label>예상 부가세 공제액</Label>
        <Value>{(vat_deduction_estimate ?? 0).toLocaleString()}원</Value>
        <SubText>확보된 절세 혜택</SubText>
      </Card>
    </Grid>
  );
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px; /* TODO: design token화 */
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* TODO: design token화 */
  background-color: ${({ theme }) => theme.colors.card_white};
  border: 0.8px solid rgba(61, 37, 30, 0.1);
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 18px 20px; /* TODO: design token화 */
`;

const Label = styled.p`
  color: rgba(61, 37, 30, 0.5); /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 600;
  letter-spacing: 0.2px;
`;

const Value = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 22px; /* TODO: design token화 */
  font-weight: 800;
`;

const SubText = styled.p`
  color: rgba(61, 37, 30, 0.45); /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* TODO: design token화 */
`;

const MarginPill = styled.span`
  background-color: #f3eee6; /* TODO: theme.js에 없는 값 */
  color: rgba(61, 37, 30, 0.5); /* TODO: theme.js에 없는 값 */
  border-radius: 6px;
  padding: 2px 6px; /* TODO: design token화 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 600;
`;

const DeltaInline = styled.span`
  color: ${({ $positive }) => ($positive ? "#2e7d52" : "#e07a2f")}; /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 700;
`;

const DeltaBadge = styled.span`
  align-self: flex-start;
  margin-top: 2px; /* TODO: design token화 */
  background-color: ${({ $positive }) => ($positive ? "#e8f5ee" : "#fdeee6")}; /* TODO: theme.js에 없는 값 */
  color: ${({ $positive }) => ($positive ? "#2e7d52" : "#e07a2f")}; /* TODO: theme.js에 없는 값 */
  border-radius: 20px;
  padding: 3px 8px; /* TODO: design token화 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 700;
`;

export default BenchmarkStatCards;
