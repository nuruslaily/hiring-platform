import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import JobDetailCard from "../components/JobDetailCard";
import { SearchIcon, ArrowLeft } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [showJobDetail, setShowJobDetail] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

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
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("resize", checkDevice);
    };
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

  // const hasActiveJobs = jobs.some((job) => job.status === "active");

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    if (isMobile) {
      setShowJobDetail(true);
    }
  };

  const handleBackToList = () => {
    setShowJobDetail(false);
    setSelectedJob(null);
  };

  const handleApply = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      navigate(`/apply/${job.id}`, { state: { job } });
    }
  };

  // Mobile view untuk jobseeker - TAMPILAN DETAIL
  if (isMobile && role === "jobseeker" && showJobDetail && selectedJob) {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        {/* Header untuk kembali ke list */}
        <div className="bg-white shadow-sm px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackToList}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Job Details
              </h1>
              <p className="text-sm text-gray-500">Back to jobs list</p>
            </div>
          </div>
        </div>

        {/* Job Detail Content */}
        <div className="p-4">
          <JobDetailCard
            job={selectedJob}
            onApply={handleApply}
            userType="jobseeker"
          />
        </div>
      </div>
    );
  }

  // Mobile view untuk jobseeker - TAMPILAN LIST
  if (isMobile && role === "jobseeker") {
    return (
      <div className="font-sans min-h-screen bg-gray-50">
        {/* Search form untuk mobile */}
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by job details"
              className="w-full pl-4 pr-10 py-3 border border-[#EFEEEE] rounded-lg shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-[#757575]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <SearchIcon className="h-5 w-5 text-[#01959F]" />
            </button>
          </form>
        </div>

        {visibleJobs.length > 0 ? (
          <div className="p-4 space-y-4">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleSelectJob(job)}
                className={`cursor-pointer transition rounded-lg ${
                  selectedJob?.id === job.id
                    ? "ring-2 ring-[#01959F] bg-[#F7FEFF]"
                    : "ring-1 ring-gray-200 bg-white"
                }`}
              >
                <JobCard job={job} userType="jobseeker" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[70vh]">
            <EmptyJobState onCreateJob={onCreateJob} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* 🔍 Search form */}
      {role === "admin" && (
        <div className="bg-white px-4 py-3 border-b border-gray-200 md:bg-transparent md:border-none">
          <form
            onSubmit={handleSearch}
            className="relative w-full md:max-w-3xl md:mx-auto flex justify-start"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by job details"
              className="w-full pl-4 pr-10 py-3 border border-[#EFEEEE] rounded-lg shadow-sm 
                 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-[#757575]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <SearchIcon className="h-5 w-5 text-[#01959F]" />
            </button>
          </form>
        </div>
      )}

      {/* 💼 Unified layout */}
      <div className="mx-4 md:mx-8 mt-4 md:mt-8 flex flex-col items-start justify-start">
        {role === "jobseeker" && visibleJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 justify-start items-start w-full">
            {/* LEFT: Job List */}
            <div className="flex flex-col overflow-y-auto max-h-[70vh] md:max-h-[80vh] gap-4 pr-1">
              {visibleJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`cursor-pointer transition rounded-lg hover:shadow-md ${
                    selectedJob?.id === job.id
                      ? "ring-2 ring-[#01959F] bg-[#F7FEFF]"
                      : "ring-1 ring-gray-200 bg-white"
                  }`}
                >
                  <JobCard job={job} userType="jobseeker" />
                </div>
              ))}
            </div>

            {/* RIGHT: Job Detail */}
            <div className="bg-transparent h-full">
              <JobDetailCard
                job={selectedJob}
                onApply={handleApply}
                userType="jobseeker"
              />
            </div>
          </div>
        ) : role === "admin" ? (
          <div className="max-w-6xl w-full">
            {visibleJobs.length > 0 ? (
              ["active", "inactive", "draft"].map((status) => {
                const statusJobs = visibleJobs.filter(
                  (job) => job.status === status
                );
                if (statusJobs.length === 0) return null;

                return (
                  <div key={status} className="mb-6 md:mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                      {status}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
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
              <div className="flex justify-center items-center min-h-[50vh]">
                <EmptyJobState onCreateJob={onCreateJob} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[50vh]">
            <EmptyJobState onCreateJob={onCreateJob} />
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
