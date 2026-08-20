import { useState } from "react";
import styled, { useTheme } from "styled-components";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// TODO: 백엔드 benchmark API의 monthly_trends는 my_profit_ratio/benchmark_profit_ratio(%)만 제공함.
// 이 차트가 필요로 하는 월별 매출·영업이익 절대금액(만원), 식자재 원가율 추이, 인건비 비중 추이는
// 아직 API에 없어서 mock으로 채움. 백엔드 MonthlyTrendItem에 필드가 추가되면
// (revenue, profit, raw_material_ratio, labor_ratio 등) 아래 MOCK_* 대신 API 응답으로 교체할 것.
const MOCK_PROFIT_LOSS_TREND = [
  { month: "3월", revenue: 950, profit: 340 },
  { month: "4월", revenue: 980, profit: 355 },
  { month: "5월", revenue: 1100, profit: 390 },
  { month: "6월", revenue: 1150, profit: 400 },
  { month: "7월", revenue: 1190, profit: 410 },
  { month: "8월", revenue: 1250, profit: 465 },
]; // 단위: 만원

const MOCK_RAW_MATERIAL_TREND = [
  { month: "3월", ratio: 33.5 },
  { month: "4월", ratio: 33.8 },
  { month: "5월", ratio: 34.0 },
  { month: "6월", ratio: 34.2 },
  { month: "7월", ratio: 34.5 },
  { month: "8월", ratio: 34.8 },
];

const MOCK_LABOR_TREND = [
  { month: "3월", ratio: 23.5 },
  { month: "4월", ratio: 23.2 },
  { month: "5월", ratio: 23.0 },
  { month: "6월", ratio: 22.8 },
  { month: "7월", ratio: 22.6 },
  { month: "8월", ratio: 22.4 },
];

const TABS = [
  { key: "PROFIT_LOSS", label: "전체 손익" },
  { key: "RAW_MATERIAL", label: "식자재 원가율" },
  { key: "PAYROLL", label: "인건비 추이" },
];

const avgRevenue = Math.round(
  MOCK_PROFIT_LOSS_TREND.reduce((sum, d) => sum + d.revenue, 0) /
    MOCK_PROFIT_LOSS_TREND.length,
);
const avgProfit = (
  MOCK_PROFIT_LOSS_TREND.reduce((sum, d) => sum + d.profit, 0) /
  MOCK_PROFIT_LOSS_TREND.length
).toFixed(1);

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <TooltipBox>
      <TooltipMonth>{label}</TooltipMonth>
      {payload.map((entry) => (
        <TooltipRow key={entry.dataKey}>
          {entry.name} {entry.value.toLocaleString()}
          {entry.dataKey === "ratio" ? "%" : "만원"}
        </TooltipRow>
      ))}
    </TooltipBox>
  );
}

function TrendChartCard() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("PROFIT_LOSS");

  return (
    <Card>
      <Title>최근 6개월 매출 및 영업이익 추이 (3월 ~ 8월)</Title>

      <TabRow>
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            type="button"
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabRow>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height={220}>
          {activeTab === "PROFIT_LOSS" ? (
            <ComposedChart data={MOCK_PROFIT_LOSS_TREND}>
              <CartesianGrid stroke="rgba(61, 37, 30, 0.08)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "rgba(61, 37, 30, 0.45)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(61, 37, 30, 0.4)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}만`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="revenue"
                name="매출"
                fill="#c97b3a"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
              <Line
                dataKey="profit"
                name="영업이익"
                stroke={theme.colors.txt_brown}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={
                activeTab === "RAW_MATERIAL"
                  ? MOCK_RAW_MATERIAL_TREND
                  : MOCK_LABOR_TREND
              }
            >
              <CartesianGrid stroke="rgba(61, 37, 30, 0.08)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "rgba(61, 37, 30, 0.45)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(61, 37, 30, 0.4)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                dataKey="ratio"
                name={
                  activeTab === "RAW_MATERIAL" ? "식자재 원가율" : "인건비 비중"
                }
                stroke={activeTab === "RAW_MATERIAL" ? "#c97b3a" : "#2E7D52"}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </ChartWrapper>

      <LegendRow>
        {activeTab === "PROFIT_LOSS" && (
          <>
            <LegendItem>
              <Dot $color="#c97b3a" />
              매출
            </LegendItem>

            <LegendItem>
              <LineDot $color={theme.colors.txt_brown} />
              영업이익
            </LegendItem>
          </>
        )}

        {activeTab === "RAW_MATERIAL" && (
          <LegendItem $color="#c97b3a">
            <LineDot $color="#c97b3a" />
            식자재 원가율
          </LegendItem>
        )}

        {activeTab === "PAYROLL" && (
          <LegendItem $color="#2e7d52">
            <LineDot $color="#2e7d52" />
            인건비 추이
          </LegendItem>
        )}
      </LegendRow>

      <StatsRow>
        <StatItem>
          <StatLabel>6개월 평균 매출</StatLabel>
          <StatValue>{avgRevenue.toLocaleString()}만 원</StatValue>
        </StatItem>
        <Divider />
        <StatItem>
          <StatLabel>6개월 평균 영업이익</StatLabel>
          <StatValue>{avgProfit}만 원</StatValue>
        </StatItem>
      </StatsRow>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* TODO: design token화 */
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

const TabRow = styled.div`
  display: flex;
  gap: 6px; /* TODO: design token화 */
`;

const TabButton = styled.button`
  border: 0.8px solid rgba(61, 37, 30, 0.1);
  border-radius: 999px;
  padding: 5px 12px; /* TODO: design token화 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 600;
  cursor: pointer;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.bg_brown : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.txt_white : "rgba(61, 37, 30, 0.55)"};
`;

const ChartWrapper = styled.div`
  width: 100%;
`;

const LegendRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px; /* TODO: design token화 */
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px; /* TODO: design token화 */
  color: ${({ $color }) => $color ?? "#C97B3A"}; /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px; /* TODO: design token화 */
  padding-top: 10px; /* TODO: design token화 */
  border-top: 0.8px solid rgba(61, 37, 30, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px; /* TODO: design token화 */
  align-items: center;
`;

const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: rgba(61, 37, 30, 0.1);
`;

const StatLabel = styled.span`
  color: rgba(61, 37, 30, 0.4); /* TODO: theme.js에 없는 값 */
  font-size: 10px; /* TODO: design token화 */
`;

const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 13px; /* TODO: design token화 */
  font-weight: 800;
`;

const TooltipBox = styled.div`
  background-color: ${({ theme }) => theme.colors.txt_brown};
  color: ${({ theme }) => theme.colors.txt_white};
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 8px 12px; /* TODO: design token화 */
  font-size: 11px; /* TODO: design token화 */
`;

const TooltipMonth = styled.p`
  font-weight: 700;
  margin-bottom: 4px; /* TODO: design token화 */
`;

const TooltipRow = styled.p`
  opacity: 0.9;
`;

const LineDot = styled.span`
  position: relative;
  width: 18px;
  height: 8px;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 18px;
    height: 2px;
    transform: translateY(-50%);
    background-color: ${({ $color }) => $color};
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;

    width: 7px;
    height: 7px;

    transform: translate(-50%, -50%);
    box-sizing: border-box;

    border: 1.5px solid ${({ $color }) => $color};
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.card_white};
  }
`;

export default TrendChartCard;
