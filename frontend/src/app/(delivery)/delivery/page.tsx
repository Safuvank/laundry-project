"use client";

import { useMyAssignments } from "@/features/delivery/hooks/useMyAssignments";

import DeliveryAgentStatusCard from "@/features/delivery/components/DeliveryAgentStatusCard";
import DeliveryAssignmentCard from "@/features/delivery/components/DeliveryAssignmentCard";

export default function DeliveryPage() {
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useMyAssignments();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <header>
          <p className="text-sm font-medium text-gray-500">
            FreshFold Delivery
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Delivery Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your availability, location, and delivery assignments.
          </p>
        </header>

        {/* ------------------------------------------------------------------ */}
        {/* Agent Status                                                       */}
        {/* ------------------------------------------------------------------ */}

        <DeliveryAgentStatusCard />

        {/* ------------------------------------------------------------------ */}
        {/* Assignments                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              My Assignments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your current pickup and delivery tasks.
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

                <p className="text-sm text-gray-700">
                  Loading assignments...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="font-semibold text-red-700">
                Failed to load assignments
              </h3>

              <p className="mt-1 text-sm text-red-600">
                Something went wrong while loading your assignments.
              </p>

              {error instanceof Error && (
                <p className="mt-2 text-xs text-red-500">
                  {error.message}
                </p>
              )}
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !isError &&
            assignments.length === 0 && (
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
            )}

          {/* Assignment Cards */}
          {!isLoading &&
            !isError &&
            assignments.length > 0 && (
              <div className="grid gap-5">
                {assignments.map((assignment) => (
                  <DeliveryAssignmentCard
                    key={assignment._id}
                    assignment={assignment}
                  />
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}
