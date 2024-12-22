import axiosInstance from "../axios/axios"; // Assuming this is your Axios instance
import axios from "axios";

// Fetch candidates by job ID
export const fetchCandidatesByJob = async ({ jobId }: { jobId: string }) => {
    console.log('Fetching candidates for jobId:', jobId); // Log jobId to check if it's passed correctly
  
    try {
      const response = await axiosInstance.get(`/candidate/${jobId}`);
      console.log('Candidates Response:', response); // Log the entire response for debugging

      // Ensure data exists and candidates is an array
      if (response?.data && Array.isArray(response.data)) {
        return { candidates: response.data }; // Return the candidates array
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