import styled from "styled-components";
import searchIcon from "../../../assets/search-icon.png";

// TODO: 대화 내역 검색 API 백엔드 미구현 - 추가되면 연동 필요
function ChatHeader() {
  return (
    <Wrapper>
      <TitleGroup>
        <Eyebrow>챗봇의 모든 답변은 실제 세법 조항에 근거합니다</Eyebrow>
        <Title>AI 세무 챗봇</Title>
      </TitleGroup>

      <SearchBox>
        <SearchInput
          placeholder="검색 기능 준비 중이에요"
          disabled
        />
        <SearchIcon src={searchIcon} alt="" />
      </SearchBox>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px; /* TODO: design token화 */
  background-color: ${({ theme }) => theme.colors.bg_white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.txt_brown}; /* TODO: 실측값 그대로 - 진한 색 구분선, 의도된 것인지 확인 필요 */
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px; /* TODO: design token화 */
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.txt_beige};
  font-size: 12px; /* TODO: design token화 */
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 24px; /* TODO: design token화 */
  font-weight: 700;
  font-family: Fraunces;
  font-style: normal;
  line-height: 32px; /* 133.333% */
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* TODO: design token화 */
  width: 288px; /* TODO: design token화 */
  padding: 10px 16px; /* TODO: design token화 */
  border-radius: 999px;
  background-color: #F7F2EB; /* TODO: theme.js에 없는 값 */
  border: 0.8px solid ${({ theme }) => theme.colors.bg_gray};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px; /* TODO: design token화 */
  color: ${({ theme }) => theme.colors.txt_brown};

  &::placeholder {
    color: #A88980; /* TODO: theme.js에 없는 값 */
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const SearchIcon = styled.img`
  flex-shrink: 0;
  width: 14px; /* TODO: 실제 이미지 비율 확인 후 조정, design token화 */
  height: 14px;
  object-fit: contain;
`;

export default ChatHeader;