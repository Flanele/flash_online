import { useMemo, useState } from "react";
import { useFetchUsersQuery } from "../../store/services/userApi";
import { useAddFriendMutation, useDeclineFriendRequestAndDeleteFriendMutation } from "../../store/services/friendApi";
import socket from '../../socket/socket';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addFriendToPending, removeFriendFromAccepted, removeFriendFromPending } from "../../store/slices/friendsSlice";
import UserList from "../UserList";

interface FriendsModalProps {
    onClose: () => void
};

const FriendsModal: React.FC<FriendsModalProps> = ({ onClose }) => {
    const dispatch = useDispatch();
    const { accepted, pending } = useSelector((state: RootState) => state.friends);
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const { data: users, isLoading } = useFetchUsersQuery({ searchTerm });
    const [addFriend] = useAddFriendMutation();
    const [cancelOrDeleteFriend] = useDeclineFriendRequestAndDeleteFriendMutation();
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-header rounded-lg shadow-lg w-full max-w-3xl h-[90vh] p-10 relative flex flex-col">
                    <button className="absolute top-4 right-4" onClick={onClose}>
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold text-center mb-3">Friends</h2>
                    <h4 className="text-md font-bold text-center mb-8">You can find new friends:</h4>
                    <input
                        type="text"
                        value={searchTerm || ''}
                        onChange={(e) => setSearchTerm(e.target.value || null)}
                        placeholder="Search for friends"
                        className="mb-6 p-3 border-b-2 border-text bg-transparent focus:outline-none focus:border-purple-400 w-full"
                    />
                    <UserList
                        users={sortedUsers}
                        accepted={accepted}
                        pending={pending}
                        isLoading={isLoading}
                        handleAddFriend={handleAddFriend}
                        handleCancelOrDelete={handleCancelOrDelete}
                    />
                </div>
            </div>
            {enlargedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={enlargedImage}
                            alt="Enlarged avatar"
                            className="max-w-full max-h-full rounded-lg shadow-lg"
                        />
                        <button
                            className="absolute top-2 right-2 bg-header rounded-full p-2 shadow-lg"
                            onClick={() => setEnlargedImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};


export default FriendsModal;