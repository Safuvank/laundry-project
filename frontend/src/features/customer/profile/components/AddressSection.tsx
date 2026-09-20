"use client";

import { MapPin, Plus } from "lucide-react";
import { useState } from "react";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import DeleteAddressDialog from "./DeleteAddressDialog";

import { useAddresses } from "../hooks/useAddresses";
import { useSetDefaultAddress } from "../hooks/useSetDefaultAddress";

import type { CustomerAddress } from "../types/address.types";

export default function AddressSection() {
  const { data: addresses = [], isLoading, isError, refetch } = useAddresses();

  const setDefaultAddressMutation = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(
    null,
  );

  const [deletingAddress, setDeletingAddress] =
    useState<CustomerAddress | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (address: CustomerAddress) => {
    setDeletingAddress(address);
  };

  const handleDeleteSuccess = () => {
    setDeletingAddress(null);
  };

  const handleSetDefault = (address: CustomerAddress) => {
    if (address.isDefault) {
      return;
    }

    setDefaultAddressMutation.mutate(address._id);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <MapPin className="h-5 w-5 text-gray-700" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Saved Addresses
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Manage your pickup and delivery addresses
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAddAddress}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="border-b border-gray-100 p-6">
          <AddressForm
            address={editingAddress}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
          />
        </div>
      )}

      {/* Content */}
      {!showForm && (
        <div className="p-6">
          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-gray-200 p-5"
                >
                  <div className="mb-4 h-10 w-10 rounded-xl bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-700">
                Unable to load your saved addresses.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-3 text-sm font-medium text-red-700 underline underline-offset-2 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && addresses.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-6 w-6 text-gray-500" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                No saved addresses
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Add your home, work, or another address to make laundry pickup
                and delivery easier.
              </p>

              <button
                type="button"
                onClick={handleAddAddress}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add Your First Address
              </button>
            </div>
          )}

          {/* Address List */}
          {!isLoading && !isError && addresses.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard
                  key={address._id}
                  address={address}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                  onSetDefault={handleSetDefault}
                />
              ))}
            </div>
          )}

          {/* Default address mutation error */}
          {setDefaultAddressMutation.isError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                {getErrorMessage(setDefaultAddressMutation.error)}
              </p>
            </div>
          )}

          {/* Default address loading */}
          {setDefaultAddressMutation.isPending && (
            <p className="mt-4 text-center text-xs text-gray-500">
              Updating your default address...
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteAddressDialog
        address={deletingAddress}
        open={Boolean(deletingAddress)}
        onCancel={() => setDeletingAddress(null)}
        onSuccess={handleDeleteSuccess}
      />
    </section>
  );
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
