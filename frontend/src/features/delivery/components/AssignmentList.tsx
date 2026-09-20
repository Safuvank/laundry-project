"use client";

import DeliveryAssignmentCard from "./DeliveryAssignmentCard";

import type { DeliveryAssignment } from "../types/delivery-assignment.types";

interface AssignmentListProps {
  assignments: DeliveryAssignment[];
}

export default function AssignmentList({ assignments }: AssignmentListProps) {
  if (assignments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <span className="text-xl text-gray-700">✓</span>
        </div>

        <h3 className="mt-4 font-semibold text-gray-900">
          No assignments
        </h3>

        <p className="mt-1 text-sm text-gray-600">
          You currently have no pickup or delivery assignments.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      {assignments.map((assignment) => (
        <DeliveryAssignmentCard
          key={assignment._id}
          assignment={assignment}
        />
      ))}
    </div>
  );
}
