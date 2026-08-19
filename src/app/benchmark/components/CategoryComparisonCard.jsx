import styled from "styled-components";

const STATUS_COLOR = {
  GOOD: "#2E7D52", // TODO: theme.js에 없는 값
  WARNING: "#8A8078", // TODO: theme.js에 없는 값
  CAUTION: "#E07A2F", // theme.colors.error와 동일
};

function CategoryComparisonCard({ categoryComparison, totalRevenue }) {
  return (
    <Card>
      <Title>매출 대비 주요 비용 구조 분석 (전월 비교)</Title>
      <Subtitle>지출 항목별 매출 대비 비율 및 전월 대비 증감 현황</Subtitle>

      <List>
        {categoryComparison.map((item) => {
          const color = STATUS_COLOR[item.status_type] ?? "#8a8078";
          const amount = Math.round((totalRevenue * item.my_ratio) / 100);

          return (
            <Row key={item.category}>
              <RowTop>
                <NameGroup>
                  <Name>{item.name}</Name>
                  <Amount>{amount.toLocaleString()}만 원</Amount>
                </NameGroup>
                <ValueGroup>
                  <Ratio>{item.my_ratio}%</Ratio>
                  <StatusText style={{ color }}>{item.status_badge}</StatusText>
                </ValueGroup>
              </RowTop>
              <BarTrack>
                <BarFill style={{ width: `${Math.min(item.my_ratio, 100)}%`, backgroundColor: color }} />
              </BarTrack>
            </Row>
          );
        })}
      </List>

      <TotalRow>
        <span>총 지출 비중</span>
        <TotalValue>
          {categoryComparison.reduce((sum, item) => sum + item.my_ratio, 0).toFixed(1)}%{" "}
          <TotalUnit>매출 대비</TotalUnit>
        </TotalValue>
      </TotalRow>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.card_white};
  border: 0.8px solid rgba(61, 37, 30, 0.1);
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 20px 22px; /* TODO: design token화 */
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-weight: 800;
  font-size: 13px; /* TODO: design token화 */
  letter-spacing: -0.2px;
`;

const Subtitle = styled.p`
  color: rgba(61, 37, 30, 0.45); /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
  margin-bottom: 18px; /* TODO: design token화 */
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* TODO: design token화 */
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* TODO: design token화 */
`;

const RowTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const NameGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px; /* TODO: design token화 */
`;

const Name = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const Amount = styled.span`
  color: rgba(61, 37, 30, 0.45); /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
`;

const ValueGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px; /* TODO: design token화 */
`;

const Ratio = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 18px; /* TODO: design token화 */
  font-weight: 800;
`;

const StatusText = styled.span`
  font-size: 10px; /* TODO: design token화 */
  font-weight: 600;
`;

const BarTrack = styled.div`
  height: 6px; /* TODO: design token화 */
  border-radius: 99px;
  background-color: rgba(61, 37, 30, 0.07);
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 99px;
`;

const TotalRow = styled.div`
  margin-top: 18px; /* TODO: design token화 */
  padding-top: 14px; /* TODO: design token화 */
  border-top: 0.8px solid rgba(61, 37, 30, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(61, 37, 30, 0.55); /* TODO: theme.js에 없는 값 */
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const TotalValue = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 16px; /* TODO: design token화 */
  font-weight: 800;
`;

const TotalUnit = styled.span`
  font-size: 11px; /* TODO: design token화 */
  font-weight: 500;
`;

export default CategoryComparisonCard;
