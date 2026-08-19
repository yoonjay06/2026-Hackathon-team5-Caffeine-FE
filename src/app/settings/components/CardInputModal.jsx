import { useState } from "react";
import styled from "styled-components";
import Modal from "../../../components/Modal";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { requestBillingAuth } from "../../../lib/mockPaymentGateway";

function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// onSubmitToken(paymentToken): 실제 결제수단 변경 API 호출은 부모(SettingsPage)가 담당한다.
// 이 모달은 "가상 PG SDK가 카드를 승인하고 토큰을 발급하는" 단계까지만 책임진다.
function CardInputModal({ open, onClose, onSubmitToken }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resetAndClose = () => {
    if (isSubmitting) return;
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { paymentToken } = await requestBillingAuth({ cardNumber, expiry, cvc });
      await onSubmitToken(paymentToken);
      resetAndClose();
    } catch (err) {
      setError(err.message || "카드 등록에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={resetAndClose} title="결제 수단 등록">
      <Notice>실제로 결제가 발생하지 않는 데모용 가상 결제 위젯입니다.</Notice>

      <Form onSubmit={handleSubmit}>
        <Input
          label="카드번호"
          required
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          maxLength={19}
          inputMode="numeric"
          autoComplete="cc-number"
        />

        <Row>
          <Input
            label="유효기간"
            required
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
            inputMode="numeric"
            autoComplete="cc-exp"
          />
          <Input
            label="CVC"
            required
            placeholder="000"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
            maxLength={3}
            inputMode="numeric"
            autoComplete="cc-csc"
          />
        </Row>

        {error && <ErrorBanner>{error}</ErrorBanner>}

        <TestCardHint>
          테스트용 카드: <strong>…0002</strong>로 끝나면 등록 거절 / <strong>…0341</strong>로 끝나면 등록은 되지만
          이후 정기 결제가 실패하는 시나리오예요.
        </TestCardHint>

        <ButtonRow>
          <Button type="button" variant="unchecked_button" onClick={resetAndClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="checked_button_brown" disabled={isSubmitting}>
            {isSubmitting ? "카드 등록 중..." : "카드 등록"}
          </Button>
        </ButtonRow>
      </Form>
    </Modal>
  );
}

const Notice = styled.p`
  color: rgba(61, 37, 30, 0.5); /* TODO: theme.js에 없는 값 */
  font-size: 12px; /* TODO: design token화 */
  margin-top: 4px; /* TODO: design token화 */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px; /* TODO: design token화 */
  margin-top: 18px; /* TODO: design token화 */
`;

const Row = styled.div`
  display: flex;
  gap: 12px; /* TODO: design token화 */

  > div {
    flex: 1;
  }
`;

const ErrorBanner = styled.p`
  background-color: #fdecea; /* TODO: theme.js에 없는 값 */
  color: #b3261e; /* TODO: theme.js에 없는 값 */
  border-radius: ${({ theme }) => theme.radius.small};
  padding: 10px 12px; /* TODO: design token화 */
  font-size: 12.5px; /* TODO: design token화 */
`;

const TestCardHint = styled.p`
  background-color: #f3eee6; /* TODO: theme.js에 없는 값 */
  color: rgba(61, 37, 30, 0.55); /* TODO: theme.js에 없는 값 */
  border-radius: ${({ theme }) => theme.radius.small};
  padding: 10px 12px; /* TODO: design token화 */
  font-size: 11.5px; /* TODO: design token화 */
  line-height: 1.5;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* TODO: design token화 */
  margin-top: 6px; /* TODO: design token화 */

  > button {
    width: auto;
    padding: 10px 18px; /* TODO: design token화 */
  }
`;

export default CardInputModal;
