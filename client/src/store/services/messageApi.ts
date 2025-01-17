import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ApiMessage {
    id: number;
    text: string;
    read: boolean;
    senderId: number;
    receiverId: number;
    createdAt: string;
    updatedAt: string;
}

export const messageApi = createApi({
    reducerPath: 'messageApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Message', 'UnreadCount'],
    endpoints: (builder) => ({
        fetchAllMessages: builder.query<ApiMessage[], void>({
            query: () => 'api/message',
            providesTags: ['Message'],
        }),
        fetchMessagesWithUser: builder.query<ApiMessage[], { receiverId: number; lastMessageTimestamp?: string; limit?: number }>({
            query: ({ receiverId, lastMessageTimestamp, limit = 20 }) => ({
                url: `api/message/${receiverId}`,
                params: { lastMessageTimestamp, limit },
            }),
            providesTags: ['Message'],
        }),
        getUnreadCountWithUser: builder.query<number, { senderId: number }>({
            query: ({ senderId }) => ({
                url: `api/message/unread/${senderId}`,
            }),
            providesTags: (result, error, { senderId }) => [{ type: 'UnreadCount', id: senderId }],
        }),
        createMessage: builder.mutation<ApiMessage, { receiverId: number; text: string }>({
            query: ({ receiverId, text }) => ({
                url: `api/message/${receiverId}`,
                method: 'POST',
                body: { text },
            }),
            invalidatesTags: ['Message'],
        }),
        editMessage: builder.mutation<ApiMessage, { id: number; text: string }>({
            query: ({ id, text }) => ({
                url: `api/message/${id}`,
                method: 'PUT',
                body: { text },
            }),
            invalidatesTags: ['Message'],
        }),
        deleteMessage: builder.mutation<{ success: boolean }, { id: number }>({
            query: ({ id }) => ({
                url: `api/message/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Message'],
        }),
        markMessageAsRead: builder.mutation<ApiMessage, { id: number; senderId: number }>({
            query: ({ id }) => ({
                url: `api/message/${id}`,
                method: 'PATCH',
            }),
            invalidatesTags: (result, error, { senderId }) => [
                'Message',
                { type: 'UnreadCount', id: senderId },
            ],
        }),
        
    }),
});

export const {
    useFetchAllMessagesQuery,
    useFetchMessagesWithUserQuery,
    useCreateMessageMutation,
    useEditMessageMutation,
    useDeleteMessageMutation,
    useMarkMessageAsReadMutation,
    useGetUnreadCountWithUserQuery
} = messageApi;
