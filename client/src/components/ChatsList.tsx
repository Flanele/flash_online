import { User } from "../store/services/userApi";
import ChatListItem from "./ChatListItem";

interface ChatsListProps {
    friends: User[];
    isLoading: boolean;
    selectedFriend: number | null;
    onSelectFriend: (friendId: number) => void;
    searchTerm: string;
    setSearchTerm: (value: string) => void;
};

const ChatsList: React.FC<ChatsListProps> = ({
    friends,
    isLoading,
    selectedFriend,
    onSelectFriend,
    searchTerm,
    setSearchTerm,
}) => {
    return (
        <div className="w-1/3 flex flex-col border-r border-gray-300 pr-4">
            <h2 className="text-xl font-bold text-center mb-4">Friends</h2>
            <input
                type="text"
                placeholder="Search friends..."
                className="mb-4 p-3 border-b-2 border-text bg-transparent focus:outline-none focus:border-purple-400 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="overflow-y-auto flex-1">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    friends.length > 0 ? (
                        friends.map((user) => (
                            <ChatListItem
                                key={user.id}
                                user={user}
                                selectedFriend={selectedFriend}
                                onSelectFriend={onSelectFriend}
                            />
                        ))
                    ) : (
                        <p>No friends found</p>
                    )
                )}
            </ul>
        </div>
    );
};

export default ChatsList;

