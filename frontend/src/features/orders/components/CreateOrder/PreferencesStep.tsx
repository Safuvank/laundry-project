"use client";

import {
  Check,
  Droplets,
  FileText,
  FoldVertical,
  Sparkles,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

export default function PreferencesStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const fabricSoftener = useWatch({
    control,
    name: "fabricSoftener",
  });

  const starchPreference = useWatch({
    control,
    name: "starchPreference",
  });

  const customerNotes = useWatch({
    control,
    name: "customerNotes",
  });

  const notesLength = customerNotes?.length ?? 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles size={20} strokeWidth={2} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Preferences & Notes
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Tell us how you'd like your laundry to be
            handled.
          </p>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        {/* Detergent Preference */}
        <div>
          <label
            htmlFor="detergentPreference"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <Droplets
              size={16}
              className="text-slate-400"
            />

            Detergent Preference
          </label>

          <select
            id="detergentPreference"
            {...register("detergentPreference")}
            className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
              errors.detergentPreference
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          >
            <option value="">No preference</option>
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
            <option value="FRAGRANCE_FREE">
              Fragrance Free
            </option>
          </select>

          {errors.detergentPreference && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.detergentPreference.message}
            </p>
          )}
        </div>

        {/* Treatment Options */}
        <div>
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-700">
              Laundry Treatments
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Choose any additional treatments you need.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Fabric Softener */}
            <label className="block cursor-pointer">
              <input
                type="checkbox"
                {...register("fabricSoftener")}
                className="sr-only"
              />

              <div
                className={`flex min-h-24 items-start gap-3 rounded-2xl border p-4 transition-all ${
                  fabricSoftener
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    fabricSoftener
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Droplets size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Fabric Softener
                    </p>

                    {fabricSoftener && (
                      <Check
                        size={18}
                        className="shrink-0 text-blue-600"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Use fabric softener during washing.
                  </p>
                </div>
              </div>
            </label>

            {/* Starch */}
            <label className="block cursor-pointer">
              <input
                type="checkbox"
                {...register("starchPreference")}
                className="sr-only"
              />

              <div
                className={`flex min-h-24 items-start gap-3 rounded-2xl border p-4 transition-all ${
                  starchPreference
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    starchPreference
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Sparkles size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Starch Treatment
                    </p>

                    {starchPreference && (
                      <Check
                        size={18}
                        className="shrink-0 text-blue-600"
                        strokeWidth={2.5}
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Add starch treatment to suitable items.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Folding Preference */}
        <div>
          <label
            htmlFor="foldingPreference"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <FoldVertical
              size={16}
              className="text-slate-400"
            />

            Folding Preference
          </label>

          <select
            id="foldingPreference"
            {...register("foldingPreference")}
            className={`mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition ${
              errors.foldingPreference
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          >
            <option value="">No preference</option>
            <option value="FOLDED">Folded</option>
            <option value="HANGER">On Hangers</option>
          </select>

          {errors.foldingPreference && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.foldingPreference.message}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label
            htmlFor="customerNotes"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <FileText
              size={16}
              className="text-slate-400"
            />

            Additional Notes
          </label>

          <textarea
            id="customerNotes"
            rows={5}
            maxLength={500}
            {...register("customerNotes")}
            placeholder="Any special instructions for our team?"
            className={`mt-2 block w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
              errors.customerNotes
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            }`}
          />

          <div className="mt-2 flex items-start justify-between gap-4">
            {errors.customerNotes ? (
              <p className="text-sm font-medium text-red-600">
                {errors.customerNotes.message}
              </p>
            ) : (
              <p className="text-xs leading-5 text-slate-400">
                Include any special handling instructions
                for your laundry.
              </p>
            )}

            <p
              className={`shrink-0 text-xs ${
                notesLength >= 450
                  ? "font-semibold text-amber-600"
                  : "text-slate-400"
              }`}
            >
              {notesLength}/500
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <Sparkles size={17} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Your preferences
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              These preferences will be included with your
              laundry order and shared with the FreshFold
              processing team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}