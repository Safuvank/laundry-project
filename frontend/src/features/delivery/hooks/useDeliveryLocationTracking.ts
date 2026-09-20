"use client";

import { useEffect } from "react";

import { useUpdateDeliveryLocation } from "./useUpdateDeliveryLocation";

interface UseDeliveryLocationTrackingOptions {
  enabled: boolean;
}

export const useDeliveryLocationTracking = ({
  enabled,
}: UseDeliveryLocationTrackingOptions) => {
  const updateLocation = useUpdateDeliveryLocation();

  useEffect(() => {
    // ---------------------------------------------------------------
    // Do not track location when the agent is offline.
    // ---------------------------------------------------------------

    if (!enabled) {
      return;
    }

    // ---------------------------------------------------------------
    // Check browser geolocation support.
    // ---------------------------------------------------------------

    if (!navigator.geolocation) {
      console.warn(
        "Delivery agent location tracking is not supported by this browser.",
      );

      return;
    }

    // ---------------------------------------------------------------
    // Start watching the delivery agent's location.
    // ---------------------------------------------------------------

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // -------------------------------------------------------------
        // Validate coordinates.
        // -------------------------------------------------------------

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          console.warn(
            "Delivery agent GPS returned invalid coordinates.",
          );

          return;
        }

        // -------------------------------------------------------------
        // Update delivery agent location.
        // -------------------------------------------------------------

        console.log("Delivery agent GPS location:", {
          latitude,
          longitude,
        });

        updateLocation.mutate({
          latitude,
          longitude,
        });
      },

      (error) => {
        // -------------------------------------------------------------
        // Handle geolocation errors.
        // -------------------------------------------------------------

        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.warn(
              "Delivery agent location permission was denied.",
            );
            break;

          case error.POSITION_UNAVAILABLE:
            console.warn(
              "Delivery agent location is currently unavailable.",
            );
            break;

          case error.TIMEOUT:
            // Timeout is recoverable. watchPosition will continue
            // attempting to obtain a location.
            console.warn(
              "Delivery agent location request timed out. Retrying...",
            );
            break;

          default:
            console.warn(
              "Unable to get delivery agent location.",
              error.message,
            );
        }
      },

      {
        // High accuracy is useful for delivery tracking.
        enableHighAccuracy: true,

        // Give the browser more time to obtain a GPS position.
        timeout: 30000,

        // Accept a location up to 10 seconds old.
        // This prevents unnecessary GPS requests.
        maximumAge: 10000,
      },
    );

    // ---------------------------------------------------------------
    // Cleanup
    // ---------------------------------------------------------------
    // Stop location tracking when:
    // - agent goes offline
    // - component unmounts
    // - enabled changes
    // ---------------------------------------------------------------

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, updateLocation]);
}