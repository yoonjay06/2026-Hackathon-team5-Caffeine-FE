import styled, { useTheme } from "styled-components";
import { PieChart, Pie, Cell } from "recharts";

const ITEM_ICON = {
  "우유·유제품": "🥛",
  "원두·커피재료": "☕",
  "포장재·소모품": "📦",
  "전기·가스요금": "⚡",
};

const BADGE_TONE = {
  free: { bg: "#D1FAE5", text: "#059669" },
  taxed: { bg: "#F2EBE4", text: "#9C6E62" },
};

function DeductionAnalysisCard({ deduction }) {
  const theme = useTheme();
  const { deduction_grade, total_deductible_amount, structure, item_details } = deduction;
  const COLORS = ["#059669", theme.colors.bg_beige, theme.colors.bg_gray]; // TODO: 첫번째 값 theme.js에 없는 초록

  return (
    <Card>
      <Title>부가세 공제 구조 분석</Title>

      <ChartRow>
        <ChartWrapper>
          <PieChart width={118} height={118}>
            <Pie
              data={structure}
              dataKey="ratio"
              nameKey="category"
              innerRadius={45}
              outerRadius={59}
              startAngle={90}
              endAngle={-270}
            >
              {structure.map((entry, i) => (
                <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <CenterLabel>
            <RatioText>{structure[0].ratio}%</RatioText>
            <RatioSubText>공제율</RatioSubText>
          </CenterLabel>
        </ChartWrapper>

        <Legend>
          {structure.map((item, i) => (
            <LegendItem key={item.category}>
              <LegendTop>
                <Dot style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <LegendText>{item.category}</LegendText>
                <LegendPercent style={{ color: COLORS[i % COLORS.length] }}>{item.ratio}%</LegendPercent>
              </LegendTop>
              <MiniBarTrack>
                <MiniBarFill style={{ width: `${item.ratio}%`, backgroundColor: COLORS[i % COLORS.length] }} />
              </MiniBarTrack>
              <LegendAmount>{item.amount.toLocaleString()}원</LegendAmount>
            </LegendItem>
          ))}
        </Legend>
      </ChartRow>

      <Divider />

      <SectionTitle>항목별 공제 현황</SectionTitle>
      <ItemGrid>
        {item_details.map((item) => {
          const isTaxFree = item.deduction_type === "면세공제";
          const tone = isTaxFree ? "free" : "taxed";
          return (
            <ItemCard key={item.item_name}>
              <ItemTopRow>
                <ItemNameGroup>
                  <span>{ITEM_ICON[item.item_name] ?? "📎"}</span>
                  <ItemName>{item.item_name}</ItemName>
                </ItemNameGroup>
                <TypeBadge $tone={tone}>{item.deduction_type}</TypeBadge>
              </ItemTopRow>
              <ItemCategory>{item.category}</ItemCategory>
              <ItemBarRow>
                <ItemBarTrack>
                  <ItemBarFill $tone={tone} style={{ width: `${item.rate}%` }} />
                </ItemBarTrack>
                <ItemRate $tone={tone}>{item.rate}%</ItemRate>
              </ItemBarRow>
            </ItemCard>
          );
        })}
      </ItemGrid>

      <TotalBox>
        총 공제 가능액 (과세 + 의제매입) <strong>{total_deductible_amount.toLocaleString()}원</strong>
      </TotalBox>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* TODO: design token화 */
  background-color: #FFFCF8; /* TODO: theme.js에 없는 값 */
  border: 0.8px solid ${({ theme }) => theme.colors.bg_gray};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 20px; /* TODO: design token화 */
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-weight: 700;
`;

const ChartRow = styled.div`
  display: flex;
  gap: 24px; /* TODO: design token화 */
  align-items: flex-start;
`;

const ChartWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const CenterLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RatioText = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 22px; /* TODO: design token화 */
  font-weight: 700;
`;

const RatioSubText = styled.span`
  color: #9C6E62; /* TODO: theme.js에 없는 값 */
  font-size: 10px; /* TODO: design token화 */
`;

const Legend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; /* TODO: design token화 */
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px; /* TODO: design token화 */
`;

const LegendTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* TODO: design token화 */
`;

const Dot = styled.span`
  width: 10px; /* TODO: design token화 */
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const LegendText = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 12px; /* TODO: design token화 */

`;

const LegendPercent = styled.span`
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const MiniBarTrack = styled.div`
  height: 5px; /* TODO: design token화 */
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.bg_gray};
  overflow: hidden;
`;

const MiniBarFill = styled.div`
  height: 100%;
`;

const LegendAmount = styled.p`
  color: #9C6E62; /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
  text-align: right;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.bg_gray};
  margin: 0; /* TODO: design token화 */
`;

const SectionTitle = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-weight: 700;
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px; /* TODO: design token화 */
`;

const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* TODO: design token화 */
  background-color: ${({ theme }) => theme.colors.bg_white};
  border-radius: ${({ theme }) => theme.radius.medium_large};
  padding: 14px; /* TODO: design token화 */
`;

const ItemTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemNameGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* TODO: design token화 */
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const TypeBadge = styled.span`
  background-color: ${({ $tone }) => BADGE_TONE[$tone].bg};
  color: ${({ $tone }) => BADGE_TONE[$tone].text};
  border-radius: 999px;
  padding: 2px 8px; /* TODO: design token화 */
  font-size: 11px; /* TODO: design token화 */
`;

const ItemCategory = styled.p`
  color: #9C6E62; /* TODO: theme.js에 없는 값 */
  font-size: 12px; /* TODO: design token화 */
`;

const ItemBarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* TODO: design token화 */
`;

const ItemBarTrack = styled.div`
  flex: 1;
  height: 4px; /* TODO: design token화 */
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.bg_gray};
  overflow: hidden;
`;

const ItemBarFill = styled.div`
  height: 100%;
  background-color: ${({ $tone }) => BADGE_TONE[$tone].text};
`;

const ItemRate = styled.span`
  color: ${({ $tone }) => BADGE_TONE[$tone].text};
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const TotalBox = styled.div`
  background-color: ${({ theme }) => theme.colors.bg_beige};
  border-radius: ${({ theme }) => theme.radius.medium_large};
  padding: 10px 14px; /* TODO: design token화 */
  font-size: 12px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.txt_brown};

  strong {
    display: block;
    font-size: 16px; /* TODO: design token화 */
    margin-top: 2px; /* TODO: design token화 */
  }
`;

export default DeductionAnalysisCard;