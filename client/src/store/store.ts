import { configureStore } from '@reduxjs/toolkit';
import { api } from './services/api';
import { genreApi } from './services/genreApi';
import filterGenreReducer from './slices/filterGenreSlice';
import filterTermReducer from './slices/filterTermSlice';
import menuReducer from './slices/menuSlice';
import { authApi } from './services/authApi';
import authSliceReducer from './slices/authSlice';
import { favoriteApi } from './services/favoriteApi';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        [genreApi.reducerPath]: genreApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer,
        filterGenre: filterGenreReducer,
        filterTerm: filterTermReducer,
        menu: menuReducer,
        auth: authSliceReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware, genreApi.middleware, authApi.middleware, favoriteApi.middleware),  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;