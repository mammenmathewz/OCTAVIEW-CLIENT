import axios from "axios";
import { SignupCredentials } from "../../lib/interface";
import axiosInstance from "../axios/axios";

export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
  try {
    const response = await axiosInstance.post('/user/login', credentials); 
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data?.error || "An unexpected error occurred";
      throw new Error(backendError); 
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};


export const signupUser = async (credentials:SignupCredentials):Promise<any>=>{
  try {
    const response = await axiosInstance.post('/user/signup',credentials)
    return response.data
  }  catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data?.error || "An unexpected error occurred";
      throw new Error(backendError); 
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export const generateOtp = async (email:string)=>{
  try {
    const response = await axiosInstance.post('/user/generate_otp',{email})
    return response
  }  catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data?.error || "An unexpected error occurred";
      throw new Error(backendError); 
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export const verify = async (email: string, otp: string) => {
  try {
    console.log("OTP in verify:", otp); 
    const response = await axiosInstance.post('/user/verify_otp', { email, otp });
    return response;
  }  catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError = error.response?.data?.error || "An unexpected error occurred";
      throw new Error(backendError); 
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

 