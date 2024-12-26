import React, { useState } from "react";
import { Button } from "../../ui/button"; // Assuming Button is from ShadCN UI
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover"; // ShadCN Popover
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { updateInterviewDateTime, rejectCandidate } from "../../../service/Api/candidateApi"; // Path to the API function
import { useToast } from "../../../@/hooks/use-toast"; // Assuming you have a toast hook

// Importing AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';

interface SelectedCandidateCardProps {
  selectedCandidateId: string; // Added selectedCandidateId prop
  candidate: {
    _id: string;
    fullName: string;
    email: string;
    contactNo: string;
    linkedin: string;
    github: string;
    resumeUrl: string;
    selectionStatus: string;
    DOB: string;
    country: string;
  };
}

const SelectedCandidateCard: React.FC<SelectedCandidateCardProps> = ({
  selectedCandidateId,
  candidate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false); // State to manage reject dialog visibility
  const { toast } = useToast(); // Initialize toast

  // Interview scheduling mutation
  const { mutate: scheduleInterview, isError, error } = useMutation({
    mutationFn: ({
      selectedCandidateId,
      interviewDate,
      interviewTime,
    }: {
      selectedCandidateId: string;
      interviewDate: string;
      interviewTime: string;
    }) =>
      updateInterviewDateTime(
        selectedCandidateId,  // Pass this as the first argument
        interviewDate,  // String formatted date
        interviewTime
      ),
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Interview scheduled successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        description: err.message || "An error occurred while scheduling the interview.",
      });
      console.error("Error scheduling interview:", err);
    },
  });

  // Candidate rejection mutation
  const { mutate: rejectInterview, isError: isRejectError, error: rejectError } = useMutation({
    mutationFn: (candidateId: string) => rejectCandidate({ candidateId }),
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Candidate rejected successfully.",
      });
      setIsRejectDialogOpen(false); // Close the reject dialog after success
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        description: err.message || "An error occurred while rejecting the candidate.",
      });
      console.error("Error rejecting candidate:", err);
    },
  });

  // Handle view resume functionality
  const handleViewResume = () => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Handle scheduling of interview
  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      // Format date as a string
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      // Pass formatted date and selected time (both are strings)
      scheduleInterview({
        selectedCandidateId,
        interviewDate: formattedDate,  // Pass formatted date as string
        interviewTime: selectedTime,   // Time is already a string
      });

      console.log(`Scheduling interview for Candidate ID: ${selectedCandidateId}`);
    } else {
      toast({
        variant: "destructive",
        description: "Please select both a date and time for the interview.",
      });
    }
  };

  // Handle opening the reject dialog
  const handleReject = () => {
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">{candidate.fullName}</h3>
          <p className="text-gray-600">Email: {candidate.email}</p>
          <p className="text-gray-600">Contact: {candidate.contactNo}</p>

          <a
            href={candidate.linkedin}
            className="text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn Profile
          </a>
        </div>
        {/* Reject Button moved to top-right */}
        <Button
          variant="destructive"
          onClick={handleReject}
          className="absolute top-2 right-2"
        >
          Reject Candidate
        </Button>
      </div>

      <div className="flex gap-6 mb-4">
        <Button variant="outline" onClick={handleViewResume}>
          View Resume
        </Button>
      </div>

      {/* Date and Time Picker Section */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Schedule Interview</label>

        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedDate ? format(selectedDate, "PP") : "Select Interview Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white shadow-lg border border-gray-200">
            <Calendar
              selected={selectedDate || undefined}
              onSelect={(date) => setSelectedDate(date || null)}
              mode="single"
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker */}
        <div className="mt-4">
          <label htmlFor="time" className="block text-gray-700 mb-2">Select Interview Time</label>
          <input
            type="time"
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Schedule Button */}
      <Button 
        variant="default" 
        className="w-full" 
        onClick={handleSchedule} 
      >
        Schedule Interview
      </Button>

      {/* Reject Candidate Confirmation Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogTrigger asChild>
          {/* Empty button or element to trigger */}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Candidate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this candidate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsRejectDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                rejectInterview(candidate._id); // Trigger rejection
                setIsRejectDialogOpen(false); // Close the dialog after rejection
              }}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SelectedCandidateCard;
