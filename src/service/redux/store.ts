import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; 


const persistConfig = {
  key: "auth",
  storage, // Default: localStorage
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
});

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectCompanyName = (state: RootState) => state.auth.companyName;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export default store;
