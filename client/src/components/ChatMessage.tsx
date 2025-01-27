import { ApiMessage } from "../store/services/messageApi";

interface ChatMessageProps {
    message: ApiMessage;
    isOwnMessage: boolean;
    onEditMessage: (message: ApiMessage) => void;
    onDeleteMessage: (messageId: number) => void;
}
const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    isOwnMessage,
    onEditMessage,
    onDeleteMessage,
}) => {
    return (
        <div
            className={`relative flex ${
                isOwnMessage ? "justify-end" : "justify-start"
            }`}
        >
            {isOwnMessage && (
                <div className="absolute left-[20px] top-[30px] flex space-x-3">
                    <button onClick={() => onEditMessage(message)}>✏️</button>
                    <button onClick={() => onDeleteMessage(message.id)}>🗑️</button>
                </div>
            )}
            <div
                className={`p-3 rounded-lg max-w-xs break-words relative ${
                    isOwnMessage ? "bg-purple-500 text-white" : "bg-gray-200 text-black"
                }`}
            >
                {message.edited && (
                    <span
                        className={`text-xs block mb-1 text-right ${
                            isOwnMessage ? "text-lighter" : "text-nav"
                        }`}
                    >
                        edited
                    </span>
                )}
                <p>{message.text}</p>
                <div className="flex justify-between items-center mt-2">
                    <span
                        className={`text-xs ${isOwnMessage ? "text-lighter" : "text-nav"}`}
                    >
                        {new Date(message.createdAt).toLocaleString()}
                    </span>
                    {isOwnMessage && (
                        <span
                            className={`text-sm ${
                                message.read ? "text-gray-200" : "text-purple-600"
                            } ml-2`}
                        >
                            {message.read ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;