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

  /*
   * Required because the refresh token is stored
   * inside an HttpOnly cookie.
   */
  withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/*                         REFRESH TOKEN INSTANCE                             */
/* -------------------------------------------------------------------------- */

/**
 * Separate Axios instance for refreshing the access token.
 *
 * This prevents:
 *
 * /auth/refresh
 *      ↓
 * 401
 *      ↓
 * interceptor
 *      ↓
 * /auth/refresh
 *      ↓
 * infinite loop
 *
 * The refresh request therefore bypasses the normal
 * `api` response interceptor.
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
/*                            PROCESS QUEUE                                   */
/* -------------------------------------------------------------------------- */

/**
 * Resolve or reject requests that were waiting
 * while another request was refreshing the token.
 */

const processQueue = (error: unknown, token: string | null): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/*                         REQUEST INTERCEPTOR                                */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    /*
     * Attach access token to authenticated requests.
     */

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
/*                         RESPONSE INTERCEPTOR                               */
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

    /*
     * If Axios does not provide the original request,
     * we cannot safely retry it.
     */

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    /* ---------------------------------------------------------------------- */
    /*                         AUTH ENDPOINTS                                 */
    /* ---------------------------------------------------------------------- */

    /*
     * These endpoints should not automatically trigger
     * another refresh attempt.
     *
     * Especially important for:
     *
     * /auth/refresh
     * /auth/login
     * /auth/register
     * /auth/google
     * /auth/google/callback
     */

    const isAuthRequest =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password") ||
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/logout") ||
      requestUrl.includes("/auth/logout-all") ||
      requestUrl.includes("/auth/google") ||
      requestUrl.includes("/auth/me");

    /* ---------------------------------------------------------------------- */
    /*                     SHOULD NOT REFRESH                                */
    /* ---------------------------------------------------------------------- */

    if (
      error.response?.status !== 401 ||
      isAuthRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    /* ---------------------------------------------------------------------- */
    /*                  ANOTHER REFRESH IS ALREADY RUNNING                    */
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
    /*                         START TOKEN REFRESH                            */
    /* ---------------------------------------------------------------------- */

    originalRequest._retry = true;

    isRefreshing = true;

    try {
      /*
       * IMPORTANT:
       *
       * Use refreshApi instead of api.
       *
       * The refresh token is stored in an HttpOnly cookie.
       *
       * withCredentials: true causes the browser to send
       * that cookie to the backend.
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
      console.error("Token refresh failed.", refreshError);

      /* -------------------------------------------------------------------- */
      /*                     REJECT QUEUED REQUESTS                           */
      /* -------------------------------------------------------------------- */

      processQueue(refreshError, null);

      /* -------------------------------------------------------------------- */
      /*                         CLEAR AUTH                                   */
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
