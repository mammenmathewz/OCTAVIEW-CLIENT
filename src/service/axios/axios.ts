import axios from "axios";
import store from "../redux/store";
import { selectAccessToken } from "../redux/store";
import { logout } from "../redux/authSlice"; // Import logout action

console.log("🔗 API Base URL:", import.meta.env.VITE_BASE_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// 🚀 Request Interceptor: Attach Authorization Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = selectAccessToken(store.getState()) || "";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Interceptor Error:", error.message);
    return Promise.reject(error);
  }
);

// 🚨 Response Interceptor: Handle Errors (401, 403, etc.)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("⚠️ Axios Response Error:", error.response?.status, error.message);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("🔑 Unauthorized! Logging out user...");
        
        // 🛑 Step 1: Dispatch logout action to clear Redux store
        store.dispatch(logout());

        // 🛑 Step 2: Clear token from localStorage/sessionStorage
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");

        // 🛑 Step 3: Redirect to login after a small delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else if (status === 403) {
        console.warn("⛔ Forbidden! You don't have permission.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
