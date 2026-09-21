import type { IPickupSlot } from "../interfaces/IPickupSlot.js";
declare class PickupSlotService {
    /**
     * Validate MongoDB ObjectId
     */
    private validateObjectId;
    /**
     * Get pickup slot or throw error
     */
    private getSlotOrFail;
    /**
     * Automatically update slot status
     *
     * FULL when:
     * bookedCount >= capacity
     *
     * AVAILABLE when:
     * bookedCount < capacity
     */
    private updateSlotStatus;
    /**
     * Get available pickup slots
     */
    getAvailableSlots(): Promise<IPickupSlot[]>;
    /**
     * Get pickup slots by date
     */
    getSlotsByDate(date: Date): Promise<IPickupSlot[]>;
    /**
     * Create pickup slot
     */
    create(data: Partial<IPickupSlot>): Promise<IPickupSlot>;
    /**
     * Get all pickup slots
     */
    getAll(): Promise<IPickupSlot[]>;
    /**
     * Get pickup slot by ID
     */
    getById(id: string): Promise<IPickupSlot>;
    /**
     * Update pickup slot
     */
    update(id: string, data: Partial<IPickupSlot>): Promise<IPickupSlot | null>;
    /**
     * Activate pickup slot
     */
    activate(id: string): Promise<IPickupSlot>;
    /**
     * Deactivate pickup slot
     */
    deactivate(id: string): Promise<IPickupSlot>;
    /**
     * Increment booked count
     *
     * Used when a customer successfully
     * reserves a pickup slot.
     */
    incrementBookedCount(id: string): Promise<IPickupSlot | null>;
    /**
     * Decrement booked count
     *
     * Used when a booking is cancelled
     * or a reservation needs to be rolled back.
     */
    decrementBookedCount(id: string): Promise<IPickupSlot | null>;
}
export declare const pickupSlotService: PickupSlotService;
export {};
//# sourceMappingURL=pickupSlot.service.d.ts.map