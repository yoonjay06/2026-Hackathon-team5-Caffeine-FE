import styled from "styled-components";
import Button from "../../../components/Button";
import CheckIcon from "../../../assets/checkIcon.png";
import { useState, useEffect } from "react";

const BAR_COLOR = {
  business: "bg_brown",
  personal: "bg_beige",
  unclassified: "bg_gray",
};

function TaxImpactPanel({
  summary,
  estimatedVat,
  normalInputTax,
  deemedInputTax,
  transactions,
}) {
  // 중복 계산 줄이기
  const isCompleted = summary.unclassified.count === 0;

  const [isSaved, setIsSaved] = useState(false);

  const totalAmount =
    summary.business.total +
    summary.personal.total +
    summary.unclassified.total;

  const handleButtonClick = () => {
    if (isCompleted) {
      setIsSaved(true);
    } else {
      alert("아직 미분류된 지출이 있습니다.");
    }
  };

  useEffect(() => {
    setIsSaved(false);
  }, [transactions]);

  return (
    <Wrapper>
      <PanelTitle>실시간 세금 영향</PanelTitle>

      <VatBox $completed={isCompleted}>
        <Label>현재 반영된 예상 부가세</Label>
        <VatAmount>{estimatedVat.toLocaleString()}원</VatAmount>
        <SubLabel>일반 매입세액 10% + 의제매입세액 공제 포함</SubLabel>
        {/*로직 추가 미분류에따른*/}
        {isCompleted && (
          <StatGrid>
            <div>
              <StatLabel>일반 매입세액 (10%)</StatLabel>
              <StatValue>{normalInputTax.toLocaleString()}원</StatValue>
            </div>

            <div>
              <StatLabel>의제매입세액 (9/109)</StatLabel>
              <StatValue>{deemedInputTax.toLocaleString()}원</StatValue>
            </div>
          </StatGrid>
        )}
      </VatBox>

      <BreakdownTitle>분류 현황</BreakdownTitle>

      <BreakdownList>
        <BreakdownRow>
          <RowLabel>
            <Dot $color="bg_brown" />
            사업 지출
          </RowLabel>

          <RowValue>
            <Count>{summary.business.count}건</Count>
            <Amount>{summary.business.total.toLocaleString()}원</Amount>
          </RowValue>
        </BreakdownRow>

        <BreakdownRow>
          <RowLabel>
            <Dot $color="bg_beige" />
            개인 지출
          </RowLabel>

          <RowValue>
            <Count>{summary.personal.count}건</Count>
            <Amount>{summary.personal.total.toLocaleString()}원</Amount>
          </RowValue>
        </BreakdownRow>

        <UnselectedBox $completed={isCompleted}>
          <UnselectedTop>
            <RowLabel>
              <UnselectedDot $completed={isCompleted} />
              <UnselectedTitle $completed={isCompleted}>
                지출 미선택
              </UnselectedTitle>
            </RowLabel>

            <RowValue>
              <UnselectedCount $completed={isCompleted}>
                {summary.unclassified.count}건
              </UnselectedCount>

              {!isCompleted && (
                <UnselectedAmount>
                  {summary.unclassified.total.toLocaleString()}원
                </UnselectedAmount>
              )}
            </RowValue>
          </UnselectedTop>

          <UnselectedDescription $completed={isCompleted}>
            {isCompleted ? "모든 지출 구분 완료" : "사업/개인 여부 미선택"}
          </UnselectedDescription>
        </UnselectedBox>
      </BreakdownList>
      <ProgressInfo>
        <span>
          {summary.business.count + summary.personal.count}/
          {summary.business.count +
            summary.personal.count +
            summary.unclassified.count}
          건 완료
        </span>

        <span>
          {Math.round(
            ((summary.business.count + summary.personal.count) /
              (summary.business.count +
                summary.personal.count +
                summary.unclassified.count)) *
              100,
          ) || 0}
          %
        </span>
      </ProgressInfo>

      <SegmentBar>
        {["business", "personal", "unclassified"].map((key) => {
          const ratio =
            totalAmount === 0 ? 0 : (summary[key].total / totalAmount) * 100;

          if (ratio === 0) return null;

          return (
            <Segment
              key={key}
              $color={BAR_COLOR[key]}
              style={{ width: `${ratio}%` }}
            />
          );
        })}
      </SegmentBar>

      {/*로직 수정*/}
      <Notice $completed={isCompleted}>
        <Icon>{isCompleted ? <img src={CheckIcon} alt="" /> : "💡"}</Icon>

        <span>
          {isCompleted ? (
            <>
              모든 지출이 분류되었습니다! 부가세 공제를 최대로 받을 수 있어요.
            </>
          ) : (
            <>
              아직 <strong>{summary.unclassified.count}건</strong>이
              미분류입니다.
              <br />
              모두 분류하면 공제 혜택을 최대로
              <br /> 받을 수 있어요.
            </>
          )}
        </span>
      </Notice>

      <Button
        variant={
          isSaved
            ? "button_large_green"
            : isCompleted
              ? "button_large_brown"
              : "button_large_gray"
        }
        size="large"
        onClick={handleButtonClick}
      >
        {isSaved ? (
          "✓ 저장 완료!"
        ) : isCompleted ? (
          "분류 완료 및 부가세 예측 반영하기"
        ) : (
          <>
            품목 분류와 지출 선택 마치고
            <br />
            부가세 예측하기
          </>
        )}
      </Button>
      {/*절감예상 표시유무 */}
      {isCompleted && (
        <SavingText>
          절감 예상: <strong>{estimatedVat.toLocaleString()}원</strong>
        </SavingText>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.aside`
  box-sizing: border-box;
  width: 24.005vw;
  height: 100%;
  flex: 0 0 24.005vw;

  display: flex;
  flex-direction: column;

  padding: 3.529vh 1.783vw 3.529vh 1.715vw;

  background-color: #fdf9f3;
  border-left: 0.069vw solid rgba(61, 37, 30, 0.08);

  font-family: "Outfit", sans-serif;

  > button {
    box-sizing: border-box;
    width: 100%;
    min-height: 7.059vh;

    margin-top: 2.353vh;
    padding: 2.059vh 0;

    border: none;
    border-radius: 1.372vw;

    box-shadow: 0 0.588vh 0.686vw rgba(61, 37, 30, 0.25);

    text-align: center;
  }
`;

const PanelTitle = styled.p`
  box-sizing: border-box;
  width: 100%;
  height: 4.706vh;

  margin: 0;
  padding-bottom: 2.353vh;

  color: #9b6e62;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
  letter-spacing: 0.075rem;
`;

const VatBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: ${({ $completed }) => ($completed ? "27.175vh" : "16.765vh")};
  min-height: ${({ $completed }) => ($completed ? "27.175vh" : "16.765vh")};

  display: flex;
  flex-direction: column;

  margin-bottom: 2.353vh;
  padding: 2.941vh 1.715vw;

  border-radius: 1.372vw;

  background: ${({ $completed }) =>
    $completed
      ? `linear-gradient(
          164deg,
          #3d251e 8.5%,
          #5c3327 91.5%
        )`
      : `linear-gradient(
          170deg,
          #3d251e 8.5%,
          #5c3327 91.5%
        )`};
`;

const Label = styled.p`
  margin: 0;

  color: #c9a882;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
`;

const VatAmount = styled.p`
  height: 5.882vh;

  margin: 0;
  padding-top: 0.588vh;

  color: #fdf9f3;

  font-family: "Fraunces", serif;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;

  white-space: nowrap;
`;

const SubLabel = styled.p`
  height: 2.647vh;

  margin: 0;
  padding-top: 0.294vh;

  color: rgba(201, 168, 130, 0.7);

  font-family: "Outfit", sans-serif;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1rem;
`;

const StatGrid = styled.div`
  box-sizing: border-box;
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.029vw;

  margin-top: 2.353vh;
  padding-top: 2.353vh;

  border-top: 0.069vw solid rgba(255, 255, 255, 0.1);
`;

const StatLabel = styled.p`
  margin: 0;

  color: rgba(201, 168, 130, 0.7);

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;

  white-space: nowrap;
`;

const StatValue = styled.p`
  height: 3.235vh;

  margin: 0;
  padding-top: 0.294vh;

  color: #fdf9f3;

  font-family: "Outfit", sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;

  white-space: nowrap;
`;

const BreakdownTitle = styled.p`
  box-sizing: border-box;
  width: 100%;
  height: 4.824vh;

  margin: 0;
  padding: 2.471vh 1.441vw 0;

  color: #3d251e;
  background-color: #fffcf8;

  border-top: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-right: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-left: 0.069vw solid rgba(61, 37, 30, 0.07);

  border-radius: 1.372vw 1.372vw 0 0;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
`;

const BreakdownList = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: auto;

  display: flex;
  flex-direction: column;
  gap: 1.471vh;

  padding: 1.765vh 1.441vw 0;

  background-color: #fffcf8;

  border-right: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-left: 0.069vw solid rgba(61, 37, 30, 0.07);
`;

const BreakdownRow = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 3.529v;
  min-height: 3.529vh;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
`;

const RowLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.686vw;

  color: #9b6e62;
  font-weight: 400;

  white-space: nowrap;
`;

const RowValue = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;

  white-space: nowrap;
`;

const Count = styled.span`
  color: #3d251e;
  font-weight: 600;
`;

const Amount = styled.span`
  color: #9b6e62;
  font-weight: 400;
`;

const Dot = styled.span`
  width: 0.625rem;
  height: 0.625rem;
  flex-shrink: 0;

  border-radius: 0.25rem;

  background-color: ${({ theme, $color }) => theme.colors[$color]};
`;

const SegmentBar = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 5.412vh;

  display: flex;
  align-items: flex-start;

  margin-bottom: 2.353vh;
  padding: 1.765vh 1.441vw 2.353vh;

  overflow: hidden;

  background-color: #fffcf8;

  border-right: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-bottom: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-left: 0.069vw solid rgba(61, 37, 30, 0.07);

  border-radius: 0 0 1.372vw 1.372vw;

  background-image: linear-gradient(#ede8e2, #ede8e2);
  background-repeat: no-repeat;
  background-position: center 1.765vh;
  background-size: calc(100% - 2.882vw) 1.176vh;
`;

const Segment = styled.div`
  height: 1.176vh;
  flex-shrink: 0;

  background-color: ${({ theme, $color }) => theme.colors[$color]};

  &:first-child {
    border-radius: 0.686vw 0 0 0.686vw;
  }

  &:last-child {
    border-radius: 0 0.686vw 0.686vw 0;
  }

  &:only-child {
    border-radius: 0.686vw;
  }
`;

const Notice = styled.div`
  box-sizing: border-box;
  width: 100%;

  height: ${({ $completed }) => ($completed ? "9.265vh" : "12.132vh")};

  display: flex;
  align-items: flex-start;
  gap: 0.858vw;

  padding: 1.765vh 1.372vw;
  margin: 0;

  color: ${({ $completed }) => ($completed ? "#2e6b47" : "#5c3327")};

  background-color: ${({ $completed }) => ($completed ? "#e8f2ec" : "#f2ebe4")};

  border-radius: 1.029vw;

  font-size: 0.75rem;
  line-height: 1.21875rem;

  strong {
    font-weight: 700;
  }
`;

const Icon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const SavingText = styled.p`
  box-sizing: border-box;
  width: 100%;
  height: 3.527vh;

  margin: 0;
  padding-top: 1.176vh;

  color: #9b6e62;

  text-align: center;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;

  strong {
    color: #5c3327;
    font-weight: 600;
  }
`;
const UnselectedBox = styled.div`
  box-sizing: border-box;
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: 10px 12px;

  background-color: ${({ $completed }) => ($completed ? "#F0F7F2" : "#FFF0E6")};

  border-radius: 12px;
`;

const UnselectedTop = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UnselectedDot = styled.span`
  width: 0.625rem;
  height: 0.625rem;
  flex-shrink: 0;

  background-color: ${({ $completed }) => ($completed ? "#2E7D52" : "#E98252")};

  border-radius: 0.25rem;
`;

const UnselectedTitle = styled.span`
  color: ${({ $completed }) => ($completed ? "#2E7D52" : "#C05328")};

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
`;

const UnselectedCount = styled.span`
  color: ${({ $completed }) => ($completed ? "#2E7D52" : "#C05328")};

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
`;

const UnselectedAmount = styled.span`
  color: #9b6e62;

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
`;

const UnselectedDescription = styled.p`
  margin: 4px 0 0;

  color: ${({ $completed }) => ($completed ? "#6A9B7E" : "#D88662")};

  font-family: "Outfit", sans-serif;
  font-size: 0.6875rem;
  font-weight: 400;
  line-height: 1rem;
`;

const ProgressInfo = styled.div`
  width: 100%;

  display: flex;
  justify-content: space-between;

  padding: 10px 1.441vw 0;

  color: #9b6e62;

  font-family: "Outfit", sans-serif;
  font-size: 0.6875rem;
  line-height: 1rem;

  background-color: #fffcf8;

  border-right: 0.069vw solid rgba(61, 37, 30, 0.07);
  border-left: 0.069vw solid rgba(61, 37, 30, 0.07);
`;
export default TaxImpactPanel;
