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
}: {
  pageParam?: number;
  userId: UserId;  // Ensure this type matches what you're using for userId
}): Promise<{ jobs: Job[]; hasMore: boolean; nextPage: number | null }> => {
  try {
    // Requesting jobs with pagination and userId in the URL path
    const response = await axiosInstance.get(`/jobs/${userId}`, {
      params: {
        page: pageParam,  
      },
    });
    return {
      jobs: response.data.jobs,  // Assuming the response contains an array of jobs
      hasMore: response.data.hasMore,  // Assuming the response indicates if there are more jobs
      nextPage: response.data.nextPage,  // Assuming the response includes the nextPage cursor or null if no more pages
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendError =
        error.response?.data?.error || "An unexpected error occurred";
      throw new Error(backendError);  // Throw the error from the backend if available
    } else {
      throw new Error("An unexpected error occurred");  // Fallback error for unexpected issues
    }
  }
};

export const deleteJob = async({jobId,userId}:{jobId:string;userId:UserId}):Promise<void>=>{
  try {
    await axiosInstance.delete(`/jobs/${userId}/${jobId}`)
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
      `/jobs/${userId}/${jobId}`,
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