import styled from "styled-components";
import Button from "../../../components/Button";

function SummaryHeader({ year, month, isClosed, isApproving, onApprove }) {
  return (
    <Wrapper>
      <TitleGroup>
        <Title>{month}월 세무 현황 결산</Title>
      </TitleGroup>

      {!isClosed && (
        <Button
          variant="button_large_brown"
          size="large"
          onClick={onApprove}
          disabled={isApproving}
        >
          {isApproving ? "승인 처리 중..." : `${month}월 장부 마감 승인하기`}
        </Button>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px; /* TODO: design token화 */
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 24px; /* TODO: design token화 */
  font-weight: 700;
`;

const Badge = styled.span`
  background-color: ${({ theme, $closed }) => ($closed ? theme.colors.bg_gray : "#FEF6EC")}; /* TODO: theme.js에 없는 값 */
  color: ${({ theme, $closed }) => ($closed ? theme.colors.txt_brown : "#B45309")}; /* TODO: theme.js에 없는 값 */
  border-radius: 999px;
  padding: 4px 12px; /* TODO: design token화 */
  font-size: 13px; /* TODO: design token화 */
  font-weight: 600;
`;

export default SummaryHeader;