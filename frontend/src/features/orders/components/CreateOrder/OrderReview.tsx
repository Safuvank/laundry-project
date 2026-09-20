"use client";

import { useFormContext } from "react-hook-form";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

export default function OrderReview() {
  const { watch } = useFormContext<CreateOrderFormData>();

  const data = watch();

  const {
    addressId,
    laundryServiceIds = [],
    turnaroundPlanId,
    pickupDate,
    pickupSlotId,
    detergentPreference,
    fabricSoftener,
    starchPreference,
    foldingPreference,
    customerNotes,
  } = data;

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    return (
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        <div className="px-5 py-4">{children}</div>
      </section>
    );
  };

  const Item = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => {
    return (
      <div className="flex items-start justify-between gap-4 py-2">
        <span className="text-sm text-slate-500">
          {label}
        </span>

        <span className="text-right text-sm font-medium text-slate-900">
          {value}
        </span>
      </div>
    );
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not selected";

    const parsedDate = new Date(`${date}T00:00:00`);

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

  const formatTime = (time?: string) => {
    if (!time) return "Not selected";

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

  const formatBoolean = (value?: boolean) => {
    return value ? "Yes" : "No";
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Review Your Order
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Review your selections carefully before placing
          your laundry order.
        </p>
      </div>

      {/* Order Summary */}
      <div className="mt-6 space-y-4">
        {/* Address */}
        <Section title="Pickup Address">
          {addressId ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg">
                📍
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Selected Address
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Address ID: {addressId}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              No pickup address selected.
            </p>
          )}
        </Section>

        {/* Services */}
        <Section title="Laundry Services">
          {laundryServiceIds.length > 0 ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  🧺
                </span>

                <p className="text-sm font-semibold text-slate-900">
                  {laundryServiceIds.length}{" "}
                  {laundryServiceIds.length === 1
                    ? "service"
                    : "services"}{" "}
                  selected
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {laundryServiceIds.map((serviceId) => (
                  <span
                    key={serviceId}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    {serviceId}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-red-600">
              No laundry services selected.
            </p>
          )}
        </Section>

        {/* Turnaround */}
        <Section title="Turnaround Plan">
          {turnaroundPlanId ? (
            <Item
              label="Selected plan"
              value={turnaroundPlanId}
            />
          ) : (
            <p className="text-sm text-red-600">
              No turnaround plan selected.
            </p>
          )}
        </Section>

        {/* Pickup Schedule */}
        <Section title="Pickup Schedule">
          <div className="divide-y divide-slate-100">
            <Item
              label="Pickup date"
              value={formatDate(pickupDate)}
            />

            <Item
              label="Pickup slot"
              value={
                pickupSlotId
                  ? pickupSlotId
                  : "Not selected"
              }
            />
          </div>
        </Section>

        {/* Preferences */}
        <Section title="Laundry Preferences">
          <div className="divide-y divide-slate-100">
            <Item
              label="Detergent"
              value={
                detergentPreference || "Not specified"
              }
            />

            <Item
              label="Fabric softener"
              value={formatBoolean(fabricSoftener)}
            />

            <Item
              label="Starch"
              value={formatBoolean(starchPreference)}
            />

            <Item
              label="Folding"
              value={
                foldingPreference || "Not specified"
              }
            />

            {customerNotes && (
              <Item
                label="Additional notes"
                value={customerNotes}
              />
            )}
          </div>
        </Section>
      </div>

      {/* Final Notice */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg">ℹ️</span>

          <div>
            <p className="text-sm font-semibold text-blue-900">
              Ready to place your order?
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Please make sure your pickup address,
              services, turnaround plan, and pickup schedule
              are correct. Your order will be created using
              these selections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
