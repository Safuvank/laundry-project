"use client";

import {
  Check,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { useLaundryServices } from "@/features/orders/hooks/useLaundryServices";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

export default function ServicesStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const selectedServiceIds = useWatch({
    control,
    name: "laundryServiceIds",
  });

  const {
    data: services = [],
    isLoading,
    isError,
    refetch,
  } = useLaundryServices();

  const selectedIds = selectedServiceIds ?? [];

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Laundry Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Loading available services...
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
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
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Laundry Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the services you need.
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
                Unable to load services
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-700">
                We couldn't retrieve the available laundry
                services. Please try again.
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
  if (services.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Laundry Services
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the services you need.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <Package
            size={32}
            className="mx-auto text-slate-400"
          />

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            No services available
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
            There are currently no laundry services
            available for booking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Choose Laundry Services
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Select one or more services for your order.
            </p>
          </div>
        </div>

        {/* Selected count */}
        <div className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
          {selectedIds.length}{" "}
          {selectedIds.length === 1
            ? "service"
            : "services"}{" "}
          selected
        </div>
      </div>

      {/* Service cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedIds.includes(
            service._id,
          );

          return (
            <label
              key={service._id}
              className="block cursor-pointer"
            >
              <input
                type="checkbox"
                value={service._id}
                {...register("laundryServiceIds")}
                className="sr-only"
              />

              <div
                className={`relative h-full rounded-2xl border p-5 transition-all duration-200 ${
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

                {/* Service content */}
                <div className="pr-9">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Package size={18} />
                  </div>

                  <h3
                    className={`mt-4 text-sm font-semibold ${
                      isSelected
                        ? "text-blue-950"
                        : "text-slate-900"
                    }`}
                  >
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Selected message */}
                {isSelected && (
                  <div className="mt-4 border-t border-blue-100 pt-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                      <Check size={14} strokeWidth={2.5} />
                      Service selected
                    </p>
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Validation error */}
      {errors.laundryServiceIds && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {errors.laundryServiceIds.message}
        </p>
      )}

      {/* Selection information */}
      {selectedIds.length > 0 && (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
              <Check
                size={18}
                strokeWidth={2.5}
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-950">
                {selectedIds.length}{" "}
                {selectedIds.length === 1
                  ? "service"
                  : "services"}{" "}
                selected
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                You can select additional services or
                remove any service before continuing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
