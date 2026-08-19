import styled from "styled-components";

const TAX_TYPE_LABEL = {
  GENERAL: "일반과세자",
  SIMPLIFIED: "간이과세자",
  EXEMPT: "면세사업자",
};

function VatReserveCard({ summary }) {
  const { month, vat_reserve_amount, vat_breakdown, vat_filing_due_date, tax_type } = summary;
  // tax_type이 확인되지 않은 사업장(UNKNOWN)은 서버가 부가세 계산 자체를 못 해 null을 내려줌
  const isUnavailable = vat_reserve_amount == null || vat_breakdown == null;

  return (
    <Card>
      <Label>{month}월 최종 예상 부가세 적립금</Label>

      {isUnavailable ? (
        <UnavailableNotice>
          과세유형이 확인되지 않아 예상 부가세를 계산할 수 없습니다. 설정 페이지에서 홈택스 동기화를 진행해주세요.
        </UnavailableNotice>
      ) : (
        <>
          <AmountRow>
            <Amount>{vat_reserve_amount.toLocaleString()}</Amount>
            <Unit>원</Unit>
          </AmountRow>
          <MetaRow>
            <MetaItem>
              <MetaLabel>부가세 신고 기한</MetaLabel>
              <MetaValue>{vat_filing_due_date}</MetaValue>
            </MetaItem>
            <Divider />
            <MetaItem>
              <MetaLabel>과세 유형</MetaLabel>
              <MetaValue>{TAX_TYPE_LABEL[tax_type] ?? "확인 필요"}</MetaValue>
            </MetaItem>
          </MetaRow>
          <BreakdownBadge>
            ✓ 매출세액 +{vat_breakdown.sales_tax.toLocaleString()}원 − 매입세액 {vat_breakdown.purchase_tax.toLocaleString()}원 − 의제매입공제 {vat_breakdown.deemed_purchase_deduction.toLocaleString()}원
          </BreakdownBadge>
        </>
      )}
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.txt_brown};
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 24px 26px; /* TODO: design token화 */
`;

const Label = styled.p`
  color: ${({ theme }) => theme.colors.txt_white};
  font-size: 12px; /* TODO: design token화 */
`;

const UnavailableNotice = styled.p`
  margin-top: 14px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.txt_white};
  opacity: 0.85;
  font-size: 12.5px; /* TODO: design token화 */
  line-height: 1.5;
`;

const AmountRow = styled.div`
  display: flex;
  align-items: baseline;
  margin: 10px 0 18px; /* TODO: design token화 */
`;

const Amount = styled.span`
  color: ${({ theme }) => theme.colors.txt_white};
  font-size: 44px; /* TODO: design token화 */
  font-weight: 800;
`;

const Unit = styled.span`
  color: ${({ theme }) => theme.colors.txt_white};
  font-size: 20px; /* TODO: design token화 */
  font-weight: 600;
  margin-left: 4px; /* TODO: design token화 */
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  padding-top: 14px; /* TODO: design token화 */
  border-top: 1px solid rgba(255,255,255,0.2);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px; /* TODO: design token화 */
`;

const MetaLabel = styled.span`
  color: ${({ theme }) => theme.colors.txt_white};
  opacity: 0.7;
  font-size: 10px; /* TODO: design token화 */
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.txt_white};
  font-size: 12px; /* TODO: design token화 */
  font-weight: 600;
`;

const Divider = styled.div`
  width: 1px;
  height: 30px; /* TODO: design token화 */
  background-color: rgba(255,255,255,0.3);
  margin: 0 16px; /* TODO: design token화 */
`;

const BreakdownBadge = styled.div`
  margin-top: 20px; /* TODO: design token화 */
  background-color: #059669; /* TODO: theme.js에 없는 값 (성공/초록) */
  border-radius: ${({ theme }) => theme.radius.medium};
  padding: 8px 12px; /* TODO: design token화 */
  color: #6EE7B7; /* TODO: theme.js에 없는 값 */
  font-size: 11px; /* TODO: design token화 */
  font-weight: 600;
`;

export default VatReserveCard;