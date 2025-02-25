import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardFooter, CardHeader } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Mail, Video, Copy, Check, ArrowLeft } from "lucide-react";
import { selectCompanyName } from '../../service/redux/store';
import { useSelector } from 'react-redux';

const CreateRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  interface Candidate {
    email: string;
    fullName: string;
  }
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  interface JobDetails {
    jobTitle: string;
  }
  
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = useSelector(selectCompanyName);
console.log(companyName);

  useEffect(() => {
    // Get candidate data from location state (passed when navigating to this page)
    if (location.state && location.state.interviewData) {
      const { candidate, job, date, time } = location.state.interviewData;
      setCandidate(candidate);
      setJobDetails(job);
      setInterviewDate(date);
      setInterviewTime(time);
    } else {
      // If no data passed, redirect back or show error
      console.error("No candidate data provided");
    }
  }, [location]);

  const createRoom = async () => {
    if (!candidate) return;
    
    setLoading(true);
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    
    // Generate the full meeting URL
    const baseUrl = window.location.origin;
    const newMeetingUrl = `${baseUrl}/meet/${newRoomId}`;
    console.info("Meeting URL:", newMeetingUrl);
    setMeetingUrl(newMeetingUrl);
    
    // Automatically send email to candidate
    try {
      await sendEmailToCandidate(newRoomId, newMeetingUrl);
    } catch (error) {
      console.error("Failed to send email automatically:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailToCandidate = async (roomId: string, meetingUrl: string) => {
    try {
        const response = await axios.post('http://localhost:5000/api/meet/send-meeting-invite', {
            candidateEmail: candidate?.email || "",
            candidateName: candidate?.fullName || "",
            meetingUrl: meetingUrl,
            roomId: roomId,
            jobTitle: jobDetails?.jobTitle || "",
            interviewDate: interviewDate,
            interviewTime: interviewTime,
            companyName
        });

        if (response.status === 200) {
            setEmailSent(true);
            setTimeout(() => setEmailSent(false), 3000);
        }
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};


  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  const joinMeeting = () => {
    if (roomId) {
      navigate(`/meet/${roomId}`);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute left-2 top-2"
            onClick={goBack}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold text-center">Interview Meeting Room</h2>
          {candidate && (
            <p className="text-center text-gray-600">
              for {candidate.fullName} • {jobDetails?.jobTitle || "Interview"}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!meetingUrl ? (
            <div className="flex flex-col items-center gap-4">
              {candidate ? (
                <>
                  <div className="w-full p-4 bg-gray-100 rounded-md space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{candidate.email}</span>
                    </div>
                    {interviewDate && interviewTime && (
                      <div className="text-sm text-gray-600">
                        Interview scheduled for {interviewDate} at {interviewTime}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-center">
                    Create a meeting room and send an invite to the candidate
                  </p>
                </>
              ) : (
                <p className="text-red-500 text-center">
                  No candidate data available. Please go back and try again.
                </p>
              )}
              
              <Button 
                onClick={createRoom} 
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
                disabled={loading || !candidate}
              >
                <Video className="w-4 h-4 mr-2" />
                Create Interview Room & Send Invite
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center bg-green-100 text-green-700 p-3 rounded-md">
                <Check className="w-4 h-4 mr-2" />
                <span>Meeting invite {emailSent ? "sent" : "queued"} to {candidate?.email}</span>
              </div>
              
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-1">Meeting URL</p>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={meetingUrl} 
                    readOnly 
                    className="w-full p-2 text-sm border rounded-md"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                The candidate will receive an email with the link to join this interview.
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {meetingUrl && (
            <Button 
              onClick={joinMeeting} 
              className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Interview Now
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateRoom;