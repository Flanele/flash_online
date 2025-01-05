import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socket from '../socket/socket';
import { useFetchUsersQuery } from '../store/services/userApi';
import { useAddFriendMutation, useDeclineFriendRequestAndDeleteFriendMutation } from '../store/services/friendApi';
import { RootState } from '../store/store';
import { addFriendToPending, removeFriendFromAccepted, removeFriendFromPending } from '../store/slices/friendsSlice';

export const useFriendsModal = () => {
    const dispatch = useDispatch();
    const { accepted, pending } = useSelector((state: RootState) => state.friends);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [friendToDelete, setFriendToDelete] = useState<number | null>(null);

    const { data: users, isLoading } = useFetchUsersQuery({ searchTerm });
    const [addFriend] = useAddFriendMutation();
    const [cancelOrDeleteFriend] = useDeclineFriendRequestAndDeleteFriendMutation();

    const openDeleteConfirmModal = (friendId: number) => {
        setFriendToDelete(friendId);
        setIsDeleteConfirmOpen(true);
    };

    const closeDeleteConfirmModal = () => {
        setIsDeleteConfirmOpen(false);
        setFriendToDelete(null);
    };

    const handleAddFriend = async (friendId: number) => {
        try {
            await addFriend({ friendId }).unwrap();
            dispatch(addFriendToPending(friendId));
            socket.emit('new_friend', { friendId });
            console.log(`Friend request sent to user with ID: ${friendId}`);
        } catch (err) {
            console.error('Error sending friend request:', err);
        }
    };

    const handleCancelOrDelete = async (friendId: number) => {
        try {
            await cancelOrDeleteFriend({ friendId }).unwrap();
            if (accepted.includes(friendId)) {
                dispatch(removeFriendFromAccepted(friendId)); 
            } else {
                dispatch(removeFriendFromPending(friendId)); 
            }
            console.log(`Friendship request or friendship deleted for user with ID: ${friendId}`);
        } catch (err) {
            console.error('Error handling cancel or delete:', err);
        }
    };

    const handleDeleteFriend = async () => {
        if (friendToDelete === null) return;
        await handleCancelOrDelete(friendToDelete);
        closeDeleteConfirmModal();
    };

    const sortedUsers = useMemo(() => {
        if (!users?.length) return [];

        return [...users].sort((a, b) => {
            const aIsFriend = accepted.includes(a.id) || pending.includes(a.id);
            const bIsFriend = accepted.includes(b.id) || pending.includes(b.id);

            if (aIsFriend && !bIsFriend) {
                return -1;
            }
            if (!aIsFriend && bIsFriend) {
                return 1;
            }
            return 0;
        });
    }, [users, accepted, pending]);

    return {
        searchTerm,
        setSearchTerm,
        isDeleteConfirmOpen,
        friendToDelete,
        sortedUsers,
        isLoading,
        openDeleteConfirmModal,
        closeDeleteConfirmModal,
        handleAddFriend,
        handleCancelOrDelete,
        handleDeleteFriend,
        setIsDeleteConfirmOpen,
        setFriendToDelete
    };
};
