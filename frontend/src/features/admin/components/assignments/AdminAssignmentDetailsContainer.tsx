"use client";

import Link from "next/link";

import { useAdminAssignment } from "../../hooks/useAdminAssignment";

import AdminAssignmentDetails from "./AdminAssignmentDetails";

interface AdminAssignmentDetailsContainerProps {
  assignmentId: string;
}

export default function AdminAssignmentDetailsContainer({
  assignmentId,
}: AdminAssignmentDetailsContainerProps) {
  const { data, isLoading, isError, error } = useAdminAssignment(assignmentId);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-500">Loading assignment...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-700">
            Failed to load assignment
          </h2>

          <p className="mt-1 text-sm text-red-600">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>

          <Link
            href="/admin/assignments"
            className="mt-4 inline-block text-sm font-medium text-gray-700 underline"
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  const assignment = data?.data;

  if (!assignment) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="font-semibold text-gray-900">Assignment not found</h2>

          <Link
            href="/admin/assignments"
            className="mt-3 inline-block text-sm font-medium text-gray-700 underline"
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  return <AdminAssignmentDetails assignment={assignment} />;
}
