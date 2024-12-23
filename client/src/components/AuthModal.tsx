import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../store/services/authApi';
import { setAuth } from '../store/slices/authSlice';


interface AuthModalProps {
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
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
                dispatch(setAuth({ token: response.token, user: { id: response.id, email, role: 'user', username, avatar_url: null } }));
                localStorage.setItem('token', response.token);
            }
            onClose();
        } catch (error: any) {
            setErrorMessage(error.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-header rounded-lg shadow-lg w-full max-w-md p-8 relative">
                <button className="absolute top-4 right-4" onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-center mb-4">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full text-backgr mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Username</label>
                            <input
                                type="text"
                                className="w-full text-backgr mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            className="w-full text-backgr mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full text-backgr mt-1 p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}
                    {errorMessage && (
                        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-light mt-4 text-white py-2 rounded-md hover:bg-hover-btn transition duration-200"
                    >
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <p className="text-sm">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            type="button"
                            onClick={() => {
                                setErrorMessage(null);
                                setIsLogin(!isLogin);
                            }}
                            className="text-backgr hover:underline"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
    
};

export default AuthModal;


