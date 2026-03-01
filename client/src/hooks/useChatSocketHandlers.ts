import { useEffect } from "react";
import { ApiMessage } from "../store/services/messageApi";
import socket from "../socket/socket";

type UseChatSocketsArgs = {
  selectedFriend: number | null;
  setMessages: React.Dispatch<React.SetStateAction<ApiMessage[]>>;
  markMessagesAsReadSafe: (ids: number[]) => Promise<void>;
};

const useChatSocketHandlers = ({
  selectedFriend,
  setMessages,
  markMessagesAsReadSafe,
}: UseChatSocketsArgs) => {
  useEffect(() => {
    if (!selectedFriend) return;

    const onNewMessage = (m: ApiMessage) => {
      if (m.receiverId !== selectedFriend && m.senderId !== selectedFriend)
        return;

      setMessages((prev) =>
        prev.some((x) => x.id === m.id) ? prev : [...prev, m]
      );

      if (m.senderId === selectedFriend) {
        markMessagesAsReadSafe([m.id]);
      }
    };

    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [selectedFriend, setMessages, markMessagesAsReadSafe]);

  useEffect(() => {
    if (!selectedFriend) return;

    const onReadMessage = ({
      userId,
      receiverId,
    }: {
      userId: number;
      receiverId: number;
    }) => {
      if (selectedFriend !== receiverId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          !msg.read && msg.senderId === userId ? { ...msg, read: true } : msg
        )
      );
    };

    socket.on("read_message", onReadMessage);
    return () => {
      socket.off("read_message", onReadMessage);
    };
  }, [selectedFriend, setMessages]);

  useEffect(() => {
    if (!selectedFriend) return;

    const onDeleteMessage = ({
      id,
      senderId,
    }: {
      id: number;
      senderId: number;
    }) => {
      if (senderId !== selectedFriend) return;
      setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    socket.on("delete_message", onDeleteMessage);
    return () => {
      socket.off("delete_message", onDeleteMessage);
    };
  }, [selectedFriend, setMessages]);

  useEffect(() => {
    if (!selectedFriend) return;

    const onEditMessage = ({
      id,
      text,
      senderId,
    }: {
      id: number;
      text: string;
      senderId: number;
      userId: number;
    }) => {
      if (senderId !== selectedFriend) return;

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text, edited: true } : m))
      );
    };

    socket.on("edit_message", onEditMessage);
    return () => {
      socket.off("edit_message", onEditMessage);
    };
  }, [selectedFriend, setMessages]);
};

export default useChatSocketHandlers;
