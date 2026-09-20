import { api } from "@/lib/api/axios";

import type {
  PickupSlot,
  PickupSlotsResponse,
} from "../types/pickup-slot.types";

export const getPickupSlotsByDate = async (
  date: string,
): Promise<PickupSlot[]> => {
  const response = await api.get<PickupSlotsResponse>(
    "/pickup-slots/date",
    {
      params: {
        date,
      },
    },
  );

  return response.data.data;
};
