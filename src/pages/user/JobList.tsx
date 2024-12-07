import { useRef, useState, useEffect } from "react";
import "../../components/Styles/Scroll.css";
import { Button } from "../../components/ui/button";
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
import JobForm from "../../components/user/Console/JobForm";
import JobCard from "../../components/user/Console/JobCard";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchJobs } from "../../service/Api/jobApis";
import JobDetail from "../../components/user/Console/JobDetail";

function JobPage() {
  const [rightCard, setRightCard] = useState(false); // Default to detail view
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const userId = useSelector(selectUserId);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['jobs', userId],
    queryFn: ({ pageParam = 1 }) => fetchJobs({ pageParam, userId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
  });

  // Set the first job as the default selectedJob
  useEffect(() => {
    if (data?.pages?.[0]?.jobs?.[0] && !selectedJob) {
      setSelectedJob({ ...data.pages[0].jobs[0] });
      setRightCard(false); // Show job detail view by default
    }
  }, [data, selectedJob]);

  // Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage(); // Fetch next page
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCardClick = (job: any) => {
    console.log("Job clicked:", job); // Check if this prints the correct job
    setSelectedJob({ ...job }); // Ensure a new object is set
    setRightCard(false); // Switch to job detail view
  };

  const handleCancelEdit = () => {
    setRightCard(true); // Hide the detail view when editing is canceled
    setSelectedJob(null); // Clear selected job
  };

  console.log("Selected Job: ", selectedJob); // Check the selectedJob state

  return (
    <div className="h-screen flex flex-col hide-scrollbar scroll-section">
      {/* Fixed Navbar */}
      <nav className="px-4 py-3 flex justify-between items-center bg-white shadow z-10">
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
        <Button variant="default" onClick={() => setRightCard(false)}>
          Add New
        </Button>
      </nav>

      {/* Content Area */}
      <div className="flex flex-grow gap-2">
        {/* Left Column */}
        <div className="bg-white w-2/4 p-4 hide-scrollbar scroll-section">
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : (
            data?.pages.map((page) =>
              page.jobs.map((job: any) => (
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
                  onClick={() => handleCardClick(job)} // Handle click to update selected job
                />
              ))
            )
          )}
          <div ref={observerRef}>
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white w-3/4 p-4 hide-scrollbar scroll-section">
          {rightCard ? (
            <JobForm /> // Show JobForm when rightCard is true (for adding new job)
          ) : (
            selectedJob && (
              <JobDetail
                job={selectedJob}
                onCancel={handleCancelEdit}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPage;
