"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminOrdersPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function AdminOrdersPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: AdminOrdersPaginationProps) {
  if (total === 0) {
    return null;
  }

  const startItem = (page - 1) * limit + 1;

  const endItem = Math.min(page * limit, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Results information */}
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-700">{startItem}</span>{" "}
        to <span className="font-medium text-gray-700">{endItem}</span> of{" "}
        <span className="font-medium text-gray-700">{total}</span> orders
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
          Previous
        </button>

        {/* Page indicator */}
        <div className="min-w-[90px] text-center text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </div>

        {/* Next */}
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
