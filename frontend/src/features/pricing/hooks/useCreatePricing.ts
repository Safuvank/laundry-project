"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createPricingRule } from "../api/pricing.api";

import type {
  CreatePricingPayload,
} from "../types/pricing.types";

export const useCreatePricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreatePricingPayload,
    ) => createPricingRule(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-pricing-rules"],
      });

      queryClient.invalidateQueries({
        queryKey: ["pricing-rules"],
      });
    },
  });
};
