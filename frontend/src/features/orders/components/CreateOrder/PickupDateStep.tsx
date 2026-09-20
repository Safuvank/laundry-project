"use client";

import { CalendarDays } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

const getToday = (): string => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatSelectedDate = (date: string): string => {
  if (!date) return "";

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

export default function PickupDateStep() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const pickupDate = watch("pickupDate");

  const today = getToday();

  /*
   * The pickup slot belongs to the selected date.
   *
   * If the customer changes the date,
   * the previously selected slot must be cleared.
   */
  useEffect(() => {
    setValue("pickupSlotId", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [pickupDate, setValue]);

  return (
    <div className="w-full">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={20} strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Pickup Date
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the date when our delivery agent should
              collect your laundry.
            </p>
          </div>
        </div>
      </div>

      {/* Date selection */}
      <div className="mt-8">
        <label
          htmlFor="pickupDate"
          className="block text-sm font-semibold text-slate-700"
        >
          Pickup Date
        </label>

        <div className="relative mt-2">
          <CalendarDays
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            id="pickupDate"
            type="date"
            min={today}
            {...register("pickupDate")}
            className={`block w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition ${
              errors.pickupDate
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          />
        </div>

        {/* Validation error */}
        {errors.pickupDate && (
          <p className="mt-2 text-sm font-medium text-red-600">
            {errors.pickupDate.message}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-400">
          You can select today or any future date with
          available pickup slots.
        </p>
      </div>

      {/* Selected date */}
      {pickupDate && !errors.pickupDate && (
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
              <CalendarDays size={18} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Selected Pickup Date
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-950">
                {formatSelectedDate(pickupDate)}
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Continue to the next step to choose an
                available pickup time slot.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Information */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-sm">ℹ️</span>

          <p className="text-xs leading-5 text-slate-500">
            Pickup time slots are managed by FreshFold and
            depend on the availability configured for your
            selected date.
          </p>
        </div>
      </div>
    </div>
  );
}
