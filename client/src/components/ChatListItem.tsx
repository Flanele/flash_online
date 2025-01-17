import { useGetUnreadCountWithUserQuery } from "../store/services/messageApi";
import { User } from "../store/services/userApi";

const apiUrl = import.meta.env.VITE_APP_API_URL;

interface ChatListItemProps {
    user: User;
    selectedFriend: number | null;
    onSelectFriend: (friendId: number) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ user, selectedFriend, onSelectFriend }) => {
    const { data: unreadCount, isLoading } = useGetUnreadCountWithUserQuery({ senderId: user.id }); 

    return (
        <li
            className={`p-3 cursor-pointer ${selectedFriend === user.id ? "bg-purple-500 text-white" : "bg-transparent"}`}
            onClick={() => onSelectFriend(user.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {user.avatar_url ? (
                        <img
                            src={`${apiUrl}/${user.avatar_url}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-nav text-white flex items-center justify-center mr-3">
                            {user.username[0]}
                        </div>
                    )}
                    <span>{user.username}</span>
                </div>
                {unreadCount && unreadCount > 0 ? (
                    <span className="w-5 h-5 bg-purple-400 text-white text-xs flex items-center justify-center rounded-full ml-3">
                        {unreadCount}
                    </span>
                ) : null}
            </div>
        </li>
    );
};

export default ChatListItem;

