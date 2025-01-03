interface UserListProps {
    users: any[];
    accepted: number[];
    pending: number[];
    isLoading: boolean;
    handleAddFriend: (friendId: number) => void;
    handleCancelOrDelete: (friendId: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, accepted, pending, isLoading, handleAddFriend, handleCancelOrDelete }) => {
    const apiUrl = import.meta.env.VITE_APP_API_URL;

    const getInitial = (username: string) => {
        return username ? username.charAt(0).toUpperCase() : '?';
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                        {accepted.includes(user.id) ? (
                            <button
                                className="px-4 py-2 rounded-md bg-red-400 hover:bg-red-500 text-white"
                                onClick={() => handleCancelOrDelete(user.id)}
                            >
                                Delete Friend
                            </button>
                        ) : pending.includes(user.id) ? (
                            <button
                                className="px-4 py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white"
                                onClick={() => handleCancelOrDelete(user.id)}
                            >
                                Cancel Request
                            </button>
                        ) : (
                            <button
                                className="px-4 py-2 rounded-md bg-header hover:bg-purple-500 text-white"
                                onClick={() => handleAddFriend(user.id)}
                            >
                                Add Friend
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;