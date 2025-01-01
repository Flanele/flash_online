import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { ApiNotification, notificationApi } from '../store/services/notificationApi';
import { AppDispatch } from '../store/store';

const socket = io(import.meta.env.VITE_APP_SOCKET_URL); 

const useNotificationSocket = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        console.log('Подключение к сокету...');
        socket.on('connect', () => {
            console.log('Сокет подключен:', socket.id);  
        });

        socket.on('new_notification', (newNotification) => {
            console.log('Новое уведомление:', newNotification);
            dispatch(
                notificationApi.util.updateQueryData('fetchNotifications', undefined, (draft) => {
                    console.log('Кэш до изменения:', draft);
                    draft.push(newNotification);
                    console.log('Кэш после изменения:', draft);
                })
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);
};

export default useNotificationSocket;