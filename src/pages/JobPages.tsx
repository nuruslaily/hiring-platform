import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import JobList from "./JobList";
import CreateJobCard from "../components/CreateJobCard";
import Notification from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { mockCandidates } from "../data/mockCandidates";
import type { Job } from "../types/job";

const JobPages: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Check device size
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Check login dan ambil data user
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const savedUserName = localStorage.getItem("userName");
    const savedUserRole = localStorage.getItem("userRole");

    if (!isAuthenticated || !savedUserRole) {
      navigate("/login");
      return;
    }

    setUserName(savedUserName || "");
    setUserRole(savedUserRole);
  }, [navigate]);

  // Load semua jobs dari localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      setAllJobs(JSON.parse(savedJobs));
    }
  }, []);

  // Inisialisasi data kandidat
  useEffect(() => {
    const savedCandidates = localStorage.getItem("candidates");
    if (!savedCandidates) {
      localStorage.setItem(
        "candidates",
        JSON.stringify(mockCandidates.candidates)
      );
    }
  }, []);

  // Filter jobs berdasarkan query dan role
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

    setFilteredJobs(filtered);
  }, [allJobs, query, userRole]);

  // Notifikasi
  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification((prev) => ({ ...prev, show: false })),
      3000
    );
  };

  // Tambah job baru
  const addNewJob = (newJob: Omit<Job, "id" | "createdAt">) => {
    const jobWithId: Job = {
      ...newJob,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updatedJobs = [...allJobs, jobWithId];
    setAllJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    showNotification("Job vacancy successfully created", "success");
  };

  // Update status job
  const updateJobStatus = (jobId: string, newStatus: Job["status"]) => {
    const updatedJobs = allJobs.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );
    setAllJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 flex flex-col">
          <JobList
            query={query}
            onQueryChange={setQuery}
            onStatusChange={updateJobStatus}
            onCreateJob={addNewJob}
          />

          {userRole === "admin" && !isMobile && (
            <CreateJobCard onCreateJob={addNewJob} />
          )}
        </div>
      </div>

      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default JobPages;
