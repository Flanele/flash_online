import React, { useState } from "react";
import { useSearchFriendsQuery } from "../../store/services/friendApi";
import ChatTextInput from "../ChatTextInput";
import ChatsList from "../ChatsList";
const apiUrl = import.meta.env.VITE_APP_API_URL;
import socket from '../../socket/socket';

import useChats from "../../hooks/useChats";
import { useDeleteMessageMutation } from "../../store/services/messageApi";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ChatModalProps {
    onClose: () => void;
    selectedFriend: number | null;
    setSelectedFriend: React.Dispatch<React.SetStateAction<number | null>>;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, selectedFriend, setSelectedFriend }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const user = useSelector((state: RootState) => state.auth.user);

    const [deleteMessage] = useDeleteMessageMutation();

    const {
        messages,
        isMessagesLoading,
        errorLoadingMessages,
        handleSendMessage,
        messagesContainerRef,
        resetChatState,
        setMessages
    } = useChats(selectedFriend);

    const { data: friends, isLoading: isFriendsLoading } = useSearchFriendsQuery(searchTerm);

    const handleSelectFriend = (friendId: number) => {
        if (selectedFriend !== friendId) {
            resetChatState(); 
        }

        setSelectedFriend(friendId);
    };

    const onDeleteMessage = async (id: number) => {
        if (!selectedFriend) return;

        try {
            await deleteMessage({ id }).unwrap();

            socket.emit('delete_message', { userId: selectedFriend, id, senderId: user?.id });

            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const onEditMessage = (id: number) => {

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
                    isLoading={isFriendsLoading}
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
                                        {friends.find((user) => user.id === selectedFriend)?.avatar_url ? (
                                            <img
                                                src={`${apiUrl}/${friends.find((user) => user.id === selectedFriend)?.avatar_url}`}
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full mr-4 object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-nav text-white flex items-center justify-center mr-4">
                                                {friends.find((user) => user.id === selectedFriend)?.username[0].toUpperCase()}
                                            </div>
                                        )}
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
                                {errorLoadingMessages ? (
                                    <div className="flex-1 flex items-center justify-center text-red-500 text-lg">
                                        <p>Error loading messages. Please try again later.</p>
                                    </div>
                                ) : isMessagesLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-8 h-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                                        <span className="text-purple-400">Loading...</span>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`relative flex ${
                                                msg.senderId === selectedFriend ? "justify-start" : "justify-end"
                                            }`}
                                        >
                                            {msg.senderId !== selectedFriend && (
                                                <div className="absolute left-[20px] top-[30px] flex space-x-3">
                                                    <button
                                                        onClick={() => onEditMessage(msg.id)}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteMessage(msg.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
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
                                                            msg.senderId === selectedFriend ? "text-nav" : "text-lighter"
                                                        }`}
                                                    >
                                                        {new Date(msg.createdAt).toLocaleString()}
                                                    </span>
                                                    {msg.senderId !== selectedFriend && (
                                                        <span
                                                            className={`text-sm ${
                                                                msg.read ? "text-gray-200" : "text-purple-600"
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

