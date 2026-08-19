import { Navigate, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useBusiness } from "../contexts/BusinessContext";
import SideBar from "./SideBar";

function AppLayout() {
  const { business } = useBusiness();

  if (!business.isSetupComplete && window.location.pathname !== "/app/setup/business") {
    return <Navigate to="/app/setup/business" replace />;
  }

  return (
    <Container>
      <SideBar />
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh; /* min-height → height: 뷰포트에 고정, 내부에서만 스크롤 */
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.bg_white};
  color: ${({ theme }) => theme.colors.txt_brown};
`;

const Content = styled.main`
  flex: 1;
  min-height: 0; /* 스크롤 체인 1단계: 이거 없으면 자식 overflow가 안 먹음 */
  display: flex;
  flex-direction: column;
  overflow: hidden;

`;

export default AppLayout;