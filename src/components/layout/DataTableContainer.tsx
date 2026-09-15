import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsChange?: (rows: number) => void;
}

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index?: number) => React.ReactNode;
  className?: string; // Optional custom styling for the td
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  className?: string;
  headerClassName?: string;
  pagination?: PaginationProps;
  loading?: boolean;
  emptyState?: React.ReactNode;
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick,
  className,
  headerClassName = "bg-[#3D898F] text-white",
  pagination,
  loading = false,
  emptyState,
}: DataTableProps<T>) {
  // Using default values for presentation if not provided
  const {
    currentPage = 1,
    totalPages = 1,
    totalItems = data.length,
    itemsPerPage = 10,
  } = pagination || {};

  // Dynamic padding based on column count
  const getPaddingClass = (cols: number) => {
    if (cols <= 5) return "px-5 lg:px-7";
    if (cols === 6) return "px-4 lg:px-6";
    return "px-3.5 lg:px-5"; // For 7 or more columns
  };
  const paddingClass = getPaddingClass(columns.length);

  return (
    <div className={cn("card-base flex flex-col bg-white overflow-hidden shadow-sm border border-gray-100 flex-1 min-h-0", className)}>
      <div className="w-full overflow-auto flex-1 scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="sticky top-0 z-10">
            <tr className={headerClassName}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "py-3.5 lg:py-5 text-fs-12 font-semibold tracking-wider uppercase whitespace-nowrap", 
                    paddingClass,
                    idx === 0 && "pl-6 lg:pl-8",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-64 text-center align-middle"
                >
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-64 text-center align-middle"
                >
                  {emptyState ? (
                    emptyState
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 font-medium text-fs-13">
                      <span>No records available</span>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr 
                  key={rowIdx} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={cn(
                        "py-3.5 lg:py-4 text-fs-12", 
                        paddingClass, 
                        colIdx === 0 && "pl-6 lg:pl-8",
                        col.className
                      )}
                    >
                      {col.cell ? (
                        col.cell(row, rowIdx)
                      ) : (
                        col.accessorKey ? String(row[col.accessorKey] ?? "") : null
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-gray-100 p-3.5 px-5 flex flex-wrap lg:flex-nowrap items-center justify-between bg-white gap-y-3 lg:gap-y-0">
        <div className="text-fs-12 text-gray-500 order-1">
          {totalItems === 0 || data.length === 0 ? (
            <span>Showing <span className="font-semibold text-text-primary">0</span> of <span className="font-semibold text-text-primary">0</span> results</span>
          ) : (
            <>
              Showing <span className="font-semibold text-text-primary">{Math.min(data.length, itemsPerPage)}</span> of <span className="font-semibold text-text-primary">{totalItems.toLocaleString()}</span> results
            </>
          )}
        </div>

        <div className="flex items-center gap-1 order-2 lg:order-3">
          <button 
            onClick={() => currentPage > 1 && pagination?.onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn("w-8 h-8 flex items-center justify-center rounded-full transition-colors border bg-white shrink-0", 
              currentPage === 1 ? "text-gray-300 border-gray-100 cursor-not-allowed" : "text-gray-400 hover:text-text-primary hover:bg-gray-100 border-gray-200")}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Simple pagination */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum = i + 1;
            if (totalPages > 5) {
              if (currentPage > 3) {
                pageNum = currentPage - 2 + i;
              }
              if (pageNum > totalPages) {
                pageNum = totalPages - (4 - i);
              }
            }
            return (
              <button 
                key={pageNum}
                onClick={() => pagination?.onPageChange?.(pageNum)}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full text-fs-12 font-semibold shrink-0 transition-colors",
                  pageNum === currentPage 
                    ? "bg-gray-100 text-text-primary" 
                    : "text-text-primary hover:bg-gray-50"
                )}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="w-4 sm:w-6 flex items-center justify-center text-text-primary text-fs-12 font-semibold tracking-wider shrink-0">...</span>
              <button 
                onClick={() => pagination?.onPageChange?.(totalPages)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-text-primary hover:bg-gray-50 text-fs-12 font-semibold transition-colors shrink-0"
              >
                {totalPages}
              </button>
            </>
          )}

          <button 
            onClick={() => currentPage < totalPages && pagination?.onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={cn("w-8 h-8 flex items-center justify-center rounded-full transition-colors border bg-white shrink-0", 
              (currentPage === totalPages || totalPages === 0) ? "text-gray-300 border-gray-100 cursor-not-allowed" : "text-gray-400 hover:text-text-primary hover:bg-gray-100 border-gray-200")}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
