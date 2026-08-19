import styled from "styled-components";

function PayrollHeader({ onAddClick }) {
  return (
    <Wrapper>
      <TitleGroup>
        <Title>인건비 관리</Title>
        <SubRow>
          <Eyebrow>2026년 8월 급여 기준</Eyebrow>
          <Badge>
            <Dot></Dot>
            9월 10일 원천세 납부 예정
          </Badge>
        </SubRow>
      </TitleGroup>
      <AddButton type="button" onClick={onAddClick}>
        + 직원 추가하기
      </AddButton>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
  padding-bottom: 20px; /* TODO: design token화 */
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; /* TODO: design token화 */
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 26px; /* TODO: design token화 */
  font-weight: 800;
`;

const SubRow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px; /* TODO: design token화 */
`;

const Eyebrow = styled.p`
  color: #8C6B5A; /* TODO: theme.js에 없는 값 */
  font-size: 13.5px; /* TODO: design token화 */
`;

const Badge = styled.span`
  background-color: #FEF6EC; /* TODO: theme.js에 없는 값 - 요약카드 warning 배지와 동일 */
  border: 0.8px solid #F3D9AB; /* TODO: theme.js에 없는 값 - 동일 */
  color: #B45309; /* TODO: theme.js에 없는 값 - 동일 */
  border-radius: 999px;
  padding: 2px 8px; /* TODO: design token화 */
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px; /* TODO: design token화 */
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.txt_brown};
  border-radius: ${({ theme }) => theme.radius.medium};
  color: ${({ theme }) => theme.colors.txt_brown};
  padding: 10px 18px; /* TODO: design token화 */
  font-size: 13.5px; /* TODO: design token화 */
  font-weight: 600;
  cursor: pointer;
`;

const Dot = styled.div`
border-radius: 2.5px;
opacity: 0.6041;
background: #B45309;
width: 5px;
height: 5px;`;

export default PayrollHeader;