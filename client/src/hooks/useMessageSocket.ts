import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import socket from '../socket/socket';
import { messageApi } from '../store/services/messageApi';

const useMessageSocket = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('new_message', (newMessage) => {
            console.log('Новое сообщение:', newMessage);
            dispatch(
                messageApi.util.updateQueryData('fetchAllMessages', undefined, (draft) => {
                    console.log('Кэш до изменения:', draft);
                    draft.push(newMessage);
                    console.log('Кэш после изменения:', draft);
                })
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [dispatch]);
};

export default useMessageSocket;