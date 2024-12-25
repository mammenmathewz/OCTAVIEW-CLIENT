import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { selectUserId } from "../../service/redux/store";
import { fetchJobs } from "../../service/Api/jobApis";
import { fetchSelectedCandidatesByJob } from "../../service/Api/candidateApi";
import JobCard from "../../components/user/Job/JobCard";
import SelectedCandidateCard from "../../components/user/Candidate/SelectedCandidateCards";

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

function SelectedCandidates() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const userId = useSelector(selectUserId);
  const jobsListRef = useRef<HTMLDivElement | null>(null);
  const candidatesListRef = useRef<HTMLDivElement | null>(null); // Added for candidates scroll

  const {
    data: jobsData,
    error: jobsError,
    isLoading: isJobsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["SelectedCandidatejobs", userId],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam, userId }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    initialPageParam: 1,
  });

  const {
    data: candidatesData,
    error: candidatesError,
    isLoading: isCandidatesLoading,
  } = useQuery({
    queryKey: ["selectedCandidates", selectedJob?.id, userId],
    queryFn: async () => {
      if (!selectedJob?.id) {
        throw new Error("Job ID is required");
      }
      const response = await fetchSelectedCandidatesByJob({ jobId: selectedJob.id });
      return response?.candidates || [];
    },
    enabled: !!selectedJob?.id,
    refetchOnWindowFocus: false,
  });

  const handleScroll = () => {
    if (!jobsListRef.current || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = jobsListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      fetchNextPage();
    }
  };

  const handleCandidatesScroll = () => {
    if (!candidatesListRef.current || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop, scrollHeight, clientHeight } = candidatesListRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      // Logic for loading more candidates, if needed
    }
  };

  useEffect(() => {
    const jobsListElement = jobsListRef.current;
    if (!jobsListElement) return;

    jobsListElement.addEventListener("scroll", handleScroll);
    return () => {
      jobsListElement.removeEventListener("scroll", handleScroll);
    };
  }, [isFetchingNextPage, hasNextPage]);

  useEffect(() => {
    const candidatesListElement = candidatesListRef.current;
    if (!candidatesListElement) return;

    candidatesListElement.addEventListener("scroll", handleCandidatesScroll);
    return () => {
      candidatesListElement.removeEventListener("scroll", handleCandidatesScroll);
    };
  }, [isFetchingNextPage, hasNextPage]);

  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
  };

  return (
    <div className="h-screen flex flex-col hide-scrollbar scroll-section">
      <nav className="px-4 py-3 flex justify-around items-center bg-white shadow z-10">
        {/* You can add a search bar or other elements here */}
      </nav>

      <div className="flex flex-grow gap-2">
        {/* Left Column - Jobs List */}
        <div
          className="bg-white w-2/4 p-4 hide-scrollbar scroll-section overflow-y-auto"
          ref={jobsListRef}
        >
          {isJobsLoading ? (
            <p>Loading jobs...</p>
          ) : jobsError ? (
            <p>Error loading jobs.</p>
          ) : (
            jobsData?.pages.map((page) =>
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
                  onClick={() => handleCardClick(job)}
                />
              ))
            )
          )}
          {isFetchingNextPage && <p>Loading more...</p>}
        </div>

        {/* Right Column - Selected Candidates */}
        <div
          className="bg-white w-3/4 p-4 hide-scrollbar scroll-section overflow-y-auto"
          ref={candidatesListRef}
        >
          {isCandidatesLoading ? (
            <p>Loading candidates...</p>
          ) : candidatesError ? (
            <p>Error loading candidates.</p>
          ) : !candidatesData || candidatesData.length === 0 ? (
            <p>No candidates available for this job.</p>
          ) : (
            candidatesData.map((entry: any) => {
              const candidate = entry.candidate; // Access candidate object
              return (
                <SelectedCandidateCard
                  key={candidate._id}
                  candidate={candidate}
                  // No need to pass onRemove or onUpdateSchedule as props here
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectedCandidates;
