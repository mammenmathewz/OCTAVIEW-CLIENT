import axiosInstance from "../axios/axios";
import axios from "axios";

interface EmailPayload {
  candidateEmail: string;
  candidateName: string;
  meetingUrl: string;
  roomId: string;
  jobTitle: string;
  interviewDate: string;
  interviewTime: string;
  companyName: string|null;
}

export const sendEmailToCandidate = async (payload: EmailPayload): Promise<void> => {
  try {
    const response = await axiosInstance.post("/meet/send-meeting-invite", payload);

    if (response.status === 200) {
      console.log("Email successfully sent to", payload.candidateEmail);
    }
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


//req for compile (meet/compile)    is on 286 line codeEditer.tsx    