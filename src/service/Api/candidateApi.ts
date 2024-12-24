import { UserId } from "src/lib/types";
import axiosInstance from "../axios/axios"; 
import axios from "axios";
import { log } from "console";

export const fetchSelectedCandidatesByJob = async ({ jobId }: { jobId: string }) => {
  console.log('Fetching candidates for jobId:', jobId);

  try {
      const response = await axiosInstance.get(`/selected/${jobId}`);
      console.log('Response:', response);

      if (response?.data && Array.isArray(response.data)) {
          return { candidates: response.data };
      } else {
          throw new Error('No candidates found in the response');
      }
  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error('Axios Error:', error.response?.data);
          throw new Error(error.response?.data?.error || 'An unexpected error occurred');
      }
      console.error('Unknown Error:', error);
      throw new Error('An unexpected error occurred');
  }
};


export const selectCandidate = async ({ candidateId, jobId }: { candidateId: any; jobId: any }) => {
  try {
    const response = await axiosInstance.post(`/selected/`, { candidateId, jobId });
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'An unexpected error occurred');
    }
    console.error('Unknown Error:', error);
    throw new Error('An unexpected error occurred');
  }
};


export const rejectCandidate = async ({ candidateId }: { candidateId: any }) => {
  try {
    console.log("Rejecting candidate with ID:", candidateId);
    
    const response = await axiosInstance.delete(`/selected/${candidateId}`);
    return response.data;
  } catch(error){
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'An unexpected error occurred');
    }
    console.error('Unknown Error:', error);
    throw new Error('An unexpected error occurred');
  }
}

export const fetchAllJobs = async (userID: UserId) => {
  try {
    const response = await axiosInstance.get(`/jobs/ext/${userID}`);
    console.log('res:', response);
    return response.data.jobs; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'An unexpected error occurred');
    }
    console.error('Unknown Error:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const fetchCandidatesByJob  = async (jobId: String) => {
  try {
    console.log('Fetching candidates for jobId:', jobId);
    
    const response = await axiosInstance.get(`/candidate/${jobId}`);
    console.log('Response:', response.data);
    return response.data;
  
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'An unexpected error occurred');
    }
    console.error('Unknown Error:', error);
    throw new Error('An unexpected error occurred');
  }
}