"use client";

import { useState } from "react";

import {
  Plus,
  RefreshCw,
  Tags,
} from "lucide-react";

import { PricingTable } from "./PricingTable";
import { PricingForm } from "./PricingForm";

import { useAdminPricingRules } from "../hooks/useAdminPricingRules";
import { useLaundryServices } from "@/features/orders/hooks/useLaundryServices";

import type { PricingRule } from "../types/pricing.types";

export function AdminPricingPage() {
  const [showForm, setShowForm] = useState(false);

  // Currently selected pricing rule for editing
  const [editingRule, setEditingRule] =
    useState<PricingRule | null>(null);

  /* ---------------------------------------------------------------------- */
  /*                              PRICING                                   */
  /* ---------------------------------------------------------------------- */

  const {
    data: pricingRules = [],
    isLoading: pricingLoading,
    isError: pricingError,
    refetch: refetchPricing,
  } = useAdminPricingRules();

  /* ---------------------------------------------------------------------- */
  /*                           LAUNDRY SERVICES                             */
  /* ---------------------------------------------------------------------- */

  const {
    data: laundryServices = [],
    isLoading: servicesLoading,
    isError: servicesError,
    refetch: refetchServices,
  } = useLaundryServices();

  /* ---------------------------------------------------------------------- */
  /*                         SERVICE NAME MAP                               */
  /* ---------------------------------------------------------------------- */

  const serviceNames = laundryServices.reduce<Record<string, string>>(
    (acc, service) => {
      acc[service._id] = service.name;

      return acc;
    },
    {}
  );

  /* ---------------------------------------------------------------------- */
  /*                              STATES                                    */
  /* ---------------------------------------------------------------------- */

  const isLoading =
    pricingLoading || servicesLoading;

  const hasError =
    pricingError || servicesError;

  /* ---------------------------------------------------------------------- */
  /*                              EDIT                                      */
  /* ---------------------------------------------------------------------- */

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /*                           ADD PRICING                                  */
  /* ---------------------------------------------------------------------- */

  const handleAddPricing = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /*                              CANCEL                                    */
  /* ---------------------------------------------------------------------- */

  const handleCancel = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  /* ---------------------------------------------------------------------- */
  /*                              SUCCESS                                   */
  /* ---------------------------------------------------------------------- */

  const handleSuccess = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  /* ---------------------------------------------------------------------- */
  /*                              RETRY                                     */
  /* ---------------------------------------------------------------------- */

  const handleRetry = () => {
    if (pricingError) {
      refetchPricing();
    }

    if (servicesError) {
      refetchServices();
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                              RENDER                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-full w-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
              <Tags
                size={23}
                strokeWidth={2}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Pricing
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage laundry service pricing and rates.
              </p>
            </div>

          </div>

          {!showForm && (
            <button
              type="button"
              onClick={handleAddPricing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus
                size={17}
                strokeWidth={2.2}
              />

              Add Pricing
            </button>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Pricing Form                                                     */}
        {/* ---------------------------------------------------------------- */}

        {showForm && (
          <PricingForm
            laundryServices={laundryServices}
            editingRule={editingRule}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Error                                                            */}
        {/* ---------------------------------------------------------------- */}

        {hasError && (
          <div className="flex flex-col gap-4 rounded-xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-semibold text-red-800">
                Failed to load pricing data.
              </p>

              <p className="mt-1 text-sm text-red-600">
                Please check your connection and try again.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50"
            >
              <RefreshCw size={15} />

              Retry
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Loading                                                          */}
        {/* ---------------------------------------------------------------- */}

        {isLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm font-medium text-slate-600">
              Loading pricing...
            </p>

          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Pricing Table                                                    */}
        {/* ---------------------------------------------------------------- */}

        {!isLoading && !hasError && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Pricing Rules
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure pricing for each laundry service.
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {pricingRules.length}{" "}
                  {pricingRules.length === 1
                    ? "Rule"
                    : "Rules"}
                </div>

              </div>
            </div>

            <PricingTable
              pricingRules={pricingRules}
              serviceNames={serviceNames}
              onEdit={handleEdit}
            />

          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Empty State                                                      */}
        {/* ---------------------------------------------------------------- */}

        {!isLoading &&
          !hasError &&
          pricingRules.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                <Tags
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No pricing rules yet
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Add your first pricing rule to define the
                base price for a laundry service.
              </p>

              {!showForm && (
                <button
                  type="button"
                  onClick={handleAddPricing}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={17} />

                  Add Pricing
                </button>
              )}

            </div>
          )}

      </div>
    </div>
  );
}
