import styled, { css, keyframes } from "styled-components";
import Button from "../../../components/Button";

// 숫자만 입력해도 자동으로 하이픈이 들어가도록 포맷팅. CardInputModal의 formatCardNumber/formatExpiry와 동일한 패턴.
function formatPhoneNumber(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 11); // 010-1234-5678 (3-4-4)
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatBirthDate(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 8); // YYYY-MM-DD
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
}

const TAX_TYPE_OPTIONS = [
  { value: "GENERAL", label: "일반과세자 (연 매출 1억 400만 원 이상 또는 선택)" },
  { value: "SIMPLIFIED", label: "간이과세자 (연 매출 1억 400만 원 미만 소상공인)" },
  { value: "EXEMPT", label: "면세사업자 (부가가치세 면제 품목 취급 사업자)" },
];

const SAVE_BUTTON_LABEL = {
  idle: "💾 설정 저장하기",
  saving: "저장 중...",
  success: "✅ 저장 완료",
};

function BusinessInfoForm({ form, onChange, onSubmit, saveStatus = "idle", onSyncTaxType, isSyncingTaxType }) {
  const {
    business_name, representative_name, birth_date, phone_number,
    business_number, tax_type, industry_code, industry_name,
  } = form;
  const taxTypeLabel = TAX_TYPE_OPTIONS.find((option) => option.value === tax_type)?.label ?? tax_type;

  return (
    <Card>
      <TitleGroup>
        <Title>사업장 기본 정보 설정</Title>
        <Description>세무 신고 및 장부 작성에 사용되는 기본 정보입니다</Description>
      </TitleGroup>

      <FormArea>
        <FieldGroup>
          <Label>상호명</Label>
          <FieldInput
            value={business_name}
            onChange={(e) => onChange("business_name", e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>대표자명</Label>
          <FieldInput
            value={representative_name}
            onChange={(e) => onChange("representative_name", e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>대표자 연락처</Label>
          <FieldInput
            placeholder="예: 010-1234-5678"
            value={phone_number}
            onChange={(e) => onChange("phone_number", formatPhoneNumber(e.target.value))}
            inputMode="numeric"
            maxLength={13}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>대표자 생년월일</Label>
          <FieldInput
            placeholder="예: 1985-01-23"
            value={birth_date}
            onChange={(e) => onChange("birth_date", formatBirthDate(e.target.value))}
            inputMode="numeric"
            maxLength={10}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>사업자등록번호</Label>
          <BusinessNumberInput
            value={business_number}
            onChange={(e) => onChange("business_number", e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>과세 유형</Label>
          <TaxTypeRow>
            <TaxTypeValue>{taxTypeLabel}</TaxTypeValue>
            <SyncButton type="button" onClick={onSyncTaxType} disabled={isSyncingTaxType}>
              {isSyncingTaxType ? "동기화 중…" : "🔄 홈택스 동기화"}
            </SyncButton>
          </TaxTypeRow>
        </FieldGroup>

        <FieldGroup>
          <Label>업종 코드</Label>
          <IndustryRow>
            <IndustryCodeInput
              value={industry_code}
              onChange={(e) => onChange("industry_code", e.target.value)}
            />
            <IndustryName>{industry_name}</IndustryName>
          </IndustryRow>
        </FieldGroup>
      </FormArea>

      <ButtonWrapper>
        <SubmitButton
          variant="button_large_brown"
          size="large"
          onClick={onSubmit}
          disabled={saveStatus === "saving"}
          $status={saveStatus}
        >
          {SAVE_BUTTON_LABEL[saveStatus]}
        </SubmitButton>
      </ButtonWrapper>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.card_white};
  border: 0.8px solid #eae0d2; /* TODO: theme.js에 없는 값 */
  border-radius: ${({ theme }) => theme.radius.large};
  box-shadow: 0 1px 4px 0 rgba(61, 37, 30, 0.05);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 20px 24px 16px 24px; /* 피그마 스펙 */
  border-bottom: 0.8px solid #f0e8da; /* TODO: theme.js에 없는 값 */
`;

const Title = styled.h2`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  min-height: 25.24px; /* MembershipCard StatusBadge 높이(17.25px line-height + 4px*2 padding)와 맞춤 */
  color: ${({ theme }) => theme.colors.txt_brown};
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 14.5px; /* TODO: design token화 */
  font-weight: 700;
  line-height: 21.75px; /* TODO: design token화 - 150% */
  letter-spacing: -0.145px; /* TODO: design token화 */
`;

const Description = styled.p`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 4px; /* TODO: design token화 */
  color: #a07860; /* TODO: theme.js에 없는 값 */
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 12px; /* TODO: design token화 */
  font-weight: 400;
  line-height: 18px; /* TODO: design token화 - 150% */
`;

const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  height: 402.25px; /* 필드 7개가 다 안 들어가므로 내부 스크롤 처리 */
  padding: 18px 24px 12px 24px; /* 피그마 스펙 + 스크롤 시 마지막 필드 여백 확보 */
  gap: 14px; /* TODO: design token화 */

  overflow-y: auto;
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari - 스크롤바 숨김, EmployeeTable RowList와 동일 패턴 */
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding-bottom: 7px; /* TODO: design token화 */
  color: #9e7060; /* TODO: theme.js에 없는 값 */
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 11.5px; /* TODO: design token화 */
  font-weight: 500;
  line-height: 17.25px; /* TODO: design token화 - 150% */
  letter-spacing: 0.287px; /* TODO: design token화 */
`;

const FieldInput = styled.input`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  width: 100%;
  height: 41.85px;
  padding: 10px 13px; /* TODO: design token화 */
  border-radius: 10px; /* TODO: theme.js에 없는 값 (기존 radius 토큰과 불일치) */
  border: 0.8px solid #e8ddd0; /* TODO: theme.js에 없는 값 */
  background-color: #faf6f0; /* TODO: theme.js에 없는 값 */
  color: ${({ theme }) => theme.colors.txt_brown};
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 13.5px; /* TODO: design token화 */
  font-weight: 400;
  line-height: 20.25px; /* TODO: design token화 - 150% */
`;

const BusinessNumberInput = styled(FieldInput)`
  height: 41.1px;
  font-family: "JetBrains Mono", monospace;
  font-size: 13px; /* TODO: design token화 */
  line-height: 19.5px; /* TODO: design token화 - 150% */
`;

const TaxTypeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* TODO: design token화 */
  width: 100%;
`;

const TaxTypeValue = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: 41.85px;
  padding: 10px 13px; /* TODO: design token화 */
  border-radius: 10px; /* TODO: theme.js에 없는 값 (기존 radius 토큰과 불일치) */
  border: 0.8px solid #e8ddd0; /* TODO: theme.js에 없는 값 */
  background-color: #f3ede3; /* TODO: theme.js에 없는 값 - 수정 불가 필드라 IndustryName과 동일 톤 */
  color: ${({ theme }) => theme.colors.txt_brown};
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 13.5px; /* TODO: design token화 */
  font-weight: 400;
  line-height: 20.25px; /* TODO: design token화 - 150% */
`;

const SyncButton = styled.button`
  flex-shrink: 0;
  height: 41.85px;
  padding: 0 14px; /* TODO: design token화 */
  border-radius: 10px; /* TODO: theme.js에 없는 값 (기존 radius 토큰과 불일치) */
  border: 0.8px solid #c4956a;
  background-color: #f5ede0;
  color: #6b3f30;
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 12.5px; /* TODO: design token화 */
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IndustryRow = styled.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 10px; /* TODO: design token화 */
`;

const IndustryCodeInput = styled.input`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  flex-shrink: 0;
  width: 100px; /* TODO: design token화 */
  height: 41.1px;
  padding: 10px 13px; /* TODO: design token화 */
  border-radius: 10px; /* TODO: theme.js에 없는 값 (기존 radius 토큰과 불일치) */
  border: 0.8px solid #e8ddd0; /* TODO: theme.js에 없는 값 */
  background-color: #f3ede3; /* TODO: theme.js에 없는 값 */
  color: ${({ theme }) => theme.colors.txt_brown};
  font-family: "JetBrains Mono", monospace;
  font-size: 13px; /* TODO: design token화 */
  font-weight: 400;
  line-height: 19.5px; /* TODO: design token화 - 150% */
`;

const IndustryName = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 13px; /* TODO: design token화 */
  border: 0.8px solid #e8ddd0; /* TODO: theme.js에 없는 값 */
  border-radius: 10px; /* TODO: theme.js에 없는 값 (기존 radius 토큰과 불일치) */
  background-color: #f3ede3; /* TODO: theme.js에 없는 값 */
  color: #6b3d30; /* TODO: theme.js에 없는 값 */
  font-family: var(--Font-familiy-Noto, "Noto Sans KR");
  font-size: 12.5px; /* TODO: design token화 */
  font-weight: 400;
  line-height: 17.5px; /* TODO: design token화 - 140% */
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 20px 24px 22px 24px; /* 피그마 스펙 */
`;

const SavePulse = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const SubmitButton = styled(Button)`
  display: flex;
  width: 100%;
  padding: 13px 20px; /* TODO: design token화 */
  gap: 8px; /* TODO: design token화 */
  transition: background-color 0.2s ease, transform 0.15s ease;

  ${({ $status }) =>
    $status === "success" &&
    css`
      background-color: #4d9b6f !important; /* TODO: theme.js에 없는 값 - 저장 완료 피드백 */
      animation: ${SavePulse} 0.35s ease;
    `}
`;

export default BusinessInfoForm;
