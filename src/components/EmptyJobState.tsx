import React, { useEffect, useState } from "react";
import emptyIllustration from "../assets/illustrations/empty-job.webp";
import CreateJobModal from "./CreateJobModal";

interface EmptyJobProps {
  onCreateJob: (job: any) => void;
}

const EmptyJobState: React.FC<EmptyJobProps> = ({ onCreateJob }) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // 🧩 Ambil role dari localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

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

  // 🎨 Konten untuk admin
  const adminContent = (
    <>
      <img
        src={emptyIllustration}
        alt="No jobs illustration"
        className="w-60 max-w-[250px] mx-auto mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2 text-[#404040]">
        No job openings available
      </h2>
      <p className="text-sm mb-6 text-[#404040]">
        There are currently no job listings available.
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium px-5 py-2 rounded-lg transition"
      >
        Create a new job
      </button>
    </>
  );

  // 🎨 Konten untuk jobseeker
  const jobseekerContent = (
    <>
      <img
        src={emptyIllustration}
        alt="No jobs illustration"
        className="w-60 max-w-[250px] mx-auto mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2 text-[#404040]">
        No job openings available
      </h2>
      <p className="text-sm mb-6 text-[#404040]">
        There are currently no job listings available. Please check back later.
      </p>
      <div className="text-sm text-gray-500">
        🔍 New jobs are posted regularly
      </div>
    </>
  );

  return (
    <main className="flex-1 flex flex-col justify-center items-center text-center px-2">
      <div className="flex flex-col justify-center items-center text-center">
        {role === "admin" && adminContent}
        {role === "jobseeker" && jobseekerContent}
        {!role && (
          <p className="text-gray-500 text-sm">⚠️ User not logged in.</p>
        )}

        {/* Modal hanya muncul untuk admin */}
        {role === "admin" && showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative">
              <CreateJobModal
                onClose={() => setShowModal(false)}
                onCreateJob={handleCreateJob}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default EmptyJobState;
