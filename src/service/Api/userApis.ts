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

export const generateOtp = async (email:string)=>{
  try {
    const response = await axiosInstance.post('/generate_otp',{email})
    return response
  } catch (error) {
    console.log("otp generate req failed",error)
    throw error
  }
}

export const verify = async (email: string, otp: string) => {
  try {
    console.log("OTP in verify:", otp); // Log OTP in verify function
    const response = await axiosInstance.post('/verify_otp', { email, otp });
    return response;
  } catch (error) {
    console.log("OTP verification request failed", error);
    throw error;
  }
};

 