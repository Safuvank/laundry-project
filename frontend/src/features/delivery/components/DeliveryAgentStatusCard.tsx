"use client";

import { useState } from "react";

import { useDeliveryProfile } from "../hooks/useDeliveryProfile";
import { useUpdateDeliveryAvailability } from "../hooks/useUpdateDeliveryAvailability";
import { useUpdateDeliveryLocation } from "../hooks/useUpdateDeliveryLocation";
import { useDeliveryLocationTracking } from "../hooks/useDeliveryLocationTracking";

/**
 * Handles automatic GPS tracking separately from the main card.
 *
 * This component is rendered only after the delivery profile
 * has successfully loaded, so the parent component never
 * changes its hook order.
 */
function DeliveryLocationTracker({ enabled }: { enabled: boolean }) {
  useDeliveryLocationTracking({
    enabled,
  });

  return null;
}

export default function DeliveryAgentStatusCard() {
  const { data: profile, isLoading, isError } = useDeliveryProfile();

  const updateAvailability = useUpdateDeliveryAvailability();
  const updateLocation = useUpdateDeliveryLocation();

  const [locationMessage, setLocationMessage] = useState("");

  /*
   * IMPORTANT:
   *
   * Do not put hooks below these early returns.
   *
   * The hooks used by this component are all called before
   * any conditional return.
   */

  if (isLoading) {
    return (
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-slate-200" />

              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-slate-200" />
                <div className="h-6 w-48 rounded bg-slate-200" />
                <div className="h-5 w-20 rounded-full bg-slate-200" />
              </div>
            </div>

            <div className="h-11 w-32 rounded-xl bg-slate-200" />
          </div>

          <div className="mt-8 h-28 rounded-2xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (isError || !profile) {
    return (
      <section className="w-full rounded-3xl border border-red-100 bg-red-50 p-8 shadow-sm">
        <div className="flex items-center gap-3 text-red-600">
          <svg
            className="h-6 w-6 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 1.732 1.732 1.732z"
            />
          </svg>

          <div>
            <p className="text-sm font-semibold">
              Failed to load delivery profile.
            </p>

            <p className="mt-1 text-xs text-red-500">
              Please refresh the page and try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const isAvailable = profile.status === "AVAILABLE";
  const hasLocation = Boolean(profile.currentLocation?.coordinates);

  const handleAvailabilityToggle = () => {
    updateAvailability.mutate({
      deliveryAgentId: profile._id,
      status: isAvailable ? "OFFLINE" : "AVAILABLE",
    });
  };

  /*
   * Manual location refresh.
   *
   * Automatic tracking is handled by DeliveryLocationTracker.
   */
  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }

    setLocationMessage("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
          setLocationMessage("Invalid GPS coordinates received.");
          return;
        }

        updateLocation.mutate(
          {
            longitude,
            latitude,
          },
          {
            onSuccess: (updatedAgent) => {
              

              setLocationMessage("Your location was updated successfully.");
            },

            onError: (error) => {
              console.error("Manual location update failed:", error);

              setLocationMessage(
                "Failed to update your location. Please try again.",
              );
            },
          },
        );
      },

      (error) => {
        console.error("Geolocation error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationMessage(
              "Location permission was denied. Please allow location access.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setLocationMessage("Your current location is unavailable.");
            break;

          case error.TIMEOUT:
            setLocationMessage("Location request timed out. Please try again.");
            break;

          default:
            setLocationMessage("Unable to access your current location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <>
      {/* ================================================================ */}
      {/* AUTOMATIC LOCATION TRACKING                                     */}
      {/* ================================================================ */}

      <DeliveryLocationTracker enabled={isAvailable} />

      {/* ================================================================ */}
      {/* MAIN CARD                                                        */}
      {/* ================================================================ */}

      <section className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-white shadow-sm">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Delivery Agent
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                  {typeof profile.userId === "object"
                    ? `${profile.userId.firstName} ${profile.userId.lastName}`
                    : profile.userId}
                </h2>

                {/* Status */}
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                      isAvailable
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isAvailable
                          ? "animate-pulse bg-green-500"
                          : "bg-slate-400"
                      }`}
                    />

                    {isAvailable ? "AVAILABLE" : profile.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="w-full lg:w-auto">
              <button
                type="button"
                onClick={handleAvailabilityToggle}
                disabled={updateAvailability.isPending}
                className={`w-full rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto ${
                  isAvailable
                    ? "bg-slate-900 hover:bg-slate-800 focus:ring-slate-900"
                    : "bg-blue-600 hover:bg-blue-500 focus:ring-blue-600"
                }`}
              >
                {updateAvailability.isPending
                  ? "Updating..."
                  : isAvailable
                    ? "Go Offline"
                    : "Go Available"}
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* LOCATION                                                           */}
        {/* ================================================================== */}

        <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              {/* Location icon */}
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">
                    Current Location
                  </p>

                  {hasLocation && (
                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                      Updated
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {hasLocation
                    ? isAvailable
                      ? "Your live GPS location is being used for delivery assignment."
                      : "Your last GPS location is saved."
                    : "Update your location so nearby orders can be assigned to you."}
                </p>

                {/* Coordinates */}
                {profile.currentLocation?.coordinates && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <p className="text-xs text-slate-500">
                      Current coordinates
                    </p>

                    <p className="mt-1 font-mono text-xs text-slate-700">
                      {profile.currentLocation.coordinates[1].toFixed(6)}
                      {" , "}
                      {profile.currentLocation.coordinates[0].toFixed(6)}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Latitude, Longitude
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Manual update location */}
            <button
              type="button"
              onClick={handleUpdateLocation}
              disabled={updateLocation.isPending}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              {updateLocation.isPending
                ? "Updating Location..."
                : "Update Location"}
            </button>
          </div>

          {/* Location feedback */}
          {locationMessage && (
            <div className="mt-5 flex items-start gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700 ring-1 ring-inset ring-blue-100">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <p>{locationMessage}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
