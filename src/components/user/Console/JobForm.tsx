import React, { useState } from "react";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select";
import { useSelector } from "react-redux";
import { selectUserId } from "../../../service/redux/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitJob } from "../../../service/Api/jobApis";
import { useToast } from "../../../@/hooks/use-toast";

const JobForm: React.FC = () => {
  const [formData, setFormData] = useState({
    job_title: "",
    skills: "",
    job_role: "",
    jobType: "",
    min_salary: 0,
    max_salary: 0,
    job_level: "",
    location: "",
    city: "",
    description: "",
    hidden: false,
  });
  const userId = useSelector(selectUserId)
  const {toast} = useToast()
  const queryClient = useQueryClient()

  const {mutate,isPending, isError, error, data} = useMutation({
    mutationFn: (jobData: any) => submitJob(jobData,userId),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        variant:'default',
        description:data.message
      })
      setFormData({
        job_title: "",
        skills: "",
        job_role: "",
        jobType: "",
        min_salary: 0,
        max_salary: 0,
        job_level: "",
        location: "",
        city: "",
        description: "",
        hidden: false,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message || "An error occurred while submitting the job.",
      });
      console.error("Error submitting job:", error);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "min_salary" || name === "max_salary" ? +value : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      hidden: checked,
    }));
  };

  const handleJobTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      userId, 
    };
    if (formData.min_salary > formData.max_salary) {
      toast({
        description: "Max salary should be greater than min salary.",
      });
      return;
    }
    mutate(jobData);
    console.log("Submitted Data:", formData);
    setFormData({
      job_title: "",
      skills: "",
      job_role: "",
      jobType: "",
      min_salary: 0,
      max_salary: 0,
      job_level: "",
      location: "",
      city: "",
      description: "",
      hidden: false,
    });
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
            onValueChange={handleJobTypeChange}
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

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default JobForm;
