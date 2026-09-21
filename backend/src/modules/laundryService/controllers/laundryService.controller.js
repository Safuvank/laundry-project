import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { laundryServiceService } from "../services/laundryService.service.js";
class LaundryServiceController {
    /**
     * Create Laundry Service
     * Admin only
     */
    create = asyncHandler(async (req, res) => {
        const service = await laundryServiceService.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Laundry service created successfully.",
            data: service,
        });
    });
    /**
     * Get Active Laundry Services
     * Customer / Public
     */
    getActiveServices = asyncHandler(async (req, res) => {
        const services = await laundryServiceService.getActiveServices();
        return res.status(200).json({
            success: true,
            message: "Laundry services retrieved successfully.",
            data: services,
        });
    });
    /**
     * Get All Laundry Services
     * Admin only
     */
    getAll = asyncHandler(async (req, res) => {
        const services = await laundryServiceService.getAll();
        return res.status(200).json({
            success: true,
            message: "All laundry services retrieved successfully.",
            data: services,
        });
    });
    /**
     * Get Laundry Service By ID
     */
    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const service = await laundryServiceService.getById(id);
        return res.status(200).json({
            success: true,
            message: "Laundry service retrieved successfully.",
            data: service,
        });
    });
    /**
     * Update Laundry Service
     * Admin only
     */
    update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const service = await laundryServiceService.update(id, req.body);
        return res.status(200).json({
            success: true,
            message: "Laundry service updated successfully.",
            data: service,
        });
    });
    /**
     * Activate Laundry Service
     * Admin only
     */
    activate = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const service = await laundryServiceService.activate(id);
        return res.status(200).json({
            success: true,
            message: "Laundry service activated successfully.",
            data: service,
        });
    });
    /**
     * Deactivate Laundry Service
     * Admin only
     */
    deactivate = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const service = await laundryServiceService.deactivate(id);
        return res.status(200).json({
            success: true,
            message: "Laundry service deactivated successfully.",
            data: service,
        });
    });
}
export const laundryServiceController = new LaundryServiceController();
//# sourceMappingURL=laundryService.controller.js.map