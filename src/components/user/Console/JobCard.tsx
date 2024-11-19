import React, { useState } from "react";
import { Button } from "../../ui/button"; 


interface Job {
  id: string;
  job_title: string;
  skills: string;
  job_role: string;
  min_salary: number;
  max_salary: number;
  job_level: string;
  location: string;
  city: string;
  description: string;
  hidden: boolean;
}

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
  onHide: (id: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDelete, onHide }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableJob, setEditableJob] = useState<Job>(job);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableJob((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="border border-gray-300 p-4 rounded-md bg-white shadow-md w-full max-w-md">
      {isEditing ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Edit Job Details</h3>
          <form className="space-y-2">
            <input
              type="text"
              name="job_title"
              value={editableJob.job_title}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Job Title"
            />
            <input
              type="text"
              name="skills"
              value={editableJob.skills}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Skills"
            />
            <input
              type="text"
              name="job_role"
              value={editableJob.job_role}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Job Role"
            />
            <input
              type="number"
              name="min_salary"
              value={editableJob.min_salary}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Min Salary"
            />
            <input
              type="number"
              name="max_salary"
              value={editableJob.max_salary}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Max Salary"
            />
            <input
              type="text"
              name="location"
              value={editableJob.location}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Location"
            />
            <textarea
              name="description"
              value={editableJob.description}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Description"
            />
          </form>
          <Button
            onClick={() => setIsEditing(false)}
            className="mt-3 bg-black text-white hover:bg-gray-800"
            variant='default'
          >
            Save Changes
          </Button>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer space-y-2"
        >
          <h3 className="text-lg font-semibold">{job.job_title}</h3>
          <p className="text-sm text-gray-600">{job.skills}</p>
          <p className="text-sm text-gray-600">{job.job_role}</p>
          <p className="text-sm text-gray-600">
            {job.min_salary} - {job.max_salary} USD
          </p>
          <p className="text-sm text-gray-600">{job.location}</p>
          <div className="flex space-x-2 mt-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onHide(job.id);
              }}
              variant='outline'
            >
              Hide
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job.id);
              }}
             variant='default'
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
