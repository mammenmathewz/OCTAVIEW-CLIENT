import  { useState } from "react";
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

function JobPage() {
  const [leftCards, setLeftCards] = useState<string[]>([]);
  const [rightCard, setRightCard] = useState(true);

  const rightState = () => {
    setRightCard(false);
  };

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
        <Button variant="default" onClick={rightState}>
          Add New
        </Button>
      </nav>

      {/* Content Area */}
      <div className="flex flex-grow gap-2">
        {/* Left Column */}
        <div className="bg-white w-2/4 p-4  hide-scrollbar scroll-section ">
          <JobCard
            job_title="Data Scientist"
            job_role="Machine Learning Engineer"
            min_salary={80000}
            max_salary={120000}
            job_level="Senior"
            location="San Francisco"
            city="CA"
            hidden={false}
          />
          <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           <JobCard
            job_title="Product Manager"
            job_role="Product Owner"
            min_salary={95000}
            max_salary={140000}
            job_level="Lead"
            location="Austin"
            city="TX"
            hidden={true}
            
          />
           
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
