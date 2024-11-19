import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    isAuthenticated: !!localStorage.getItem('accessToken')
}

const authSlice = createSlice({
    name: 'auth',
    initialState,  
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            console.log("Storing token:", action.payload); 
            state.isAuthenticated = true;
            localStorage.setItem('accessToken', action.payload);
        },
        logout: (state) => {
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken');
        }
    }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
