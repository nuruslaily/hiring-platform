import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import JobDetailCard from "../components/JobDetailCard";
import { SearchIcon } from "lucide-react";
import EmptyJobState from "../components/EmptyJobState";
import type { Job } from "../types/job";
import { useNavigate } from "react-router-dom";

interface JobListProps {
  query: string;
  onQueryChange: (query: string) => void;
  onStatusChange: (jobId: string, newStatus: Job["status"]) => void;
  onCreateJob: (job: Omit<Job, "id" | "createdAt">) => void;
}

const JobList: React.FC<JobListProps> = ({
  query,
  onQueryChange,
  onStatusChange,
  onCreateJob,
}) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [role, setRole] = useState<"admin" | "jobseeker">("jobseeker");

  useEffect(() => {
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    setJobs(storedJobs);

    const storedRole = (localStorage.getItem("userRole") || "jobseeker") as
      | "admin"
      | "jobseeker";
    setRole(storedRole);

    const handleStorageChange = () => {
      const updatedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      setJobs(updatedJobs);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const filteredJobs = jobs.filter((job) =>
    job.jobName.toLowerCase().includes(query.toLowerCase())
  );

  const visibleJobs =
    role === "jobseeker"
      ? filteredJobs.filter((job) => job.status === "active")
      : filteredJobs;

  const hasActiveJobs = jobs.some((job) => job.status === "active");

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleApply = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      navigate(`/apply/${job.id}`, { state: { job } });
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 ">
      {/* 🔍 Search form */}
      {role === "admin" && (
        <form
          onSubmit={handleSearch}
          className="relative mr-10 ml-10 mt-10 max-w-6xl w-full self-start"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by job details"
            className="w-full pl-4 pr-10 py-2 border border-[#EFEEEE] rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-[#757575]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <SearchIcon className="h-5 w-5 text-[#01959F]" />
          </button>
        </form>
      )}

      {/* 💼 Split layout (jobseeker) */}
      {role === "jobseeker" && visibleJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6 m-10">
          {/* LEFT: Job List */}
          <div className="flex flex-col overflow-y-auto max-h-[80vh] gap-4 pr-2">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className={`cursor-pointer transition rounded-lg hover:shadow-md ${
                  selectedJob?.id === job.id
                    ? "ring-2 ring-[#01959F]"
                    : "ring-1 ring-gray-200"
                }`}
              >
                <JobCard job={job} userType="jobseeker" />
              </div>
            ))}
          </div>

          {/* RIGHT: Job Detail */}
          <div className="bg-transparent">
            <JobDetailCard
              job={selectedJob}
              onApply={handleApply}
              userType="jobseeker"
            />
          </div>
        </div>
      ) : role === "admin" ? (
        // 🧩 Admin View
        <div className="relative m-10 max-w-5xl w-full self-start">
          {visibleJobs.length > 0 ? (
            ["active", "inactive", "draft"].map((status) => {
              const statusJobs = visibleJobs.filter(
                (job) => job.status === status
              );
              if (statusJobs.length === 0) return null;

              return (
                <div key={status} className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                    {status}
                  </h3>
                  <div className="space-y-4">
                    {statusJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onStatusChange={onStatusChange}
                        userType="admin"
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-64">
              <EmptyJobState onCreateJob={onCreateJob} />
            </div>
          )}
        </div>
      ) : (
        // 🌼 Empty state
        <div className="flex justify-center items-center h-64">
          {role === "jobseeker" || !hasActiveJobs ? (
            <EmptyJobState onCreateJob={onCreateJob} />
          ) : (
            <p className="text-gray-500 text-center">
              No active job postings at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobList;
