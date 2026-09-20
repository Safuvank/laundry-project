"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useMyAddresses } from "@/features/customer/hooks/useMyAddresses";
import AddAddressForm from "@/features/customer/addresses/components/AddAddressForm";

import type { CreateOrderFormData } from "../../validation/create-order.schema";

export default function AddressStep() {
  const [showAddAddress, setShowAddAddress] = useState(false);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateOrderFormData>();

  const selectedAddressId = watch("addressId");

  const { data: addresses = [], isLoading, isError, error } = useMyAddresses();

  /**
   * Show Add Address form
   */
  if (showAddAddress) {
    return (
      <AddAddressForm
        onSuccess={(addressId) => {
          setValue("addressId", addressId, {
            shouldValidate: true,
            shouldDirty: true,
          });

          setShowAddAddress(false);
        }}
        onCancel={() => {
          setShowAddAddress(false);
        }}
      />
    );
  }

  /**
   * Loading state
   */
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Select Pickup Address
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose where our delivery agent should collect your laundry.
        </p>

        <div className="mt-6 space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Error state
   */
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="font-semibold text-red-900">Unable to load addresses</h2>

        <p className="mt-1 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading your addresses."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Select Pickup Address
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Choose where our delivery agent should collect your laundry.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddAddress(true)}
          className="w-fit rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
        >
          + Add New Address
        </button>
      </div>

      {/* No Addresses */}
      {addresses.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="text-3xl">📍</div>

          <h3 className="mt-3 font-semibold text-slate-900">
            No saved addresses
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add a pickup address to continue with your order.
          </p>

          <button
            type="button"
            onClick={() => setShowAddAddress(true)}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Address
          </button>
        </div>
      ) : (
        /* Existing Addresses */
        <div className="mt-6 space-y-3">
          {addresses.map((address) => {
            const isSelected = selectedAddressId === address._id;

            return (
              <label key={address._id} className="block cursor-pointer">
                <input
                  type="radio"
                  value={address._id}
                  {...register("addressId")}
                  className="sr-only"
                />

                <div
                  className={`rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio indicator */}
                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-blue-600" : "border-slate-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                      )}
                    </div>

                    {/* Address information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {address.fullName}
                        </p>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                          {address.addressType}
                        </span>

                        {address.isDefault && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600">
                        {address.addressLine1}

                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {address.city}, {address.state} {address.postalCode}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {address.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Validation Error */}
      {errors.addressId && (
        <p className="mt-3 text-sm font-medium text-red-600">
          {errors.addressId.message}
        </p>
      )}
    </div>
  );
}
