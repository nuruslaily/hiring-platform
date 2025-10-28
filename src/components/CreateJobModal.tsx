import { ChevronDownIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import type { Job } from "../types/job";

interface CreateJobModalProps {
  onClose: () => void;
  onCreateJob: (job: Omit<Job, "id" | "createdAt">) => void;
}

const jobTypes = [
  { value: "fulltime", label: "Full-time" },
  { value: "contract", label: "Contract" },
  { value: "parttime", label: "Part-time" },
  { value: "intern", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const formatRupiah = (value: string): string => {
  const numericValue = value.replace(/\D/g, "");
  if (numericValue) {
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return "";
};

const CreateJobModal: React.FC<CreateJobModalProps> = ({
  onClose,
  onCreateJob,
}) => {
  const [selected, setSelected] = useState(jobTypes[0]);
  const [jobName, setJobName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [descriptionItems, setDescriptionItems] = useState<string[]>([""]);
  const [numberOfCandidates, setNumberOfCandidates] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [infoStates, setInfoStates] = useState<Record<string, string>>({
    fullName: "Mandatory",
    photoProfile: "Mandatory",
    gender: "Mandatory",
    domicile: "Mandatory",
    email: "Mandatory",
    phone: "Mandatory",
    linkedinLink: "Mandatory",
    dateOfBirth: "Mandatory",
  });

  const lockedFields = ["fullName", "photoProfile", "email"];

  const handleToggle = (key: string, value: string) => {
    if (lockedFields.includes(key)) return;
    setInfoStates((prev) => ({ ...prev, [key]: value }));
  };

  const updateDescriptionItem = (index: number, value: string) => {
    const newItems = [...descriptionItems];
    newItems[index] = value;
    setDescriptionItems(newItems);

    const formattedDescription = newItems
      .filter((item) => item.trim() !== "")
      .map((item) => `• ${item}`)
      .join("\n");
    setJobDescription(formattedDescription);
  };

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatRupiah(value);
    setMinSalary(formattedValue);
  };

  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatRupiah(value);
    setMaxSalary(formattedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobName.trim() || !jobDescription.trim() || !numberOfCandidates) {
      return;
    }

    const newJob: Omit<Job, "id" | "createdAt"> = {
      jobName,
      jobType: selected.value,
      jobDescription,
      numberOfCandidates: parseInt(numberOfCandidates) || 1,
      minSalary,
      maxSalary,
      status: "draft",
      infoStates,
    };

    onCreateJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col relative max-h-[95vh] md:max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-[#EFEEEE] sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Job Opening
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#404040] text-2xl leading-none p-1"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 md:px-6 py-4 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Job Name */}
            <div>
              <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                Job Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="Ex. Front End Engineer"
                className="w-full text-[#404040] border-[#E0E0E0] border-2 rounded-lg px-4 py-3 md:py-2 focus:ring-2 focus:ring-[#01959F] outline-none"
                required
              />
            </div>

            {/* Job Type */}
            <div className="relative">
              <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                Job Type<span className="text-red-500">*</span>
              </label>

              <div className="dropdown w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn w-full justify-between bg-white border-2 border-[#E0E0E0] text-[#404040] hover:bg-gray-50 py-3 md:py-2"
                >
                  {selected?.label || "Select job type"}
                  <ChevronDownIcon className="w-5 h-5" />
                </div>

                <ul
                  tabIndex={0}
                  className="dropdown-content z-10 menu p-2 bg-white border border-gray-200 rounded-box w-full max-h-60 overflow-y-auto"
                >
                  {jobTypes.map((type) => (
                    <li key={type.value}>
                      <button
                        type="button"
                        onClick={() => setSelected(type)}
                        className={`text-left hover:bg-gray-50 ${
                          selected.value === type.value
                            ? "text-[#01959F] bg-gray-50"
                            : "text-[#404040]"
                        }`}
                      >
                        {type.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                Job Description<span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 border-2 border-[#E0E0E0] rounded-lg md:p-4">
                {descriptionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <textarea
                      value={item}
                      onChange={(e) =>
                        updateDescriptionItem(index, e.target.value)
                      }
                      placeholder="Ex."
                      className="flex-1 text-[#404040] border-none focus:outline-none focus:ring-0 min-w-0 max-h-3xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Number of Candidates */}
            <div>
              <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                Number of Candidates Needed
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={numberOfCandidates}
                onChange={(e) => setNumberOfCandidates(e.target.value)}
                placeholder="Ex. 2"
                className="w-full text-[#404040] border-2 border-[#E0E0E0] rounded-lg px-4 py-3 md:py-2 focus:ring-2 focus:ring-[#01959F] outline-none"
                required
                min="1"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                Job Salary
              </label>
              <div className="flex flex-col md:flex-row gap-3 justify-between">
                <div className="flex flex-col w-full">
                  <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                    Minimum Estimated Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#404040] font-medium">
                      Rp
                    </span>
                    <input
                      type="text"
                      placeholder="7.000.000"
                      value={minSalary}
                      onChange={handleMinSalaryChange}
                      className="w-full text-[#404040] border-2 border-[#E0E0E0] rounded-lg pl-10 pr-4 py-3 md:py-2 focus:ring-2 focus:ring-[#01959F] outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <label className="block text-start text-sm font-normal text-[#404040] mb-2">
                    Maximum Estimated Salary
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#404040] font-medium">
                      Rp
                    </span>
                    <input
                      type="text"
                      placeholder="8.000.000"
                      value={maxSalary}
                      onChange={handleMaxSalaryChange}
                      className="w-full text-[#404040] border-2 border-[#E0E0E0] rounded-lg pl-10 pr-4 py-3 md:py-2 focus:ring-2 focus:ring-[#01959F] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Minimum Info Required */}
            <div className="border text-start border-[#EDEDED] rounded-xl p-4 mt-6">
              <h3 className="text-[#404040] text-start font-bold mb-4">
                Minimum Profile Information Required
              </h3>

              <div className="space-y-3">
                {Object.entries(infoStates).map(([key, value]) => {
                  const isLocked = lockedFields.includes(key);

                  return (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-b-[#EDEDED] last:border-b-0"
                    >
                      <span className="capitalize text-[#404040] text-sm sm:text-base">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        {["Mandatory", "Optional", "Off"].map((option) => {
                          const isDisabled = isLocked && option !== "Mandatory";
                          const isActive = value === option;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                !isDisabled && handleToggle(key, option)
                              }
                              disabled={isDisabled}
                              className={`px-3 py-1 text-xs sm:text-sm rounded-2xl border transition ${
                                isDisabled
                                  ? "bg-[#F2F2F2] text-gray-400 border-[#E0E0E0] cursor-not-allowed"
                                  : isActive
                                  ? "border-[#01959F] text-[#01959F] bg-[#F7FEFF]"
                                  : "text-[#404040] border-[#E0E0E0] hover:border-[#01959F] hover:text-[#01959F]"
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EFEEEE] p-4 text-right sticky bottom-0 bg-white rounded-b-xl">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-[#01959F] hover:bg-[#017E86] text-white font-medium px-6 py-3 md:py-2 rounded-lg transition w-full sm:w-auto"
          >
            Publish Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;
