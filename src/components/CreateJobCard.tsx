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
      <div className="fixed right-10 items-end justify-end rounded-xl overflow-hidden shadow-lg max-w-xl gap-24 w-[300px] z-30 mt-10">
        <div className="relative">
          <img
            src={img1}
            alt="Team work"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 text-white">
            <h2 className="text-lg font-semibold mb-1">
              Recruit the best candidates
            </h2>
            <p className="text-sm text-gray-200 mb-4">
              Create jobs, invite, and hire with ease
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition"
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
