import React, { useEffect, useState } from "react";
import emptyIllustration from "../../assets/illustrations/empty-job.webp";
import CreateJobModal from "../CreateJobModal";

interface EmptyJobProps {
  onCreateJob: (job: any) => void;
}

const EmptyJobState: React.FC<EmptyJobProps> = ({ onCreateJob }) => {
  const [showModal, setShowModal] = useState(false);
  const [role, setRole] = useState<string | null>(null);

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

    const existingJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = [...existingJobs, newJob];

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    onCreateJob(updatedJobs);
    setShowModal(false);
  };

  const adminContent = (
    <>
      <img
        src={emptyIllustration}
        alt="No jobs illustration"
        className="w-48 md:w-60 max-w-[200px] md:max-w-[250px] mx-auto mb-4 md:mb-6"
      />
      <h2 className="text-xl md:text-2xl font-semibold mb-2 text-[#404040] text-center px-4">
        No job openings available
      </h2>
      <p className="text-sm mb-6 text-[#404040] text-center px-4">
        There are currently no job listings available.
      </p>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium px-5 py-2 rounded-lg transition text-sm md:text-base"
      >
        Create a new job
      </button>
    </>
  );

  const jobseekerContent = (
    <>
      <img
        src={emptyIllustration}
        alt="No jobs illustration"
        className="w-48 md:w-60 max-w-[200px] md:max-w-[250px] mx-auto mb-4 md:mb-6"
      />
      <h2 className="text-xl md:text-2xl font-semibold mb-2 text-[#404040] text-center px-4">
        No job openings available
      </h2>
      <p className="text-sm mb-6 text-[#404040] text-center px-4">
        There are currently no job listings available. Please check back later.
      </p>
      <div className="text-sm text-gray-500 text-center">
        🔍 New jobs are posted regularly
      </div>
    </>
  );

  return (
    <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-8">
      <div className="flex flex-col justify-center items-center text-center max-w-md">
        {role === "admin" && adminContent}
        {role === "jobseeker" && jobseekerContent}
        {!role && (
          <p className="text-gray-500 text-sm">⚠️ User not logged in.</p>
        )}

        {role === "admin" && showModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
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
