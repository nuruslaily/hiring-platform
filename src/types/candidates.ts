export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  domicile: string;
  gender: string;
  linkedinLink: string;
  appliedDate: string;
  status: "applied" | "reviewed" | "interview" | "rejected" | "hired";
  profilePhoto?: string;
}
