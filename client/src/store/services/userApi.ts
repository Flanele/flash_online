import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
    id: number;
    email: string;
    username: string;
    avatar_url: string | null;
};

export const userApi = createApi({
    reducerPath: 'userApi',
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        fetchUsers: builder.query<User[], { searchTerm?: string | null }>({
            query: ({ searchTerm }) => { 
                const params = new URLSearchParams();
                if (searchTerm) params.append('searchTerm', searchTerm);
                return `api/user?${params.toString()}` },
            providesTags: ['User'],
        }),
        getUserById: builder.query<User, number>({
            query: (id) => `api/user/${id}`
        })
    }),
});

export const { useFetchUsersQuery, useGetUserByIdQuery } = userApi;
