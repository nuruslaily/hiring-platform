import React, { useState } from "react";
import img1 from "../assets/img/img1.jpg";
import CreateJobModal from "./CreateJobModal";

interface CreateJobCardProps {
  onCreateJob: (job: any) => void;
}

const CreateJobCard: React.FC<CreateJobCardProps> = ({ onCreateJob }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCreateJob = (jobData: any) => {
    const newJob = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "active",
      createdBy: "admin",
      ...jobData,
    };

    // Ambil existing jobs
    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = [...existingJobs, newJob];

    // Simpan ke localStorage biar jobseeker bisa lihat juga
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    onCreateJob(newJob);
    setShowModal(false);
  };

  return (
    <>
      <div className="rounded-xl overflow-hidden shadow-lg max-w-sm w-[280px] bg-white relative">
        <div className="relative">
          <img
            src={img1}
            alt="Team work"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-5 text-white">
            <h2 className="text-base font-semibold mb-1">
              Recruit the best candidates
            </h2>
            <p className="text-sm text-gray-200 mb-3 leading-tight">
              Create jobs, invite, and hire with ease
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#01959F] hover:bg-[#017F88] text-white px-4 py-2 rounded-lg font-medium transition text-sm"
            >
              Create a new job
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <CreateJobModal
          onClose={() => setShowModal(false)}
          onCreateJob={handleCreateJob}
        />
      )}
    </>
  );
};

export default CreateJobCard;
