import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FriendsState {
    accepted: number[]; // ID друзей со статусом "accepted"
    pending: number[];  // ID друзей со статусом "pending"
}

const initialState: FriendsState = {
    accepted: [],
    pending: [],
};

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setFriends: (state, action: PayloadAction<{ accepted: number[]; pending: number[] }>) => {
            state.accepted = action.payload.accepted;
            state.pending = action.payload.pending;
        },
        addFriendToAccepted: (state, action: PayloadAction<number>) => {
            if (!state.accepted.includes(action.payload)) {
                state.accepted.push(action.payload);
            }
        },
        addFriendToPending: (state, action: PayloadAction<number>) => {
            if (!state.pending.includes(action.payload)) {
                state.pending.push(action.payload);
            }
        },
        removeFriendFromAccepted: (state, action: PayloadAction<number>) => {
            state.accepted = state.accepted.filter(id => id !== action.payload);
        },
        removeFriendFromPending: (state, action: PayloadAction<number>) => {
            state.pending = state.pending.filter(id => id !== action.payload);
        },
    },
});

export const {
    setFriends,
    addFriendToAccepted,
    addFriendToPending,
    removeFriendFromAccepted,
    removeFriendFromPending,
} = friendsSlice.actions;

export default friendsSlice.reducer;


