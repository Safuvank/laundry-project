/**
 * Get the customer's current browser location.
 *
 * This function requests the location only when it is called.
 * It does not continuously track the user.
 */

export interface CurrentLocation {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = (): Promise<CurrentLocation> => {
  return new Promise((resolve, reject) => {
    // Geolocation is only available in the browser.
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Location services are not supported by your browser."));

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          reject(new Error("Unable to get a valid location."));

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
                "Location permission was denied. Please allow location access to create your order.",
              ),
            );
            break;

          case error.POSITION_UNAVAILABLE:
            reject(
              new Error(
                "Your current location is unavailable. Please check your device location settings and try again.",
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
