import { useEffect, useRef, useState } from "react";
import { ApiMessage, useCreateMessageMutation, useFetchMessagesWithUserQuery, useMarkMessageAsReadMutation } from "../store/services/messageApi";
import { skipToken } from "@reduxjs/toolkit/query";
import socket from '../socket/socket';
import useReadMessagesSocket from "./useReadMessagesSocket";


const useChats = (selectedFriend: number | null) => {
    const [messages, setMessages] = useState<ApiMessage[]>([]);
    const [unreadMessageIds, setUnreadMessageIds] = useState<number[]>([]);
    const [page, setPage] = useState(1);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
    const [retryFetch, setRetryFetch] = useState(false);
    const [attempts, setAttempts] = useState(0);

    useReadMessagesSocket();

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const { data: userMessages, isLoading: isMessagesLoading, error: errorLoadingMessages } = useFetchMessagesWithUserQuery(
        selectedFriend ? { receiverId: selectedFriend, page, limit: 20 } : skipToken,
        { skip: !selectedFriend }
    );

    const [createMessage] = useCreateMessageMutation();
    const [markMessageAsRead] = useMarkMessageAsReadMutation();

    const resetChatState = () => {
        setPage(1);
        setMessages([]);
        setShouldScrollToBottom(true);
    };

    useEffect(() => {
            if (userMessages && userMessages.length === 0 && attempts < 2) {
                setRetryFetch(true);
            };
    
            if (userMessages && selectedFriend) {
                const reversedMessages = [...userMessages].reverse();
        
                setMessages((prev) => {
                    const messageIds = new Set(prev.map((msg) => msg.id));
                    const newMessages = reversedMessages.filter(
                        (msg) =>
                            !messageIds.has(msg.id) &&
                            (msg.senderId === selectedFriend || msg.receiverId === selectedFriend)
                    );
                    return [...newMessages, ...prev];
                });
        
                const allUnreadMessages = reversedMessages
                    .filter((msg) => !msg.read && msg.senderId === selectedFriend)
                    .map((msg) => msg.id);
                setUnreadMessageIds(allUnreadMessages);
        
                markMessagesAsRead(allUnreadMessages);
            }
        }, [userMessages, selectedFriend, markMessageAsRead]);
    
        useEffect(() => {
            if (retryFetch) {
    
                console.log('retry fetching');
                setAttempts(prev => prev + 1); 
                setRetryFetch(false); 
    
                setPage(1); 
            }
        }, [retryFetch]);

        const markMessagesAsRead = async (unreadIds: number[]) => {
            if (unreadIds.length === 0 || selectedFriend === null) return;
    
            try {
                await Promise.all(
                    unreadIds.map((id) =>
                        markMessageAsRead({ id, senderId: selectedFriend })
                            .unwrap()
                            .catch((err) => {
                                console.error(`Failed to mark message ${id} as read:`, err);
                            })
                    )
                );


                socket.emit("read_message", { userId: selectedFriend });
                setUnreadMessageIds([]);               
            } catch (error) {
                console.error("Failed to mark messages as read:", error);
            }
        };

        useEffect(() => {
            const handleReadMessage = ({ readMessageIds }: { readMessageIds: number[] }) => {
                setMessages((prev) =>
                    prev.map((message) =>
                        readMessageIds.includes(message.id) ? { ...message, read: true } : message
                    )
                );
            };
    
            socket.on("read_message", handleReadMessage);
    
            return () => {
                socket.off("read_message", handleReadMessage);
            };
        }, []);
    
        useEffect(() => {
            if (userMessages && selectedFriend) {
                const reversedMessages = [...userMessages].reverse();
    
                setMessages(reversedMessages);
    
                const unreadMessages = reversedMessages
                    .filter((msg) => !msg.read && msg.senderId === selectedFriend)
                    .map((msg) => msg.id);
    
                setUnreadMessageIds(unreadMessages);
    
                if (unreadMessages.length) {
                    markMessagesAsRead(unreadMessages);
                }
            }
        }, [userMessages, selectedFriend]);
    
        useEffect(() => {
            if (messagesContainerRef.current && shouldScrollToBottom) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
        }, [messages, shouldScrollToBottom]);
    
        const loadMoreMessages = () => {
            if (messagesContainerRef.current && messagesContainerRef.current.scrollTop === 0) {
                setPage((prevPage) => prevPage + 1);
            }
        };
    
        useEffect(() => {
            if (messagesContainerRef.current) {
                const container = messagesContainerRef.current;
                container.addEventListener('scroll', loadMoreMessages);
    
                const handleScroll = () => {
                    if (container.scrollTop === 0) {
                        setShouldScrollToBottom(false);  
                    }
                };
    
                container.addEventListener('scroll', handleScroll);
    
                return () => {
                    container.removeEventListener('scroll', loadMoreMessages);
                    container.removeEventListener('scroll', handleScroll);
                };
            }
        }, [messages]);

        const handleSendMessage = async (content: string) => {
            if (!selectedFriend) return;
    
            try {
                const newMessage = await createMessage({ receiverId: selectedFriend, text: content }).unwrap();
                socket.emit("new_message", { userId: selectedFriend });
                setMessages((prev) => [...prev, newMessage]);
                setShouldScrollToBottom(true);  
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        };

        useEffect(() => {
            const handleNewMessage = (newMessage: ApiMessage) => {
                if (selectedFriend && (newMessage.receiverId === selectedFriend || newMessage.senderId === selectedFriend)) {
                    setMessages((prev) => {
                        const messageIds = new Set(prev.map((msg) => msg.id));
                        if (!messageIds.has(newMessage.id)) {
                            return [...prev, newMessage];
                        }
                        return prev;
                    });
    
                    if (newMessage.senderId === selectedFriend) {
                        markMessagesAsRead([newMessage.id]);
                    }
                }
            };
    
            socket.on("new_message", handleNewMessage);
    
            return () => {
                socket.off("new_message", handleNewMessage);
            };
        }, [selectedFriend]);


        return {
            messages,
            isMessagesLoading,
            errorLoadingMessages,
            handleSendMessage,
            messagesContainerRef,
            resetChatState,
            setMessages 
        };
    
};

export default useChats;