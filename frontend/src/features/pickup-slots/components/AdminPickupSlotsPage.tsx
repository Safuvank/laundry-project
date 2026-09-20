"use client";

import PickupSlotForm from "./PickupSlotForm";
import PickupSlotTable from "./PickupSlotTable";
import { useAdminPickupSlots } from "../hooks/useAdminPickupSlots";

export default function AdminPickupSlotsPage() {
  const {
    data: slots = [],
    isLoading,
    isError,
    refetch,
  } = useAdminPickupSlots();

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pickup Slots
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage the pickup dates and times available to customers.
        </p>
      </div>

      {/* Create Pickup Slot */}
      <div className="w-full">
        <PickupSlotForm
          onSuccess={() => {
            refetch();
          }}
        />
      </div>

      {/* Current Pickup Slots */}
      <div className="w-full">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <div className="space-y-4">
              <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />

              <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />

              <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-800">
              Unable to load pickup slots
            </h2>

            <p className="mt-1 text-sm text-red-600">
              We couldn't retrieve the current pickup slots.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <PickupSlotTable slots={slots} />
        )}
      </div>
    </div>
  );
}
