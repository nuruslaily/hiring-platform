import React from "react";
import logo from "../assets/logogram.svg";
import type { Job } from "../types/job";

interface JobDetailCardProps {
  job: Job | null;
  onApply?: (id: string) => void;
  userType?: "admin" | "jobseeker";
}

const JobDetailCard: React.FC<JobDetailCardProps> = ({
  job,
  onApply,
  userType = "jobseeker",
}) => {
  if (!job) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Select a job to view details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col h-full max-h-[80vh] overflow-hidden font-['Nunito_Sans']">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-start gap-4">
          <img
            src={logo}
            alt="Rakamin"
            className="w-12 h-12 border border-gray-200 rounded-lg object-cover"
          />
          <div>
            <span className="text-white text-xs font-semibold bg-[#43936C] px-2 py-1 rounded w-max mb-2 block">
              {job.jobType === "fulltime" ? "Full-Time" : "Part-Time"}
            </span>
            <h2 className="text-xl font-bold text-[#1D1F20] leading-tight">
              {job.jobName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">Rakamin</p>
          </div>
        </div>

        {userType === "jobseeker" && (
          <button
            onClick={() => onApply?.(job.id)}
            className="bg-[#FBC037] text-[#404040] px-6 py-2 rounded-lg hover:bg-[#FA9810] transition font-semibold text-sm shadow-sm"
          >
            Apply
          </button>
        )}
      </div>

      {/* Body */}
      <div className="overflow-y-auto px-6 py-4 text-gray-700 leading-relaxed text-[15px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {job.jobDescription ? (
          <div className="whitespace-pre-line">{job.jobDescription}</div>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}
      </div>
    </div>
  );
};

export default JobDetailCard;
