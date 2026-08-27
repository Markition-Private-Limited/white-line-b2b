"use client";

import React, { useState } from "react";
import { Download, FileText, Search } from "lucide-react";

interface ContractDocument {
  id: string;
  title: string;
  uploadedDate: string;
  fileSize: string;
}

const mockContracts: ContractDocument[] = [
  { id: "1", title: "Master Service Agreement 2024", uploadedDate: "Oct 24, 2023", fileSize: "2.4 MB" },
  { id: "2", title: "Corporate Liability Policy", uploadedDate: "Feb 05, 2024", fileSize: "4.8 MB" },
  { id: "3", title: "Chauffeur Service Standards", uploadedDate: "Mar 18, 2024", fileSize: "850 KB" },
  { id: "4", title: "Privacy & NDA Addendum", uploadedDate: "Jan 12, 2024", fileSize: "1.1 MB" },
  { id: "5", title: "Amended Fleet Access Rights", uploadedDate: "Apr 02, 2024", fileSize: "1.3 MB" },
  { id: "6", title: "Master Service Agreement 2024", uploadedDate: "Oct 24, 2023", fileSize: "2.4 MB" },
  { id: "7", title: "Privacy & NDA Addendum", uploadedDate: "Jan 12, 2024", fileSize: "1.1 MB" },
];

export default function ContractsPage() {
  const [search, setSearch] = useState("");

  const filteredContracts = mockContracts.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-poppins text-gray-900">Contract Documents</h1>
          <p className="text-xs text-gray-400">Access and download your corporate agreements and policies</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-white border border-gray-200 rounded-full pl-10 pr-4 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#005C66]"
          />
        </div>
      </div>

      {/* Grid of Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredContracts.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-[24px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-[#005C66]/20 transition-all duration-200 group"
          >
            {/* Top Row: PDF Badge & Download Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100/60 shadow-xs">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-gray-50 text-gray-500 hover:bg-[#005C66] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold font-poppins text-gray-900 leading-snug group-hover:text-[#005C66] transition-colors">
                {doc.title}
              </h3>
              <p className="text-[11px] text-gray-400">
                Uploaded: {doc.uploadedDate} <span className="mx-1">•</span> {doc.fileSize}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
