import type { IPickupSlot } from "../interfaces/IPickupSlot.js";
declare class PickupSlotRepository {
    /**
     * Create Pickup Slot
     */
    create(data: Partial<IPickupSlot>): Promise<IPickupSlot>;
    /**
     * Find All Available Pickup Slots
     */
    findAllAvailable(): Promise<IPickupSlot[]>;
    /**
     * Find All Pickup Slots
     */
    findAll(): Promise<IPickupSlot[]>;
    /**
     * Find Pickup Slot By ID
     */
    findById(id: string): Promise<IPickupSlot | null>;
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
    findByDate(date: Date): Promise<IPickupSlot[]>;
    /**
     * Find Duplicate Slot
     */
    findDuplicate(date: Date, startTime: string, endTime: string): Promise<IPickupSlot | null>;
    /**
     * Update Pickup Slot
     */
    update(id: string, data: Partial<IPickupSlot>): Promise<IPickupSlot | null>;
    /**
     * Increment Booked Count
     *
     * Atomically increments bookedCount only when
     * the slot is active, available, and not full.
     */
    incrementBookedCount(id: string): Promise<IPickupSlot | null>;
    /**
     * Decrement Booked Count
     */
    decrementBookedCount(id: string): Promise<IPickupSlot | null>;
    /**
     * Activate Pickup Slot
     */
    activate(id: string): Promise<IPickupSlot | null>;
    /**
     * Deactivate Pickup Slot
     */
    deactivate(id: string): Promise<IPickupSlot | null>;
}
export declare const pickupSlotRepository: PickupSlotRepository;
export {};
//# sourceMappingURL=pickupSlot.repository.d.ts.map