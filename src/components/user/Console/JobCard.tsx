import React from 'react';
import { Briefcase, MapPin, DollarSign } from 'lucide-react'; // Importing Lucide Icons
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card'; // Importing ShadCN UI components

// Define the JobCard component
interface JobCardProps {
  job_title: string;
  job_role: string;
  min_salary: number;
  max_salary: number;
  job_level: string;
  location: string;
  city: string;
  hidden: boolean;
}

const JobCard: React.FC<JobCardProps> = ({
  job_title,
  job_role,
  min_salary,
  max_salary,
  job_level,
  location,
  city,
  hidden,
}) => {
  return (
    <Card className="shadow-md rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="font-semibold text-xl ">{job_title}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Job Role & Level */}
        <div className="flex items-center space-x-2 mb-3">
          <Briefcase size={20}  />
          <p className="text-sm">{job_role} | {job_level}</p>
        </div>

        {/* Salary Range */}
        <div className="flex items-center space-x-2 mb-3">
          <DollarSign size={20}  />
          <p className="text-sm">${min_salary} - ${max_salary}</p>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 mb-3">
          <MapPin size={20}  />
          <p className="text-sm">{location}, {city}</p>
        </div>

        {/* Hidden Status */}
        <div className={`mt-2 text-sm`}>
          {hidden ? "This job is hidden" : "This job is visible"}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
