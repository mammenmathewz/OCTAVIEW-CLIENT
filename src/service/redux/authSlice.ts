import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  companyName: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  userId: null,
  companyName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; userId: string; companyName: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.companyName = action.payload.companyName;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userId = null;
      state.companyName = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
