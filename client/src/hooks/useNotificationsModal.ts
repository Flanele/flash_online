import { useDispatch } from "react-redux";
import { useState } from "react";
import socket from '../socket/socket';
import { ApiNotification, useDeleteNotificationMutation } from "../store/services/notificationApi";
import { useAcceptFriendRequestMutation, useDeclineFriendRequestAndDeleteFriendMutation } from "../store/services/friendApi";
import { addFriendToAccepted } from "../store/slices/friendsSlice";

export const useNotificationsModal = (initialNotifications: ApiNotification[]) => {
    const [acceptFriendRequest] = useAcceptFriendRequestMutation();
    const [declineFriendRequest] = useDeclineFriendRequestAndDeleteFriendMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const dispatch = useDispatch();
    const [currentNotifications, setCurrentNotifications] = useState(initialNotifications);

    const handleAccept = async (friendId: number | null) => {
        if (friendId === null) {
            console.error("Friend ID is null. Cannot accept request.");
            return;
        }
        try {
            await acceptFriendRequest({ friendId }).unwrap();
            dispatch(addFriendToAccepted(friendId));
            socket.emit('new_friend', { friendId });
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleDecline = async (friendId: number | null) => {
        if (friendId === null) {
            console.error("Friend ID is null. Cannot decline request.");
            return;
        }
        try {
            await declineFriendRequest({ friendId }).unwrap();
            setCurrentNotifications((prev) =>
                prev.filter((notification) => notification.from !== friendId)
            );
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };

    const handleDeleteNotification = async (notificationId: number) => {
        try {
            await deleteNotification({ id: notificationId }).unwrap();
            setCurrentNotifications((prev) =>
                prev.filter((notification) => notification.id !== notificationId)
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return {
        currentNotifications,
        handleAccept,
        handleDecline,
        handleDeleteNotification
    };
};
