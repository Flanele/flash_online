import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Genre {
    id: number;
    name: string;
};

export const genreApi = createApi({
    reducerPath: 'genreApi',
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
    tagTypes: ['Genre'],
    endpoints: (builder) => ({
        fetchGenres: builder.query<Genre[], void>({
            query: () => 'api/genre',
            providesTags: ['Genre'],
        }),
    }),
});

export const { useFetchGenresQuery } = genreApi;
