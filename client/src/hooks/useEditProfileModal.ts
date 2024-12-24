import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useState } from "react";
import { useEditUserMutation } from "../store/services/authApi";
import { setAuth } from "../store/slices/authSlice";


const useEditProfileModal = (onClose: () => void) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const [username, setUsername] = useState(user?.username ?? '');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? null);
    const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [editUser] = useEditUserMutation();

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
            onClose();  // Закрываем модальное окно после успешного сохранения
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

    return {
        username,
        setUsername,
        avatarUrl,
        previewAvatarUrl,
        handleAvatarChange,
        handleSave,
        getUserInitials,
    };
};

export default useEditProfileModal;
