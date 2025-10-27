import React from "react";
import logo from "../assets/logogram.svg";
import type { Job } from "../types/job";
import { useNavigate } from "react-router-dom";

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
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-500">Select a job to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full h-fit font-['Nunito_Sans']">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <img
            src={logo}
            alt="Rakamin"
            className="w-12 h-12 border border-gray-200 rounded-lg object-cover"
          />
          <div>
            <span className="text-white text-sm font-semibold bg-[#43936C] px-2 py-1 rounded w-max mb-2 block">
              {job.jobType === "fulltime" ? "Full-Time" : "Part-Time"}
            </span>
            <h2 className="text-2xl font-bold text-[#1D1F20]">{job.jobName}</h2>
            <p className="text-gray-600 text-sm mt-1">Rakamin</p>
          </div>
        </div>

        {userType === "jobseeker" && (
          <button
            onClick={() => onApply?.(job.id)}
            className="bg-[#FBC037] text-[#404040] px-6 py-2 rounded-lg hover:bg-[#FA9810] transition font-semibold"
          >
            Apply
          </button>
        )}
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="text-gray-700 leading-relaxed text-[15px]">
        {job.jobDescription || "No description provided."}
      </div>
    </div>
  );
};

export default JobDetailCard;
