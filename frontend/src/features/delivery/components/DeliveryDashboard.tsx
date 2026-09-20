"use client";

import { useMemo } from "react";

import { useMyAssignments } from "../hooks/useMyAssignments";

import DeliveryAgentStatusCard from "./DeliveryAgentStatusCard";
import DeliveryLocationCard from "./DeliveryLocationCard";
import DeliveryAssignmentCard from "./DeliveryAssignmentCard";

function DeliveryDashboard() {
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useMyAssignments();

  /*
   * Active assignment
   *
   * An assignment is considered active when:
   * - isActive === true
   * - status is OFFERED, ACCEPTED or IN_PROGRESS
   */
  const activeAssignment = useMemo(() => {
    return assignments.find(
      (assignment) =>
        assignment.isActive &&
        ["OFFERED", "ACCEPTED", "IN_PROGRESS"].includes(assignment.status),
    );
  }, [assignments]);

  /*
   * Assignment history
   *
   * Completed, rejected and cancelled assignments
   * are shown here.
   */
  const assignmentHistory = useMemo(() => {
    return assignments.filter(
      (assignment) =>
        !assignment.isActive ||
        ["COMPLETED", "REJECTED", "CANCELLED"].includes(assignment.status),
    );
  }, [assignments]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------------ */}
        {/* HEADER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <header>
          <p className="text-sm font-medium text-gray-500">
            FreshFold Delivery
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Delivery Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Manage your availability, location, and delivery assignments.
          </p>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* DELIVERY STATUS                                                     */}
        {/* ------------------------------------------------------------------ */}

        <section>
          <DeliveryAgentStatusCard />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* DELIVERY LOCATION                                                   */}
        {/* ------------------------------------------------------------------ */}

        <section>
          <DeliveryLocationCard />
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* LOADING                                                             */}
        {/* ------------------------------------------------------------------ */}

        {isLoading && (
          <section className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

              <p className="text-sm text-gray-700">Loading assignments...</p>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* ERROR                                                               */}
        {/* ------------------------------------------------------------------ */}

        {isError && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-700">
              Failed to load assignments
            </h2>

            <p className="mt-1 text-sm text-red-600">
              Something went wrong while loading your assignments.
            </p>

            {error instanceof Error && (
              <p className="mt-2 text-xs text-red-500">{error.message}</p>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* ASSIGNMENTS                                                         */}
        {/* ------------------------------------------------------------------ */}

        {!isLoading && !isError && (
          <>
            {/* ================================================================ */}
            {/* CURRENT ACTIVE ASSIGNMENT                                        */}
            {/* ================================================================ */}

            <section className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Current Task
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Active Assignment
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Your current pickup or delivery task.
                </p>
              </div>

              {activeAssignment ? (
                <DeliveryAssignmentCard assignment={activeAssignment} />
              ) : (
                <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-2xl">✓</span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    No active assignment
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                    You currently have no pickup or delivery task. Stay
                    available to receive new assignments.
                  </p>
                </div>
              )}
            </section>

            {/* ================================================================ */}
            {/* ASSIGNMENT HISTORY                                               */}
            {/* ================================================================ */}

            <section className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Previous Tasks
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Assignment History
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  View your completed, rejected, and cancelled assignments.
                </p>
              </div>

              {assignmentHistory.length > 0 ? (
                <div className="grid gap-5">
                  {assignmentHistory.map((assignment) => (
                    <DeliveryAssignmentCard
                      key={assignment._id}
                      assignment={assignment}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-xl text-gray-500">—</span>
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No assignment history
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    Completed delivery tasks will appear here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default DeliveryDashboard;
