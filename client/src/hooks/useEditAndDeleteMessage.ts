import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ApiMessage, useDeleteMessageMutation, useEditMessageMutation } from "../store/services/messageApi";
import { useState } from "react";

import socket from '../socket/socket';

const useEditAndDeleteMessage = (
    selectedFriend: number | null,
    setMessages: React.Dispatch<React.SetStateAction<ApiMessage[]>>
) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [editingMessage, setEditingMessage] = useState<ApiMessage | null>(null);

    const [deleteMessage] = useDeleteMessageMutation();
    const [editMessage] = useEditMessageMutation();

    const onDeleteMessage = async (id: number) => {
        if (!selectedFriend) return;

        try {
            await deleteMessage({ id }).unwrap();

            socket.emit("delete_message", { userId: selectedFriend, id, senderId: user?.id });

            setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const onEditMessage = (message: ApiMessage) => {
        setEditingMessage(message);
    };

    const handleSaveEdit = async (messageId: number, updatedText: string) => {
        try {
            const updatedMessage = await editMessage({ id: messageId, text: updatedText }).unwrap();

            socket.emit("edit_message", { id: messageId, text: updatedText, userId: selectedFriend, senderId: user?.id });

            setMessages((prevMessages) =>
                prevMessages.map((msg) => (msg.id === messageId ? updatedMessage : msg))
            );
            setEditingMessage(null);
        } catch (error) {
            console.error("Failed to edit message:", error);
        }
    };

    return {
        editingMessage,
        onDeleteMessage,
        onEditMessage,
        handleSaveEdit,
        setEditingMessage
    };
};

export default useEditAndDeleteMessage;