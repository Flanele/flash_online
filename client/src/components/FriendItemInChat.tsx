import { useGetUserByIdQuery } from "../store/services/userApi";
const apiUrl = import.meta.env.VITE_APP_API_URL;

interface FriendItemProps {
    friendId: number;
    handleSelectFriend: (friendId: number) => void;
    selectedFriend: number | null;
};

const FriendItemInChat: React.FC<FriendItemProps> = ({ friendId, handleSelectFriend, selectedFriend }) => {
    const { data: friendData, isLoading } = useGetUserByIdQuery(friendId);

    return (
        <li
            onClick={() => handleSelectFriend(friendId)}
            className={`flex items-center p-4 mb-2 rounded-md cursor-pointer ${
                selectedFriend === friendId ? "bg-purple-500 text-white" : "bg-light"
            }`}
        >
            {isLoading ? (
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-3" />
            ) : (
                friendData?.avatar_url && (
                    <img
                        src={`${apiUrl}/${friendData.avatar_url}`}
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                        alt="avatar"
                    />
                )
            )}
            <div className="flex-grow">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <p className="font-bold">{friendData?.username}</p>
                )}
            </div>
        </li>
    );
};

export default FriendItemInChat;