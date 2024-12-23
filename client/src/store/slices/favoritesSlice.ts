import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favoriteGames: number[];
}

const initialState: FavoritesState = {
  favoriteGames: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavoriteGames: (state, action: PayloadAction<number[]>) => {
      state.favoriteGames = action.payload;
    },
    addGameToFavorites: (state, action: PayloadAction<number>) => {
      if (!state.favoriteGames.includes(action.payload)) {
        state.favoriteGames.push(action.payload);
      }
    },
    removeGameFromFavorites: (state, action: PayloadAction<number>) => {
      state.favoriteGames = state.favoriteGames.filter(id => id !== action.payload);
    },
  },
});

export const { setFavoriteGames, addGameToFavorites, removeGameFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
