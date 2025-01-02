import { useAcceptFriendRequestMutation, useDeclineFriendRequestMutation } from "../../store/services/friendApi";
import { ApiNotification } from "../../store/services/notificationApi";
import socket from '../../socket/socket';

interface NotificationsModalProps {
    onClose: () => void;
    notifications: ApiNotification[];
    isLoading: boolean;
}

const NotificationsModal : React.FC<NotificationsModalProps> = ({ onClose, notifications, isLoading }) => {
    const [acceptFriendRequest] = useAcceptFriendRequestMutation();
    const [declineFriendRequest] = useDeclineFriendRequestMutation();

    const handleAccept = async (friendId: number | null) => {
        if (friendId === null) {
            console.error("Friend ID is null. Cannot accept request.");
            return;
        }
        try {
            await acceptFriendRequest({ friendId }).unwrap();
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
        } catch (error) {
            console.error("Error declining friend request:", error);
        }
    };
   
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-header rounded-lg shadow-lg w-full max-w-md p-8 relative">
                    <h2 className="text-2xl font-bold text-center mb-4">Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-header rounded-lg shadow-lg w-full max-w-xl h-[80vh] p-10 relative flex flex-col">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-center mb-5">Notifications</h2>
                {notifications && notifications.length > 0 ? (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        <ul>
                            {notifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className={`p-4 rounded-md shadow-md mb-3 ${
                                        notification.seen
                                            ? 'bg-light'
                                            : 'bg-lighter text-nav'
                                    }`}
                                >
                                    <p className="text-md font-medium">{notification.content}</p>
                                    <p className="text-sm text-nav mt-3">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                    {notification.type === "friend request" && (
                                        <div className="flex justify-end space-x-4 mt-3">
                                            <button
                                                onClick={() => handleAccept(notification.from)}
                                                className="px-3 py-1 bg-header text-white rounded-md hover:bg-purple-600 text-md"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleDecline(notification.from)}
                                                className="px-3 py-1 bg-text text-nav rounded-md hover:bg-gray-300 text-md"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-center text-gray-300">No notifications available</p>
                )}
            </div>
        </div>
    );
    
};

export default NotificationsModal;