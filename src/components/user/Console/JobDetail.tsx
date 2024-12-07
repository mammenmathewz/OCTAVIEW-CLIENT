import React, { useEffect, useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface JobDetailProps {
  job: any; // Job data passed as a prop
  onCancel: () => void; // Callback to handle canceling the edit
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onCancel }) => {
  const [formData, setFormData] = useState<any>({ ...job });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(job)) {
      setFormData({ ...job }); // Update state only if the job data has changed
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === "min_salary" || name === "max_salary" ? +value : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      hidden: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.min_salary > formData.max_salary) {
      alert("Min salary cannot be greater than Max salary!");
      return;
    }
    setEditMode(false); // Exit edit mode
  };

  const handleCancelEdit = () => {
    setFormData({ ...job }); // Reset the form data to initial job
    onCancel();
    setEditMode(false); // Exit edit mode
  };

  return (
    <div className="p-4 space-y-4">
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-sm rounded-lg border border-neutral-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                placeholder="Enter job title"
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="job_role">Job Role</Label>
              <Input
                id="job_role"
                name="job_role"
                value={formData.job_role}
                onChange={handleChange}
                placeholder="Enter job role"
                className="mt-2 w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_level">Job Level</Label>
              <Input
                id="job_level"
                name="job_level"
                value={formData.job_level}
                onChange={handleChange}
                placeholder="Enter job level"
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => setFormData({ ...formData, jobType: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Job Type</SelectLabel>
                    <SelectItem value="onsite">Onsite</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="mt-2 w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="mt-2 w-full"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter required skills"
              className="mt-2 w-full"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min_salary">Min Salary</Label>
              <Input
                id="min_salary"
                name="min_salary"
                type="number"
                value={formData.min_salary}
                onChange={handleChange}
                placeholder="Enter minimum salary"
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="max_salary">Max Salary</Label>
              <Input
                id="max_salary"
                name="max_salary"
                type="number"
                value={formData.max_salary}
                onChange={handleChange}
                placeholder="Enter maximum salary"
                className="mt-2"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              className="mt-2 w-full rounded-md border border-neutral-300 p-2 text-sm"
              rows={5}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="hidden"
              checked={formData.hidden}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="hidden">Hide this job</Label>
          </div>

          <Button type="submit" className="w-full" variant='outline'>
            Save
          </Button>
          <Button type="button" className="w-full mt-2" variant="destructive" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </form>
      ) : (
        <div className="relative p-4 bg-white shadow-sm rounded-lg border border-neutral-200 space-y-4">
        {/* Buttons at the top-right corner */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditMode(true)}
            className="px-4"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => console.log('Delete clicked')} // Replace with delete logic
            className="px-4"
          >
            Delete
          </Button>
        </div>
      
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-neutral-600">Job Title:</Label>
            <p className="mt-1 text-sm text-neutral-800">{formData.job_title}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-neutral-600">Job Role:</Label>
            <p className="mt-1 text-sm text-neutral-800">{formData.job_role}</p>
          </div>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-neutral-600">Job Level:</Label>
            <p className="mt-1 text-sm text-neutral-800">{formData.job_level}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-neutral-600">Job Type:</Label>
            <p className="mt-1 text-sm text-neutral-800 capitalize">{formData.jobType}</p>
          </div>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-neutral-600">City:</Label>
            <p className="mt-1 text-sm text-neutral-800">{formData.city}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-neutral-600">Location:</Label>
            <p className="mt-1 text-sm text-neutral-800">{formData.location}</p>
          </div>
        </div>
      
        <div>
          <Label className="text-sm font-medium text-neutral-600">Skills:</Label>
          <p className="mt-1 text-sm text-neutral-800">{formData.skills}</p>
        </div>
      
        <div>
          <Label className="text-sm font-medium text-neutral-600">Salary Range:</Label>
          <p className="mt-1 text-sm text-neutral-800">
            {formData.min_salary} - {formData.max_salary}
          </p>
        </div>
      
        <div>
          <Label className="text-sm font-medium text-neutral-600">Description:</Label>
          <p className="mt-1 text-sm text-neutral-800">{formData.description}</p>
        </div>
      
        <div>
          <Label className="text-sm font-medium text-neutral-600">Hidden:</Label>
          <p className="mt-1 text-sm text-neutral-800">{formData.hidden ? "Yes" : "No"}</p>
        </div>
      </div>
      
      )}
    </div>
  );
};

export default JobDetail;
