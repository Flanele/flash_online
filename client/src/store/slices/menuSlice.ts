import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuState {
  menuOpen: boolean;
}

const initialState: MenuState = {
  menuOpen: true,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen;
    },
    setMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.menuOpen = action.payload;
    },
  },
});

export const { toggleMenu, setMenuOpen } = menuSlice.actions;
export default menuSlice.reducer;