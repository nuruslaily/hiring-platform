export interface User {
  id: number;
  email: string;
  password: string;
  userType: "admin" | "jobseeker";
  name: string;
  company?: string;
  profession?: string;
}

export const mockUsers = {
  users: [
    {
      id: 1,
      email: "admin@example.com",
      password: "password",
      userType: "admin" as const,
      name: "Admin User",
      company: "Tech Company Inc.",
    },
    {
      id: 2,
      email: "hr@example.com",
      password: "password",
      userType: "admin" as const,
      name: "HR Manager",
      company: "Tech Company Inc.",
    },
    {
      id: 3,
      email: "jobseeker@example.com",
      password: "password",
      userType: "jobseeker" as const,
      name: "John Doe",
      profession: "Frontend Developer",
    },
    {
      id: 4,
      email: "developer@example.com",
      password: "password",
      userType: "jobseeker" as const,
      name: "Jane Smith",
      profession: "Fullstack Developer",
    },
    {
      id: 5,
      email: "designer@example.com",
      password: "password",
      userType: "jobseeker" as const,
      name: "Mike Johnson",
      profession: "UI/UX Designer",
    },
  ],
};
