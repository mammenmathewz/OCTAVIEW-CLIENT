import { useState, useEffect, useRef } from "react";
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
import JobForm from "../../components/user/Job/JobForm";
import JobCard from "../../components/user/Job/JobCard";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchJobs } from "../../service/Api/jobApis";
import JobDetail from "../../components/user/Job/JobDetail";
import { Job } from "../../lib/interface"; // Using the shared Job interface

interface JobsResponse {
  jobs: Job[];
  hasMore: boolean;
  nextPage: number | null;
}

function JobPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const userId = useSelector(selectUserId);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["jobs", userId ?? ''],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchJobs({ pageParam, userId: userId ?? '' });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    enabled: !!userId,
  });

  useEffect(() => {
    const currentObserver = observerRef.current;
    if (!currentObserver || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 1.0,
      }
    );

    observer.observe(currentObserver);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  const handleCardClick = (job: Job) => {
    setSelectedJob(job);
    setIsFormVisible(false);
  };

  const handleCancelEdit = () => {
    setIsFormVisible(false);
    setSelectedJob(null);
  };

  const handleAddNew = () => {
    setSelectedJob(null);
    setIsFormVisible(true);
  };

  const renderJobs = () => {
    if (isLoading) {
      return <p className="p-4">Loading jobs...</p>;
    }

    if (error instanceof Error) {
      return <p className="p-4 text-red-500">Error loading jobs: {error.message}</p>;
    }

    if (!data?.pages || data.pages.length === 0 || data.pages[0].jobs.length === 0) {
      return <p className="p-4">No jobs found.</p>;
    }

    return (
      <>
        {data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.jobs.map((job) => (
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
            ))}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="h-screen flex flex-col hide-scrollbar scroll-section">
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
        <Button variant="default" onClick={handleAddNew}>
          Add New
        </Button>
      </nav>

      <div className="flex flex-grow gap-2">
        {/* Left Column */}
        <div className="bg-white w-2/4 p-4 hide-scrollbar scroll-section">
          {renderJobs()}
          <div ref={observerRef} className="h-4">
            {isFetchingNextPage && <p className="text-center">Loading more...</p>}
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-white w-3/4 p-4 hide-scrollbar scroll-section">
          {isFormVisible ? (
            <JobForm />
          ) : (
            selectedJob && (
              <JobDetail job={selectedJob} onCancel={handleCancelEdit} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPage;