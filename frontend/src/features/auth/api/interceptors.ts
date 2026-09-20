import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { api } from "@/lib/api/axios";
import { useAuthStore } from "@/stores/auth.store";

import { refreshAccessToken } from "./refresh.api";

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isInterceptorAttached = false;
let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = () => {
  if (isInterceptorAttached) {
    return;
  }

  isInterceptorAttached = true;

  /* ------------------------------------------------------------------------ */
  /* REQUEST INTERCEPTOR                                                      */
  /* ------------------------------------------------------------------------ */

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

  /* ------------------------------------------------------------------------ */
  /* RESPONSE INTERCEPTOR                                                     */
  /* ------------------------------------------------------------------------ */

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      /* -------------------------------------------------------------------- */
      /* ONLY HANDLE 401                                                      */
      /* -------------------------------------------------------------------- */

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      /* -------------------------------------------------------------------- */
      /* DO NOT REFRESH AUTHENTICATION REQUESTS                               */
      /* -------------------------------------------------------------------- */

      const requestUrl = originalRequest.url ?? "";

      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register") ||
        requestUrl.includes("/auth/verify-email") ||
        requestUrl.includes("/auth/forgot-password") ||
        requestUrl.includes("/auth/reset-password") ||
        requestUrl.includes("/auth/refresh") ||
        requestUrl.includes("/auth/logout") ||
        requestUrl.includes("/auth/logout-all");

      if (isAuthRequest) {
        return Promise.reject(error);
      }

      /* -------------------------------------------------------------------- */
      /* PREVENT INFINITE RETRY LOOP                                          */
      /* -------------------------------------------------------------------- */

      if (originalRequest._retry) {
        useAuthStore.getState().clearAuth();

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      /* -------------------------------------------------------------------- */
      /* REFRESH ALREADY RUNNING                                              */
      /* -------------------------------------------------------------------- */

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((newAccessToken) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          return api(originalRequest);
        });
      }

      /* -------------------------------------------------------------------- */
      /* START REFRESH                                                        */
      /* -------------------------------------------------------------------- */

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        useAuthStore.getState().setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        useAuthStore.getState().clearAuth();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
};