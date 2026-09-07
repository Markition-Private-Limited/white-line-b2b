"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import contractsService, { type Contract } from "@/services/contracts.service";

export default function ContractsPage() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    contractsService.getActive()
      .then(setContract)
      .catch(() => setError("Could not load contract."))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const formatAmount = (v: number) =>
    `SAR ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="space-y-4">
        <h1 className="h1 font-bold text-text-primary">Corporate Contract</h1>
        <div className="card-base p-12 flex flex-col items-center gap-3 text-center">
          <FileText className="w-12 h-12 text-gray-300" />
          <p className="text-fs-14 font-semibold text-text-secondary">
            {error || "No active contract found."}
          </p>
          <p className="text-fs-12 text-gray-400">
            Please contact your WhiteLine account manager to set up a contract.
          </p>
        </div>
      </div>
    );
  }

  const pricingTerms = (contract.pricing_terms ?? {}) as Record<string, unknown>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h1 font-bold text-text-primary">Corporate Contract</h1>
          <p className="body-2 text-gray-text">Your active service agreement with WhiteLine</p>
        </div>
        <StatusBadge status={contract.status} />
      </div>

      {/* Main Contract Card */}
      <div className="card-base p-6 lg:p-8 space-y-6">
        {/* Contract Number + Company */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Contract Number</p>
            <p className="text-fs-18 font-bold text-text-primary font-poppins mt-0.5">{contract.contract_number}</p>
          </div>
          {contract.b2b_client?.company_name && (
            <div className="text-right">
              <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Company</p>
              <p className="text-fs-14 font-semibold text-text-primary mt-0.5">{contract.b2b_client.company_name}</p>
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-input-bg rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Start Date</span>
            </div>
            <p className="text-fs-14 font-bold text-text-primary pl-5.5">{formatDate(contract.contract_start_date)}</p>
          </div>
          <div className="bg-input-bg rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">End Date</span>
            </div>
            <p className="text-fs-14 font-bold text-text-primary pl-5.5">{formatDate(contract.contract_end_date)}</p>
          </div>
          <div className="bg-input-bg rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Contract Amount</span>
            </div>
            <p className="text-fs-14 font-bold text-text-primary pl-5.5">{formatAmount(contract.contract_amount)}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Primary Email</p>
            <p className="text-fs-13 font-semibold text-text-primary">{contract.primary_email ?? "—"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Main Contact Phone</p>
            <p className="text-fs-13 font-semibold text-text-primary">{contract.main_contact_phone ?? "—"}</p>
          </div>
        </div>

        {/* Pricing Terms */}
        {Object.keys(pricingTerms).length > 0 && (
          <div className="space-y-2">
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Pricing Terms</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(pricingTerms).map(([key, val]) => (
                <div key={key} className="bg-input-bg rounded-xl p-3 flex items-center justify-between">
                  <span className="text-fs-11 text-text-secondary capitalize">{key.replace(/_/g, " ")}</span>
                  <span className="text-fs-12 font-bold text-text-primary">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contract Document */}
        {contract.contract_doc_url && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider mb-3">Contract Document</p>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-fs-12 font-semibold text-text-primary truncate">
                  Contract_{contract.contract_number}.pdf
                </p>
                <p className="text-fs-10 text-gray-400">PDF Document</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={contract.contract_doc_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-text-secondary hover:text-primary transition-colors"
                  title="View"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={contract.contract_doc_url}
                  download
                  className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
