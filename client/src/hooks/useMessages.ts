import {  useEffect, useState } from "react"
import { ApiMessage, useFetchAllMessagesQuery } from "../store/services/messageApi";

const useMessages = () => {
    const [unreadMesCount, setUnreadMesCount] = useState(0);
    const { data: messages, isLoading: isMesLoading, error } = useFetchAllMessagesQuery();

    useEffect(() => {
        if (messages) {
            const unread = messages.filter((mes) => !mes.read).length;
            setUnreadMesCount(unread);
        }
    }, [messages]);

    return {
        messages: messages as ApiMessage[],
        unreadMesCount,
        isMesLoading,
        error
    };
};

export default useMessages;