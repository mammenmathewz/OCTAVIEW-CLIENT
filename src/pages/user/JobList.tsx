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

function JobPage() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const userId = useSelector(selectUserId);
  const observerRef = useRef<HTMLDivElement | null>(null); // Ref for the "observer" element

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

  const handleCardClick = (job: any) => {
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
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : error ? (
            <p>Error loading jobs.</p>
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
                  onClick={() => handleCardClick(job)}
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
