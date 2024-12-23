import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Comment {
    id: number;
    text: string;
    createdAt: string;
    user: {
        username: string;
        avatar_url: string | null;
    };
}

interface AddCommentPayload {
    text: string;  
    gameId: number; 
}

export const commentApi = createApi({
    reducerPath: 'commentApi',  
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_APP_API_URL, 
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;  
        },
    }),
    endpoints: (builder) => ({
        getComments: builder.query<Comment[], number>({
            query: (gameId) => `api/comment/${gameId}`,  
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

