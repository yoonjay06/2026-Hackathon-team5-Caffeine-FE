import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { sendChatMessage, getChatMessages } from "../../api/chat";
import ChatHeader from "./components/ChatHeader";
import ChatMessageList from "./components/ChatMessageList";
import ChatInputBar from "./components/ChatInputBar";
import { useBusiness } from "../../contexts/BusinessContext";

const WELCOME_MESSAGE = {
  id: "welcome",
  sender: "bot",
  text: "안녕하세요! 카페비서 AI 세무 챗봇입니다. 부가세, 원천세, 공제, 인건비 등 세무 관련 궁금한 것에 대해 질문해 주세요.",
};

// role(USER/ASSISTANT)·content를 화면 표시용 sender/text로 변환
function normalizeMessage(raw) {
  return {
    id: raw.message_id,
    sender: raw.role === "ASSISTANT" ? "bot" : "user",
    text: raw.content,
  };
}

function ChatPage() {
  const { business } = useBusiness();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isSending, setIsSending] = useState(false);

  const loadHistory = useCallback(async () => {
    const res = await getChatMessages(business.businessId);
    // 서버는 최신순(-created_at) 정렬로 내려주므로 화면 표시를 위해 역순 정렬
    const history = res.data.data.items.map(normalizeMessage).reverse();
    return history.length > 0 ? history : [WELCOME_MESSAGE];
  }, [business.businessId]);

  useEffect(() => {
    const load = async () => {
      try {
        const history = await loadHistory();
        setMessages(history);
      } catch {
        setMessages([WELCOME_MESSAGE]);
      }
    };
    load();
  }, [loadHistory]);

  const handleSend = async (text) => {
    if (!text.trim() || isSending) return;

    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const res = await sendChatMessage({ business_id: business.businessId, message: text });
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: res.data.data.answer,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: "답변을 가져오지 못했어요. 잠시 후 다시 시도해주세요.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Wrapper>
      <ChatHeader />
      <ChatCard>
        <ChatMessageList messages={messages} isSending={isSending} />
        <ChatInputBar onSend={handleSend} disabled={isSending} />
      </ChatCard>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 24px; /* TODO: design token화 */
  gap: 16px; /* TODO: design token화 */
`;

const ChatCard = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background-color: #FFFCF8; /* TODO: theme.js에 없는 값 - 인건비 관리 카드와 동일 색 */
  border: 0.8px solid ${({ theme }) => theme.colors.bg_gray};
  border-radius: ${({ theme }) => theme.radius.large};
`;

export default ChatPage;