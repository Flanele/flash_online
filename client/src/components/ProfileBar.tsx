import messages from '../assets/messages.svg';
import notificationsImg from '../assets/notifications.svg';
import friends from '../assets/friends.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import NotificationsModal from './NotificationsModal';
import { useNotifications } from '../hooks/useNotifications';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ProfileBar: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

    const { notifications, unreadCount, isLoading, markAllAsSeen } = useNotifications();

    const handleNotificationsClose = async () => {
        await markAllAsSeen();
        setIsNotificationsModalOpen(false);
    };


    const getUserInitials = (username: string) => {
        const nameParts = username.split(' ');
        return nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : nameParts[0][0];
    };
    
    return (
        <>
            <button>
                <img src={messages} alt="messages" />
            </button>
            <button onClick={() => setIsNotificationsModalOpen(true)} className="relative">
                <img src={notificationsImg} alt="notifications" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            <button>
                <img src={friends} alt="friends" />
            </button>

            <div className={`relative flex items-center gap-2 cursor-pointer ${!isProfileModalOpen && 'group'}`} onClick={() => setIsProfileModalOpen(true)}>
                <div className="w-10 h-10 rounded-full bg-nav flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                        <img
                            src={`${apiUrl}/${user.avatar_url}`}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-lg">
                            {user?.username ? getUserInitials(user.username) : 'U'}
                        </span>
                    )}
                </div>
                <span className="text-white text-md">{user?.username}</span>

                <div className="absolute left-full bottom-full transform translate-x-2 translate-y-16 px-3 py-1 text-sm text-header bg-gray-100 border border-gray-300 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Click to edit profile
                </div>    
            </div>
            {isProfileModalOpen && <EditProfileModal onClose={() => setIsProfileModalOpen(false)} />}
            {isNotificationsModalOpen && (
                <NotificationsModal
                    onClose={handleNotificationsClose}
                    notifications={notifications || []}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default ProfileBar;
