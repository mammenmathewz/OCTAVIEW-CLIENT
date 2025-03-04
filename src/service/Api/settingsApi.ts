import axios from "axios";
import { UserId } from "src/lib/types";
import axiosInstance from "../axios/axios";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

console.log("Stripe Publishable Key:", import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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
      console.error("❌ Stripe failed to initialize.");
      throw new Error("Stripe failed to initialize.");
    }

    console.log(`🔄 Initiating token purchase for User: ${userId}, Amount: ${amount}`);

    const response = await axiosInstance.post(`/settings/purchase-tokens/${userId}`, { amount });

    console.log("🔍 Server Response:", response.data);

    if (response.status !== 201 || !response.data?.checkoutUrl) {
      console.error("❌ Invalid server response:", response);
      throw new Error("Failed to retrieve a valid checkout session from the server.");
    }

    const checkoutUrl = response.data.checkoutUrl;
    console.log("✅ Checkout URL received:", checkoutUrl);

    return checkoutUrl.checkoutUrl; // ✅ Return URL instead of redirecting here
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to purchase tokens.");
    }
    console.error("❌ Unexpected Error:", error);
    throw new Error("An unexpected error occurred during the token purchase.");
  }
};

export const paymentSuccess = async (paymentId: string, userId: string) => {
  if (!paymentId || !userId) {
    console.error("❌ Missing paymentId or userId:", { paymentId, userId });
    throw new Error("Payment ID and User ID are required");
  }

  try {
    console.log("🚀 Sending payment confirmation request with:", { paymentId, userId });

    const response = await axiosInstance.post("/settings/success", { paymentId, userId });

    if (!response.data) {
      throw new Error("Empty response from server");
    }

    console.log("✅ Server Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Payment API request failed:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.error || "Unknown error";

      console.error("📌 Request failed with status:", status);
      console.error("📌 Error message:", errorMsg);

      if (status === 404) {
        throw new Error("Payment endpoint not found. Check your API routes.");
      } else if (status === 400) {
        throw new Error(`Invalid payment data: ${errorMsg}`);
      } else {
        throw new Error(errorMsg || "Failed to confirm payment");
      }
    }

    throw new Error("Network error confirming payment");
  }
};
