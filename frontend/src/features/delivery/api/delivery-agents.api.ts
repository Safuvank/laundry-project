import { api } from "@/lib/api/axios";

import type {
  DeliveryAgent,
  DeliveryAgentResponse,
  UpdateAvailabilityPayload,
  UpdateLocationPayload,
} from "../types/delivery-agent.types";

/**
 * Get logged-in delivery agent profile
 */
export const getDeliveryProfile = async (): Promise<DeliveryAgent> => {
  const response = await api.get<DeliveryAgentResponse>("/delivery-agents/me");

  return response.data.data;
};

/**
 * Update logged-in delivery agent location
 *
 * Coordinates:
 * [longitude, latitude]
 */
export const updateDeliveryLocation = async (
  payload: UpdateLocationPayload,
): Promise<DeliveryAgent> => {
  const response = await api.patch<DeliveryAgentResponse>(
    "/delivery-agents/location",
    payload,
  );

  return response.data.data;
};

/**
 * Update delivery agent status
 *
 * PATCH /delivery-agents/:id/status
 */
export const updateDeliveryAvailability = async (
  deliveryAgentId: string,
  payload: UpdateAvailabilityPayload,
): Promise<DeliveryAgent> => {
  const response = await api.patch<DeliveryAgentResponse>(
    `/delivery-agents/${deliveryAgentId}/status`,
    payload,
  );

  return response.data.data;
};
