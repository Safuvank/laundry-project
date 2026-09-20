"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Home, Loader2, MapPin, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { addressSchema, type AddressFormData } from "../schemas/address.schema";
import { useCreateAddress } from "../hooks/useCreateAddress";
import { useUpdateAddress } from "../hooks/useUpdateAddress";
import type {
  CustomerAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types/address.types";

interface AddressFormProps {
  address?: CustomerAddress | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClasses =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

const labelClasses = "mb-1.5 block text-sm font-medium text-gray-700";

const errorClasses = "mt-1 text-xs text-red-600";

export default function AddressForm({
  address,
  onSuccess,
  onCancel,
}: AddressFormProps) {
  const isEditMode = Boolean(address);

  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();

  const isSubmitting =
    createAddressMutation.isPending || updateAddressMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),

    defaultValues: {
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      addressType: "HOME",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      isDefault: false,
    },
  });

  /*
   * Populate the form when editing an existing address.
   */
  useEffect(() => {
    if (!address) {
      reset({
        fullName: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        addressType: "HOME",
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        isDefault: false,
      });

      return;
    }

    reset({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      addressType: address.addressType,
      location: address.location,
      isDefault: address.isDefault,
    });
  }, [address, reset]);

  const onSubmit = async (values: AddressFormData) => {
    try {
      if (isEditMode && address) {
        /*
         * Your current backend updateAddressSchema
         * does not accept location.
         */
        const payload: UpdateAddressPayload = {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 || undefined,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
          addressType: values.addressType,
          isDefault: values.isDefault,
        };

        await updateAddressMutation.mutateAsync({
          addressId: address._id,
          payload,
        });
      } else {
        /*
         * New addresses require a location.
         *
         * We use the browser's current location for now.
         * Later this can be replaced with a map picker.
         */
        const position = await getCurrentPosition();

        const payload: CreateAddressPayload = {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2 || undefined,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
          addressType: values.addressType,
          isDefault: values.isDefault,

          location: {
            type: "Point",
            coordinates: [position.longitude, position.latitude],
          },
        };

        await createAddressMutation.mutateAsync(payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Failed to save address:", error);
    }
  };

  const mutationError =
    createAddressMutation.error || updateAddressMutation.error;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? "Edit Address" : "Add New Address"}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {isEditMode
              ? "Update your saved address details."
              : "Add an address for laundry pickup and delivery."}
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            aria-label="Close address form"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 p-6">
        {/* Contact Information */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Contact Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className={labelClasses}>
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter full name"
                {...register("fullName")}
                className={inputClasses}
              />

              {errors.fullName && (
                <p className={errorClasses}>{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className={labelClasses}>
                Phone Number
              </label>

              <input
                id="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                {...register("phoneNumber")}
                className={inputClasses}
              />

              {errors.phoneNumber && (
                <p className={errorClasses}>{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Address Information
          </h3>

          <div className="space-y-5">
            {/* Address Line 1 */}
            <div>
              <label htmlFor="addressLine1" className={labelClasses}>
                Address Line 1
              </label>

              <input
                id="addressLine1"
                type="text"
                placeholder="House number, building, street"
                {...register("addressLine1")}
                className={inputClasses}
              />

              {errors.addressLine1 && (
                <p className={errorClasses}>{errors.addressLine1.message}</p>
              )}
            </div>

            {/* Address Line 2 */}
            <div>
              <label htmlFor="addressLine2" className={labelClasses}>
                Address Line 2
                <span className="ml-1 text-xs font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <input
                id="addressLine2"
                type="text"
                placeholder="Apartment, landmark, area..."
                {...register("addressLine2")}
                className={inputClasses}
              />

              {errors.addressLine2 && (
                <p className={errorClasses}>{errors.addressLine2.message}</p>
              )}
            </div>

            {/* City / State */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="city" className={labelClasses}>
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  {...register("city")}
                  className={inputClasses}
                />

                {errors.city && (
                  <p className={errorClasses}>{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className={labelClasses}>
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  placeholder="Enter state"
                  {...register("state")}
                  className={inputClasses}
                />

                {errors.state && (
                  <p className={errorClasses}>{errors.state.message}</p>
                )}
              </div>
            </div>

            {/* Postal / Country */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="postalCode" className={labelClasses}>
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  {...register("postalCode")}
                  className={inputClasses}
                />

                {errors.postalCode && (
                  <p className={errorClasses}>{errors.postalCode.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className={labelClasses}>
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  placeholder="Enter country"
                  {...register("country")}
                  className={inputClasses}
                />

                {errors.country && (
                  <p className={errorClasses}>{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Address Type */}
        <section>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Address Type
          </h3>

          <div className="grid grid-cols-3 gap-3">
            <AddressTypeOption
              value="HOME"
              label="Home"
              icon={<Home className="h-4 w-4" />}
              register={register}
            />

            <AddressTypeOption
              value="WORK"
              label="Work"
              icon={<Briefcase className="h-4 w-4" />}
              register={register}
            />

            <AddressTypeOption
              value="OTHER"
              label="Other"
              icon={<MapPin className="h-4 w-4" />}
              register={register}
            />
          </div>

          {errors.addressType && (
            <p className={errorClasses}>{errors.addressType.message}</p>
          )}
        </section>

        {/* Default Address */}
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300">
          <input
            type="checkbox"
            {...register("isDefault")}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />

          <span>
            <span className="block text-sm font-medium text-gray-900">
              Set as default address
            </span>

            <span className="mt-1 block text-xs leading-5 text-gray-500">
              Use this address as your primary pickup and delivery address.
            </span>
          </span>
        </label>

        {/* Location Notice */}
        {!isEditMode && (
          <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <div>
              <p className="text-sm font-medium text-blue-900">
                Location access required
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                FreshFold uses your current location to accurately coordinate
                pickup and delivery.
              </p>
            </div>
          </div>
        )}

        {/* Mutation Error */}
        {mutationError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {getErrorMessage(mutationError)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Address"
                : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}

interface AddressTypeOptionProps {
  value: "HOME" | "WORK" | "OTHER";
  label: string;
  icon: React.ReactNode;
  register: ReturnType<typeof useForm<AddressFormData>>["register"];
}

function AddressTypeOption({
  value,
  label,
  icon,
  register,
}: AddressTypeOptionProps) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        value={value}
        {...register("addressType")}
        className="peer sr-only"
      />

      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-400 peer-checked:border-gray-900 peer-checked:bg-gray-900 peer-checked:text-white">
        {icon}
        {label}
      </div>
    </label>
  );
}

/**
 * Get the browser's current location.
 */
const getCurrentPosition = (): Promise<{
  latitude: number;
  longitude: number;
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Location services are not supported by your browser."));

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          reject(new Error("Unable to get a valid current location."));

          return;
        }

        resolve({
          latitude,
          longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location permission was denied. Please allow location access to save your address.",
              ),
            );
            break;

          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                "Your current location is unavailable. Please check your device location settings.",
              ),
            );
            break;

          case error.TIMEOUT:
            reject(new Error("Location request timed out. Please try again."));
            break;

          default:
            reject(
              new Error(
                "Unable to get your current location. Please try again.",
              ),
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
