import styled from "styled-components";
import EmployeeRow from "./EmployeeRow";

const COLUMNS = ["직원", "고용 형태", "월 근무시간", "시급", "세전 급여"];

function EmployeeTable({ employees, onUpdateEmployee, onViewPayslip, onDeleteEmployee }) {
  return (
    <Wrapper>
      <ListHeader>
        <TitleRow>
          <Title>직원 급여 내역</Title>
          <CountBadge>{employees.length}명</CountBadge>
        </TitleRow>
        <HelperText>입력값을 수정하면 급여가 자동 재계산됩니다</HelperText>
      </ListHeader>

      <TableHeader>
        {COLUMNS.map((col) => (
          <span key={col}>{col}</span>
        ))}
      </TableHeader>

      <RowList>
        {employees.map((emp) => (
          <EmployeeRow
            key={emp.employee_id}
            employee={emp}
            onUpdate={onUpdateEmployee}
            onViewPayslip={onViewPayslip}
            onDelete={onDeleteEmployee}
          />
        ))}
      </RowList>

      <NoticeBox>
        <span>📋</span>
        <p>
          <strong>원천세 납부 안내:</strong> 3.3% 프리랜서 원천세는 매월
          10일까지 납부하셔야 합니다. 4대보험 정직원의 경우 근로소득 간이세액표
          기준으로 자동 계산되며, 소액부징수(월 1,000원 미만) 시 징수하지
          않습니다.
        </p>
      </NoticeBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  flex: 1;
  min-height: 0;
`;

const ListHeader = styled.div`
  flex-shrink: 0;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;

  gap: 0.625rem;
`;

const Title = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;

  letter-spacing: -0.02rem;
`;

const CountBadge = styled.span`
  background-color: #f5ede0;
  color: #6b3f30;

  border-radius: 1.25rem;

  padding: 0.1875rem 0.5625rem;

  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.03125rem;

  white-space: nowrap;
`;

const HelperText = styled.p`
  margin: 0;

  color: #8c6b5a;

  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
`;

const TableHeader = styled.div`
  flex-shrink: 0;

  display: grid;

  grid-template-columns:
    200fr
    220fr
    130fr
    130fr
    160fr;

  gap: 0.75rem;

  padding: 0 1.5rem;

  color: #8c6b5a;

  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.03125rem;

  letter-spacing: 0.0275rem;

`;

const RowList = styled.div`
  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;

  gap: 0.5rem;

  padding-top: 0.5rem;

  overflow-y: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NoticeBox = styled.div`
  flex-shrink: 0;

  display: flex;
  align-items: center;
  gap: 0.625rem;

  margin-top: 1.25rem;
  padding: 0.875rem 1.25rem;

  background-color: #f5ede0;

  border: 0.05rem solid #e8d9c8;
  border-radius: 0.75rem;

  color: #6b3f30;

  > span {
    font-size: 1rem;
  }

  > p {
    margin: 0;

    font-size: 0.78125rem;
    font-weight: 400;
    line-height: 1.25rem;
  }

  strong {
    font-weight: 700;
  }
`;

export default EmployeeTable;
