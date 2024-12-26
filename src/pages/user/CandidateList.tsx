import { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import "../../components/Styles/Scroll.css";
import { Input } from "../../components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [debouncedSearch, setDebouncedSearch] = useState<string>(""); // State for debounced search
  const userId = useSelector(selectUserId);
  const observerRef = useRef<HTMLDivElement | null>(null); // Ref for the "observer" element
  const navigate = useNavigate();

  // Debounced handler for search input
  const debouncedHandleSearchChange = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value); // Update the debounced search state
    }, 300), // 300ms delay
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update local search term immediately
    debouncedHandleSearchChange(e.target.value); // Trigger the debounced function
  };

  // Fetching jobs with pagination and search query
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs", userId, debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      fetchJobs({ pageParam, userId: userId ?? "", search: debouncedSearch }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
  });

  const {
    data: candidatesData,
    error: candidatesError,
    isLoading: isCandidatesLoading,
  } = useQuery({
    queryKey: ["candidates", selectedJob?.id, userId],
    queryFn: () => {
      if (selectedJob) {
        return fetchCandidatesByJob(selectedJob.id);
      }
      return [];
    },
    enabled: !!selectedJob?.id, // Only run when selectedJob?.id is available
    refetchOnWindowFocus: false,
  });

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
    setSelectedJob(job);
  };

  return (
    <div className="h-screen flex flex-col hide-scrollbar scroll-section">
      <nav className="px-4 py-3 flex justify-around items-center bg-white shadow z-10">
        <div>
          {/* Search Input */}
          <Input
            type="search"
            placeholder="Search.."
            value={searchTerm}
            onChange={handleSearchChange} // Update search state on input change
          />
        </div>
      </nav>

      <div className="flex flex-grow gap-2">
        {/* Left Column - Jobs List */}
        <div className="bg-white w-2/4 p-4 hide-scrollbar scroll-section">
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p>Error loading jobs.</p>
          ) : data?.pages.every((page) => page.jobs.length === 0) ? (
            <p>No jobs found.</p> // Show this message if no jobs are found
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
                key={candidate.id}
                name={candidate.fullName}
                email={candidate.email}
                phone={candidate.contactNo}
                country={candidate.country}
                status={candidate.status}
                onClick={() =>
                  navigate("/dash/candidate-details", {
                    state: {
                      candidate: {
                        id: candidate.id,
                        fullName: candidate.fullName,
                        dob: candidate.DOB,
                        contactNo: candidate.contactNo,
                        country: candidate.country,
                        email: candidate.email,
                        github: candidate.github,
                        linkedin: candidate.linkedin,
                        resumeUrl: candidate.resumeUrl,
                      },
                      jobId: selectedJob?.id, // Include the jobId here
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
