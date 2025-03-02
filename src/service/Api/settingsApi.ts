import axios from "axios";
import { UserId } from "src/lib/types";
import axiosInstance from "../axios/axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

export const purchaseTokens = async (userId: UserId, amount: number) => {
    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }
  
      const response = await axiosInstance.post(`/settings/${userId}/purchase-tokens`, { amount });
  
      const session = response.data;
      await stripe.redirectToCheckout({ sessionId: session.id });
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data);
        throw new Error(error.response?.data?.error || "Failed to purchase tokens.");
      }
      console.error("Unknown Error:", error);
      throw new Error("An unexpected error occurred");
    }
  };
  
  
