import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Game {
    id: number;
    title: string;
    description: string;
    popularity_score: number;
    file_url: string;
    preview_url: string;
};

export const api = createApi({
    reducerPath: 'api', 
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_APP_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;  
        },
     }),
    tagTypes: ['Game'], 
    endpoints: (builder) => ({
        fetchGames: builder.query<Game[], { genreId?: number | null; searchTerm?: string | null }>({
            query: ({ genreId, searchTerm }) => {
                const params = new URLSearchParams();
                if (genreId) params.append('genreId', String(genreId));
                if (searchTerm) params.append('searchTerm', searchTerm);
                return `api/game?${params.toString()}`;
            },
            transformResponse: (response: { rows: Game[] }) => response.rows,
        }),
        fetchGame: builder.query<Game, number>({
            query: (id) => `api/game/${id}`,
            providesTags: (result, error, id) => [{ type: 'Game', id }],
        }),
    }),
});

export const { useFetchGamesQuery, useFetchGameQuery } = api;