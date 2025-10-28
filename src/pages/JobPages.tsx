import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import JobList from "./JobList";
import { useNavigate } from "react-router-dom";
import { mockCandidates } from "../data/candidates";
import type { Job } from "../types/job";

const JobPages: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const savedUserRole =
      (localStorage.getItem("userRole") as "admin" | "jobseeker") ||
      "jobseeker";
    setUserRole(savedUserRole);

    if (!isAuthenticated || !savedUserRole) {
      navigate("/login");
      return;
    }

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

  }, [allJobs, query, userRole]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col">
          <JobList
            query={query}
            onQueryChange={setQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default JobPages;
