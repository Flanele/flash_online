import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './userApi';

interface Friend {
    id: number;
    userId: number;
    friendId: number;
    status: string;
};

interface AddFriendPayload {
    friendId: number;
};

interface FriendsListResponse {
    friends: Friend[];
};

interface AcceptFriendPayload {
    friendId: number;
};

interface DeclineFriendPayload {
    friendId: number;
};


export const friendApi = createApi({
    reducerPath: 'friendApi',
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
        getFriendsList: builder.query<FriendsListResponse, void>({
            query: () => ({
                url: 'api/friend',
            }),
        }),
        
        addFriend: builder.mutation<Friend, AddFriendPayload>({
            query: ({ friendId }) => ({
                url: `api/friend/${friendId}`,
                method: 'POST',
            }),
        }),

        acceptFriendRequest: builder.mutation<Friend, AcceptFriendPayload>({
            query: ({ friendId }) => ({
                url: `api/friend/${friendId}`,
                method: 'PATCH',
            }),
        }),

        declineFriendRequestAndDeleteFriend: builder.mutation<string, DeclineFriendPayload>({
            query: ({ friendId }) => ({
                url: `api/friend/${friendId}`,
                method: 'DELETE',
            }),
        }),
        searchFriends: builder.query<User[], string>({
            query: (searchTerm) => { 
                const params = new URLSearchParams();
                if (searchTerm) params.append('searchTerm', searchTerm);
                return `api/friend/search/?${params.toString()}`;
            },
        }),        
    }),
});

export const { 
    useGetFriendsListQuery, 
    useAddFriendMutation, 
    useAcceptFriendRequestMutation, 
    useDeclineFriendRequestAndDeleteFriendMutation,
    useSearchFriendsQuery
} = friendApi;



