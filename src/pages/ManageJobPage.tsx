import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import EmptyCandidateState from "../components/EmptyCandidateState";
import type { Job } from "../types/job";
import type { Candidate } from "../types/candidates";
import CandidateTable from "../components/CandidateTable";

const ManageJobPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load job dan candidates dari localStorage
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
        Loading...
      </div>
    );
  }

  if (!job) {
    return <EmptyCandidateState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />

      <div className="w-full max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {job?.jobName}
              </h1>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          {candidates.length > 0 ? (
            <CandidateTable candidates={candidates} />
          ) : (
            /* Empty State - Sesuai Gambar */
            <EmptyCandidateState />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageJobPage;
