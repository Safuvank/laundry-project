import { api } from "@/lib/api/axios";

import type {
  CreatePricingPayload,
  PricingResponse,
  PricingRulesResponse,
  UpdatePricingPayload,
} from "../types/pricing.types";

/**
 * Customer
 * Get active pricing rules
 */
export const getActivePricingRules = async () => {
  const response = await api.get<PricingRulesResponse>("/pricing");

  return response.data.data;
};

/**
 * Admin
 * Get all pricing rules
 */
export const getAdminPricingRules = async () => {
  const response = await api.get<PricingRulesResponse>(
    "/pricing/admin/all",
  );

  return response.data.data;
};

/**
 * Admin
 * Create pricing rule
 */
export const createPricingRule = async (
  payload: CreatePricingPayload,
) => {
  const response = await api.post<PricingResponse>(
    "/pricing",
    payload,
  );

  return response.data.data;
};

/**
 * Admin
 * Update pricing rule
 */
export const updatePricingRule = async (
  id: string,
  payload: UpdatePricingPayload,
) => {
  const response = await api.patch<PricingResponse>(
    `/pricing/${id}`,
    payload,
  );

  return response.data.data;
};

/**
 * Admin
 * Activate pricing rule
 */
export const activatePricingRule = async (id: string) => {
  const response = await api.patch<PricingResponse>(
    `/pricing/${id}/activate`,
  );

  return response.data.data;
};

/**
 * Admin
 * Deactivate pricing rule
 */
export const deactivatePricingRule = async (id: string) => {
  const response = await api.patch<PricingResponse>(
    `/pricing/${id}/deactivate`,
  );

  return response.data.data;
};
