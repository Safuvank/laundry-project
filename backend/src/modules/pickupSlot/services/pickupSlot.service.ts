

import { Types } from "mongoose";

import type { IPickupSlot } from "../interfaces/IPickupSlot.js";

import { pickupSlotRepository } from "../repositories/pickupSlot.repository.js";

import { SlotStatus } from "../constants/slotStatus.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

class PickupSlotService {
  /* -------------------------------------------------------------------------- */
  /*                              Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(
    id: string,
  ): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError(
        "Invalid pickup slot id.",
      );
    }
  }

  /**
   * Get pickup slot or throw error
   */
  private async getSlotOrFail(
    id: string,
  ): Promise<IPickupSlot> {
    this.validateObjectId(id);

    const slot =
      await pickupSlotRepository.findById(id);

    if (!slot) {
      throw new NotFoundError(
        "Pickup slot not found.",
      );
    }

    return slot;
  }

  /**
   * Automatically update slot status
   *
   * FULL when:
   * bookedCount >= capacity
   *
   * AVAILABLE when:
   * bookedCount < capacity
   */
  private async updateSlotStatus(
    slot: IPickupSlot,
  ): Promise<void> {
    if (!slot.isActive) {
      return;
    }

    const slotId =
      slot._id.toString();

    if (
      slot.bookedCount >=
      slot.capacity
    ) {
      if (
        slot.status !==
        SlotStatus.FULL
      ) {
        await pickupSlotRepository.update(
          slotId,
          {
            status:
              SlotStatus.FULL,
          },
        );
      }
    } else {
      if (
        slot.status ===
        SlotStatus.FULL
      ) {
        await pickupSlotRepository.update(
          slotId,
          {
            status:
              SlotStatus.AVAILABLE,
          },
        );
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Customer APIs                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Get available pickup slots
   */
  async getAvailableSlots() {
    return pickupSlotRepository.findAllAvailable();
  }

  /**
   * Get pickup slots by date
   */
  async getSlotsByDate(
    date: Date,
  ) {
    return pickupSlotRepository.findByDate(
      date,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                               Admin APIs                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Create pickup slot
   */
  async create(
    data: Partial<IPickupSlot>,
  ) {
    if (
      data.capacity !==
        undefined &&
      data.capacity <= 0
    ) {
      throw new ValidationError(
        "Capacity must be greater than zero.",
      );
    }

    if (!data.date) {
      throw new ValidationError(
        "Pickup date is required.",
      );
    }

    if (!data.startTime) {
      throw new ValidationError(
        "Start time is required.",
      );
    }

    if (!data.endTime) {
      throw new ValidationError(
        "End time is required.",
      );
    }

    const duplicate =
      await pickupSlotRepository.findDuplicate(
        data.date,
        data.startTime,
        data.endTime,
      );

    if (duplicate) {
      throw new ValidationError(
        "Pickup slot already exists for this date and time.",
      );
    }

    return pickupSlotRepository.create(
      data,
    );
  }

  /**
   * Get all pickup slots
   */
  async getAll() {
    return pickupSlotRepository.findAll();
  }

  /**
   * Get pickup slot by ID
   */
  async getById(
    id: string,
  ) {
    return this.getSlotOrFail(id);
  }

  /**
   * Update pickup slot
   */
  async update(
    id: string,
    data: Partial<IPickupSlot>,
  ) {
    const slot =
      await this.getSlotOrFail(id);

    const updated =
      await pickupSlotRepository.update(
        slot._id.toString(),
        data,
      );

    if (!updated) {
      throw new NotFoundError(
        "Pickup slot not found.",
      );
    }

    await this.updateSlotStatus(
      updated,
    );

    return pickupSlotRepository.findById(
      updated._id.toString(),
    );
  }

  /**
   * Activate pickup slot
   */
  async activate(
    id: string,
  ) {
    await this.getSlotOrFail(id);

    const slot =
      await pickupSlotRepository.activate(
        id,
      );

    if (!slot) {
      throw new NotFoundError(
        "Pickup slot not found.",
      );
    }

    return slot;
  }

  /**
   * Deactivate pickup slot
   */
  async deactivate(
    id: string,
  ) {
    await this.getSlotOrFail(id);

    const slot =
      await pickupSlotRepository.deactivate(
        id,
      );

    if (!slot) {
      throw new NotFoundError(
        "Pickup slot not found.",
      );
    }

    return slot;
  }

  /**
   * Increment booked count
   *
   * Used when a customer successfully
   * reserves a pickup slot.
   */
  async incrementBookedCount(
    id: string,
  ) {
    const slot =
      await this.getSlotOrFail(id);

    if (!slot.isActive) {
      throw new ValidationError(
        "Pickup slot is inactive.",
      );
    }

    if (
      slot.status ===
      SlotStatus.FULL
    ) {
      throw new ValidationError(
        "Pickup slot is already full.",
      );
    }

    const updated =
      await pickupSlotRepository.incrementBookedCount(
        id,
      );

    if (!updated) {
      throw new ValidationError(
        "Pickup slot is no longer available.",
      );
    }

    await this.updateSlotStatus(
      updated,
    );

    return pickupSlotRepository.findById(
      updated._id.toString(),
    );
  }

  /**
   * Decrement booked count
   *
   * Used when a booking is cancelled
   * or a reservation needs to be rolled back.
   */
  async decrementBookedCount(
    id: string,
  ) {
    const slot =
      await this.getSlotOrFail(id);

    if (slot.bookedCount <= 0) {
      throw new ValidationError(
        "Booked count cannot be negative.",
      );
    }

    const updated =
      await pickupSlotRepository.decrementBookedCount(
        id,
      );

    if (!updated) {
      throw new NotFoundError(
        "Pickup slot not found.",
      );
    }

    await this.updateSlotStatus(
      updated,
    );

    return pickupSlotRepository.findById(
      updated._id.toString(),
    );
  }
}

export const pickupSlotService =
  new PickupSlotService();