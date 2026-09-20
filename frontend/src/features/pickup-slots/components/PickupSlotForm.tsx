"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreatePickupSlot } from "../hooks/useCreatePickupSlot";
import {
  pickupSlotSchema,
  type PickupSlotFormData,
} from "../validation/pickup-slot.schema";

interface PickupSlotFormProps {
  onSuccess?: () => void;
}

export default function PickupSlotForm({
  onSuccess,
}: PickupSlotFormProps) {
  const createPickupSlotMutation =
    useCreatePickupSlot();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PickupSlotFormData>({
    resolver: zodResolver(pickupSlotSchema),

    defaultValues: {
      date: "",
      startTime: "",
      endTime: "",
      capacity: 5,
    },
  });

  const onSubmit = (
    data: PickupSlotFormData,
  ) => {
    createPickupSlotMutation.mutate(data, {
      onSuccess: () => {
        reset();

        onSuccess?.();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {/* Header */}

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Create Pickup Slot
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure a pickup time that customers can
          book.
        </p>
      </div>

      {/* Form */}

      <div className="mt-6 space-y-5">
        {/* Date */}

        <div>
          <label
            htmlFor="pickup-slot-date"
            className="block text-sm font-medium text-slate-700"
          >
            Pickup Date
          </label>

          <input
            id="pickup-slot-date"
            type="date"
            {...register("date")}
            min={new Date()
              .toISOString()
              .split("T")[0]}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          {errors.date && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.date.message}
            </p>
          )}
        </div>

        {/* Time */}

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Start */}

          <div>
            <label
              htmlFor="pickup-slot-start-time"
              className="block text-sm font-medium text-slate-700"
            >
              Start Time
            </label>

            <input
              id="pickup-slot-start-time"
              type="time"
              {...register("startTime")}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.startTime && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {errors.startTime.message}
              </p>
            )}
          </div>

          {/* End */}

          <div>
            <label
              htmlFor="pickup-slot-end-time"
              className="block text-sm font-medium text-slate-700"
            >
              End Time
            </label>

            <input
              id="pickup-slot-end-time"
              type="time"
              {...register("endTime")}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {errors.endTime && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {errors.endTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Capacity */}

        <div>
          <label
            htmlFor="pickup-slot-capacity"
            className="block text-sm font-medium text-slate-700"
          >
            Capacity
          </label>

          <input
            id="pickup-slot-capacity"
            type="number"
            min={1}
            {...register("capacity", {
              valueAsNumber: true,
            })}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          {errors.capacity && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.capacity.message}
            </p>
          )}
        </div>

        {/* Server Error */}

        {createPickupSlotMutation.isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              Unable to create pickup slot.
            </p>

            <p className="mt-1 text-sm text-red-600">
              Please check the details and try again.
            </p>
          </div>
        )}

        {/* Success */}

        {createPickupSlotMutation.isSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">
              Pickup slot created successfully.
            </p>
          </div>
        )}

        {/* Submit */}

        <button
          type="submit"
          disabled={
            createPickupSlotMutation.isPending
          }
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createPickupSlotMutation.isPending
            ? "Creating Slot..."
            : "Create Pickup Slot"}
        </button>
      </div>
    </form>
  );
}
