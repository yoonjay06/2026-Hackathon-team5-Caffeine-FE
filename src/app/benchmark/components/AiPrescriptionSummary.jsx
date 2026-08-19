import styled from "styled-components";

function AiPrescriptionSummary({ prescriptions }) {
  return (
    <Card>
      <Title>⚡ AI 카페비서의 이번 달 경영 진단 &amp; 필수 액션 요약</Title>

      <List>
        {prescriptions.map((item) => (
          <ListItem key={item.id}>
            <ItemText>💡 {item.title}</ItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px; /* TODO: design token화 */
  background-color: #f3eee6; /* TODO: theme.js에 없는 값 */
  border: 0.8px solid rgba(61, 37, 30, 0.08);
  border-radius: ${({ theme }) => theme.radius.large};
  padding: 18px 22px; /* TODO: design token화 */
`;

const Title = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 13px; /* TODO: design token화 */
  font-weight: 800;
  letter-spacing: -0.2px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px; /* TODO: design token화 */
  list-style: none;
`;

const ListItem = styled.li`
  background-color: rgba(253, 249, 243, 0.65); /* TODO: theme.js에 없는 값 */
  border-radius: 10px;
  padding: 10px 14px; /* TODO: design token화 */
`;

const ItemText = styled.p`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-size: 12px; /* TODO: design token화 */
  font-weight: 500;
  line-height: 1.6;
`;

export default AiPrescriptionSummary;
