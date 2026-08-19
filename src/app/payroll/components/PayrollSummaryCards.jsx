import styled from "styled-components";

function PayrollSummaryCards({ totalExpense, totalWithholdingTax, onExport }) {
  return (
    <Wrapper>
      <Card>
        <Label>이번 달 총 인건비 지출</Label>
        <Value>{totalExpense.toLocaleString()}원</Value>
        <NotePill $tone="warning">
          💡 세전 급여 + 사장님 부담 4대보험료
        </NotePill>
      </Card>

      <Card>
        <LabelRow>
          <Dot />
          <Label>9월 10일 납부할 원천세 합계</Label>
        </LabelRow>
        <Value>{totalWithholdingTax.toLocaleString()}원</Value>
        <NotePill $tone="warning">소득세 + 개인지방소득세</NotePill>
      </Card>

      <Card>
        <Label>임금명세서 파일 내보내기</Label>
        <Description>
          전 직원의 임금명세서를 PDF 또는 엑셀 파일로 일괄 내보낼 수 있습니다.
        </Description>
        <ExportButton type="button" onClick={onExport}>
          ⬇ 급여명세서 일괄 내보내기
        </ExportButton>
      </Card>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex-shrink: 0;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;

  width: 100%;
  margin-bottom: 1.75rem;
`;

const Card = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  min-height: 25.46vh;

  background-color: #ffffff;
  border: 0.05rem solid #e8d9c8;

  border-radius: 1rem;

  padding: 1.55rem;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const Dot = styled.span`
  width: 0.375rem;
  height: 0.375rem;

  border-radius: 50%;

  background-color: #b45309;
  opacity: 0.6;

  flex-shrink: 0;
`;

const Label = styled.p`
  margin: 0;

  color: #8c6b5a;

  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.125rem;
`;

const Value = styled.p`
  margin: 0.625rem 0 0;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-size: 1.875rem;
  font-weight: 800;
  line-height: 2.0625rem;

  letter-spacing: -0.075rem;
`;

const Description = styled.p`
  margin: 0.5rem 0 0;

  color: #8c6b5a;

  font-size: 0.78125rem;
  font-weight: 400;

  line-height: 1.25rem;
`;

const NOTE_TONE = {
  neutral: {
    bg: "#F5EDE0",
    text: "#8C6B5A",
    border: "transparent",
  },

  warning: {
    bg: "#FEF6EC",
    text: "#B45309",
    border: "#F3D9AB",
  },
};

const NotePill = styled.p`
  align-self: flex-start;

  margin: 0.625rem 0 0;

  background-color: ${({ $tone }) => NOTE_TONE[$tone].bg};
  color: ${({ $tone }) => NOTE_TONE[$tone].text};

  border: 0.05rem solid ${({ $tone }) => NOTE_TONE[$tone].border};
  border-radius: 1.25rem;

  padding: 0.25rem 0.625rem;

  font-size: 0.71875rem;
  line-height: 1.078rem;

  white-space: nowrap;
`;

const ExportButton = styled.button`
  margin-top: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 0.5rem;

  width: 100%;

  border: none;
  border-radius: 0.625rem;

  background-color: ${({ theme }) => theme.colors.txt_brown};
  color: ${({ theme }) => theme.colors.txt_white};

  padding: 0.6875rem 1rem;

  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.21875rem;

  cursor: pointer;
`;
export default PayrollSummaryCards;