import { useEffect, useState } from "react";
import { ApiMessage } from "../store/services/messageApi";

interface ChatTextInputProps {
    onSendMessage: (message: string) => void; 
    editingMessage: ApiMessage | null; 
    onCancelEdit: () => void; 
    onSaveEdit: (messageId: number, updatedText: string) => void; 
};


const ChatTextInput: React.FC<ChatTextInputProps> = ({
    onSendMessage,
    editingMessage,
    onCancelEdit,
    onSaveEdit,
}) => {
    const [messageInput, setMessageInput] = useState(editingMessage?.text || "");

    useEffect(() => {
        if (editingMessage) {
            setMessageInput(editingMessage.text);
        }
    }, [editingMessage]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        if (editingMessage) {
            onSaveEdit(editingMessage.id, messageInput.trim()); 
            onCancelEdit(); 
        } else {
            onSendMessage(messageInput.trim()); 
        }
        setMessageInput("");
        const textarea = document.getElementById("messageInput") as HTMLTextAreaElement;
        if (textarea) {
            textarea.style.height = "50px";
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="p-5 border-t border-gray-300 flex items-center">
            <textarea
                id="messageInput"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 p-3 border border-gray-300 text-nav rounded-lg focus:outline-none focus:border-purple-400 resize-none overflow-hidden"
                style={{
                    minHeight: "50px",
                    maxHeight: "150px",
                    width: "100%",
                }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${Math.min(target.scrollHeight, 150)}px`;
                }}
                onKeyDown={handleKeyPress}
            />
            {editingMessage ? (
                <>
                    <button
                        onClick={handleSendMessage}
                        className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        Save
                    </button>
                    <button
                        onClick={() => {
                            onCancelEdit();
                            setMessageInput("");
                        }}
                        className="ml-2 px-4 py-2 bg-light rounded-lg hover:bg-hover-btn hover:text-nav"
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <button
                    onClick={handleSendMessage}
                    className="ml-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                    Send
                </button>
            )}
        </div>
    );
};

export default ChatTextInput;
