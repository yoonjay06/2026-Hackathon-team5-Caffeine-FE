import styled, { css } from "styled-components";

const VARIANT_STYLES = {
  unchecked_button: css`
    background-color: ${({ theme }) => theme.colors.bg_gray};
    color: ${({ theme }) => theme.colors.txt_beige};
    display: flex;
    align-items: center;
  `,

  checked_button_brown: css`
    background-color: ${({ theme }) => theme.colors.bg_brown};
    color: ${({ theme }) => theme.colors.txt_white};
    display: flex;
    align-items: center;
  `,

  checked_button_beige: css`
    background-color: ${({ theme }) => theme.colors.bg_beige};
    color: ${({ theme }) => theme.colors.txt_brown};
  `,

  button_large_brown: css`
    background-color: ${({ theme }) => theme.colors.bg_brown};
    color: ${({ theme }) => theme.colors.txt_white};
    font-size: 0.875rem;
  `,

  button_large_green: css`
    background-color: ${({ theme }) => theme.colors.bg_green};
    color: ${({ theme }) => theme.colors.txt_white};
    font-size: 0.875rem;
  `,

button_large_gray: css`
  background-color: ${({ theme }) => theme.colors.bg_dark_gray};
  color: ${({ theme }) => theme.colors.txt_white};
  font-size: 0.75rem;
  display: flex;
`,

  filter_unchecked: css`
    background-color: #f2ebe4;
    border-radius: 12px;
    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;
    color: #9b6e62;
    font-family: Outfit;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  `,

  filter_checked: css`
    border-radius: 12px;
    background: var(--primary-brand-primary-500, #3d251e);
    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;
    color: var(--primary-brand-primary-100, #fdf9f3);
    font-family: Outfit;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  `,

  item_unclassified: css`
    background-color: #ffe2d7;
    border-radius: 12px;
    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;
    color: #9b6e62;
    text-align: center;
    font-family: Outfit;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  `,

  item_classified: css`
    background: #7b9ec5;
    border-radius: 12px;
    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;
    color: var(--primary-brand-primary-100, #fdf9f3);
    text-align: center;
    font-family: Outfit;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
  `,
};

const SIZE_STYLES = {
  small: css`
    width: 127.6px;
    padding: 10px 0;
    font-size: 14px;
  `,

  large: css`
    width: 239.2px;
    padding: 14px 0;
    font-size: 16px;
  `,
};

function Button({
  variant = "unchecked_button",
  size = "small",
  children,
  ...props
}) {
  return (
    <StyledButton $variant={variant} $size={size} {...props}>
      {children}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.radius.medium_large};
  font-weight: 600;
  cursor: pointer;

  flex-direction: column;
  justify-content: center;
  align-items: center;

  
  ${({ $size }) => SIZE_STYLES[$size]}
  ${({ $variant }) => VARIANT_STYLES[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
