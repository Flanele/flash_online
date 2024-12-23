import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import { useEditUserMutation } from "../store/services/authApi";
import { setAuth } from "../store/slices/authSlice";

const apiUrl = import.meta.env.VITE_APP_API_URL;

interface EditProfileModalProps {
    onClose: () => void;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const [username, setUsername] = useState(user?.username);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [editUser, { isLoading }] = useEditUserMutation();

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPreviewAvatarUrl(imageUrl);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            if (username) {
                formData.append("username", username);
            }
            if (avatarFile) {
                formData.append("img", avatarFile);
            }

            const updatedUser = await editUser(formData).unwrap();

            if (!user?.email || !user?.role) {
                throw new Error('Email or role is missing');
            }

            const updatedUserWithOldData = {
                id: user.id,
                email: user.email,
                role: user.role,
                username: updatedUser.username,
                avatar_url: updatedUser.avatar_url,
            };

            dispatch(setAuth({ token: localStorage.getItem('token')!, user: updatedUserWithOldData }));
            setAvatarUrl(updatedUser.avatar_url ?? null);
            setPreviewAvatarUrl(null);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const getUserInitials = (username: string) => {
        const nameParts = username.split(' ');
        return nameParts.length > 1
            ? `${nameParts[0][0]}${nameParts[1][0]}`
            : nameParts[0][0];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-header rounded-lg shadow-lg w-96 p-6 relative">
                <button
                    className="absolute top-2 right-2"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-[32px] font-logo mb-4 text-center">Edit Profile</h2>
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[180px] h-[180px] rounded-full bg-nav flex items-center justify-center overflow-hidden group">
                        {previewAvatarUrl ? (
                            <img
                                src={previewAvatarUrl}
                                alt="Avatar Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : avatarUrl ? (
                            <img
                                src={`${apiUrl}/${avatarUrl}`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-[28px] font-bold text-white group-hover:opacity-0">
                                {username ? getUserInitials(username) : 'U'}
                            </span>
                        )}
    
                        <label
                            htmlFor="avatar-upload"
                            className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-sm opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity cursor-pointer"
                        >
                            Change Avatar
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <p>{user?.email}</p>
                    <div className="relative w-full">
                        <input
                            type="text"
                            id="username"
                            className="w-full border border-purple-500 text-backgr rounded px-3 py-2 text-sm pr-10 focus:ring-purple-500 focus:border-purple-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                            ✏️
                        </span>
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 text-sm bg-light rounded hover:bg-hover-btn hover:text-backgr"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default EditProfileModal;
