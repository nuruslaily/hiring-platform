import React from "react";
import emptyIllustration from "../assets/illustrations/empty-candidate.webp";

const EmptyCandidateState: React.FC = () => {
  return (
    <main className="min-h-screen flex justify-center items-center text-center px-2">
      <div className="flex flex-col justify-center items-center text-center">
        <img
          src={emptyIllustration}
          alt="No jobs illustration"
          className="w-60 max-w-[250px] mx-auto mb-6"
        />
        <h2 className="text-xl font-semibold mb-2 text-[#000000]">
          No candidates found
        </h2>
        <p className="text-sm mb-6 text-[#757575]">
          Share your job vacancies so that more candidates will apply.
        </p>
      </div>
    </main>
  );
};

export default EmptyCandidateState;
