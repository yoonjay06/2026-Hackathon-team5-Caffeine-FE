// src/components/Loading.jsx
import styled, { keyframes } from "styled-components";

function Loading({ label = "불러오는 중..." }) {
  return (
    <Wrapper>
      <Spinner />
      <span>{label}</span>
    </Wrapper>
  );
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.muted};
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid ${({ theme }) => theme.colors.line};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default Loading;