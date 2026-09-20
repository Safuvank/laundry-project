"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { getPaymentByOrderId } from "../api/payments.api";

export const usePaymentByOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["payments", "order", orderId],

    queryFn: async () => {
      try {
        return await getPaymentByOrderId(orderId);
      } catch (error) {
        /*
         * A payment does not exist yet.
         *
         * Backend returns 404 when no payment has been
         * created for this order.
         *
         * React Query does not allow queryFn to return undefined,
         * so we explicitly return null for this valid state.
         */
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },

    enabled: Boolean(orderId),

    staleTime: 30 * 1000,

    retry: (failureCount, error) => {
      /*
       * Don't retry a 404 because "payment doesn't exist"
       * is an expected state.
       */
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }

      return failureCount < 2;
    },
  });
};
