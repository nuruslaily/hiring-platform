import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logogram.svg";
import { Banknote, MapPin } from "lucide-react";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  userType?: "admin" | "jobseeker";
}

const formatRupiahDisplay = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  return numericValue
    ? numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "0";
};

const JobCard: React.FC<JobCardProps> = ({
  job,
  userType = "admin",
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-[#43936C] border-[#B8DBCA] bg-[#F8FBF9]";
      case "inactive":
        return "text-[#E11428] border-[#F5B1B7] bg-[#FFFAFA]";
      case "draft":
        return "text-[#FBC037] border-[#FEEABC] bg-[#FFFCF5]";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`${
        userType === "jobseeker"
          ? "bg-[#F7FEFF] border-2 border-[#01777F]"
          : "bg-white border border-gray-200"
      } rounded-lg p-4 md:p-6 shadow-sm hover:shadow-md transition ${
        userType === "jobseeker" ? "h-full flex flex-col" : ""
      } font-['Nunito_Sans']`}
    >
      {userType === "admin" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <span
            className={`border rounded-lg px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
              job.status
            )} w-fit`}
          >
            {job.status}
          </span>
          <span className="border border-[#E5E7EB] rounded px-3 py-1 text-sm text-[#404040] w-fit">
            started on {formatDate(job.createdAt)}
          </span>
        </div>
      )}

      <div className="mb-4 flex flex-row gap-3 md:gap-4 items-start">
        {userType === "jobseeker" && (
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 md:w-10 md:h-10 border-[#E0E0E0] border-2 rounded-lg object-cover shrink-0"
          />
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-[#1D1F20] wrap-break-word">
            {job.jobName}
          </h3>

          {userType === "jobseeker" && (
            <div className="text-sm text-gray-600">
              <p className="font-normal">Raka min</p>
            </div>
          )}
        </div>
      </div>

      {userType === "jobseeker" && (
        <>
          <p className="text-[#616161] font-normal text-sm md:text-base">
            <MapPin className="inline-block mr-1 h-4 w-4" /> Jakarta Selatan
          </p>
          <p className="font-normal text-[#616161] mb-4 gap-2 text-sm md:text-base">
            {" "}
            <Banknote className="inline-block mr-2 h-4 w-4" />
            Rp {formatRupiahDisplay(job.minSalary)} - Rp{" "}
            {formatRupiahDisplay(job.maxSalary)}
          </p>
        </>
      )}

      {userType === "admin" && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mt-4">
          <p className="font-normal text-[#616161] text-sm md:text-base">
            Rp {formatRupiahDisplay(job.minSalary)} - Rp{" "}
            {formatRupiahDisplay(job.maxSalary)}
          </p>
          <button
            className={`text-sm font-medium px-4 py-2 rounded-lg transition w-full sm:w-auto ${
              userType === "admin"
                ? "bg-[#01959F] text-white hover:bg-[#017f7f]"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
            onClick={() => navigate(`/jobs/manage/${job.id}`)}
          >
            Manage Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
