import { useDispatch } from 'react-redux';
import socket from '../socket/socket';
import { AppDispatch } from '../store/store';
import { useEffect } from 'react';
import { messageApi } from '../store/services/messageApi';


const useReadMessagesSocket = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('read_message', ({ userId, receiverId }) => {
            dispatch(messageApi.util.invalidateTags([{ type: 'Message'}]));

            dispatch(messageApi.util.updateQueryData('fetchMessagesWithUser', { receiverId }, (draft) => {
                draft.forEach((message) => {
                    if (!message.read && message.senderId === userId) {
                        message.read = true;
                    }
                });
            }));
        })
    }, [dispatch])

    return () => {
        socket.off('read_message');
    };
};

export default useReadMessagesSocket;