import axios from "axios";
import axiosInstance from "../axios/axios";
import { UserId } from "../../lib/types";
import { Job } from "../../lib/interface";

export const submitJob = async (jobData: any, userId: UserId): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/jobs/${userId}`, jobData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit job");
  }
};

export const fetchJobs = async ({
  pageParam = 1,
  userId,
  search = "",
}: {
  pageParam?: number;
  userId: string; // Adjusted for clarity; ensure `userId` matches your application type
  search?: string; // Optional search string for filtering jobs
}): Promise<{ jobs: Job[]; hasMore: boolean; nextPage: number | null }> => {
  try {
    console.log("fetchJobs", userId, search);
    
    const response = await axiosInstance.get(`/jobs/${userId}`, {
      params: {
        page: pageParam,
        search, // Pass search parameter to backend
      },
    });

    return {
      jobs: response.data.jobs || [], // Default to an empty array if no jobs are returned
      hasMore: response.data.hasMore || false, // Ensure hasMore is a boolean
      nextPage: response.data.nextPage || null, // Handle cases where nextPage might be undefined
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Extract error message from backend or fallback to generic error
      const backendError =
        error.response?.data?.error || "Failed to fetch jobs. Please try again.";
      throw new Error(backendError);
    } else {
      // Handle unexpected errors
      throw new Error("An unexpected error occurred while fetching jobs.");
    }
  }
};

export const deleteJob = async({jobId,userId}:{jobId:string;userId:UserId}):Promise<void>=>{
  try {
    await axiosInstance.delete(`/jobs/${jobId}/${userId}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError =
        error.response?.data?.error || "Failed to delete the job";
      throw new Error(backendError);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

export const editJob = async ({
  jobId,
  userId,
  updatedData,
}: {
  jobId: string;
  userId: UserId;
  updatedData: Partial<Job>;
}): Promise<Job> => {
  try {
    const response = await axiosInstance.put(
      `/jobs/${jobId}/${userId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError =
        error.response?.data?.error || "Failed to update the job";
      throw new Error(backendError);
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};