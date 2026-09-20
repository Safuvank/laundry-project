"use client";

import { Pencil } from "lucide-react";

import type { PricingRule } from "../types/pricing.types";

interface PricingTableProps {
  pricingRules: PricingRule[];

  onEdit: (pricingRule: PricingRule) => void;
}

export function PricingTable({
  pricingRules,
  onEdit,
}: PricingTableProps) {
  if (pricingRules.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="font-semibold text-slate-900">
          No pricing rules found
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Create your first pricing rule.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Laundry Service
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pricing Type
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Adjustment
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {pricingRules.map((rule) => {
              return (
                <tr
                  key={rule._id}
                  className="group transition-colors hover:bg-slate-50"
                >
                  {/* Service */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {rule.laundryServiceId?.name ??
                        "Unknown Service"}
                    </div>

                    <div className="mt-0.5 text-xs text-slate-400">
                      Service pricing
                    </div>
                  </td>

                  {/* Pricing Type */}
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-100">
                      {rule.pricingType}
                    </span>
                  </td>

                  {/* Adjustment */}
                  <td className="px-6 py-4 text-slate-600">
                    {rule.adjustmentType}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900">
                      ₹{rule.amount.toFixed(2)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={
                        rule.isActive
                          ? "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200"
                          : "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200"
                      }
                    >
                      <span
                        className={
                          rule.isActive
                            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                            : "h-1.5 w-1.5 rounded-full bg-slate-400"
                        }
                      />

                      {rule.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onEdit(rule)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <Pencil size={15} />

                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
