import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../store/services/authApi';
import { setAuth } from '../store/slices/authSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:9000'); 

const useAuthModal = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();
    const dispatch = useDispatch();

    const validateForm = () => {
        if (!email || !password || (!isLogin && !username) || (!isLogin && !confirmPassword)) {
            setErrorMessage('All fields are required.');
            return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email.');
            return false;
        }

        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return false;
        }

        if (!isLogin && password !== confirmPassword) {
            setErrorMessage("Passwords don't match.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent, onClose: () => void) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!validateForm()) {
            return;
        }

        try {
            if (isLogin) {
                const response = await login({ email, password }).unwrap();
                dispatch(setAuth({ token: response.token, user: { id: response.id, email, role: 'user', username: response.username, avatar_url: response.avatar_url || null } }));
                localStorage.setItem('token', response.token);
            } else {               
                const response = await register({ email, password, username }).unwrap();
                socket.emit('register_user', response.id);
                dispatch(setAuth({ token: response.token, user: { id: response.id, email, role: 'user', username, avatar_url: null } }));
                localStorage.setItem('token', response.token);              
            }
            onClose(); 
        } catch (error: any) {
            setErrorMessage(error.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return {
        isLogin,
        email,
        setEmail,
        password,
        setPassword,
        username,
        setUsername,
        confirmPassword,
        setConfirmPassword,
        errorMessage,
        setErrorMessage,
        handleSubmit,
        setIsLogin,
    };
};

export default useAuthModal;
