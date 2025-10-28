import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  userType: "admin" | "jobseeker";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  return {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.userType === "admin",
    isJobseeker: user?.userType === "jobseeker",
  };
};
