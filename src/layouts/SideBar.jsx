import styled from "styled-components";
import logo from "../assets/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../router/paths";
import { useState, useEffect } from "react";
import { getBusinessSettings } from "../api/settings";
import { useBusiness } from "../contexts/BusinessContext";

const MENU_ROUTE_MAP = {
  홈: ROUTES.DASHBOARD,
  "지출 내역 분류": ROUTES.TRANSACTIONS_REVIEW,
  "AI 세무 챗봇": ROUTES.CHAT,
  "인건비 관리": ROUTES.PAYROLL,
  "경영 분석 리포트": ROUTES.BENCHMARK,
  설정: ROUTES.SETTINGS,
};

const MENUS = [
  ["🏠", "홈"],
  ["📋", "지출 내역 분류"],
  ["👥", "인건비 관리"],
  ["📊", "경영 분석 리포트"],
  ["🤖", "AI 세무 챗봇"],
  ["⚙️", "설정"],
];

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [businessInfo, setBusinessInfo] = useState(null);
  const { business } = useBusiness();
  useEffect(() => {
    if (!business?.businessId) return;

    const loadBusinessInfo = async () => {
      try {
        const res = await getBusinessSettings(business.businessId);
        console.log(res);
        setBusinessInfo(res.data.data);
      } catch (err) {
        console.error("사업장 정보 조회 실패", err);
      }
    };

    loadBusinessInfo();
  }, [business?.businessId, location.pathname]);
  return (
    <SideBarContainer>
      <BrandWrapper>
        <LogoContainer>
          <LogoContent>
            <img src={logo} alt="카페비서 로고" />
          </LogoContent>

          <Title>카페비서</Title>
        </LogoContainer>

        <MarketWrapper>
          <MarketContainer>
            <MarketContent>{businessInfo?.business_name ?? ""}</MarketContent>
          </MarketContainer>
        </MarketWrapper>
      </BrandWrapper>

      <Navigation>
        {MENUS.map(([icon, name]) => {
          const path = MENU_ROUTE_MAP[name];
          const isActive = Boolean(path) && location.pathname === path;

          return (
            <NavigationBtn
              key={name}
              $active={isActive}
              $clickable={Boolean(path)}
              onClick={() => path && navigate(path)}
            >
              <NavigationLogo>{icon}</NavigationLogo>

              <NavigationText $active={isActive}>{name}</NavigationText>

              {isActive && <ActiveDot />}
            </NavigationBtn>
          );
        })}
      </Navigation>

      <UserInfoWrapper>
        <UserInfoContainer>
          <UserIcon>
            {businessInfo?.representative_name?.charAt(0) ?? ""}
          </UserIcon>
          <UserName>
            {businessInfo?.representative_name
              ? `${businessInfo.representative_name} 사장님`
              : ""}
          </UserName>
        </UserInfoContainer>
      </UserInfoWrapper>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div`
  display: flex;
  width: 220px;
  height: 100%;
  min-height: 0;

  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;

  border-right: 0.8px solid rgba(255, 255, 255, 0.06);
  background: ${({ theme }) => theme.colors.bg_brown};
`;

const BrandWrapper = styled.div`
  display: flex;
  padding: 28px 20px 24px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  flex-shrink: 0;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

const LogoContent = styled.div`
  display: flex;
  width: 32px;
  height: 32px;

  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  overflow: hidden;

  border-radius: 8px;
  background: #c9a882;

  img {
    display: block;
    width: 37.832px;
    height: 36px;
    flex-shrink: 0;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  color: ${({ theme }) => theme.colors.txt_white};

  font-family: Fraunces;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.4px;

  white-space: nowrap;
`;

const MarketWrapper = styled.div`
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
`;

const MarketContainer = styled.div`
  display: flex;
  width: 179.2px;
  padding: 10px 12px;

  justify-content: space-between;
  align-items: center;

  border-radius: 12px;
  border: 0.8px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.07);
`;

const MarketContent = styled.div`
  display: flex;
  height: 16px;

  flex-direction: column;
  align-items: flex-start;

  color: #fdf9f3;

  font-family: Outfit;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;

  white-space: nowrap;
`;

const Navigation = styled.div`
  display: flex;
  width: 100%;
  min-height: 0;
  flex: 1;

  padding: 0 12px;
  flex-direction: column;
  align-items: flex-start;
`;

const NavigationBtn = styled.div`
  display: flex;
  width: 195.2px;
  padding: 10px 12px;

  align-items: center;
  gap: 12px;

  border-radius: 12px;

  background: ${({ $active }) =>
    $active ? "rgba(201, 168, 130, 0.18)" : "transparent"};

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:not(:first-child) {
    margin-top: 4px;
  }
`;

const NavigationLogo = styled.p`
  display: flex;
  width: 20px;

  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const NavigationText = styled.p`
  color: ${({ $active }) => ($active ? "#c9a882" : "rgba(253, 249, 243, 0.5)")};

  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;

  white-space: nowrap;
`;

const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  flex-shrink: 0;

  margin-left: auto;

  border-radius: 50%;
  background: #c9a882;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  padding: 0 12px 20px;

  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  flex-shrink: 0;
`;

const UserInfoContainer = styled.div`
  display: flex;
  padding: 12px;

  align-items: center;
  gap: 12px;
  align-self: stretch;

  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
`;

const UserIcon = styled.div`
  display: flex;
  width: 32px;
  height: 32px;

  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  border-radius: 50%;
  background: #5c3327;

  color: #c9a882;

  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
`;

const UserName = styled.div`
  color: #fdf9f3;

  font-family: Outfit;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;

  white-space: nowrap;
`;

export default SideBar;
