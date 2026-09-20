"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePricingRule } from "../api/pricing.api";

import type { UpdatePricingPayload } from "../types/pricing.types";

interface UpdatePricingVariables {
  id: string;
  payload: UpdatePricingPayload;
}

export function useUpdatePricing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: UpdatePricingVariables) => {
      return updatePricingRule(id, payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-pricing-rules"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["pricing-rules"],
      });
    },
  });
}
