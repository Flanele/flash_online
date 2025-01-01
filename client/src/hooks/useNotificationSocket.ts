import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notificationApi } from '../store/services/notificationApi';
import { AppDispatch } from '../store/store';
import socket from '../socket/socket';

const useNotificationSocket = () => {
    const dispatch = useDispatch<AppDispatch>();
    console.log('Клиентский сокет ID:', socket.id);

    useEffect(() => {
        console.log('Подключение к сокету...');
        socket.on('connect', () => {
            console.log('Сокет подключен:', socket.id);  
        });

        socket.on('reconnect', () => {
            console.log('Переподключение, новый сокет ID:', socket.id);
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