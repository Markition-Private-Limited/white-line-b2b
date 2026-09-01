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
  cell?: (row: T) => React.ReactNode;
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
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick,
  className,
  headerClassName = "bg-[#489196] text-white",
  pagination,
  loading = false
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
    if (cols <= 5) return "px-6 lg:px-10";
    if (cols === 6) return "px-5 lg:px-8";
    return "px-4 lg:px-6"; // For 7 or more columns
  };
  const paddingClass = getPaddingClass(columns.length);

  return (
    <div className={cn("card-lg flex flex-col bg-white overflow-hidden mt-1 shadow-sm border border-border flex-1 min-h-0", className)}>
      <div className="w-full overflow-auto flex-1 scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-[850px]">
          <thead className="sticky top-0 z-20">
            <tr className={headerClassName}>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={cn(
                    "py-3.5 lg:py-5 text-fs-10 font-semibold tracking-wider uppercase whitespace-nowrap", 
                    paddingClass,
                    idx === 0 && "pl-6 lg:pl-8"
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
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400 font-medium text-fs-13">
                    <span>No records available</span>
                  </div>
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
                        "py-2 lg:py-2.5 text-fs-12", 
                        paddingClass, 
                        colIdx === 0 && "pl-6 lg:pl-8",
                        col.className
                      )}
                    >
                      {col.cell ? (
                        col.cell(row)
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
      <div className="border-t border-gray-100 p-4 px-5 flex flex-wrap lg:flex-nowrap items-center justify-between bg-white gap-y-3 lg:gap-y-0">
        <div className="hidden lg:block text-fs-12 text-gray-500 order-3 lg:order-1 w-full lg:w-auto text-left lg:text-left mt-1 lg:mt-0">
          {totalItems === 0 || data.length === 0 ? (
            <span>Showing <span className="font-semibold text-text-primary">0</span> Entities</span>
          ) : (
            <>
              Showing <span className="font-semibold text-text-primary">{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-semibold text-text-primary">{totalItems.toLocaleString()}</span> Entities
            </>
          )}
        </div>

        <div className="order-1 lg:order-2 flex items-center lg:ml-5 lg:mr-auto relative">
          <select 
            value={itemsPerPage}
            onChange={(e) => pagination?.onRowsChange?.(Number(e.target.value))}
            className="appearance-none h-8 pl-3.5 pr-8 border border-gray-200 rounded-[12px] flex items-center text-fs-11 font-medium text-text-secondary hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer bg-transparent"
          >
            <option value={10}>Rows: 10</option>
            <option value={20}>Rows: 20</option>
            <option value={50}>Rows: 50</option>
            <option value={100}>Rows: 100</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
