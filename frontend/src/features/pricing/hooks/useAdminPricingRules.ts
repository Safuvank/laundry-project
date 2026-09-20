"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminPricingRules } from "../api/pricing.api";

export const useAdminPricingRules = () => {
  return useQuery({
    queryKey: ["admin-pricing-rules"],
    queryFn: getAdminPricingRules,
    staleTime: 30 * 1000,
  });
};
