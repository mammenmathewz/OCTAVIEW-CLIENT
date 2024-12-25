import InterviewCard from "../../components/user/Candidate/ScheduledInterviewCard";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduledInterviews } from "../../service/Api/candidateApi";
import { useSelector } from "react-redux";
import { selectUserId } from "../../service/redux/store";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

function ScheduledCandidates() {
  const userId = useSelector(selectUserId);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 rows x 3 columns grid

  const { data: allInterviews, isLoading, isError, error } = useQuery({
    queryKey: ["scheduledCandidates", userId],
    queryFn: () => fetchScheduledInterviews(userId),
    enabled: !!userId,
  });

  // Loading state
  if (isLoading) {
    return <div className="p-6 text-white">Loading scheduled interviews...</div>;
  }

  // Error state
  if (isError) {
    console.error("Error fetching scheduled candidates:", error);
    return (
      <div className="p-6 text-white">
        An error occurred while fetching scheduled interviews. Please try again later.
      </div>
    );
  }

  // Pagination calculations
  const totalItems = allInterviews?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInterviews = allInterviews?.slice(startIndex, endIndex) || [];

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pageNumbers.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push('...');
      }
    }
    return pageNumbers.filter((value, index, self) => 
      self.indexOf(value) === index
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Scheduled Interviews</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentInterviews.map((interview: any) => (
          <InterviewCard
            key={interview.selectedCandidateId}
            interviewData={interview}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(Number(pageNum))}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {totalItems === 0 && (
        <div className="text-center text-gray-400 py-8">
          No scheduled interviews found.
        </div>
      )}
    </div>
  );
}

export default ScheduledCandidates;