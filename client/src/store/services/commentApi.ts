import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Comment {
    id: number;
    text: string;
    createdAt: string;
    user: {
        username: string;
        avatar_url: string | null;
        id: number;
    };
}

interface AddCommentPayload {
    text: string;  
    gameId: number; 
}

interface PaginatedCommentsResponse {
    comments: Comment[];
    totalComments: number;
    totalPages: number;
    currentPage: number;
}

export const commentApi = createApi({
    reducerPath: 'commentApi',
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
        getComments: builder.query<PaginatedCommentsResponse, { gameId: number; page?: number; limit?: number }>({
            query: ({ gameId, page = 1, limit = 10 }) => ({
                url: `api/comment/${gameId}`,
                params: { page, limit },
            }),
        }),
        addComment: builder.mutation<Comment, AddCommentPayload>({
            query: (payload) => ({
                url: `api/comment/${payload.gameId}`,
                method: 'POST',
                body: {
                    text: payload.text,
                },
            }),
        }),
    }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentApi;  

