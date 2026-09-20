"use client";

interface AdminDeliveryAgentsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function AdminDeliveryAgentsPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: AdminDeliveryAgentsPaginationProps) {
  if (total === 0) {
    return null;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      {/* Result Count */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-gray-900">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-900">
          {total}
        </span>{" "}
        delivery agents
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          <span className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white">
            {page}
          </span>

          <span className="px-1 text-sm text-gray-500">
            of
          </span>

          <span className="text-sm font-medium text-gray-700">
            {totalPages}
          </span>
        </div>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}