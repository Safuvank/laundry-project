"use client";

import { CalendarDays, Clock3, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { usePickupSlots } from "@/features/orders/hooks/usePickupSlots";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

const formatDate = (date: string): string => {
  if (!date) return "Not selected";

  const [year, month, day] = date.split("-").map(Number);

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

const formatTime = (time: string): string => {
  if (!time) return "";

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

export default function PickupScheduleStep() {
  const {
    watch,
    setValue,
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

  const activeSlots = slots.filter(
    (slot) => slot.isActive,
  );

  const selectedSlot = activeSlots.find(
    (slot) => slot._id === pickupSlotId,
  );

  const handleSlotSelect = (slotId: string) => {
    setValue("pickupSlotId", slotId, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Clock3 size={20} strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Choose Pickup Schedule
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Select a pickup time that is available for
            your chosen date.
          </p>
        </div>
      </div>

      {/* No date selected */}
      {!pickupDate && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <CalendarDays
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                Select a pickup date first
              </h3>

              <p className="mt-1 text-sm leading-6 text-amber-700">
                Go back to the previous step and choose
                the date when you want your laundry
                collected.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected date */}
      {pickupDate && (
        <>
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

          {/* Loading */}
          {isLoading && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                <span>
                  Checking available pickup slots...
                </span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <h3 className="text-sm font-semibold text-red-900">
                Unable to load pickup slots
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                We couldn't retrieve the available pickup
                times for this date.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Slots */}
          {!isLoading && !isError && (
            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Available Pickup Times
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose one available time slot.
                  </p>
                </div>

                {isFetching && (
                  <Loader2
                    size={16}
                    className="animate-spin text-slate-400"
                  />
                )}
              </div>

              {activeSlots.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Clock3
                    size={28}
                    className="mx-auto text-slate-400"
                  />

                  <h3 className="mt-3 text-sm font-semibold text-slate-900">
                    No pickup times available
                  </h3>

                  <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                    There are currently no available pickup
                    slots for this date. Please go back and
                    select another date.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {activeSlots.map((slot) => {
                    const remaining =
                      slot.capacity -
                      slot.bookedCount;

                    const isFull =
                      slot.status === "FULL" ||
                      remaining <= 0;

                    const isSelected =
                      pickupSlotId === slot._id;

                    return (
                      <button
                        key={slot._id}
                        type="button"
                        disabled={isFull}
                        onClick={() =>
                          handleSlotSelect(slot._id)
                        }
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          isFull
                            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                            : isSelected
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                              : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isSelected
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <Clock3 size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                {formatTime(
                                  slot.startTime,
                                )}{" "}
                                –{" "}
                                {formatTime(
                                  slot.endTime,
                                )}
                              </p>

                              {isFull ? (
                                <p className="mt-2 text-xs font-semibold text-red-600">
                                  Fully booked
                                </p>
                              ) : (
                                <p className="mt-2 text-xs text-slate-500">
                                  {remaining}{" "}
                                  {remaining === 1
                                    ? "spot"
                                    : "spots"}{" "}
                                  remaining
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Selection indicator */}
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                              isSelected
                                ? "border-blue-600"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-3 w-3 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected schedule */}
          {selectedSlot && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                  <Clock3 size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Selected Pickup Schedule
                  </p>

                  <p className="mt-1 text-sm font-semibold text-emerald-950">
                    {formatDate(pickupDate)}
                  </p>

                  <p className="mt-1 text-sm text-emerald-800">
                    {formatTime(selectedSlot.startTime)}{" "}
                    –{" "}
                    {formatTime(selectedSlot.endTime)}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-emerald-700">
                    Your selected pickup slot will be
                    reserved when you place the order.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation error */}
          {errors.pickupSlotId && (
            <p className="mt-3 text-sm font-medium text-red-600">
              {errors.pickupSlotId.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}
