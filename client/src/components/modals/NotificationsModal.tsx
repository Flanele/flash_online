import { ApiNotification } from "../../store/services/notificationApi";
import { useNotificationsModal } from "../../hooks/useNotificationsModal";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface NotificationsModalProps {
    onClose: () => void;
    notifications: ApiNotification[];
    isLoading: boolean;
}

const NotificationsModal : React.FC<NotificationsModalProps> = ({ onClose, notifications, isLoading }) => {
    const { currentNotifications, handleAccept, handleDecline, handleDeleteNotification } = useNotificationsModal(notifications);
    const { accepted } = useSelector((state: RootState) => state.friends);
   
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
                {currentNotifications && currentNotifications.length > 0 ? (
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        <ul>
                            {currentNotifications.map((notification, index) => (
                                <li
                                    key={index}
                                    className={`p-4 rounded-md shadow-md mb-3 ${
                                        notification.seen
                                            ? 'bg-light'
                                            : 'bg-lighter text-nav'
                                    }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-md font-medium">{notification.content}</p>
                                            <p className="text-sm text-nav mt-3">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            className="hover:text-red-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {notification.type === "friend request" 
                                        && notification.from !== null 
                                        && !accepted.includes(notification.from) 
                                        && (
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