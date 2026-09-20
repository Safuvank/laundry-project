"use client";

import { CalendarDays, Check, Clock3, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { usePickupSlots } from "@/features/orders/hooks/usePickupSlots";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

const formatTime = (time: string): string => {
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

const formatDate = (date: string): string => {
  if (!date) return "Invalid date";

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

export default function PickupSlotStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const pickupDate = watch("pickupDate");
  const pickupSlotId = watch("pickupSlotId");

  const {
    data: slots = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = usePickupSlots(pickupDate);

  /*
   * Only active slots should be available
   * for customer selection.
   */
  const activeSlots = slots.filter(
    (slot) => slot.isActive,
  );

  /*
   * Find the currently selected slot.
   */
  const selectedSlot = activeSlots.find(
    (slot) => slot._id === pickupSlotId,
  );

  /*
   * No pickup date selected.
   */
  if (!pickupDate) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock3 size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Pickup Slot
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Please select a pickup date before choosing
              a pickup time.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <CalendarDays
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Pickup date required
              </p>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Go back to the previous step and select
                your preferred pickup date.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Loading state.
   */
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock3 size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Pickup Slot
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Checking available pickup times...
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Pickup Date
          </p>

          <p className="mt-1 text-sm font-semibold text-blue-950">
            {formatDate(pickupDate)}
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error state.
   */
  if (isError) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock3 size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Pickup Slot
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select an available pickup time.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-900">
            Unable to load pickup slots
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            We couldn't load the available pickup times
            for this date. Please try again.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Clock3 size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Choose Pickup Slot
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Select a pickup time available for your
            selected date.
          </p>
        </div>
      </div>

      {/* Selected Date */}
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <CalendarDays size={19} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Pickup Date
            </p>

            <p className="mt-1 text-sm font-semibold text-blue-950">
              {formatDate(pickupDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Background refetch indicator */}
      {isFetching && !isLoading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <Loader2
            size={14}
            className="animate-spin"
          />

          <span>Updating available slots...</span>
        </div>
      )}

      {/* Slot section */}
      <div className="mt-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Available Pickup Times
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Choose one available time slot.
          </p>
        </div>

        {activeSlots.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
            <Clock3
              size={28}
              className="mx-auto text-slate-400"
            />

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No pickup slots available
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
              There are no pickup slots configured for
              this date. Please go back and choose another
              date.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {activeSlots.map((slot) => {
              const remaining =
                slot.capacity - slot.bookedCount;

              const isFull =
                slot.status === "FULL" ||
                remaining <= 0;

              const isSelected =
                pickupSlotId === slot._id;

              return (
                <label
                  key={slot._id}
                  className={
                    isFull
                      ? "block cursor-not-allowed"
                      : "block cursor-pointer"
                  }
                >
                  <input
                    type="radio"
                    value={slot._id}
                    disabled={isFull}
                    {...register("pickupSlotId")}
                    className="sr-only"
                  />

                  <div
                    className={[
                      "relative rounded-2xl border p-5 transition-all duration-200",
                      isFull
                        ? "border-slate-200 bg-slate-50 opacity-60"
                        : isSelected
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm",
                    ].join(" ")}
                  >
                    {/* Selection indicator */}
                    {!isFull && (
                      <div
                        className={[
                          "absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition",
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </div>
                    )}

                    {/* Slot information */}
                    <div className="pr-10">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={17}
                          className={
                            isSelected
                              ? "text-blue-600"
                              : "text-slate-400"
                          }
                        />

                        <p
                          className={[
                            "text-base font-semibold",
                            isSelected
                              ? "text-blue-950"
                              : "text-slate-900",
                          ].join(" ")}
                        >
                          {formatTime(
                            slot.startTime,
                          )}{" "}
                          <span className="text-slate-400">
                            –
                          </span>{" "}
                          {formatTime(slot.endTime)}
                        </p>
                      </div>

                      {/* Availability */}
                      {isFull ? (
                        <div className="mt-3 inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                          Fully booked
                        </div>
                      ) : (
                        <p
                          className={`mt-3 text-xs ${
                            remaining <= 2
                              ? "font-semibold text-amber-600"
                              : "text-slate-500"
                          }`}
                        >
                          {remaining}{" "}
                          {remaining === 1
                            ? "spot"
                            : "spots"}{" "}
                          remaining
                        </p>
                      )}
                    </div>

                    {/* Selected message */}
                    {isSelected && !isFull && (
                      <div className="mt-4 border-t border-blue-100 pt-3">
                        <p className="text-xs font-semibold text-blue-700">
                          ✓ Pickup time selected
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Validation */}
      {errors.pickupSlotId && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {errors.pickupSlotId.message}
        </p>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot &&
        selectedSlot.isActive &&
        selectedSlot.status !== "FULL" &&
        selectedSlot.bookedCount <
          selectedSlot.capacity && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                <Check size={18} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Selected Pickup Schedule
                </p>

                <p className="mt-1 text-sm font-bold text-emerald-950">
                  {formatTime(
                    selectedSlot.startTime,
                  )}{" "}
                  –{" "}
                  {formatTime(selectedSlot.endTime)}
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  {formatDate(pickupDate)}
                </p>

                <p className="mt-2 text-xs leading-5 text-emerald-700">
                  This pickup slot will be reserved when
                  you place your order.
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
