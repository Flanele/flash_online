import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ApiMessage,
  useCreateMessageMutation,
  useFetchMessagesWithUserQuery,
  useMarkMessageAsReadMutation,
} from "../store/services/messageApi";
import { skipToken } from "@reduxjs/toolkit/query";
import socket from "../socket/socket";

type UseChatMessagesArgs = {
  selectedFriend: number | null;
  userId?: number | null;
  limit: number;
};

const useChatMessages = ({
  selectedFriend,
  userId,
  limit,
}: UseChatMessagesArgs) => {
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [page, setPage] = useState(1);

  const queryArg = useMemo(() => {
    return selectedFriend
      ? { receiverId: selectedFriend, page, limit }
      : skipToken;
  }, [selectedFriend, page, limit]);

  const {
    data: userMessages,
    isLoading: isMessagesLoading,
    isFetching: isMessagesFetching,
    error: errorLoadingMessages,
  } = useFetchMessagesWithUserQuery(queryArg);

  const [createMessage] = useCreateMessageMutation();
  const [markMessageAsRead] = useMarkMessageAsReadMutation();

  const resetMessagesState = useCallback(() => {
    setPage(1);
    setMessages([]);
  }, []);

  useEffect(() => {
    resetMessagesState();
  }, [selectedFriend, resetMessagesState]);

  const markMessagesAsReadSafe = useCallback(
    async (unreadIds: number[]) => {
      if (!selectedFriend || !userId || unreadIds.length === 0) return;

      await Promise.all(
        unreadIds.map((id) =>
          markMessageAsRead({ id, senderId: selectedFriend })
            .unwrap()
            .catch((err) =>
              console.error(`Failed to mark message ${id} as read:`, err)
            )
        )
      );

      socket.emit("read_message", {
        userId: selectedFriend,
        receiverId: userId,
      });
    },
    [markMessageAsRead, selectedFriend, userId]
  );

  useEffect(() => {
    if (!selectedFriend || !userMessages) return;

    const incoming = [...userMessages].reverse();

    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m.id));
      const filtered = incoming.filter(
        (m) =>
          !ids.has(m.id) &&
          (m.senderId === selectedFriend || m.receiverId === selectedFriend)
      );
      return [...filtered, ...prev];
    });

    const unreadIds = incoming
      .filter((m) => !m.read && m.senderId === selectedFriend)
      .map((m) => m.id);

    markMessagesAsReadSafe(unreadIds);
  }, [userMessages, selectedFriend, markMessagesAsReadSafe]);

  return {
    messages,
    setMessages,
    page,
    setPage,
    resetMessagesState,

    isMessagesLoading,
    isMessagesFetching,
    errorLoadingMessages,

    createMessage,
    markMessagesAsReadSafe,
  };
};

export default useChatMessages;
