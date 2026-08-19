import styled from "styled-components";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Content onClick={(e) => e.stopPropagation()}>
        <Header>
          {title && <Title>{title}</Title>}

          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        {children}
      </Content>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.45);

  z-index: 1000;
`;

const Content = styled.div`
  box-sizing: border-box;

  width: 640px;
  height: 612px;

  padding: 32px;

  background-color: ${({ theme }) => theme.colors.bg_white};

  border-radius: 20px;

  box-shadow:
    0 24px 64px rgba(61, 37, 30, 0.22),
    0 4px 16px rgba(61, 37, 30, 0.1);

  overflow-y: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-family: "Noto Sans KR", sans-serif;
  font-size: 22px;
  font-weight: 800;
  line-height: 33px;

  letter-spacing: -0.88px;
`;


const CloseButton = styled.button`
  width: 1.75rem;
  height: 1.75rem;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  border: 0.05rem solid #E8D9C8;
  border-radius: 0.375rem;


  background: #F5EDE0;
  color: #6B3F30;

  font-size: 1.25rem;
  line-height: 1;

  cursor: pointer;

  &:hover {
    background: #e8d9c8;
    color: #3d251e;
  }
`;


export default Modal;