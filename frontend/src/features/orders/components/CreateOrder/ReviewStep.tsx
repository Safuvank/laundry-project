"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

import { usePickupSlots } from "@/features/orders/hooks/usePickupSlots";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

const formatTime = (time?: string): string => {
  if (!time) return "Unavailable";

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return time;
  }

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date?: string): string => {
  if (!date) return "No date selected";

  const datePart = date.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  const parsedDate = new Date(year, month - 1, day);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function ReviewStep() {
  const { watch } =
    useFormContext<CreateOrderFormData>();

  const pickupDate = watch("pickupDate");
  const pickupSlotId = watch("pickupSlotId");

  const {
    data: slots = [],
    isLoading,
    isError,
  } = usePickupSlots(pickupDate);

  const selectedSlot = slots.find(
    (slot) => slot._id === pickupSlotId,
  );

  const selectedSlotRemaining = selectedSlot
    ? selectedSlot.capacity -
      selectedSlot.bookedCount
    : 0;

  const isSelectedSlotAvailable =
    Boolean(selectedSlot) &&
    selectedSlot?.isActive === true &&
    selectedSlot?.status !== "FULL" &&
    selectedSlotRemaining > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <PackageCheck
            size={20}
            strokeWidth={2}
          />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Review Your Order
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Please review your pickup details before
            placing the order.
          </p>
        </div>
      </div>

      {/* Pickup Details */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={17}
              className="text-blue-600"
            />

            <h3 className="text-sm font-semibold text-slate-900">
              Pickup Details
            </h3>
          </div>

          {isSelectedSlotAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={13} />
              Available
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
              Review Required
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Pickup Date */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-slate-400"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pickup Date
                </p>
              </div>

              <p
                className={`mt-2 text-sm font-semibold ${
                  pickupDate
                    ? "text-slate-900"
                    : "text-red-600"
                }`}
              >
                {formatDate(pickupDate)}
              </p>
            </div>

            {/* Pickup Time */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <Clock3
                  size={16}
                  className="text-slate-400"
                />

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pickup Time
                </p>
              </div>

              {isLoading ? (
                <div className="mt-2 h-5 w-40 animate-pulse rounded bg-slate-200" />
              ) : isError ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Unable to verify slot
                </p>
              ) : isSelectedSlotAvailable &&
                selectedSlot ? (
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatTime(
                    selectedSlot.startTime,
                  )}{" "}
                  <span className="text-slate-400">
                    –
                  </span>{" "}
                  {formatTime(selectedSlot.endTime)}
                </p>
              ) : (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Pickup slot not selected
                </p>
              )}
            </div>
          </div>

          {/* Selected Slot */}
          {isSelectedSlotAvailable &&
            selectedSlot && (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                    <CheckCircle2
                      size={18}
                      strokeWidth={2.5}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      Selected Pickup Slot
                    </p>

                    <p className="mt-1 text-sm font-bold text-emerald-950">
                      {formatTime(
                        selectedSlot.startTime,
                      )}{" "}
                      –{" "}
                      {formatTime(
                        selectedSlot.endTime,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-emerald-700">
                      {formatDate(pickupDate)}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-emerald-700">
                      Your selected pickup time is currently
                      available.
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Slot no longer available */}
          {!isLoading &&
            !isError &&
            pickupSlotId &&
            !isSelectedSlotAvailable && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <Clock3
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      Pickup slot is no longer available
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-700">
                      This pickup slot may have become full
                      or inactive. Please go back and select
                      another available pickup time.
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* Final Confirmation */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <PackageCheck size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-blue-950">
              Ready to place your order?
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Make sure your pickup date and time are
              correct. When you place the order, FreshFold
              will verify the selected pickup slot and
              reserve its capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
