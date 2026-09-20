"use client";

import Link from "next/link";

import { useAdminDeliveryAgent } from "@/features/admin/hooks/useAdminDeliveryAgent";

import AdminDeliveryAgentDetails from "./AdminDeliveryAgentDetails";

interface AdminDeliveryAgentDetailsContainerProps {
  deliveryAgentId: string;
}

export default function AdminDeliveryAgentDetailsContainer({
  deliveryAgentId,
}: AdminDeliveryAgentDetailsContainerProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminDeliveryAgent(deliveryAgentId);

  /*
   * ------------------------------------------------------------------------
   * Loading
   * ------------------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Loading delivery agent...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Error
   * ------------------------------------------------------------------------
   */

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-red-600">
              Failed to load delivery agent.
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {error instanceof Error
                ? error.message
                : "Something went wrong."}
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Try Again
              </button>

              <Link
                href="/admin/delivery-agents"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Back to Agents
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Missing data
   * ------------------------------------------------------------------------
   */

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-medium text-gray-900">
              Delivery agent not found.
            </p>

            <p className="mt-1 text-sm text-gray-500">
              The delivery agent may have been removed or
              the provided ID is invalid.
            </p>

            <Link
              href="/admin/delivery-agents"
              className="mt-4 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Back to Agents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ------------------------------------------------------------------------
   * Data
   * ------------------------------------------------------------------------
   */

  const deliveryAgent = data.data;

  return (
    <AdminDeliveryAgentDetails
      deliveryAgent={deliveryAgent}
    />
  );
}