import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ApiNotification {
    id: number;
    content: string;
    type: string;
    seen: boolean;
    userId: number;
    createdAt: string;
    from: null | number;
};

export const notificationApi = createApi({
    reducerPath: 'notificationApi',
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
    tagTypes: ['Notification'],
    endpoints: (builder) => ({
        fetchNotifications: builder.query<ApiNotification[], void>({
            query: () => 'api/notification',
            providesTags: ['Notification']
        }),
        markAsSeen: builder.mutation<ApiNotification, { id: number }>({
            query: (notificationData) => ({
                url: `api/notification/${notificationData.id}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Notification'],
        }),
        deleteNotification: builder.mutation<string, { id: number }>({
            query: (notificationData) => ({
                url: `api/notification/${notificationData.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

export const { useFetchNotificationsQuery, useMarkAsSeenMutation, useDeleteNotificationMutation } = notificationApi;