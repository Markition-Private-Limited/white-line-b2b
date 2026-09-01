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
    <div className="space-y-4">
      {/* Top Header Row with Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="h1 font-bold text-text-primary">Contract Documents</h1>
          <p className="body-2 text-gray-text">Access and download your corporate agreements and policies</p>
        </div>

        <div className="relative w-full sm:w-80 bg-white rounded-full p-1 shadow-[0px_2px_10px_0px_rgba(0,0,0,0.02)] border border-gray-50">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full h-[37px] bg-background-panel border-none rounded-full pl-9 pr-3.5 text-fs-12 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid of Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1">
        {filteredContracts.map((doc) => (
          <div
            key={doc.id}
            className="card-base p-5 flex flex-col justify-between hover:shadow-md transition-all duration-200 group min-h-[170px]"
          >
            {/* Top Row: PDF Badge & Download Button */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#FEE2E2]/60 text-[#EF4444] flex flex-col items-center justify-center border border-[#FCA5A5]/40 shadow-xs">
                <span className="font-extrabold text-[9px] tracking-wider border border-[#EF4444] px-1 py-0.5 rounded text-[#EF4444] leading-none">PDF</span>
              </div>

              <button
                type="button"
                className="w-8 h-8 rounded-full bg-background-panel text-text-secondary hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Content */}
            <div className="space-y-1">
              <h3 className="text-fs-13 font-bold font-poppins text-text-primary leading-snug group-hover:text-primary transition-colors line-clamp-1">
                {doc.title}
              </h3>
              <p className="text-fs-10 text-gray-400">
                Uploaded: {doc.uploadedDate} <span className="mx-1">•</span> {doc.fileSize}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
