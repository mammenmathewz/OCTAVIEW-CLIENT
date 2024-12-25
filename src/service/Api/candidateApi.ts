import { UserId } from "src/lib/types";
import axiosInstance from "../axios/axios"; 
import axios from "axios";
import { log } from "console";

export const fetchSelectedCandidatesByJob = async ({ jobId }: { jobId: string }) => {
  console.log('Fetching selectedcandidates for jobId:', jobId);

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

export const updateInterviewDateTime = async (
  selectedCandidateId: string, 
  interviewDate: string, 
  interviewTime: string
) => {
  try {
    // Prepare the data to be sent to the backend
    const data = {
      candidateId: selectedCandidateId,
      interviewDate,
      interviewTime,
    };

    // Make an API call to update the interview date and time
    const response = await axiosInstance.put(`/selected/${selectedCandidateId}`, data);

    // Return the response data
    return response.data;
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.error || "An unexpected error occurred");
    }

    // Handle unknown errors
    console.error("Unknown Error:", error);
    throw new Error("An unexpected error occurred");
  }
};

export const fetchScheduledInterviews = async (userId: UserId) => {
  try {
    console.log("Fetching scheduled interviews for userId:", userId);

    const response = await axiosInstance.get(`/selected/scheduled-interviews/${userId}`);
    console.log("Response:", response);

    if (response?.data && Array.isArray(response.data)) {
      return response.data.map((interview) => ({
        selectedCandidateId: interview.selectedCandidateId,
        candidate: {
          _id: interview.candidate._id,
          fullName: interview.candidate.fullName,
          DOB: interview.candidate.DOB,
          linkedin: interview.candidate.linkedin,
          resumeUrl: interview.candidate.resumeUrl,
          country: interview.candidate.country,
          email: interview.candidate.email,
          contactNo: interview.candidate.contactNo,
          github: interview.candidate.github,
          selection: interview.candidate.selection,
        },
        selectionStatus: interview.selectionStatus,
        meetUrl: interview.meetUrl,
        report: interview.report,
        date: interview.date,
        time: interview.time,
        job: {
          jobId: interview.job.jobId,
          jobTitle: interview.job.jobTitle,
          jobLocation: interview.job.jobLocation,
          jobLevel: interview.job.jobLevel,
        },
      }));
    } else {
      throw new Error("No scheduled interviews found in the response");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data);
      throw new Error(error.response?.data?.error || "An unexpected error occurred");
    }
    console.error("Unknown Error:", error);
    throw new Error("An unexpected error occurred");
  }
};
