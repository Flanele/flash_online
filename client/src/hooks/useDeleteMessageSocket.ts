import { useDispatch } from 'react-redux';
import socket from '../socket/socket';
import { AppDispatch } from '../store/store';
import { useEffect } from 'react';
import { messageApi } from '../store/services/messageApi';


const useDeleteMessageSocket = () => {
    
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('delete_message', ({ userId, id }) => {
            console.log('delete_message received', { userId, id });
            dispatch(messageApi.util.invalidateTags([{ type: 'Message' }]));

            dispatch(
                messageApi.util.updateQueryData(
                    'fetchMessagesWithUser',
                    { receiverId: userId },
                    (draft) => {
                        const index = draft.findIndex((mes) => mes.id === id);
                        if (index !== -1) {
                            draft.splice(index, 1);
                        }
                    }
                )
            );
        });
    }, [dispatch]);

    return () => {
        socket.off('delete_message');
    };
};

export default useDeleteMessageSocket;