import React, { useState } from "react";
import { useSearchFriendsQuery } from "../../store/services/friendApi";
import ChatTextInput from "../ChatTextInput";
import ChatsList from "../ChatsList";
const apiUrl = import.meta.env.VITE_APP_API_URL;

import useChats from "../../hooks/useChats";
import useOnlineUsers from "../../hooks/useOnlineUsers";
import useEditAndDeleteMessage from "../../hooks/useEditAndDeleteMessage";
import ChatMessage from "../ChatMessage";

interface ChatModalProps {
    onClose: () => void;
    selectedFriend: number | null;
    setSelectedFriend: React.Dispatch<React.SetStateAction<number | null>>;
}

const ChatModal: React.FC<ChatModalProps> = ({ onClose, selectedFriend, setSelectedFriend }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
   
    const { onlineUsers, isOnline } = useOnlineUsers();

    const {
        messages,
        isMessagesLoading,
        errorLoadingMessages,
        handleSendMessage,
        messagesContainerRef,
        resetChatState,
        setMessages
    } = useChats(selectedFriend);

     const {
        editingMessage,
        onDeleteMessage,
        onEditMessage,
        handleSaveEdit,
        setEditingMessage
    } = useEditAndDeleteMessage(selectedFriend, setMessages);

    const { data: friends, isLoading: isFriendsLoading } = useSearchFriendsQuery(searchTerm);

    const handleSelectFriend = (friendId: number) => {
        if (selectedFriend !== friendId) {
            resetChatState(); 
        }

        setSelectedFriend(friendId);
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
                    isOnline={isOnline}
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
                                        <div className="flex items-center space-x-3">
                                            <h2 className="text-lg font-bold">
                                                {friends.find((user) => user.id === selectedFriend)?.username}
                                            </h2>
                                            {isOnline(selectedFriend) && (
                                                <span className="text-sm text-white bg-green-500 px-2 py-1 rounded-full mt-1">
                                                    online
                                                </span>
                                            )}
                                        </div>
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
                                        <ChatMessage
                                            key={msg.id}
                                            message={msg}
                                            isOwnMessage={msg.senderId !== selectedFriend}
                                            onEditMessage={onEditMessage}
                                            onDeleteMessage={onDeleteMessage}
                                        />
                                    ))
                                )}
                            </div>
    
                            <ChatTextInput 
                                onSendMessage={handleSendMessage} 
                                editingMessage={editingMessage}
                                onCancelEdit={() => setEditingMessage(null)}
                                onSaveEdit={handleSaveEdit}
                            />
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

