import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import EmptyCandidateState from "../components/state/EmptyCandidateState";
import type { Job } from "../types/job";
import type { Candidate } from "../types/candidates";
import CandidateTable from "../components/CandidateTable";

const ManageJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const savedJobs = localStorage.getItem("jobs");
    const savedCandidates = localStorage.getItem("candidates");

    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs);
      const currentJob = jobs.find((j) => j.id === id);
      setJob(currentJob || null);
    }

    if (savedCandidates) {
      const allCandidates: Candidate[] = JSON.parse(savedCandidates);
      const jobCandidates = allCandidates.filter((c) => c.jobId === id);
      setCandidates(jobCandidates);
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01959F]"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <EmptyCandidateState />
      </div>
    );
  }

  const handleStatusChange = (newStatus: "active" | "inactive" | "draft") => {
    if (!job) return;

    const updatedJob = { ...job, status: newStatus };
    setJob(updatedJob);

    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      const jobs: Job[] = JSON.parse(savedJobs);
      const updatedJobs = jobs.map((j) =>
        j.id === job.id ? { ...j, status: newStatus } : j
      );
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />

      <div className="w-full mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#01959F] rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <span className="text-white font-bold text-lg sm:text-xl">
                {job.jobName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 wrap-break-word">
                {job.jobName}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1">
                {candidates.length} candidate
                {candidates.length !== 1 ? "s" : ""} applied
              </p>
            </div>
          </div>

          <div className="sm:hidden">
            <select
              value={job.status}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "active" | "inactive" | "draft"
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition w-full
      ${
        job.status === "active"
          ? "bg-green-100 text-green-800 border-green-300"
          : job.status === "inactive"
          ? "bg-red-100 text-red-800 border-red-300"
          : "bg-yellow-100 text-yellow-800 border-yellow-300"
      }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <select
              value={job.status}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "active" | "inactive" | "draft"
                )
              }
              className={`px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition
      ${
        job.status === "active"
          ? "bg-green-100 text-green-800 border-green-300"
          : job.status === "inactive"
          ? "bg-red-100 text-red-800 border-red-300"
          : "bg-yellow-100 text-yellow-800 border-yellow-300"
      }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6 sm:hidden">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">
              {candidates.length}
            </p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-2xl font-bold text-gray-900">
              {candidates.filter((c) => c.status === "applied").length}
            </p>
            <p className="text-xs text-gray-500">Applied</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <CandidateTable candidates={candidates} />
            </div>
          ) : (
            <EmptyCandidateState />
          )}
        </div>
        {candidates.length > 0 && (
          <div className="fixed bottom-6 right-6 sm:hidden">
            <button className="bg-[#01959F] hover:bg-[#017E86] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#01959F]"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobPage;
