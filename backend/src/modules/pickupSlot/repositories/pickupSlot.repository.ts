import type { IPickupSlot } from "../interfaces/IPickupSlot.js";

import { PickupSlot } from "../models/pickupSlot.model.js";

import { SlotStatus } from "../constants/slotStatus.js";

class PickupSlotRepository {
  /**
   * Create Pickup Slot
   */
  async create(data: Partial<IPickupSlot>): Promise<IPickupSlot> {
    return PickupSlot.create(data);
  }

  /**
   * Find All Available Pickup Slots
   */
  async findAllAvailable(): Promise<IPickupSlot[]> {
    return PickupSlot.find({
      isActive: true,
      status: SlotStatus.AVAILABLE,
    }).sort({
      date: 1,
      startTime: 1,
    });
  }

  /**
   * Find All Pickup Slots
   */
  async findAll(): Promise<IPickupSlot[]> {
    return PickupSlot.find().sort({
      date: 1,
      startTime: 1,
    });
  }

  /**
   * Find Pickup Slot By ID
   */
  async findById(id: string): Promise<IPickupSlot | null> {
    return PickupSlot.findById(id);
  }

  /**
   * Find Pickup Slots By Date
   *
   * Searches the complete UTC calendar day.
   *
   * Example:
   * 2026-09-20
   *
   * searches:
   * 2026-09-20T00:00:00.000Z
   * →
   * 2026-09-20T23:59:59.999Z
   */
  async findByDate(date: Date): Promise<IPickupSlot[]> {
    const startOfDay = new Date(date);

    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);

    endOfDay.setUTCHours(23, 59, 59, 999);

    return PickupSlot.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      isActive: true,
    }).sort({
      startTime: 1,
    });
  }

  /**
   * Find Duplicate Slot
   */
  async findDuplicate(
    date: Date,
    startTime: string,
    endTime: string,
  ): Promise<IPickupSlot | null> {
    return PickupSlot.findOne({
      date,
      startTime,
      endTime,
    });
  }

  /**
   * Update Pickup Slot
   */
  async update(
    id: string,
    data: Partial<IPickupSlot>,
  ): Promise<IPickupSlot | null> {
    return PickupSlot.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
  }

  /**
   * Increment Booked Count
   *
   * Atomically increments bookedCount only when
   * the slot is active, available, and not full.
   */
  async incrementBookedCount(id: string): Promise<IPickupSlot | null> {
    return PickupSlot.findOneAndUpdate(
      {
        _id: id,
        isActive: true,
        status: SlotStatus.AVAILABLE,

        $expr: {
          $lt: ["$bookedCount", "$capacity"],
        },
      },
      {
        $inc: {
          bookedCount: 1,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  /**
   * Decrement Booked Count
   */
  async decrementBookedCount(id: string): Promise<IPickupSlot | null> {
    return PickupSlot.findOneAndUpdate(
      {
        _id: id,
        bookedCount: {
          $gt: 0,
        },
      },
      {
        $inc: {
          bookedCount: -1,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  /**
   * Activate Pickup Slot
   */
  async activate(id: string): Promise<IPickupSlot | null> {
    return PickupSlot.findByIdAndUpdate(
      id,
      {
        isActive: true,
        status: SlotStatus.AVAILABLE,
      },
      {
        returnDocument: "after",
      },
    );
  }

  /**
   * Deactivate Pickup Slot
   */
  async deactivate(id: string): Promise<IPickupSlot | null> {
    return PickupSlot.findByIdAndUpdate(
      id,
      {
        isActive: false,
        status: SlotStatus.DISABLED,
      },
      {
        returnDocument: "after",
      },
    );
  }
}

export const pickupSlotRepository = new PickupSlotRepository();
