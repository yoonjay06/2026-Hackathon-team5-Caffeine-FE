import styled from "styled-components";

function Input({ label, required, error, unit, ...props }) {
  return (
    <Wrapper>
      {label && (
        <Label>
          {label}
          {required && <Required> *</Required>}
        </Label>
      )}

      <InputRow>
        <StyledInput $hasError={!!error} {...props} />
        {unit && <Unit>{unit}</Unit>}
      </InputRow>

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px; /* TODO: design token화 */
`;

const Label = styled.label`
  margin: 0;

  font-size: 12.5px;
  font-weight: 700;
  line-height: 19px;

  letter-spacing: -0.125px;

  color: ${({ theme }) => theme.colors.txt_brown};
`;

const InputRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px; /* TODO: design token화 */
  border-radius: ${({ theme }) => theme.radius.small};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.error : theme.colors.bg_gray};
  background-color: ${({ theme }) => theme.colors.bg_white};
  color: ${({ theme }) => theme.colors.txt_brown};
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Unit = styled.span`
  position: absolute;
  right: 12px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.txt_beige};
  font-size: 14px; /* TODO: design token화 */
`;

const ErrorText = styled.span`
  font-size: 12px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.error};
`;

const Required = styled.span`
  color: #b45309;
`;

export default Input;
