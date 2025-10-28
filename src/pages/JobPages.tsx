import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import JobList from "./JobList";
import { useNavigate } from "react-router-dom";
import { mockCandidates } from "../data/candidates";
import type { Job } from "../types/job";
import { toast } from "react-toastify";

const JobPages: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  // const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    // const savedUserName = localStorage.getItem("userName");
    const savedUserRole =
      (localStorage.getItem("userRole") as "admin" | "jobseeker") ||
      "jobseeker";
    setUserRole(savedUserRole);

    if (!isAuthenticated || !savedUserRole) {
      navigate("/login");
      return;
    }

    // setUserName(savedUserName || "");
    setUserRole(savedUserRole);
  }, [navigate]);

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      setAllJobs(JSON.parse(savedJobs));
    }
  }, []);

  useEffect(() => {
    const savedCandidates = localStorage.getItem("candidates");
    if (!savedCandidates) {
      localStorage.setItem(
        "candidates",
        JSON.stringify(mockCandidates.candidates)
      );
    }
  }, []);

  useEffect(() => {
    let filtered = allJobs;

    if (userRole === "jobseeker") {
      filtered = filtered.filter((job) => job.status === "active");
    }

    if (query.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.jobName.toLowerCase().includes(query.toLowerCase()) ||
          job.jobType.toLowerCase().includes(query.toLowerCase()) ||
          job.jobDescription.toLowerCase().includes(query.toLowerCase())
      );
    }

    // setFilteredJobs(filtered);
  }, [allJobs, query, userRole]);

  const addNewJob = (newJob: Omit<Job, "id" | "createdAt">) => {
    const jobWithId: Job = {
      ...newJob,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedJobs = [...allJobs, jobWithId];
    setAllJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    toast.success("Job vacancy successfully created!");
  };

  // const updateJobStatus = (jobId: string, newStatus: Job["status"]) => {
  //   const updatedJobs = allJobs.map((job) =>
  //     job.id === jobId ? { ...job, status: newStatus } : job
  //   );
  //   setAllJobs(updatedJobs);
  //   localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  // };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col">
          <JobList
            query={query}
            onQueryChange={setQuery}
            // onStatusChange={updateJobStatus}
            onCreateJob={addNewJob}
          />
        </div>
      </div>
    </div>
  );
};

export default JobPages;
