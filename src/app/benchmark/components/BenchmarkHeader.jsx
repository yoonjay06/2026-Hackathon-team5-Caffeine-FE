import styled from "styled-components";

function BenchmarkHeader({ year, month }) {
  return (
    <Wrapper>
      <TitleGroup>
        <Title>AI 경영 진단</Title>
        <Subtitle>내 매장의 매출·지출 데이터 기반 손익 진단 및 전월 대비 경영 리포트</Subtitle>
      </TitleGroup>

      <Badge>📅 {year}년 {month}월 기준</Badge>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px; /* TODO: design token화 */
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 20px; /* TODO: design token화 */
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: rgba(61, 37, 30, 0.55); /* TODO: theme.js에 없는 값 */
  font-size: 12px; /* TODO: design token화 */
`;

const Badge = styled.span`
  background-color: #f3eee6; /* TODO: theme.js에 없는 값 */
  border: 0.8px solid rgba(61, 37, 30, 0.1);
  border-radius: 10px;
  padding: 7px 14px; /* TODO: design token화 */
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
  color: ${({ theme }) => theme.colors.txt_brown};
  flex-shrink: 0;
`;

export default BenchmarkHeader;
