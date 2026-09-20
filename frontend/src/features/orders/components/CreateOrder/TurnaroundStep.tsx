"use client";

import {
  Check,
  Clock3,
  RefreshCw,
  Timer,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { useTurnaroundPlans } from "@/features/orders/hooks/useTurnaroundPlans";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

export default function TurnaroundStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const selectedPlanId = useWatch({
    control,
    name: "turnaroundPlanId",
  });

  const {
    data: plans = [],
    isLoading,
    isError,
    refetch,
  } = useTurnaroundPlans();

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Timer size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Turnaround Plan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Loading available plans...
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  /*
   * Error state
   */
  if (isError) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Timer size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Turnaround Plan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose how quickly you want your laundry
              processed.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <RefreshCw size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-red-900">
                Unable to load turnaround plans
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                We couldn't retrieve the available turnaround
                plans. Please try again.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Empty state
   */
  if (plans.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Timer size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Turnaround Plan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose how quickly you want your laundry
              processed.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Timer
            size={32}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            No turnaround plans available
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            There are currently no turnaround plans
            available for booking.
          </p>
        </div>
      </div>
    );
  }

  const selectedPlan = plans.find(
    (plan) => plan._id === selectedPlanId,
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Timer size={20} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Choose Turnaround Plan
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Choose how quickly you want your laundry
            processed.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="mt-7 space-y-4">
        {plans.map((plan) => {
          const isSelected =
            selectedPlanId === plan._id;

          const duration =
            plan.minHours === plan.maxHours
              ? `${plan.minHours} hours`
              : `${plan.minHours}–${plan.maxHours} hours`;

          return (
            <label
              key={plan._id}
              className="block cursor-pointer"
            >
              <input
                type="radio"
                value={plan._id}
                {...register("turnaroundPlanId")}
                className="sr-only"
              />

              <div
                className={`relative rounded-2xl border p-5 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 hover:shadow-sm"
                }`}
              >
                {/* Selection indicator */}
                <div
                  className={`absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    isSelected
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="text-white"
                    />
                  )}
                </div>

                <div className="pr-10">
                  {/* Plan icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Clock3 size={19} />
                  </div>

                  {/* Plan name */}
                  <h3
                    className={`mt-4 text-base font-semibold ${
                      isSelected
                        ? "text-blue-950"
                        : "text-slate-900"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Description */}
                  {plan.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {plan.description}
                    </p>
                  )}

                  {/* Duration */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                    <Clock3
                      size={14}
                      className="text-slate-500"
                    />

                    <span className="text-xs font-semibold text-slate-700">
                      {duration}
                    </span>
                  </div>
                </div>

                {/* Selected message */}
                {isSelected && (
                  <div className="mt-4 border-t border-blue-100 pt-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                      />
                      Turnaround plan selected
                    </p>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Validation error */}
      {errors.turnaroundPlanId && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {errors.turnaroundPlanId.message}
        </p>
      )}

      {/* Selected plan summary */}
      {selectedPlan && (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Check
                size={18}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Selected Turnaround
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-950">
                {selectedPlan.name}
              </p>

              <p className="mt-1 text-xs text-emerald-700">
                Estimated processing time:{" "}
                {selectedPlan.minHours ===
                selectedPlan.maxHours
                  ? `${selectedPlan.minHours} hours`
                  : `${selectedPlan.minHours}–${selectedPlan.maxHours} hours`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
