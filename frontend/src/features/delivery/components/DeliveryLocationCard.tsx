"use client";

import { useState } from "react";

export default function DeliveryLocationCard() {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setIsLoading(false);
      },
      (locationError) => {
        setError(
          locationError.message || "Unable to get your current location.",
        );

        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Delivery Location
        </h2>

        <p className="mt-1 text-sm text-gray-600">
          Update your current location so nearby delivery assignments can be
          identified.
        </p>
      </div>

      {/* Location */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        {location ? (
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-gray-500">Latitude</p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {location.latitude.toFixed(6)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Longitude</p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {location.longitude.toFixed(6)}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-sm font-medium text-green-700">
                Location captured
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <span className="text-lg">📍</span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">
                Location not updated
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Capture your current location to continue.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action */}
      <div className="mt-5">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading
            ? "Getting Location..."
            : location
              ? "Update Location"
              : "Get Current Location"}
        </button>
      </div>
    </section>
  );
}

