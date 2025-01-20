import { useDispatch } from 'react-redux';
import socket from '../socket/socket';
import { AppDispatch } from '../store/store';
import { useEffect } from 'react';
import { messageApi } from '../store/services/messageApi';


const useMarkMessagesSocket = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('read_message', () => {
            dispatch(messageApi.util.invalidateTags([{ type: 'Message'}]));
        })
    }, [dispatch])

    return () => {
        socket.off('read_message');
    };
};

export default useMarkMessagesSocket;