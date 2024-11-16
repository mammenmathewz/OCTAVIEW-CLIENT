import { SignupCredentials } from "../../lib/interface";
import axiosInstance from "../axios/axios";

export const loginUser = async (credentials: { email: string; password: string }): Promise<any> => {
  try {
    const response = await axiosInstance.post('/login', credentials); 
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error; 
  }
};

export const signupUser = async (credentials:SignupCredentials):Promise<any>=>{
  try {
    const response = await axiosInstance.post('/signup',credentials)
    return response.data
  } catch (error) {
    console.log("signup failed",error);
    throw error
  }
}

export const generateOtp = async ()=>{
  try {
    const response = await axiosInstance.post('/generate_otp')
  } catch (error) {
    console.log("otp generate req failed",error)
    throw error
  }
}