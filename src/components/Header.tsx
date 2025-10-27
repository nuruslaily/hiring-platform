import React, { useState } from "react";
import { ChevronRight, LogOut, User, Building, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Ambil data user dari localStorage
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";
  const userType =
    (localStorage.getItem("userRole") as "admin" | "jobseeker") || "jobseeker";

  const userName = localStorage.getItem("userName") || "User";
  const userCompany = localStorage.getItem("userCompany");
  const userProfession = localStorage.getItem("userProfession");

  const isManageJobPage = location.pathname.includes("/jobs/manage/");
  const isJobListPage =
    location.pathname === "/jobs" || location.pathname === "/admin";
  const isApplyPage = location.pathname.includes("/apply");

  // Handle logout
  const handleLogout = () => {
    setShowDropdown(false);
    setIsLoggingOut(true);

    setTimeout(() => {
      const savedJobs = localStorage.getItem("jobs");
      const savedCandidates = localStorage.getItem("candidates");
      localStorage.clear();
      if (savedJobs) localStorage.setItem("jobs", savedJobs);
      if (savedCandidates) localStorage.setItem("candidates", savedCandidates);
      sessionStorage.setItem("justLoggedOut", "true");
      window.location.href = "/login";
    }, 400);
  };

  const handleBackToJobList = () => {
    navigate(userType === "admin" ? "/admin" : "/jobs");
  };

  const getHeaderTitle = () => {
    if (isManageJobPage) return "Manage Candidate";
    if (isApplyPage) return "Apply for Job";
    if (isJobListPage)
      return userType === "admin" ? "Job List" : "Available Jobs";
    return "Dashboard";
  };

  const userInfo =
    userType === "admin"
      ? {
          title: userCompany || "Administrator",
          icon: <Building className="h-4 w-4 text-[#01959F]" />,
        }
      : {
          title: userProfession || "Job Seeker",
          icon: <User className="h-4 w-4 text-[#01959F]" />,
        };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center font-['Nunito_Sans']">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        {isManageJobPage ? (
          <>
            <button
              onClick={handleBackToJobList}
              className="text-[#404040] font-semibold hover:text-gray-900 text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 transition"
            >
              {userType === "admin" ? "Job List" : "Available Jobs"}
            </button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-[#404040] font-semibold text-sm border border-gray-300 rounded px-3 py-1 bg-gray-50">
              Manage Candidate
            </span>
          </>
        ) : (
          <h1 className="text-xl font-semibold text-gray-800">
            {getHeaderTitle()}
          </h1>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* User Info (desktop) */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">{userInfo.title}</p>
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#01959F] flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-sm text-gray-600">{userEmail}</p>
                <div className="flex items-center gap-2 mt-1">
                  {userInfo.icon}
                  <span className="text-xs text-gray-500 capitalize">
                    {userType} • {userInfo.title}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Logout Loading */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-[9999] transition-all duration-300">
          <Loader2 className="w-8 h-8 text-[#01959F] animate-spin" />
          <span className="mt-2 text-[#01959F] font-medium">
            Logging out...
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;
