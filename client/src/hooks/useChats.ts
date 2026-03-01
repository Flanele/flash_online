import socket from "../socket/socket";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import useChatMessages from "./useChatMessages";
import useChatScroll from "./useChatScroll";
import useChatSocketHandlers from "./useChatSocketHandlers";
import { useCallback } from "react";

const LIMIT = 20;

export const useChats = (selectedFriend: number | null) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    messages,
    setMessages,
    setPage,
    resetMessagesState,
    isMessagesLoading,
    isMessagesFetching,
    errorLoadingMessages,
    createMessage,
    markMessagesAsReadSafe,
  } = useChatMessages({
    selectedFriend,
    userId: user?.id ?? null,
    limit: LIMIT,
  });

  const {
    messagesContainerRef,
    topSentinelRef,
    setShouldScrollToBottom,
    resetScrollState,
  } = useChatScroll({
    selectedFriend,
    messagesLength: messages.length,
    isMessagesFetching,
    limit: LIMIT,
    setPage,
  });

  useChatSocketHandlers({
    selectedFriend,
    setMessages,
    markMessagesAsReadSafe,
  });

  const resetChatState = useCallback(() => {
    resetMessagesState();
    resetScrollState();
  }, [resetMessagesState, resetScrollState]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedFriend) return;

      try {
        const newMessage = await createMessage({
          receiverId: selectedFriend,
          text: content,
        }).unwrap();

        socket.emit("new_message", { userId: selectedFriend });

        setMessages((prev) =>
          prev.some((m) => m.id === newMessage.id)
            ? prev
            : [...prev, newMessage]
        );

        setShouldScrollToBottom(true);

        const c = messagesContainerRef.current;
        if (c) {
          c.scrollTop = c.scrollHeight;
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [createMessage, selectedFriend, setMessages, setShouldScrollToBottom]
  );

  return {
    messages,
    isMessagesLoading,
    isMessagesFetching,
    errorLoadingMessages,

    handleSendMessage,

    messagesContainerRef,
    topSentinelRef,

    resetChatState,
    setMessages,
  };
};

export default useChats;
