import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterTermState {
    searchTerm: string | null,
};

const initialState: FilterTermState = {
    searchTerm: null,
};

const filterTermSlice = createSlice({
    name: 'filterTerm',
    initialState,
    reducers: {
        setTermSearch(state, action: PayloadAction<string | null>) {
            state.searchTerm = action.payload;
        }
    }
});

export const { setTermSearch } = filterTermSlice.actions;
export default filterTermSlice.reducer;