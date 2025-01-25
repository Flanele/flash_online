import { useDispatch } from 'react-redux';
import socket from '../socket/socket';
import { AppDispatch } from '../store/store';
import { useEffect } from 'react';
import { messageApi } from '../store/services/messageApi';


const useEditMessageSocket = () => {
    
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('edit_message', ({ userId, id }) => {
            dispatch(messageApi.util.invalidateTags([{ type: 'Message' }]));
            console.log('edit_message received', { userId, id });

            dispatch(
                messageApi.util.updateQueryData(
                    'fetchMessagesWithUser',
                    { receiverId: userId },
                    (draft) => {
                        const index = draft.findIndex((mes) => mes.id === id);
                        if (index !== -1) {
                            if (!draft[index].edited) {
                                draft[index].edited = true;
                            }
                        }
                    }
                )
            );
        });
    }, [dispatch]);

    return () => {
        socket.off('edit_message');
    };
};

export default useEditMessageSocket;