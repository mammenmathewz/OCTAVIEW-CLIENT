import axiosInstance from '../axios/axios'; 

export const submitJob = async (jobData: any,userId:string|null): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/jobs/${userId}`, jobData); 
    return response.data;
  } catch (error) {
    throw new Error("Failed to submit job");
  }
};
