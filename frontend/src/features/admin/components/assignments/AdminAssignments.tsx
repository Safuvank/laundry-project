"use client";

import { useState } from "react";

import { useAdminAssignments } from "../../hooks/useAdminAssignments";

import AdminAssignmentFilters from "./AdminAssignmentFilters";
import AdminAssignmentsTable from "./AdminAssignmentsTable";
import AdminAssignmentsPagination from "./AdminAssignmentsPagination";

import type {
  AdminAssignmentListQuery,
  AdminDeliveryAssignmentStatus,
  AdminDeliveryAssignmentType,
} from "../../types/admin.types";

export default function AdminAssignments() {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<AdminDeliveryAssignmentStatus | "">("");

  const [assignmentType, setAssignmentType] = useState<
    AdminDeliveryAssignmentType | ""
  >("");

  const [isActive, setIsActive] = useState<"" | "true" | "false">("");

  const filters: AdminAssignmentListQuery = {
    page,
    limit: 10,

    ...(search && {
      search,
    }),

    ...(status && {
      status,
    }),

    ...(assignmentType && {
      assignmentType,
    }),

    ...(isActive !== "" && {
      isActive: isActive === "true",
    }),
  };

  const { data, isLoading, isError, error } = useAdminAssignments(filters);

  const assignments = data?.data.assignments ?? [];

  const pagination = data?.data.pagination;

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setAssignmentType("");
    setIsActive("");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(status) ||
    Boolean(assignmentType) ||
    isActive !== "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Assignments</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage pickup and delivery assignments.
        </p>
      </div>

      <AdminAssignmentFilters
        searchInput={searchInput}
        status={status}
        assignmentType={assignmentType}
        isActive={isActive}
        hasFilters={hasFilters}
        onSearchInputChange={setSearchInput}
        onSearch={handleSearch}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onAssignmentTypeChange={(value) => {
          setAssignmentType(value);
          setPage(1);
        }}
        onIsActiveChange={(value) => {
          setIsActive(value);
          setPage(1);
        }}
        onReset={handleReset}
      />

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading assignments...</p>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">
            Failed to load assignments.
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <AdminAssignmentsTable assignments={assignments} />

          {pagination && (
            <AdminAssignmentsPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
