"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

import { useDeleteAddress } from "../hooks/useDeleteAddress";
import type { CustomerAddress } from "../types/address.types";

interface DeleteAddressDialogProps {
  address: CustomerAddress | null;
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function DeleteAddressDialog({
  address,
  open,
  onCancel,
  onSuccess,
}: DeleteAddressDialogProps) {
  const deleteAddressMutation = useDeleteAddress();

  if (!open || !address) {
    return null;
  }

  const handleDelete = () => {
    deleteAddressMutation.mutate(address._id, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-address-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2
                id="delete-address-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Address
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleteAddressMutation.isPending}
            aria-label="Close delete dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-gray-600">
            Are you sure you want to delete this address?
          </p>

          {/* Address preview */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {address.fullName}
                </p>

                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                  {address.addressType}
                </p>
              </div>

              {address.isDefault && (
                <span className="rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white">
                  Default
                </span>
              )}
            </div>

            <div className="mt-3 space-y-1 text-sm leading-5 text-gray-600">
              <p>{address.addressLine1}</p>

              {address.addressLine2 && <p>{address.addressLine2}</p>}

              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>

              <p>{address.country}</p>
            </div>
          </div>

          {/* Error */}
          {deleteAddressMutation.isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">
                {getErrorMessage(deleteAddressMutation.error)}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleteAddressMutation.isPending}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteAddressMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteAddressMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Address
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to delete the address. Please try again.";
};
