import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterGenreState {
    genreId: number | null,
};

const initialState: FilterGenreState = {
    genreId: null,
};

const filterGenreSlice = createSlice({
    name: 'filterGenre',
    initialState,
    reducers: {
        setGenre(state, action: PayloadAction<number | null>) {
            state.genreId = action.payload;
        }
    }
});

export const { setGenre } = filterGenreSlice.actions;
export default filterGenreSlice.reducer;