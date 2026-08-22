import { Document } from "mongoose";

import { SlotStatus } from "../constants/slotStatus.js";

export interface IPickupSlot extends Document {
  /**
   * Pickup Date
   */
  date: Date;

  /**
   * Slot Timing
   */
  startTime: string;

  endTime: string;

  /**
   * Maximum Bookings Allowed
   */
  capacity: number;

  /**
   * Current Bookings
   */
  bookedCount: number;

  /**
   * Slot Status
   */
  status: SlotStatus;

  /**
   * Active / Inactive
   */
  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}