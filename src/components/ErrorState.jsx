// src/components/ErrorState.jsx
import styled from "styled-components";

function ErrorState({ message = "데이터를 불러오지 못했어요.", onRetry }) {
  return (
    <Wrapper>
      <span>{message}</span>
      {onRetry && <RetryButton onClick={onRetry}>다시 시도</RetryButton>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.colors.error};
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.line};
  }
`;

export default ErrorState;
