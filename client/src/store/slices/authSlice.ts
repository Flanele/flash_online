import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: { 
        email: string; 
        role: string; 
        username: string; 
        avatar_url?: string | null; 
    } | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action: PayloadAction<{ token: string; user: { email: string; role: string; username: string; avatar_url?: string | null  } }>) {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem('token'); 
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
