import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: 'authApi',
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
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string; avatar_url?: string | null; username: string }, { email: string; password: string }>({
            query: (credentials) => ({
                url: 'api/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<{ token: string; avatar_url?: string | null; username: string }, { email: string; password: string; username: string }>({
            query: (userData) => ({
                url: 'api/user/registration',
                method: 'POST',
                body: userData,
            }),
        }),
        checkAuth: builder.query<{ token: string; email: string; role: string; username: string; avatar_url?: string }, void>({
            query: () => ({
                url: 'api/user/auth',
                method: 'GET',
            }),
        }),
        editUser: builder.mutation<{ username: string; avatar_url?: string }, FormData>({
            query: (formData) => ({
                url: 'api/user',
                method: 'PATCH',
                body: formData,
            }),
        }),
        
    }),
});


export const { useLoginMutation, useRegisterMutation, useCheckAuthQuery, useEditUserMutation } = authApi;