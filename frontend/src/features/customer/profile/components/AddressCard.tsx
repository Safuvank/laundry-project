"use client";

import {
  Check,
  Edit3,
  Home,
  MapPin,
  MoreVertical,
  Trash2,
  Briefcase,
} from "lucide-react";
import { useState } from "react";

import type { CustomerAddress } from "../types/address.types";

interface AddressCardProps {
  address: CustomerAddress;
  onEdit?: (address: CustomerAddress) => void;
  onDelete?: (address: CustomerAddress) => void;
  onSetDefault?: (address: CustomerAddress) => void;
}

const getAddressIcon = (addressType: CustomerAddress["addressType"]) => {
  switch (addressType) {
    case "HOME":
      return Home;

    case "WORK":
      return Briefcase;

    default:
      return MapPin;
  }
};

const formatAddressType = (
  addressType: CustomerAddress["addressType"],
): string => {
  switch (addressType) {
    case "HOME":
      return "Home";

    case "WORK":
      return "Work";

    default:
      return "Other";
  }
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const [showActions, setShowActions] = useState(false);

  const AddressIcon = getAddressIcon(address.addressType);

  return (
    <article
      className={`relative rounded-2xl border bg-white p-5 transition ${
        address.isDefault
          ? "border-gray-900 shadow-sm"
          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              address.isDefault ? "bg-gray-900" : "bg-gray-100"
            }`}
          >
            <AddressIcon
              className={`h-5 w-5 ${
                address.isDefault ? "text-white" : "text-gray-600"
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {formatAddressType(address.addressType)}
              </h3>

              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700">
                  <Check className="h-3 w-3" />
                  Default
                </span>
              )}
            </div>

            <p className="mt-0.5 text-xs text-gray-500">{address.fullName}</p>
          </div>
        </div>

        {/* Actions menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Address actions"
            aria-expanded={showActions}
            onClick={() => setShowActions((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {showActions && (
            <>
              {/* Backdrop */}
              <button
                type="button"
                aria-label="Close address actions"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setShowActions(false)}
              />

              {/* Dropdown */}
              <div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowActions(false);
                    onEdit?.(address);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Address
                </button>

                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowActions(false);
                      onSetDefault?.(address);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <Check className="h-4 w-4" />
                    Set as Default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowActions(false);
                    onDelete?.(address);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Address
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address details */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

          <div className="space-y-1 text-sm leading-5 text-gray-600">
            <p>{address.addressLine1}</p>

            {address.addressLine2 && <p>{address.addressLine2}</p>}

            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>

            <p>{address.country}</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Contact
            </p>

            <p className="mt-1 text-sm text-gray-700">{address.phoneNumber}</p>
          </div>

          {address.isDefault && (
            <span className="text-xs text-gray-400">
              Used for pickup & delivery
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
