import { api } from "@/lib/api/axios";

import type {
  CreatePickupSlotPayload,
  CreatePickupSlotResponse,
  PickupSlot,
} from "../types/pickup-slot.types";

export interface AdminPickupSlotsResponse {
  success: boolean;
  message: string;
  data: PickupSlot[];
}

/**
 * Create a new pickup slot
 * POST /api/v1/pickup-slots
 */
export const createPickupSlot = async (
  payload: CreatePickupSlotPayload,
): Promise<CreatePickupSlotResponse> => {
  const response = await api.post<CreatePickupSlotResponse>(
    "/pickup-slots",
    payload,
  );

  return response.data;
};

/**
 * Get all pickup slots for admin
 * GET /api/v1/pickup-slots/admin/all
 */
export const getAdminPickupSlots = async (): Promise<PickupSlot[]> => {
  const response = await api.get<AdminPickupSlotsResponse>(
    "/pickup-slots/admin/all",
  );

  return response.data.data;
};
