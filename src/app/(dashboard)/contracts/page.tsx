"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText, Download, ExternalLink, Calendar, DollarSign, X, ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, type ColumnDef } from "@/components/layout/DataTableContainer";
import contractsService, { type Contract } from "@/services/contracts.service";

const LIMIT = 10;

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchContracts = useCallback(() => {
    setLoading(true);
    contractsService.list(page)
      .then((res) => { setContracts(res.data ?? []); setTotal(res.total ?? 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const handleRowClick = async (row: Contract) => {
    setDetailLoading(true);
    setSelected(row); // optimistically show row data immediately
    try {
      const full = await contractsService.get(row.id);
      setSelected(full);
    } catch {
      // keep optimistic row data
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (d?: string | Date) =>
    d ? new Date(d as string).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const formatAmount = (v?: number) =>
    `SAR ${Number(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const columns = useMemo<ColumnDef<Contract>[]>(() => [
    {
      header: "CONTRACT NO.",
      cell: (row) => (
        <span className="font-semibold text-text-primary text-fs-12 font-mono">{row.contract_number}</span>
      ),
    },
    {
      header: "START DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.contract_start_date)}</span>,
    },
    {
      header: "END DATE",
      cell: (row) => <span className="text-text-secondary text-fs-12">{formatDate(row.contract_end_date)}</span>,
    },
    {
      header: "AMOUNT",
      cell: (row) => <span className="text-text-primary font-semibold text-fs-12">{formatAmount(row.contract_amount)}</span>,
    },
    {
      header: "STATUS",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "",
      className: "text-right",
      cell: () => (
        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
      ),
    },
  ], []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="h1 font-bold text-text-primary">Contracts</h1>
        <p className="body-2 text-gray-text">All service agreements with WhiteLine</p>
      </div>

      {/* Table */}
      <DataTable
        data={contracts}
        columns={columns}
        loading={loading}
        onRowClick={handleRowClick}
        pagination={{ currentPage: page, totalPages, totalItems: total, itemsPerPage: LIMIT, onPageChange: setPage }}
        emptyState={
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300" />
            <p className="text-fs-14 font-semibold text-text-secondary">No contracts found</p>
            <p className="text-fs-12 text-gray-400">Contact your WhiteLine account manager to set up a contract.</p>
          </div>
        }
      />

      {/* Detail Panel */}
      {selected && (
        <ContractDetailPanel
          contract={selected}
          loading={detailLoading}
          onClose={() => setSelected(null)}
          formatDate={formatDate}
          formatAmount={formatAmount}
        />
      )}
    </div>
  );
}

function ContractDetailPanel({
  contract,
  loading,
  onClose,
  formatDate,
  formatAmount,
}: {
  contract: Contract;
  loading: boolean;
  onClose: () => void;
  formatDate: (d?: string | Date) => string;
  formatAmount: (v?: number) => string;
}) {
  const pricingTerms = (contract.pricing_terms ?? {}) as Record<string, unknown>;
  const vehicleTypes = Array.isArray(contract.vehicle_types_allowed)
    ? (contract.vehicle_types_allowed as string[])
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Contract</p>
            <p className="text-fs-17 font-bold text-text-primary font-poppins font-mono">{contract.contract_number}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={contract.status} />
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-secondary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-primary" />
            </div>
          )}

          {/* Dates + Amount */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-input-bg rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="text-fs-9 font-bold text-gray-400 uppercase tracking-wider">Start</span>
              </div>
              <p className="text-fs-13 font-bold text-text-primary">{formatDate(contract.contract_start_date)}</p>
            </div>
            <div className="bg-input-bg rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span className="text-fs-9 font-bold text-gray-400 uppercase tracking-wider">End</span>
              </div>
              <p className="text-fs-13 font-bold text-text-primary">{formatDate(contract.contract_end_date)}</p>
            </div>
            <div className="bg-input-bg rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                <span className="text-fs-9 font-bold text-gray-400 uppercase tracking-wider">Amount</span>
              </div>
              <p className="text-fs-13 font-bold text-text-primary">{formatAmount(contract.contract_amount)}</p>
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

          {/* Vehicle Types */}
          {vehicleTypes.length > 0 && (
            <div className="space-y-2">
              <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Vehicle Types Allowed</p>
              <div className="flex flex-wrap gap-2">
                {vehicleTypes.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-primary/8 text-primary text-fs-11 font-semibold rounded-full">
                    {String(v)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Terms */}
          {Object.keys(pricingTerms).length > 0 && (
            <div className="space-y-2">
              <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Pricing Terms</p>
              <div className="space-y-2">
                {Object.entries(pricingTerms).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-fs-12 text-text-secondary capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-fs-12 font-bold text-text-primary">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contract Document */}
          {contract.contract_doc_url ? (
            <div className="space-y-2">
              <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Contract Document</p>
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
          ) : (
            <div className="space-y-2">
              <p className="text-fs-10 font-bold text-gray-400 uppercase tracking-wider">Contract Document</p>
              <p className="text-fs-12 text-gray-400 italic">No document attached to this contract.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
