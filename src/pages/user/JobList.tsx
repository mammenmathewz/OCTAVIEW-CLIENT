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


function JobPage() {
  const [rightCard, setRightCard] = useState(true);
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
  

  // Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();  // Fetch next page
        }
      },
      { threshold: 1.0 }
    );
  
    if (observerRef.current) observer.observe(observerRef.current);
  
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);  // Add isFetchingNextPage to avoid multiple requests
  console.log('data : ',data);
  

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
        <Button variant="default" onClick={()=>setRightCard(false)}>
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
            <h2 className="font-bold mb-4">Right Content</h2>
          ) : (
            <JobForm />
          )}
        </div>
      </div>
    </div>
  );
}

export default JobPage;




