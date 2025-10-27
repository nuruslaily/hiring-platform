import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logogram.svg";
import { Banknote, Locate, MapPin } from "lucide-react";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
  onStatusChange?: (jobId: string, newStatus: Job["status"]) => void;
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
  onStatusChange,
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onStatusChange && userType === "admin") {
      onStatusChange(job.id, e.target.value as Job["status"]);
    }
  };

  return (
    <div
      className={`${
        userType === "jobseeker"
          ? "bg-[#F7FEFF] border-2 border-[#01777F]"
          : "bg-white border border-gray-200"
      }  rounded-lg p-6 shadow-sm hover:shadow-md transition ${
        userType === "jobseeker" ? "h-full flex flex-col" : ""
      } font-['Nunito_Sans']`}
    >
      {/* Status + Date → hanya admin */}
      {userType === "admin" && (
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`border rounded-lg px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
              job.status
            )}`}
          >
            {job.status}
          </span>
          <span className="border border-[#E5E7EB] rounded px-3 py-1 text-sm text-[#404040]">
            started on {formatDate(job.createdAt)}
          </span>
        </div>
      )}
      <div className="mb-4 flex flex-row gap-4 items-start">
        {/* Kiri: Logo */}
        {userType === "jobseeker" && (
          <img
            src={logo}
            alt="Rakamin"
            className="w-10 h-10 border-[#E0E0E0] border-2 rounded-lg object-cover"
          />
        )}

        {/* Kanan: Info Pekerjaan */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-[#1D1F20]">{job.jobName}</h3>

          {userType === "jobseeker" && (
            <div className="text-sm text-gray-600">
              <p className="font-normal">Rakamin</p>
            </div>
          )}
        </div>
      </div>

      {/* Gaji di bawah blok */}
      {userType === "jobseeker" && (
        <>
          <p className="text-[#616161] font-normal ">
            <MapPin className="inline-block mr-1" /> Jakarta Selatan
          </p>
          <p className="font-normal text-[#616161] mb-4 gap-2">
            {" "}
            <Banknote className="inline-block mr-2" />
            Rp {formatRupiahDisplay(job.minSalary)} - Rp{" "}
            {formatRupiahDisplay(job.maxSalary)}
          </p>
        </>
      )}

      {userType === "admin" && (
        <div className="flex justify-between items-end mt-auto">
          <p className="font-normal text-[#616161] mb-4 gap-2">
            Rp {formatRupiahDisplay(job.minSalary)} - Rp{" "}
            {formatRupiahDisplay(job.maxSalary)}
          </p>
          <button
            className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
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
