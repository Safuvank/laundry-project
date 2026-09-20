"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateAddress } from "../hooks/useCreateAddress";
import {
  addressSchema,
  type AddressFormData,
} from "../validation/address.schema";

interface AddAddressFormProps {
  onSuccess: (addressId: string) => void;
  onCancel: () => void;
}

type LocationStatus = "idle" | "loading" | "success" | "error";

const ADDRESS_TYPES = ["HOME", "OFFICE", "OTHER"] as const;

const inputClassName =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const errorClassName = "mt-1 text-xs text-red-600";

export default function AddAddressForm({
  onSuccess,
  onCancel,
}: AddAddressFormProps) {
  const createAddressMutation = useCreateAddress();

  const [locationStatus, setLocationStatus] =
    useState<LocationStatus>("idle");

  const [locationError, setLocationError] = useState("");

  const [locationAccuracy, setLocationAccuracy] =
    useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
      isDefault: false,

      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },

    mode: "onTouched",
  });

  const location = watch("location");

  /*
   * --------------------------------------------------------------------------
   * GET CURRENT LOCATION
   * --------------------------------------------------------------------------
   */

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError(
        "Location services are not supported by this browser.",
      );
      return;
    }

    setLocationStatus("loading");
    setLocationError("");
    setLocationAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          longitude,
          latitude,
          accuracy,
        } = position.coords;

        /*
         * Validate coordinates.
         *
         * GeoJSON Point:
         * [longitude, latitude]
         */

        if (
          !Number.isFinite(longitude) ||
          !Number.isFinite(latitude) ||
          (longitude === 0 && latitude === 0) ||
          longitude < -180 ||
          longitude > 180 ||
          latitude < -90 ||
          latitude > 90
        ) {
          setLocationStatus("error");
          setLocationError(
            "Invalid location received. Please try getting your location again.",
          );
          return;
        }

        setValue(
          "location",
          {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          {
            shouldValidate: true,
            shouldDirty: true,
          },
        );

        setLocationAccuracy(accuracy);
        setLocationStatus("success");
        setLocationError("");
      },

      (error: GeolocationPositionError) => {
        setLocationStatus("error");

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location permission was denied. Please allow location access in your browser settings.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationError(
              "Your current location could not be determined. Please try again.",
            );
            break;

          case error.TIMEOUT:
            setLocationError(
              "Location request timed out. Please try again.",
            );
            break;

          default:
            setLocationError(
              "Unable to get your current location. Please try again.",
            );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      },
    );
  }, [setValue]);

  /*
   * --------------------------------------------------------------------------
   * GET LOCATION ON MOUNT
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  /*
   * --------------------------------------------------------------------------
   * SUBMIT ADDRESS
   * --------------------------------------------------------------------------
   */

  const onSubmit = (data: AddressFormData) => {
    const coordinates = data.location?.coordinates;

    const longitude = coordinates?.[0];
    const latitude = coordinates?.[1];

    /*
     * LOCATION PROTECTION
     */

    if (locationStatus !== "success") {
      setLocationStatus("error");
      setLocationError(
        "Please capture your pickup location before saving the address.",
      );
      return;
    }

    if (
      longitude === undefined ||
      latitude === undefined ||
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude) ||
      (longitude === 0 && latitude === 0)
    ) {
      setLocationStatus("error");
      setLocationError(
        "A valid pickup location is required. Please click 'Use My Location' and try again.",
      );
      return;
    }

    if (
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      setLocationStatus("error");
      setLocationError(
        "The captured location is invalid. Please try again.",
      );
      return;
    }

    /*
     * BUILD PAYLOAD
     */

    const payload: AddressFormData = {
      ...data,

      fullName: data.fullName.trim(),
      phoneNumber: data.phoneNumber.trim(),
      addressLine1: data.addressLine1.trim(),
      city: data.city.trim(),
      state: data.state.trim(),
      postalCode: data.postalCode.trim(),
      country: data.country.trim(),

      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };

    /*
     * OPTIONAL ADDRESS LINE 2
     */

    if (payload.addressLine2?.trim()) {
      payload.addressLine2 = payload.addressLine2.trim();
    } else {
      delete payload.addressLine2;
    }

    /*
     * CREATE ADDRESS
     */

    createAddressMutation.mutate(payload, {
      onSuccess: (address) => {
        onSuccess(address._id);
      },
    });
  };

  /*
   * --------------------------------------------------------------------------
   * API ERROR MESSAGE
   * --------------------------------------------------------------------------
   */

  const getApiErrorMessage = (): string => {
    const error = createAddressMutation.error as
      | {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
          message?: string;
        }
      | null;

    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong while saving the address. Please try again."
    );
  };

  const isBusy =
    createAddressMutation.isPending ||
    locationStatus === "loading";

  /*
   * --------------------------------------------------------------------------
   * UI
   *
   * IMPORTANT:
   * No <form> element here.
   *
   * CreateOrderPage already contains the parent <form>.
   * --------------------------------------------------------------------------
   */

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            New Address
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Add Pickup Address
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter the address where we should collect your laundry.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={isBusy}
          className="w-fit text-sm font-semibold text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      <div className="mt-6 space-y-6">
        {/* ---------------------------------------------------------------- */}
        {/* CONTACT INFORMATION                                              */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <h3 className="text-sm font-bold text-slate-900">
            Contact Information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="address-fullName"
                className="text-sm font-semibold text-slate-700"
              >
                Full Name
              </label>

              <input
                id="address-fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter full name"
                disabled={createAddressMutation.isPending}
                {...register("fullName")}
                className={inputClassName}
              />

              {errors.fullName && (
                <p className={errorClassName}>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address-phoneNumber"
                className="text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="address-phoneNumber"
                type="tel"
                autoComplete="tel"
                placeholder="Enter phone number"
                disabled={createAddressMutation.isPending}
                {...register("phoneNumber")}
                className={inputClassName}
              />

              {errors.phoneNumber && (
                <p className={errorClassName}>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* ADDRESS DETAILS                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <h3 className="text-sm font-bold text-slate-900">
            Address Details
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="address-line1"
                className="text-sm font-semibold text-slate-700"
              >
                Address Line 1
              </label>

              <input
                id="address-line1"
                type="text"
                autoComplete="street-address"
                placeholder="House number, building, street"
                disabled={createAddressMutation.isPending}
                {...register("addressLine1")}
                className={inputClassName}
              />

              {errors.addressLine1 && (
                <p className={errorClassName}>
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="address-line2"
                className="text-sm font-semibold text-slate-700"
              >
                Address Line 2
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                id="address-line2"
                type="text"
                placeholder="Apartment, landmark, area"
                disabled={createAddressMutation.isPending}
                {...register("addressLine2")}
                className={inputClassName}
              />

              {errors.addressLine2 && (
                <p className={errorClassName}>
                  {errors.addressLine2.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="address-city"
                  className="text-sm font-semibold text-slate-700"
                >
                  City
                </label>

                <input
                  id="address-city"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City"
                  disabled={createAddressMutation.isPending}
                  {...register("city")}
                  className={inputClassName}
                />

                {errors.city && (
                  <p className={errorClassName}>
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="text-sm font-semibold text-slate-700"
                >
                  State
                </label>

                <input
                  id="address-state"
                  type="text"
                  autoComplete="address-level1"
                  placeholder="State"
                  disabled={createAddressMutation.isPending}
                  {...register("state")}
                  className={inputClassName}
                />

                {errors.state && (
                  <p className={errorClassName}>
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address-postalCode"
                  className="text-sm font-semibold text-slate-700"
                >
                  Postal Code
                </label>

                <input
                  id="address-postalCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="Postal code"
                  disabled={createAddressMutation.isPending}
                  {...register("postalCode")}
                  className={inputClassName}
                />

                {errors.postalCode && (
                  <p className={errorClassName}>
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address-country"
                  className="text-sm font-semibold text-slate-700"
                >
                  Country
                </label>

                <input
                  id="address-country"
                  type="text"
                  autoComplete="country-name"
                  placeholder="Country"
                  disabled={createAddressMutation.isPending}
                  {...register("country")}
                  className={inputClassName}
                />

                {errors.country && (
                  <p className={errorClassName}>
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* ADDRESS TYPE                                                      */}
        {/* ---------------------------------------------------------------- */}

        <section>
          <h3 className="text-sm font-bold text-slate-900">
            Address Type
          </h3>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {ADDRESS_TYPES.map((type) => (
              <label
                key={type}
                className="cursor-pointer"
              >
                <input
                  type="radio"
                  value={type}
                  disabled={createAddressMutation.isPending}
                  {...register("addressType")}
                  className="peer sr-only"
                />

                <div className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-600 transition hover:border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700">
                  {type}
                </div>
              </label>
            ))}
          </div>

          {errors.addressType && (
            <p className={errorClassName}>
              {errors.addressType.message}
            </p>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PICKUP LOCATION                                                   */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Pickup Location
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Your location helps our delivery agent find the pickup
                address.
              </p>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isBusy}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locationStatus === "loading"
                ? "Getting Location..."
                : locationStatus === "success"
                  ? "Update Location"
                  : "Use My Location"}
            </button>
          </div>

          {locationStatus === "success" && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <p className="text-xs font-semibold text-emerald-700">
                ✓ Pickup location captured successfully.
              </p>

              <p className="mt-1 text-xs text-emerald-700">
                Coordinates:{" "}
                {location?.coordinates?.[0]?.toFixed(6)},{" "}
                {location?.coordinates?.[1]?.toFixed(6)}
              </p>

              {locationAccuracy !== null && (
                <p className="mt-1 text-xs text-emerald-600">
                  Accuracy: approximately{" "}
                  {Math.round(locationAccuracy)} meters
                </p>
              )}
            </div>
          )}

          {locationStatus === "error" && (
            <div
              role="alert"
              className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3"
            >
              <p className="text-xs font-medium text-red-600">
                {locationError}
              </p>
            </div>
          )}

          {locationStatus === "loading" && (
            <p className="mt-3 text-xs text-blue-600">
              Getting your current location. Please wait...
            </p>
          )}

          {locationStatus === "idle" && (
            <p className="mt-3 text-xs text-amber-600">
              Waiting for pickup location...
            </p>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* DEFAULT ADDRESS                                                   */}
        {/* ---------------------------------------------------------------- */}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            disabled={createAddressMutation.isPending}
            {...register("isDefault")}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <span>
            <span className="block text-sm font-semibold text-slate-800">
              Make this my default address
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              Use this address automatically for future orders.
            </span>
          </span>
        </label>

        {/* ---------------------------------------------------------------- */}
        {/* API ERROR                                                         */}
        {/* ---------------------------------------------------------------- */}

        {createAddressMutation.isError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4"
          >
            <p className="text-sm font-semibold text-red-800">
              Unable to save address
            </p>

            <p className="mt-1 text-sm text-red-600">
              {getApiErrorMessage()}
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* ACTIONS                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          {/*
           * IMPORTANT:
           * This is intentionally NOT type="submit".
           *
           * CreateOrderPage already owns the parent <form>.
           * We manually trigger this child form's React Hook Form validation.
           */}

          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isBusy}
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createAddressMutation.isPending
              ? "Saving Address..."
              : locationStatus === "loading"
                ? "Getting Location..."
                : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
