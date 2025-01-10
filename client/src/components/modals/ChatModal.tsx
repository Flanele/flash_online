import React, { useEffect, useRef, useState } from "react";
import { useSearchFriendsQuery } from "../../store/services/friendApi";
import ChatTextInput from "../ChatTextInput";
import ChatsList from "../ChatsList";
import { ApiMessage, useCreateMessageMutation, useFetchMessagesWithUserQuery } from "../../store/services/messageApi";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import { skipToken } from '@reduxjs/toolkit/query';
import socket from '../../socket/socket';
import useMessageSocket from "../../hooks/useMessageSocket";

interface ChatModalProps {
    onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
    const [selectedFriend, setSelectedFriend] = useState<number | null>(null);
    const [messages, setMessages] = useState<ApiMessage[]>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const { data: friends, isLoading } = useSearchFriendsQuery(searchTerm);

    const { data: userMessages, isLoading: isMessagesLoading } = useFetchMessagesWithUserQuery(
        selectedFriend ? { receiverId: selectedFriend } : skipToken,
        { skip: !selectedFriend }
    );

    const [createMessage] = useCreateMessageMutation();

    useEffect(() => {
        if (userMessages) {
            const sortedMessages = [...userMessages].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setMessages(sortedMessages);
        }
    }, [userMessages]);

    useMessageSocket(selectedFriend);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSelectFriend = (friendId: number) => {
        setSelectedFriend(friendId);
        setMessages([]);
    };

    const handleSendMessage = async (content: string) => {
        if (!selectedFriend) return;
        try {
            const newMessage = await createMessage({ receiverId: selectedFriend, text: content }).unwrap();

            socket.emit("new_message", { userId: selectedFriend });

            setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`bg-header rounded-lg shadow-lg ${
                    isFullScreen ? "w-full h-full" : "w-full max-w-5xl h-[90vh]"
                } p-6 relative flex`}
            >
                <button className="absolute top-4 right-4" onClick={onClose}>
                    ✕
                </button>
                <button
                    className="absolute top-4 right-16 px-3 py-1 text-sm bg-light rounded hover:bg-hover-btn hover:text-backgr"
                    onClick={() => setIsFullScreen(!isFullScreen)}
                >
                    {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                </button>
    
                <ChatsList
                    friends={friends || []}
                    isLoading={isLoading}
                    selectedFriend={selectedFriend}
                    onSelectFriend={handleSelectFriend}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
    
                <div className="w-2/3 flex flex-col pl-4">
                    {selectedFriend ? (
                        <>
                            <div className="flex items-center p-4 border-b border-gray-300">
                                {friends && friends.find((user) => user.id === selectedFriend) ? (
                                    <>
                                        <img
                                            src={`${apiUrl}/${friends.find((user) => user.id === selectedFriend)?.avatar_url}`}
                                            alt="avatar"
                                            className="w-12 h-12 rounded-full mr-4 object-cover"
                                        />
                                        <h2 className="text-lg font-bold">
                                            {friends.find((user) => user.id === selectedFriend)?.username}
                                        </h2>
                                    </>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                            <div
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                                ref={messagesContainerRef}
                            >
                                {isMessagesLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-8 h-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                                        <span className="text-purple-500">Loading...</span>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`relative flex ${
                                                msg.senderId === selectedFriend ? "justify-start" : "justify-end"
                                            }`}
                                        >
                                            <div
                                                className={`p-3 rounded-lg max-w-xs break-words relative ${
                                                    msg.senderId === selectedFriend
                                                        ? "bg-gray-200 text-black"
                                                        : "bg-purple-500 text-white"
                                                }`}
                                            >
                                                <p>{msg.text}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span
                                                        className={`text-xs ${
                                                            msg.senderId === selectedFriend
                                                                ? "text-nav"
                                                                : "text-lighter"
                                                        }`}
                                                    >
                                                        {new Date(msg.createdAt).toLocaleString()}
                                                    </span>
                                                    {msg.senderId !== selectedFriend && (
                                                        <span
                                                            className={`text-sm ${
                                                                msg.read ? "text-purple-500" : "text-gray-300"
                                                            } ml-2`}
                                                        >
                                                            {msg.read ? "✓✓" : "✓"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <ChatTextInput onSendMessage={handleSendMessage} />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-lg">Select a friend to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatModal;

