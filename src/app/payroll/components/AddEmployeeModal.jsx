import { useState } from "react";
import styled from "styled-components";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const EMPLOYMENT_TYPES = [
  {
    value: "FULL_TIME",
    label: "4대보험 정직원",
    desc: "국민연금·건강·고용·산재보험 가입",
  },
  {
    value: "PART_TIME",
    label: "단시간 근로자 (주 15시간 미만)",
    desc: "4대보험 중 일부 적용 제외, 주휴수당 없음",
  },
  {
    value: "FREELANCER",
    label: "3.3% 프리랜서",
    desc: "사업소득세 3.3% 원천징수",
  },
];

const INITIAL_FORM = {
  name: "",
  employment_type: "FULL_TIME",
  hourly_wage: 10320,
  monthly_contracted_hours: "",
  work_started_at: "", // TODO: 폼에 입사일 입력 필드(date input) 추가 필요 - 현재 UI엔 없음
  resident_id_front: "", // TODO: employees 응답에 필드가 없음 - 서버가 저장/사용하는지 백엔드 확인 필요
  is_employment_insured: false, // TODO: employees 응답에 필드가 없음 - 서버가 저장/사용하는지 백엔드 확인 필요
};

function AddEmployeeModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid = form.name.trim() && form.hourly_wage && form.monthly_contracted_hours;

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({
      name: form.name,
      employment_type: form.employment_type,
      hourly_wage: form.hourly_wage,
      monthly_contracted_hours: form.monthly_contracted_hours,
      work_started_at: form.work_started_at || new Date().toISOString().slice(0, 10),
    });

    setForm(INITIAL_FORM);
  };

  return (
    <Modal open={open} onClose={onClose} title="신규 직원 등록">
      <Content>
        <Description>
          직원 정보와 고용 형태를 입력하면 세금 및 보험료가 자동 계산됩니다.
        </Description>

        <Divider />

        <FormArea>
          <Input
            label="직원 성명"
            required
            placeholder="예: 홍길동"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <FieldGroup>
            <FieldLabel>
              고용 형태 선택 <Required>*</Required>
            </FieldLabel>

            <TypeCardList>
              {EMPLOYMENT_TYPES.map((type) => {
                const selected = form.employment_type === type.value;

                return (
                  <TypeCard
                    key={type.value}
                    type="button"
                    $selected={selected}
                    onClick={() => handleChange("employment_type", type.value)}
                  >
                    <Radio $selected={selected}>
                      {selected && <RadioDot />}
                    </Radio>

                    <TypeContent>
                      <TypeCardLabel $selected={selected}>
                        {type.label}
                      </TypeCardLabel>

                      <TypeCardDesc $selected={selected}>
                        {type.desc}
                      </TypeCardDesc>
                    </TypeContent>
                  </TypeCard>
                );
              })}
            </TypeCardList>
          </FieldGroup>
                      {form.employment_type === "PART_TIME" && (
              <InsuranceOption
                type="button"
                $checked={form.is_employment_insured}
                onClick={() =>
                  handleChange("is_employment_insured", !form.is_employment_insured)
                }
              >
                <CheckBox $checked={form.is_employment_insured}>
                  {form.is_employment_insured && "✓"}
                </CheckBox>

                <InsuranceContent>
                  <InsuranceTitle $checked={form.is_employment_insured}>
                    근로계약 기간 3개월 이상 (고용보험 적용 대상)
                  </InsuranceTitle>

                  <InsuranceDesc $checked={form.is_employment_insured}>
                    근로계약서 상 계약기간이 3개월 이상(또는 기간의 정함이 없는
                    경우)이면 고용보험 가입 대상입니다.
                  </InsuranceDesc>

                  {form.is_employment_insured && (
                    <InsuranceIncluded>
                      <SmallCheck>✓</SmallCheck>
                      고용보험료가 급여 계산에 포함됩니다.
                    </InsuranceIncluded>
                  )}
                </InsuranceContent>
              </InsuranceOption>
            )}

          <TwoColumn>
            <InputBox>
              <Input
                label="약정 시급"
                required
                type="number"
                unit="원"
                value={form.hourly_wage}
                onChange={(e) =>
                  handleChange("hourly_wage", Number(e.target.value))
                }
              />

              <HelperText>2026년 최저시급 10,320원</HelperText>
            </InputBox>

            <InputBox>
              <Input
                label="월 약정 근무시간"
                required
                type="number"
                unit="시간"
                placeholder="예: 209"
                value={form.monthly_contracted_hours}
                onChange={(e) =>
                  handleChange("monthly_contracted_hours", Number(e.target.value))
                }
              />

              <HelperText>주 40시간 기준 월 209시간</HelperText>
            </InputBox>
          </TwoColumn>

          <ResidentArea>
            <ResidentLabel>
              주민등록번호 앞자리
              <OptionalBadge>선택</OptionalBadge>
            </ResidentLabel>

            <Input
              placeholder="990101-1******"
              value={form.resident_id_front}
              onChange={(e) => handleChange("resident_id_front", e.target.value)}
            />

            <HelperText>
              간이세액표 적용 시 필요합니다. 저장 후 암호화됩니다.
            </HelperText>
          </ResidentArea>
        </FormArea>

        <Divider />

        <ButtonRow>
          <Button variant="unchecked_button" size="large" onClick={onClose}>
            취소
          </Button>

          <Button
            variant="button_large_brown"
            size="large"
            onClick={handleSubmit}
            disabled={!isValid}
          >
            ＋ 직원 등록 완료하기
          </Button>
        </ButtonRow>
      </Content>
    </Modal>
  );
}

const Content = styled.div`
  width: 100%;

  font-family: "Noto Sans KR", sans-serif;
`;

const Description = styled.p`
  margin: 0;
  padding-top: 0.375rem;

  color: #8c6b5a;

  font-size: 0.8125rem;
  font-weight: 400;
  line-height: 1.3rem;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.0625rem;

  margin-top: 1.75rem;

  background-color: #e8d9c8;
`;

const FormArea = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 1.375rem;

  padding-top: 1.5rem;

  /* 공용 Input 크기 보정 */
  > div {
    width: 100%;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.4375rem;
`;

const FieldLabel = styled.p`
  margin: 0;

  color: #3d251e;

  font-size: 0.78125rem;
  font-weight: 700;
  line-height: 1.171875rem;

  letter-spacing: -0.0078rem;
`;

const Required = styled.span`
  color: #b45309;
`;

const TypeCardList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 0.5rem;
`;

const TypeCard = styled.button`
  box-sizing: border-box;

  width: 100%;
  height: 4.1625rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;

  gap: 0.75rem;

  padding: 0.75rem 1rem;

  border: 0.05rem solid
    ${({ $selected }) => ($selected ? "#3d251e" : "#e8d9c8")};

  border-radius: 0.75rem;

  background-color: ${({ $selected }) => ($selected ? "#3d251e" : "#ffffff")};

  text-align: left;

  cursor: pointer;
`;

const Radio = styled.div`
  box-sizing: border-box;

  width: 1.125rem;
  height: 1.125rem;

  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 0.1rem solid #c4956a;
  border-radius: 50%;
`;

const RadioDot = styled.div`
  width: 0.4375rem;
  height: 0.4375rem;

  border-radius: 50%;

  background: var(--primary-brand-primary-100, #fdf9f3);
`;

const TypeContent = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

const TypeCardLabel = styled.p`
  margin: 0;

  color: ${({ $selected }) => ($selected ? "#fdf9f3" : "#3d251e")};

  font-size: 0.84375rem;
  font-weight: 700;
  line-height: 1.265625rem;

  letter-spacing: -0.016875rem;
`;

const TypeCardDesc = styled.p`
  margin: 0.125rem 0 0;

  color: ${({ $selected }) =>
    $selected ? "rgba(253, 249, 243, 0.7)" : "#8c6b5a"};

  font-size: 0.71875rem;
  font-weight: 400;
  line-height: 1.078125rem;
`;

const TwoColumn = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 1rem;
`;

const InputBox = styled.div`
  min-width: 0;
`;

const HelperText = styled.p`
  margin: 0.3125rem 0 0;

  color: #8c6b5a;

  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1.03125rem;
`;

const ResidentArea = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const ResidentLabel = styled.div`
  display: flex;
  align-items: center;

  gap: 0.375rem;

  margin-bottom: 0.4375rem;

  color: #3d251e;

  font-size: 0.78125rem;
  font-weight: 700;
`;

const OptionalBadge = styled.span`
  padding: 0.125rem 0.4375rem;

  border-radius: 1.25rem;

  background-color: #f5ede0;
  color: #8c6b5a;

  font-size: 0.625rem;
  font-weight: 600;
  line-height: 0.9375rem;
`;

const ButtonRow = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 190fr 374fr;

  gap: 0.75rem;

  padding-top: 1.5rem;

  > button {
    width: 100%;
    height: 3.0625rem;

    padding: 0.8125rem 0;

    font-size: 0.875rem;
    line-height: 1.3125rem;
  }
`;
const InsuranceOption = styled.button`
  box-sizing: border-box;

  width: 100%;

  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  padding: 0.75rem 1rem;

  text-align: left;
  cursor: pointer;

  border: 0.05rem solid ${({ $checked }) => ($checked ? "#76B38C" : "#E8D9C8")};

  border-radius: 0.75rem;

  background-color: ${({ $checked }) => ($checked ? "#EAF6EE" : "#FFFFFF")};
`;

const CheckBox = styled.span`
  box-sizing: border-box;

  width: 1.125rem;
  height: 1.125rem;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0.1rem solid ${({ $checked }) => ($checked ? "#4E9A69" : "#C4956A")};

  border-radius: 0.25rem;

  background-color: ${({ $checked }) => ($checked ? "#4E9A69" : "transparent")};

  color: #ffffff;

  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
`;

const InsuranceContent = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

const InsuranceTitle = styled.p`
  margin: 0;

  color: ${({ $checked }) => ($checked ? "#34734B" : "#3D251E")};

  font-size: 0.78125rem;
  font-weight: 700;
  line-height: 1.171875rem;

  letter-spacing: -0.0078125rem;
`;

const InsuranceDesc = styled.p`
  margin: 0.25rem 0 0;

  color: ${({ $checked }) => ($checked ? "#5F9270" : "#8C6B5A")};

  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1rem;
`;

const InsuranceIncluded = styled.div`
  display: flex;
  padding-top: 0.625rem;
  align-items: center;
  gap: 0.375rem;
  align-self: stretch;
  color: #2a6347;
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 0.71875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5;

  border-top: 0.05rem solid rgba(58, 125, 92, 0.20);
`;

const SmallCheck = styled.span`
  width: 0.75rem;
  height: 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.125rem;

  background-color: #22b455;
  color: #ffffff;

  font-size: 0.5rem;
  font-weight: 700;
`;

export default AddEmployeeModal;
