import JobCard from "../../components/user/Console/JobCard";
import { useState } from "react";

const jobs = [
  {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  },
  {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  },
  {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  }, {
    id: "job2",
    job_title: "Data Scientist",
    skills: "Python, SQL, Machine Learning",
    job_role: "Data Analyst",
    min_salary: 60000,
    max_salary: 90000,
    job_level: "Senior",
    location: "Kochi, Kerala, India",
    city: "Kochi",
    description:
      "We are looking for a talented Data Scientist to join our team. You will be responsible for analyzing large datasets and developing machine learning models.",
    hidden: false,
  },
];
function JobList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("job_title");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterAndSortJobs(term, sortOption);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    filterAndSortJobs(searchTerm, option);
  };

  const filterAndSortJobs = (term: string, option: string) => {
    const filtered = jobs.filter(
      (job) =>
        job.job_title.toLowerCase().includes(term) ||
        job.skills.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
    );

    const sorted = filtered.sort((a, b) =>
      a[option as keyof typeof a].toString().localeCompare(
        b[option as keyof typeof b].toString()
      )
    );

    setFilteredJobs(sorted);
  };

  const handleDelete = (id: string) => {
    console.log("Deleted Job ID:", id);
    // Add delete logic here
  };

  const handleHide = (id: string) => {
    console.log("Hid Job ID:", id);
    // Add hide logic here
  };

  return (
    <div className="p-10">
      {/* Search and Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search by title, skills, or location"
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded p-2 w-1/2"
        />
        <select
          value={sortOption}
          onChange={handleSort}
          className="border border-gray-300 rounded p-2"
        >
          <option value="job_title">Sort by Title</option>
          <option value="min_salary">Sort by Min Salary</option>
          <option value="max_salary">Sort by Max Salary</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>

      {/* Job Cards in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={handleDelete}
            onHide={handleHide}
          />
        ))}
      </div>
    </div>
  );
}

export default JobList