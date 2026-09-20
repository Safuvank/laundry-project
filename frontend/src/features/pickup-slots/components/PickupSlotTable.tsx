"use client";

import type { PickupSlot } from "@/features/orders/types/pickup-slot.types";

interface PickupSlotTableProps {
  slots: PickupSlot[];
}

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusStyles = (slot: PickupSlot) => {
  if (!slot.isActive) {
    return "bg-slate-100 text-slate-600";
  }

  if (slot.status === "FULL") {
    return "bg-red-50 text-red-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

const getStatusLabel = (slot: PickupSlot) => {
  if (!slot.isActive) {
    return "Inactive";
  }

  if (slot.status === "FULL") {
    return "Full";
  }

  return "Available";
};

export default function PickupSlotTable({
  slots,
}: PickupSlotTableProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-slate-900">
          No pickup slots found
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Create your first pickup slot to make booking
          times available to customers.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Current Pickup Slots
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Pickup slots currently configured for customers.
        </p>
      </div>

      {/* Desktop Table */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pickup Time
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Capacity
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Booked
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Remaining
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {slots.map((slot) => {
              const remaining = Math.max(
                slot.capacity - slot.bookedCount,
                0,
              );

              return (
                <tr
                  key={slot._id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatDate(slot.date)}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {formatTime(slot.startTime)}{" "}
                      <span className="text-slate-400">
                        –
                      </span>{" "}
                      {formatTime(slot.endTime)}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {slot.capacity}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {slot.bookedCount}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">
                      {remaining}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                        slot,
                      )}`}
                    >
                      {getStatusLabel(slot)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}

      <div className="divide-y divide-slate-100 md:hidden">
        {slots.map((slot) => {
          const remaining = Math.max(
            slot.capacity - slot.bookedCount,
            0,
          );

          return (
            <div
              key={slot._id}
              className="p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatDate(slot.date)}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {formatTime(slot.startTime)}{" "}
                    –{" "}
                    {formatTime(slot.endTime)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                    slot,
                  )}`}
                >
                  {getStatusLabel(slot)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Capacity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {slot.capacity}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Booked
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {slot.bookedCount}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">
                    Remaining
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {remaining}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
