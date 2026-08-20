import { useState } from "react";
import styled from "styled-components";
import Input from "../../../components/Input";

const EMPLOYMENT_TYPE_LABEL = {
  FULL_TIME: "4대보험 정직원",
  PART_TIME: "단시간 근로자 (주 15시간 미만)",
  FREELANCER: "3.3% 프리랜서",
};

const DETAIL_BUTTON_LABEL = {
  FULL_TIME: "임금명세서 상세",
  PART_TIME: "임금명세서 상세",
  FREELANCER: "지급내역서 상세",
};

// FREELANCER는 세법상 3.3% 고정, PART_TIME/FULL_TIME은 간이세액표 기준이라 급여에 따라 달라짐 - 서버 값으로 실효세율 역산
function getWithholdingNote(employmentType, grossPay, withholdingTax) {
  if (employmentType === "FREELANCER") return "3.3%";
  if (employmentType === "PART_TIME" && grossPay > 0) {
    return `${((withholdingTax / grossPay) * 100).toFixed(1)}%`;
  }
  return null;
}

function EmployeeRow({ employee, onUpdate, onViewPayslip, onDelete }) {
  const { employee_id, name, employment_type, hourly_wage, monthly_contracted_hours, grossPay, withholdingTax, paymentId } = employee;
  const hasTaxOwed = withholdingTax > 0;
  const withholdingNote = getWithholdingNote(employment_type, grossPay, withholdingTax);

  // 실제로는 완전 삭제가 아니라 퇴사 처리(soft delete) - status만 INACTIVE로 바뀌고 목록에서만 숨겨짐
  const handleDelete = () => {
    if (window.confirm(`${name} 직원을 퇴사 처리하시겠습니까?`)) {
      onDelete(employee_id);
    }
  };

  // 타이핑 중엔 문자열 그대로 보여주고(빈 값·선행 0 자유롭게 편집), blur 시에만 숫자로 변환해 저장
  // prop이 바뀌면(서버 재조회 등) 렌더링 중 비교해서 로컬 입력값을 리셋 - effect 대신 렌더 중 조정 패턴 사용
  const [hoursInput, setHoursInput] = useState(String(monthly_contracted_hours ?? ""));
  const [prevHours, setPrevHours] = useState(monthly_contracted_hours);
  if (monthly_contracted_hours !== prevHours) {
    setPrevHours(monthly_contracted_hours);
    setHoursInput(String(monthly_contracted_hours ?? ""));
  }

  const [wageInput, setWageInput] = useState(String(hourly_wage ?? ""));
  const [prevWage, setPrevWage] = useState(hourly_wage);
  if (hourly_wage !== prevWage) {
    setPrevWage(hourly_wage);
    setWageInput(String(hourly_wage ?? ""));
  }

  const commitHours = () => {
    const value = Number(hoursInput);
    if (hoursInput === "" || Number.isNaN(value) || value === monthly_contracted_hours) {
      setHoursInput(String(monthly_contracted_hours ?? ""));
      return;
    }
    onUpdate(employee_id, "monthly_contracted_hours", value);
  };

  const commitWage = () => {
    const value = Number(wageInput);
    if (wageInput === "" || Number.isNaN(value) || value === hourly_wage) {
      setWageInput(String(hourly_wage ?? ""));
      return;
    }
    onUpdate(employee_id, "hourly_wage", value);
  };

  return (
    <Card>
      <DeleteButton type="button" onClick={handleDelete} aria-label={`${name} 퇴사 처리`}>
        ✕
      </DeleteButton>

      <NameArea>
        <Avatar>{name[0]}</Avatar>
        <NameGroup>
          <Name>{name}</Name>
          <EmployeeNumber>직원 #{employee_id}</EmployeeNumber>
        </NameGroup>
      </NameArea>

      <TypeArea>
        <TypeSelect
          value={employment_type}
          onChange={(e) => onUpdate(employee_id, "employment_type", e.target.value)}
        >
          {Object.entries(EMPLOYMENT_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </TypeSelect>
      </TypeArea>

      <HoursArea>
        <Input
          type="number"
          unit="시간"
          value={hoursInput}
          onChange={(e) => setHoursInput(e.target.value)}
          onBlur={commitHours}
        />
      </HoursArea>

      <WageArea>
        <Input
          type="number"
          unit="원"
          value={wageInput}
          onChange={(e) => setWageInput(e.target.value)}
          onBlur={commitWage}
        />
      </WageArea>

      <GrossPayArea>
        <FieldLabel>세전 급여</FieldLabel>
        <GrossPay>{grossPay.toLocaleString()}</GrossPay>
      </GrossPayArea>

      <DetailButtonArea>
        <DetailButton
          type="button"
          disabled={!paymentId}
          onClick={() => onViewPayslip(paymentId)}
        >
          📄 {DETAIL_BUTTON_LABEL[employment_type]} &gt;
        </DetailButton>
      </DetailButtonArea>

      <TaxArea>
        <FieldLabel>원천세</FieldLabel>
        <TaxValue $hasTaxOwed={hasTaxOwed}>
          {withholdingTax.toLocaleString()}원
          {withholdingNote && <TaxNote> ({withholdingNote})</TaxNote>}
        </TaxValue>
      </TaxArea>
    </Card>
  );
}

const Card = styled.div`
  box-sizing: border-box;
  position: relative;

  width: 100%;
  min-height: 9.75625rem;

  display: grid;
  grid-template-columns: 200fr 220fr 130fr 130fr 160fr;
  grid-template-areas:
    "name type hours wage gross"
    "detail . . . tax";

  row-gap: 0.75rem;
  column-gap: 0.75rem;

  align-items: center;

  padding: 1.125rem 1.5rem;

  background-color: #ffffff;

  border: 0.05rem solid #e8d9c8;
  border-radius: 1rem;

  box-shadow: 0 0.0625rem 0.09375rem rgba(61, 37, 30, 0.04);
`;

const NameArea = styled.div`
  grid-area: name;

  display: flex;
  align-items: center;

  gap: 0.75rem;
`;

const DeleteButton = styled.button`
  box-sizing: border-box;
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;

  width: 1.5rem;
  height: 1.5rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;

  background-color: transparent;
  color: #b45309;

  font-size: 0.75rem;

  cursor: pointer;

  &:hover {
    background-color: #f5ede0;
  }
`;

const Avatar = styled.div`
  width: 2.375rem;
  height: 2.375rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background-color: #c4956a;
  color: ${({ theme }) => theme.colors.bg_white};

  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;

  letter-spacing: -0.0175rem;
`;

const NameGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Name = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.40625rem;

  letter-spacing: -0.01875rem;
`;

const EmployeeNumber = styled.p`
  margin: 0.0625rem 0 0;

  color: #8c6b5a;

  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.03125rem;
`;

const TypeArea = styled.div`
  grid-area: type;
`;

const TypeSelect = styled.select`
  box-sizing: border-box;

  width: 100%;
  height: 2.125rem;

  padding: 0 2rem 0 0.625rem;

  border: 0.05rem solid #e8d9c8;
  border-radius: 0.5rem;

  background-color: ${({ theme }) => theme.colors.bg_white};

  color: ${({ theme }) => theme.colors.txt_brown};

  font-family: "Noto Sans KR", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem;

  cursor: pointer;
`;

const HoursArea = styled.div`
  grid-area: hours;

  > div {
    width: 100%;
  }

  input {
    height: 2.1875rem;
    padding: 0.4375rem 0.625rem;

    border-radius: 0.5rem;

    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.21875rem;
  }
`;

const WageArea = styled.div`
  grid-area: wage;

  > div {
    width: 100%;
  }

  input {
    height: 2.1875rem;
    padding: 0.4375rem 0.625rem;

    border-radius: 0.5rem;

    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.21875rem;
  }
`;

const GrossPayArea = styled.div`
  grid-area: gross;

  justify-self: start;
  align-self: center;

  text-align: left;
`;

const FieldLabel = styled.p`
  margin: 0;

  color: #8c6b5a;

  font-size: 0.625rem;
  font-weight: 500;
  line-height: 0.9375rem;
`;

const GrossPay = styled.p`
  margin: 0.1875rem 0 0;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.40625rem;

  letter-spacing: -0.01875rem;
`;

const DetailButtonArea = styled.div`
  grid-area: detail;

  justify-self: start;
  align-self: center;
`;

const DetailButton = styled.button`
  box-sizing: border-box;

  height: 2.125rem;

  display: inline-flex;
  align-items: center;

  gap: 0.3125rem;

  padding: 0.4375rem 0.75rem;

  border: 0.05rem solid #c4956a;
  border-radius: 0.5rem;

  background-color: #f5ede0;
  color: #6b3f30;

  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.125rem;

  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TaxArea = styled.div`
  grid-area: tax;

  justify-self: start;
  align-self: center;

  text-align: left;
`;

const TaxValue = styled.p`
  margin: 0.1875rem 0 0;

  color: ${({ $hasTaxOwed }) =>
    $hasTaxOwed ? "#6d4c9e" : "#3a7d5c"};

  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;
`;

const TaxNote = styled.span`
  margin-left: 0.1875rem;

  color: #8c6b5a;

  font-size: 0.625rem;
  font-weight: 500;
  line-height: 0.9375rem;
`;

export default EmployeeRow;