import { useCallback, useEffect, useState } from "react"
import { ApiMessage, useFetchAllMessagesQuery, useMarkMessageAsReadMutation } from "../store/services/messageApi";

const useMessages = () => {
    const [unreadMesCount, setUnreadMesCount] = useState(0);
    const { data: messages, isLoading: isMesLoading, error } = useFetchAllMessagesQuery();
    const [markAsRead] = useMarkMessageAsReadMutation();

    useEffect(() => {
        if (messages) {
            const unread = messages.filter((mes) => !mes.read).length;
            setUnreadMesCount(unread);
        }
    }, [messages]);

    const markAllAsRead = useCallback(async () => {
        if (messages) {
            const unreadMessages = messages.filter((mes) => !mes.read);
            await Promise.all(
                unreadMessages.map((mes) => markAsRead({ id: mes.id }).unwrap())
            );
            setUnreadMesCount(0);
        }
    }, [messages, markAsRead]);

    return {
        messages: messages as ApiMessage[],
        unreadMesCount,
        markAllAsRead,
        isMesLoading,
        error
    };
};

export default useMessages;