import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";

/* -------------------------------------------------------------------------- */
/*                              API INSTANCE                                  */
/* -------------------------------------------------------------------------- */

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                         REFRESH TOKEN INSTANCE                             */
/* -------------------------------------------------------------------------- */

/**
 * Separate Axios instance for refreshing the access token.
 *
 * This prevents the refresh request itself from entering the normal
 * response interceptor and creating a refresh loop.
 */
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                         REFRESH TOKEN STATE                                */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

/* -------------------------------------------------------------------------- */
/*                            PROCESS QUEUE                                    */
/* -------------------------------------------------------------------------- */

const processQueue = (error: unknown, token: string | null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                         REQUEST INTERCEPTOR                                 */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/* -------------------------------------------------------------------------- */
/*                         RESPONSE INTERCEPTOR                                */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
        })
      | undefined;

    /* ---------------------------------------------------------------------- */
    /*                         INVALID REQUEST                                */
    /* ---------------------------------------------------------------------- */

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    /* ---------------------------------------------------------------------- */
    /*                         AUTH ENDPOINTS                                  */
    /* ---------------------------------------------------------------------- */

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout") ||
      requestUrl.includes("/auth/logout-all");

    /* ---------------------------------------------------------------------- */
    /*                     SHOULD NOT REFRESH                                  */
    /* ---------------------------------------------------------------------- */

    if (
      error.response?.status !== 401 ||
      isAuthRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /*                  ANOTHER REFRESH IS ALREADY RUNNING                     */
    /* ---------------------------------------------------------------------- */

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    /* ---------------------------------------------------------------------- */
    /*                         START TOKEN REFRESH                             */
    /* ---------------------------------------------------------------------- */

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      /**
       * IMPORTANT:
       * Use refreshApi instead of api.
       *
       * The refresh token is expected to be stored in an HttpOnly cookie.
       * withCredentials: true sends that cookie to the backend.
       */
      const response = await refreshApi.post<{
        success: boolean;
        message: string;
        data: {
          accessToken: string;
        };
      }>("/auth/refresh");

      const newAccessToken = response.data.data.accessToken;

      if (!newAccessToken) {
        throw new Error("Refresh succeeded but no access token was returned.");
      }

      /* -------------------------------------------------------------------- */
      /*                    UPDATE ZUSTAND STATE                              */
      /* -------------------------------------------------------------------- */

      useAuthStore.getState().setAccessToken(newAccessToken);

      /* -------------------------------------------------------------------- */
      /*                    RESOLVE QUEUED REQUESTS                           */
      /* -------------------------------------------------------------------- */

      processQueue(null, newAccessToken);

      /* -------------------------------------------------------------------- */
      /*                        RETRY ORIGINAL REQUEST                        */
      /* -------------------------------------------------------------------- */

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      console.error("❌ Token refresh failed.", refreshError);

      /* -------------------------------------------------------------------- */
      /*                     REJECT QUEUED REQUESTS                           */
      /* -------------------------------------------------------------------- */

      processQueue(refreshError, null);

      /* -------------------------------------------------------------------- */
      /*                         CLEAR AUTH                                    */
      /* -------------------------------------------------------------------- */

      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    } finally {
      /* -------------------------------------------------------------------- */
      /*                     RELEASE REFRESH LOCK                             */
      /* -------------------------------------------------------------------- */

      isRefreshing = false;
    }
  },
);
