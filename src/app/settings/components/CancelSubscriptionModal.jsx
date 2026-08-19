import { useState } from "react";
import styled from "styled-components";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

function CancelSubscriptionModal({ open, onClose, onConfirm, nextBillingDate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="구독을 취소할까요?">
      <Description>
        지금 취소해도 <DateHighlight>{nextBillingDate}</DateHighlight>까지는 지금과 동일하게 이용할 수 있어요.
        이후 자동 결제가 중단되고 서비스 이용이 종료됩니다. (기존 결제 건에 대한 환불은 제공되지 않아요)
      </Description>

      <ButtonRow>
        <Button type="button" variant="unchecked_button" onClick={handleClose} disabled={isSubmitting}>
          더 이용할게요
        </Button>
        <Button type="button" variant="button_large_gray" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? "취소 처리 중..." : "구독 취소하기"}
        </Button>
      </ButtonRow>
    </Modal>
  );
}

const Description = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 13.5px; /* TODO: design token화 */
  line-height: 1.6;
  margin-top: 18px; /* TODO: design token화 */
`;

const DateHighlight = styled.strong`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-weight: 800;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px; /* TODO: design token화 */
  margin-top: 22px; /* TODO: design token화 */

  > button {
    width: auto;
    padding: 10px 18px; /* TODO: design token화 */
  }
`;

export default CancelSubscriptionModal;
