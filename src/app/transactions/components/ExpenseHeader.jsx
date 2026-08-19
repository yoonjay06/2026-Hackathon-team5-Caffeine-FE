import { useState } from "react";
import styled from "styled-components";
import Button from "../../../components/Button";
import notice from "../../../assets/notice.png";
import { useBusiness } from "../../../contexts/BusinessContext";
import { exportTransactions } from "../../../api/transactions";

function ExpenseHeader({ year, month }) {
  const { business } = useBusiness();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async () => {
    setIsDownloading(true);
    try {
      const res = await exportTransactions(business.businessId, year, month);
      const blob = new Blob([res.data], { type: "text/csv; charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `caffeine_transactions_${year}-${String(month).padStart(2, "0")}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("CSV 파일을 다운로드하는 중 오류가 발생했어요.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Wrapper>
      <TitleGroup>
        <Eyebrow>2026년 8월 · 부가세 신고 준비</Eyebrow>
        <Title>지출 내역 분류</Title>
      </TitleGroup>
      <CsvArea>
        <CsvButton
          variant="unchecked_button"
          size="small"
          onClick={handleExport}
          disabled={isDownloading}
        >
          {isDownloading ? "내보내는 중..." : "CSV 파일 내보내기"}
          <img src={notice} alt="" />
        </CsvButton>
      </CsvArea>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  padding: 16px 32px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 0.8px solid rgba(61, 37, 30, 0.08);
  background: #fdf9f3;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Eyebrow = styled.p`
  color: ${({ theme }) => theme.colors.txt_beige};
  font-family: Outfit;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.txt_brown};
  font-family: Fraunces;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px; /* 133.333% */
`;

const CsvArea = styled.div`
  position: relative;

  display: flex;
  align-items: center;
`;

const CsvButton = styled(Button)`
  width: 141px;
  height: 36px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding: 8px;

  color: #3d251e;
  text-align: center;
  font-family: Outfit;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px; /* 142.857% */

  img {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
`;

export default ExpenseHeader;
