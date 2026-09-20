export type PickupSlotStatus = "AVAILABLE" | "FULL" | string;

export interface PickupSlot {
  _id: string;

  date: string;

  startTime: string;
  endTime: string;

  capacity: number;
  bookedCount: number;

  status: PickupSlotStatus;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface PickupSlotsResponse {
  success: boolean;
  message: string;
  data: PickupSlot[];
}
