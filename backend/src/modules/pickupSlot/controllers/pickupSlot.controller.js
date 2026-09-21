import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { pickupSlotService } from "../services/pickupSlot.service.js";
class PickupSlotController {
    /* -------------------------------------------------------------------------- */
    /*                           Create Pickup Slot                               */
    /* -------------------------------------------------------------------------- */
    /**
     * Create Pickup Slot
     * Admin Only
     */
    create = asyncHandler(async (req, res) => {
        const slot = await pickupSlotService.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Pickup slot created successfully.",
            data: slot,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                         Get Available Slots                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Get Available Pickup Slots
     * Customer
     */
    getAvailableSlots = asyncHandler(async (req, res) => {
        const slots = await pickupSlotService.getAvailableSlots();
        return res.status(200).json({
            success: true,
            message: "Available pickup slots retrieved successfully.",
            data: slots,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            Get Slots By Date                               */
    /* -------------------------------------------------------------------------- */
    /**
     * Get Pickup Slots By Date
     * Customer
     */
    getSlotsByDate = asyncHandler(async (req, res) => {
        const { date } = req.query;
        /**
         * Validate date query parameter
         */
        if (!date ||
            typeof date !== "string") {
            return res.status(400).json({
                success: false,
                message: "Date is required.",
            });
        }
        /**
         * Expected format:
         * YYYY-MM-DD
         */
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD.",
            });
        }
        /**
         * Parse date
         */
        const parsedDate = new Date(`${date}T00:00:00.000Z`);
        if (Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date.",
            });
        }
        /**
         * Get slots for selected date
         */
        const slots = await pickupSlotService.getSlotsByDate(parsedDate);
        return res.status(200).json({
            success: true,
            message: "Pickup slots retrieved successfully.",
            data: slots,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              Get All Slots                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Get All Pickup Slots
     * Admin Only
     */
    getAll = asyncHandler(async (req, res) => {
        const slots = await pickupSlotService.getAll();
        return res.status(200).json({
            success: true,
            message: "Pickup slots retrieved successfully.",
            data: slots,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              Get Slot By ID                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Get Pickup Slot By ID
     */
    getById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Pickup slot id is required.",
            });
        }
        const slot = await pickupSlotService.getById(id);
        return res.status(200).json({
            success: true,
            message: "Pickup slot retrieved successfully.",
            data: slot,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              Update Slot                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Update Pickup Slot
     * Admin Only
     */
    update = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Pickup slot id is required.",
            });
        }
        const slot = await pickupSlotService.update(id, req.body);
        return res.status(200).json({
            success: true,
            message: "Pickup slot updated successfully.",
            data: slot,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            Activate Slot                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Activate Pickup Slot
     * Admin Only
     */
    activate = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Pickup slot id is required.",
            });
        }
        const slot = await pickupSlotService.activate(id);
        return res.status(200).json({
            success: true,
            message: "Pickup slot activated successfully.",
            data: slot,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                           Deactivate Slot                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Deactivate Pickup Slot
     * Admin Only
     */
    deactivate = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                success: false,
                message: "Pickup slot id is required.",
            });
        }
        const slot = await pickupSlotService.deactivate(id);
        return res.status(200).json({
            success: true,
            message: "Pickup slot deactivated successfully.",
            data: slot,
        });
    });
}
export const pickupSlotController = new PickupSlotController();
//# sourceMappingURL=pickupSlot.controller.js.map