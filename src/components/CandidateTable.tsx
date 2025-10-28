import React, { useState, useMemo } from "react";
import type { Candidate } from "../types/candidates";

interface CandidateTableProps {
  candidates: Candidate[];
}

const CandidateTable: React.FC<CandidateTableProps> = ({ candidates }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [candidates, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const currentCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm font-['Nunito_Sans']">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Candidate List</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-72 px-3 py-2 border border-gray-300 focus:text-[#404040] rounded-md text-sm focus:ring-2 focus:ring-[#01959F] focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3">Nama Lengkap</th>
              <th className="px-6 py-3">Email Address</th>
              <th className="px-6 py-3">Phone Number</th>
              <th className="px-6 py-3">Date of Birth</th>
              <th className="px-6 py-3">Domicile</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Link LinkedIn</th>
            </tr>
          </thead>
          <tbody>
            {currentCandidates.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  {candidate.profilePhoto ? (
                    <img
                      src={candidate.profilePhoto}
                      alt={candidate.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#01959F]/20 flex items-center justify-center text-[#01959F] font-semibold">
                      {candidate.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-gray-900">
                    {candidate.name}
                  </span>
                </td>
                <td className="px-6 py-4">{candidate.email}</td>
                <td className="px-6 py-4">{candidate.phone}</td>
                <td className="px-6 py-4">{candidate.birthDate}</td>
                <td className="px-6 py-4">{candidate.domicile}</td>
                <td className="px-6 py-4">{candidate.gender}</td>
                <td className="px-6 py-4 text-[#01959F]">
                  <a
                    href={candidate.linkedinLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {candidate.linkedinLink}
                  </a>
                </td>
              </tr>
            ))}

            {currentCandidates.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500 italic"
                >
                  No candidates found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === 1
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-[#01959F] border-[#01959F] hover:bg-[#01959F]/10"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page <strong>{currentPage}</strong> of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border text-sm ${
              currentPage === totalPages
                ? "text-gray-400 border-gray-200 cursor-not-allowed"
                : "text-[#01959F] border-[#01959F] hover:bg-[#01959F]/10"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateTable;
