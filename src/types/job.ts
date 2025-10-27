export interface Job {
  id: string;
  jobName: string;
  jobType: string;
  jobDescription: string;
  numberOfCandidates: number;
  minSalary: string;
  maxSalary: string;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  infoStates: Record<string, string>;
}
