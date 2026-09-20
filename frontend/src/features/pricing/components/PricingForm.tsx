"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, X, Tags } from "lucide-react";

import { useCreatePricing } from "../hooks/useCreatePricing";
import { useUpdatePricing } from "../hooks/useUpdatePricing";

import type { PricingRule } from "../types/pricing.types";

/* -------------------------------------------------------------------------- */
/*                                SCHEMA                                      */
/* -------------------------------------------------------------------------- */

const pricingFormSchema = z.object({
  laundryServiceId: z.string(),

  pricingType: z.enum(["BASE", "MINIMUM", "PICKUP", "DELIVERY", "TURNAROUND"]),

  adjustmentType: z.enum(["NONE", "FIXED", "PERCENTAGE"]),

  amount: z
    .number({
      error: "Amount is required.",
    })
    .min(0, "Amount cannot be negative."),
});

type PricingFormData = z.infer<typeof pricingFormSchema>;

/* -------------------------------------------------------------------------- */
/*                              SERVICE TYPE                                  */
/* -------------------------------------------------------------------------- */

interface LaundryService {
  _id: string;
  name: string;
  isActive: boolean;
}

/* -------------------------------------------------------------------------- */
/*                         POPULATED SERVICE TYPE                             */
/* -------------------------------------------------------------------------- */

interface PopulatedLaundryService {
  _id: string;
  name: string;
  isActive?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               PROPS                                        */
/* -------------------------------------------------------------------------- */

interface PricingFormProps {
  laundryServices: LaundryService[];

  editingRule?: PricingRule | null;

  onSuccess: () => void;

  onCancel: () => void;
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export function PricingForm({
  laundryServices,
  editingRule,
  onSuccess,
  onCancel,
}: PricingFormProps) {
  const createPricing = useCreatePricing();
  const updatePricing = useUpdatePricing();

  const isEditMode = Boolean(editingRule);

  const isPending = createPricing.isPending || updatePricing.isPending;

  /* ---------------------------------------------------------------------- */
  /* Debug                                                                  */
  /* ---------------------------------------------------------------------- */

  /* ---------------------------------------------------------------------- */
  /* Form                                                                   */
  /* ---------------------------------------------------------------------- */

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingFormSchema),

    defaultValues: {
      laundryServiceId: "",
      pricingType: "BASE",
      adjustmentType: "NONE",
      amount: 0,
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Normalize Laundry Service ID                                           */
  /* ---------------------------------------------------------------------- */

  const getLaundryServiceId = (): string => {
    if (!editingRule) {
      return "";
    }

    const service = editingRule.laundryServiceId;

    if (typeof service === "string") {
      return service;
    }

    if (service && typeof service === "object" && "_id" in service) {
      return String((service as PopulatedLaundryService)._id);
    }

    return "";
  };

  /* ---------------------------------------------------------------------- */
  /* Get Laundry Service Name                                               */
  /* ---------------------------------------------------------------------- */

  const getLaundryServiceName = (): string => {
    if (!editingRule) {
      return "Laundry service";
    }

    const service = editingRule.laundryServiceId;

    /* -------------------------------------------------------------- */
    /* Populated object                                               */
    /* -------------------------------------------------------------- */

    if (service && typeof service === "object" && "name" in service) {
      return String((service as PopulatedLaundryService).name);
    }

    /* -------------------------------------------------------------- */
    /* Service ID                                                     */
    /* -------------------------------------------------------------- */

    if (typeof service === "string") {
      const foundService = laundryServices.find((item) => item._id === service);

      return foundService?.name ?? "Laundry service";
    }

    return "Laundry service";
  };

  /* ---------------------------------------------------------------------- */
  /* Populate Form                                                          */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (editingRule) {
      const normalizedServiceId = getLaundryServiceId();

      reset({
        laundryServiceId: normalizedServiceId,
        pricingType: editingRule.pricingType,
        adjustmentType: editingRule.adjustmentType,
        amount: editingRule.amount,
      });

      return;
    }

    reset({
      laundryServiceId: "",
      pricingType: "BASE",
      adjustmentType: "NONE",
      amount: 0,
    });
  }, [editingRule, reset]);

  /* ---------------------------------------------------------------------- */
  /* Submit                                                                 */
  /* ---------------------------------------------------------------------- */

  const onSubmit = (data: PricingFormData) => {
    /* ------------------------------------------------------------------ */
    /* EDIT MODE                                                          */
    /* ------------------------------------------------------------------ */

    if (editingRule) {
      const updatePayload = {
        adjustmentType: data.adjustmentType,
        amount: data.amount,
      };

      updatePricing.mutate(
        {
          id: editingRule._id,
          payload: updatePayload,
        },
        {
          onSuccess: (updatedRule) => {
            onSuccess();
          },

          onError: (error) => {},
        },
      );

      return;
    }

    /* ------------------------------------------------------------------ */
    /* CREATE MODE                                                        */
    /* ------------------------------------------------------------------ */

    if (!data.laundryServiceId) {
      console.warn("CREATE stopped: laundryServiceId is missing.");

      return;
    }

    createPricing.mutate(data, {
      onSuccess: (createdRule) => {
        reset();

        onSuccess();
      },

      onError: (error) => {
        console.error("==========================================");
        console.error("        PRICING CREATE FAILED");
        console.error("==========================================");

        console.error("Create error:", error);
      },
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Validation Error                                                      */
  /* ---------------------------------------------------------------------- */

  const onInvalid = (validationErrors: typeof errors) => {
    console.error("==========================================");
    console.error("       PRICING FORM VALIDATION FAILED");
    console.error("==========================================");

    console.error("Validation errors:", validationErrors);

    Object.entries(validationErrors).forEach(([field, error]) => {
      console.error(`❌ Field "${field}" validation error:`, error);
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Laundry Service Display                                               */
  /* ---------------------------------------------------------------------- */

  const selectedServiceName = getLaundryServiceName();


  /* ---------------------------------------------------------------------- */
  /* Error                                                                  */
  /* ---------------------------------------------------------------------- */

  const hasError = createPricing.isError || updatePricing.isError;

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Tags size={20} strokeWidth={2} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditMode ? "Edit Pricing Rule" : "Add Pricing Rule"}
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {isEditMode
                ? "Update the pricing rule details."
                : "Create a pricing rule for a laundry service."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          aria-label="Close"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Form                                                               */}
      {/* ------------------------------------------------------------------ */}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-6 p-6"
      >
        {/* ---------------------------------------------------------------- */}
        {/* Laundry Service                                                  */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <label
            htmlFor="laundryServiceId"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Laundry Service
          </label>

          {isEditMode ? (
            <div className="flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span className="text-sm font-medium text-slate-700">
                {selectedServiceName}
              </span>
            </div>
          ) : (
            <select
              id="laundryServiceId"
              {...register("laundryServiceId")}
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition ${
                errors.laundryServiceId
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            >
              <option value="">Select laundry service</option>

              {laundryServices
                .filter((service) => service.isActive)
                .map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
            </select>
          )}

          {!isEditMode && errors.laundryServiceId && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.laundryServiceId.message}
            </p>
          )}

          {isEditMode && (
            <p className="mt-1.5 text-xs text-slate-400">
              The laundry service cannot be changed.
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Pricing Type                                                     */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <label
            htmlFor="pricingType"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Pricing Type
          </label>

          {isEditMode ? (
            <div className="flex min-h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
              <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {editingRule?.pricingType}
              </span>
            </div>
          ) : (
            <select
              id="pricingType"
              {...register("pricingType")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="BASE">BASE</option>
              <option value="MINIMUM">MINIMUM</option>
              <option value="PICKUP">PICKUP</option>
              <option value="DELIVERY">DELIVERY</option>
              <option value="TURNAROUND">TURNAROUND</option>
            </select>
          )}

          {isEditMode && (
            <p className="mt-1.5 text-xs text-slate-400">
              Pricing type cannot be changed.
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Adjustment Type                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <label
            htmlFor="adjustmentType"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Adjustment Type
          </label>

          <select
            id="adjustmentType"
            {...register("adjustmentType")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="NONE">NONE</option>

            <option value="FIXED">FIXED</option>

            <option value="PERCENTAGE">PERCENTAGE</option>
          </select>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Amount                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Amount
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
              ₹
            </span>

            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              {...register("amount", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              className={`w-full rounded-lg border bg-white py-2.5 pl-8 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 ${
                errors.amount
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />
          </div>

          {errors.amount && (
            <p className="mt-1.5 text-xs font-medium text-red-600">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                             */}
        {/* ---------------------------------------------------------------- */}

        {hasError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">
              {isEditMode
                ? "Failed to update pricing rule."
                : "Failed to create pricing rule."}
            </p>

            <p className="mt-1 text-xs text-red-600">
              Please check the browser console for the exact error.
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Actions                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}

            {isPending
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Pricing"
                : "Create Pricing"}
          </button>
        </div>
      </form>
    </div>
  );
}
