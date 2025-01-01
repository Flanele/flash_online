import { ApiNotification } from "../../store/services/notificationApi";

interface NotificationsModalProps {
    onClose: () => void;
    notifications: ApiNotification[];
    isLoading: boolean;
}

const NotificationsModal : React.FC<NotificationsModalProps> = ({ onClose, notifications, isLoading }) => {
   
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
                                    <p className="text-sm text-nav mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
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