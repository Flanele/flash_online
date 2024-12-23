import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Game } from './api';

interface FavoriteGame {
    id: number;
    userId: number;
    gameId: number;
    game: Game; 
  };

  export const favoriteApi = createApi({
    reducerPath: 'favoriteApi',
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
    tagTypes: ['Favorite'],
    endpoints: (builder) => ({
        fetchFavorites: builder.query<FavoriteGame[], void>({
            query: () => `api/favorite`, 
            transformResponse: (response: FavoriteGame[]) => response, 
            providesTags: (result) => [{ type: 'Favorite', id: 'all' }],
        }),
        addToFavorites: builder.mutation<void, { gameId: number }>({
            query: (game) => ({
                url: `api/favorite/${game.gameId}`,
                method: 'POST',
            }),
            invalidatesTags: [{ type: 'Favorite', id: 'all' }],
        }),
        removeFromFavorites: builder.mutation<void, { gameId: number }>({
            query: (game) => ({
                url: `api/favorite/${game.gameId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Favorite', id: 'all' }],
        }),
    })
});

export const { useFetchFavoritesQuery, useAddToFavoritesMutation, useRemoveFromFavoritesMutation } = favoriteApi;
