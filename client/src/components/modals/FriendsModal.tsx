import { useState } from "react";
import { useFetchUsersQuery } from "../../store/services/userApi";
import { useAddFriendMutation } from "../../store/services/friendApi";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_APP_SOCKET_URL); 

interface FriendsModalProps {
    onClose: () => void
};

const apiUrl = import.meta.env.VITE_APP_API_URL;

const FriendsModal: React.FC<FriendsModalProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const { data: users, isLoading, error } = useFetchUsersQuery({ searchTerm });
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
    const [addFriend] = useAddFriendMutation();

    const getInitial = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : '?';
    };

    const handleAddFriend = async (friendId: number) => {
        try {
            await addFriend({ friendId }).unwrap();

            socket.emit('new_friend', { friendId });
            console.log(`Friend request sent to user with ID: ${friendId}`);
        } catch (err) {
            console.error('Error sending friend request:', err);
        }
    };

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
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {isLoading && <p>Loading...</p>}
                        <ul>
                            {users?.map((user, index) => (
                                <li
                                    key={index}
                                    className="flex items-center p-4 rounded-md shadow-md bg-light mb-3 space-x-4"
                                >
                                    <div className="flex-shrink-0">
                                        {user.avatar_url ? (
                                            <img
                                                src={`${apiUrl}/${user.avatar_url}`}
                                                alt={`${user.username}'s avatar`}
                                                className="w-14 h-14 rounded-full cursor-pointer object-cover"
                                                onClick={() => setEnlargedImage(`${apiUrl}/${user.avatar_url}`)}
                                            />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-lighter flex items-center justify-center text-lg font-semibold text-nav">
                                                {getInitial(user.username)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-lg">{user.username}</span>
                                    </div>
                                    <button 
                                        className="bg-header px-4 py-2 rounded-md hover:bg-purple-500"
                                        onClick={() => handleAddFriend(user.id)}
                                    >
                                        Add Friend
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
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