import axios from "axios";
import store from "../redux/store";
import { selectAccessToken } from "../redux/store";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, 
});

axiosInstance.interceptors.request.use((config) => {
  const token = selectAccessToken(store.getState()) || '';  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Request failed:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
