import messages from '../assets/messages.svg';
import notifications from '../assets/notifications.svg';
import friends from '../assets/friends.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useCallback, useState } from 'react';
import EditProfileModal from './EditProfileModal';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ProfileBar: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
            <button>
                <img src={notifications} alt="notifications" />
            </button>
            <button>
                <img src={friends} alt="friends" />
            </button>

            <div className={`relative flex items-center gap-2 cursor-pointer ${!isModalOpen && 'group'}`} onClick={() => setIsModalOpen(true)}>
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
            {isModalOpen && <EditProfileModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default ProfileBar;
