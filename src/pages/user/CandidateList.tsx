import { useState, useEffect, useRef } from "react";
import "../../components/Styles/Scroll.css";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import JobCard from "../../components/user/Job/JobCard";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchJobs } from "../../service/Api/jobApis";
import { fetchCandidatesByJob } from "../../service/Api/candidateApi";
import CandidateCard from "../../components/user/Candidate/CandidateCard";
import { useNavigate } from "react-router-dom";

type Job = {
  id: string;
  job_title: string;
  job_role: string;
  min_salary: number;
  max_salary: number;
  job_level: string;
  location: string;
  city: string;
  hidden: boolean;
};

type Candidate = {
  DOB: any;
  github: any;
  linkedin: any;
  resumeUrl: any;
  id: string;
  fullName: string;
  email: string;
  contactNo: string;
  country: string;
  status: string;
};

function CandidateList() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const userId = useSelector(selectUserId);
  const observerRef = useRef<HTMLDivElement | null>(null); // Ref for the "observer" element
  const navigate = useNavigate()

  // Fetching jobs with pagination
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs", userId],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam, userId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
  });

  const { 
    data: candidatesData, 
    error: candidatesError, 
    isLoading: isCandidatesLoading 
  } = useQuery({
    queryKey: ["candidates", selectedJob?.id, userId],
    queryFn: async () => {
      if (!selectedJob?.id) {
        throw new Error("Job ID is required");
      }
      const response = await fetchCandidatesByJob({ jobId: selectedJob.id });
      console.log('Fetched candidates:', response); // Log the response here
      
      // Ensure you return a valid data structure, candidates array or empty array
      return response?.candidates || []; // Return an empty array if no candidates
    },
    enabled: !!selectedJob?.id, // Only run when selectedJob?.id is available
    refetchOnWindowFocus: false,
  });
  
  

  useEffect(() => {
    console.log('Candidates Data:', candidatesData); // Add this line to check the data
  }, [candidatesData]);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage(); // Fetch next page when the observer target is visible
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "100px", // Preload slightly before reaching the bottom
        threshold: 1.0, // Trigger only when the element is fully visible
      }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect(); // Clean up on unmount
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCardClick = (job: Job) => {
    setSelectedJob(job); // Set selected job when a job card is clicked
  };

  return (
    <div className="h-screen flex flex-col hide-scrollbar scroll-section">
      <nav className="px-4 py-3 flex justify-around items-center bg-white shadow z-10">
        <div>
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sort by</SelectLabel>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Input type="search" placeholder="Search.." />
        </div>
      </nav>

      <div className="flex flex-grow gap-2">
        {/* Left Column - Jobs List */}
        <div className="bg-white w-2/4 p-4 hide-scrollbar scroll-section">
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p>Error loading jobs.</p>
          ) : (
            data?.pages.map((page) =>
              page.jobs.map((job: Job) => (
                <JobCard
                  key={job.id}
                  job_title={job.job_title}
                  job_role={job.job_role}
                  min_salary={job.min_salary}
                  max_salary={job.max_salary}
                  job_level={job.job_level}
                  location={job.location}
                  city={job.city}
                  hidden={job.hidden}
                  onClick={() => handleCardClick(job)} // Trigger the fetch for candidates
                />
              ))
            )
          )}
          <div ref={observerRef}>
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        </div>

        {/* Right Column - Show Candidates */}
        <div className="bg-white w-3/4 p-4 hide-scrollbar scroll-section">
        {isCandidatesLoading ? (
  <p>Loading candidates...</p>
) : candidatesError ? (
  <p>Error loading candidates.</p>
) : candidatesData?.length === 0 ? (
  <p>No candidates available for this job.</p>
) : (
  candidatesData?.map((candidate: Candidate) => (
    <CandidateCard
    key={candidate.email} // Ensure email is unique
    name={candidate.fullName}
    email={candidate.email}
    phone={candidate.contactNo}
    country={candidate.country}
    status={candidate.status}
    onClick={() =>
      navigate('/dash/candidate-details', {
        state: {
          candidate: {
            fullName: candidate.fullName,
            dob: candidate.DOB,
            contactNo: candidate.contactNo,
            country: candidate.country,
            email: candidate.email,
            github: candidate.github,
            linkedin: candidate.linkedin,
            resumeUrl: candidate.resumeUrl,
          },
        },
      })
    }
  />
  
  
  ))
)}

        </div>
      </div>
    </div>
  );
}

export default CandidateList;
