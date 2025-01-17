import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import socket from '../socket/socket';
import { messageApi } from '../store/services/messageApi';

const useMessageSocket = (selectedFriend?: number | null) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        socket.on('new_message', (newMessage) => {
            if (selectedFriend && (newMessage.receiverId === selectedFriend || newMessage.senderId === selectedFriend)) {
                dispatch(
                    messageApi.util.updateQueryData('fetchMessagesWithUser', { receiverId: selectedFriend }, (draft) => {
                        draft.push(newMessage);
                    })
                );
            }

            dispatch(
                messageApi.util.updateQueryData('fetchAllMessages', undefined, (draft) => {
                    draft.push(newMessage);
                })
            );


            if (newMessage.senderId !== selectedFriend) {
                dispatch(messageApi.util.invalidateTags([{ type: 'UnreadCount', id: newMessage.senderId }]));
            }
        });

        return () => {
            socket.off('new_message');
        };
    }, [dispatch, selectedFriend]);
};

export default useMessageSocket;