import { PickupSlot } from "../models/pickupSlot.model.js";
import { SlotStatus } from "../constants/slotStatus.js";
class PickupSlotRepository {
    /**
     * Create Pickup Slot
     */
    async create(data) {
        return PickupSlot.create(data);
    }
    /**
     * Find All Available Pickup Slots
     */
    async findAllAvailable() {
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
    async findAll() {
        return PickupSlot.find().sort({
            date: 1,
            startTime: 1,
        });
    }
    /**
     * Find Pickup Slot By ID
     */
    async findById(id) {
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
    async findByDate(date) {
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
    async findDuplicate(date, startTime, endTime) {
        return PickupSlot.findOne({
            date,
            startTime,
            endTime,
        });
    }
    /**
     * Update Pickup Slot
     */
    async update(id, data) {
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
    async incrementBookedCount(id) {
        return PickupSlot.findOneAndUpdate({
            _id: id,
            isActive: true,
            status: SlotStatus.AVAILABLE,
            $expr: {
                $lt: ["$bookedCount", "$capacity"],
            },
        }, {
            $inc: {
                bookedCount: 1,
            },
        }, {
            returnDocument: "after",
        });
    }
    /**
     * Decrement Booked Count
     */
    async decrementBookedCount(id) {
        return PickupSlot.findOneAndUpdate({
            _id: id,
            bookedCount: {
                $gt: 0,
            },
        }, {
            $inc: {
                bookedCount: -1,
            },
        }, {
            returnDocument: "after",
        });
    }
    /**
     * Activate Pickup Slot
     */
    async activate(id) {
        return PickupSlot.findByIdAndUpdate(id, {
            isActive: true,
            status: SlotStatus.AVAILABLE,
        }, {
            returnDocument: "after",
        });
    }
    /**
     * Deactivate Pickup Slot
     */
    async deactivate(id) {
        return PickupSlot.findByIdAndUpdate(id, {
            isActive: false,
            status: SlotStatus.DISABLED,
        }, {
            returnDocument: "after",
        });
    }
}
export const pickupSlotRepository = new PickupSlotRepository();
//# sourceMappingURL=pickupSlot.repository.js.map