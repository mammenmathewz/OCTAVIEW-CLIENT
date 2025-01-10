import axios from "axios";
import { UserId } from "src/lib/types";
import axiosInstance from "../axios/axios";

export const generateApi = async (userId: UserId) => {
    try {
        const response = await axiosInstance.post(`/settings/generate-api-key/${userId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data);
            throw new Error(error.response?.data?.error || 'Failed to generate API key');
        }
        console.error('Unknown Error:', error);
        throw new Error('An unexpected error occurred');
    }
};

export const fetchSettingsData = async (userId: UserId) => {
    try {
        const response = await axiosInstance.get(`/settings/${userId}`);
        console.log('Response settings:', response);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios Error:', error.response?.data);
            throw new Error(error.response?.data?.error || 'Failed to fetch settings data');
        }
        console.error('Unknown Error:', error);
        throw new Error('An unexpected error occurred');
    }
};
