import styled from "styled-components";
import Button from "../../../components/Button";
import { useState } from "react";
import { ITEM_CATEGORY_LABEL } from "../constants";

function ExpenseListItem({ transaction, onCategoryChange, onItemCategoryChange }) {
  const {
    transaction_id,
    icon,
    merchant_name,
    memo,
    date,
    total_amount,
    category,
    itemCategoryCode,
  } = transaction;
  const [isOpen, setIsOpen] = useState(false);
  const isItemUnclassified = itemCategoryCode === "UNCLASSIFIED";

  return (
    <Card>
      <CardTop>
        <TransactionInfo>
          <IconBox>{icon}</IconBox>

          <TextGroup>
            <Merchant>{merchant_name}</Merchant>
            <Memo>
              {memo} · {date}
            </Memo>
          </TextGroup>
        </TransactionInfo>

        {transaction.is_deemed && <DeemedBadge>의제매입</DeemedBadge>}
      </CardTop>

      <CategoryCard>
        <CategoryButton onClick={() => setIsOpen(!isOpen)} $unclassified={isItemUnclassified}>
          <span>
            {!isItemUnclassified && "✓ "}
            {ITEM_CATEGORY_LABEL[itemCategoryCode]}
          </span>

          <Arrow $isOpen={isOpen}>▼</Arrow>
        </CategoryButton>

        {isOpen && (
          <DropdownMenu>
            {Object.entries(ITEM_CATEGORY_LABEL).map(([code, label]) => (
              <DropdownItem
                key={code}
                $selected={itemCategoryCode === code}
                onClick={() => {
                  onItemCategoryChange(transaction_id, code);
                  setIsOpen(false);
                }}
              >
                {label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </CategoryCard>

      <Amount>{total_amount.toLocaleString()}원</Amount>

      <ButtonRow>
        <Button
          variant={
            category === "business"
              ? "checked_button_brown"
              : "unchecked_button"
          }
          size="small"
          onClick={() => onCategoryChange(transaction_id, "business")}
        >
          {category === "business" ? "✓ 사업 지출" : "☕ 사업 지출"}
        </Button>

        <Button
          variant={
            category === "personal"
              ? "checked_button_beige"
              : "unchecked_button"
          }
          size="small"
          onClick={() => onCategoryChange(transaction_id, "personal")}
        >
          {category === "personal" ? "✓ 개인 지출" : "👤 개인 지출"}
        </Button>
      </ButtonRow>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  min-width: 295.2px;
  height: auto;
  flex-shrink: 0;
  align-self: start;

  display: flex;
  flex-direction: column;

  padding: 16px;

  background-color: ${({ theme }) => theme.colors.card_white};

  border: 1px solid rgba(61, 37, 30, 0.07);
  border-radius: 16px;

  box-shadow:
    0 1px 2px rgba(61, 37, 30, 0.07),
    0 0 0 rgba(61, 37, 30, 0.05);
`;

const CardTop = styled.div`
  width: 100%;
  height: 40px;
  flex-shrink: 0;

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TransactionInfo = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #3d251e;
  background-color: #f2ebe4;

  border-radius: 12px;

  font-family: "Outfit", sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.75rem;
`;

const TextGroup = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Merchant = styled.p`
  max-width: 150px;
  overflow: hidden;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-family: "Outfit", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.09375rem;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Memo = styled.p`
  max-width: 150px;
  padding-top: 2px;
  overflow: hidden;

  color: ${({ theme }) => theme.colors.txt_beige};

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Amount = styled.p`
  flex-shrink: 0;
  padding-top: 12px;

  color: ${({ theme }) => theme.colors.txt_brown};

  font-family: "Outfit", sans-serif;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;

  white-space: nowrap;
`;

const ButtonRow = styled.div`
  width: 100%;
  height: 44px;
  flex-shrink: 0;

  display: flex;
  align-items: flex-end;
  gap: 8px;

  margin-top: auto;
  padding-top: 12px;

  > button {
    width: auto;
    min-width: 0;
    height: 32px;
    flex: 1;

    padding: 8px 0;
    border-radius: 12px;
  }
`;

const DeemedBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;

  color: #2e6b47;
  background: #e8f2ec;

  border-radius: 6px;

  font-family: "Outfit";
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1rem;

  white-space: nowrap;
`;

const CategoryCard = styled.div`
  position: relative;
  margin-top: 12px;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 7px 10px;

  border: none;
  border-radius: 10px;

  background-color: ${({ $unclassified }) => ($unclassified ? "#FFF0E6" : "#EAF4EE")};

  color: ${({ $unclassified }) => ($unclassified ? "#C05328" : "#2E7D52")};
  border-radius: 8px;


  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;

  cursor: pointer;
`;

const Arrow = styled.span`
  font-size: 0.55rem;

  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};

  transition: transform 0.15s;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;

  z-index: 100;

  width: 150px;

  padding: 4px 0;

  background-color: ${({ theme }) => theme.colors.card_white};

  border: 1px solid rgba(61, 37, 30, 0.1);
  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(61, 37, 30, 0.12);

  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;

  padding: 5px 10px;

  border: none;

  color: ${({ theme }) => theme.colors.txt_brown};

  background-color: ${({ $selected }) =>
    $selected ? "#C99B7D" : "transparent"};

  font-family: "Outfit", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;

  text-align: left;

  cursor: pointer;

  &:hover {
    background-color: #c99b7d;
  }
`;

export default ExpenseListItem;
