import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { deliveryAgentService } from "../services/deliveryAgent.service.js";
import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";
class DeliveryAgentController {
    /* -------------------------------------------------------------------------- */
    /*                                  CREATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Create delivery agent
     *
     * Admin only.
     *
     * This creates:
     *
     * 1. User account
     * 2. DeliveryAgent profile
     *
     * POST /api/v1/delivery-agents
     */
    create = asyncHandler(async (req, res) => {
        const agent = await deliveryAgentService.create(req.body);
        return res.status(201).json({
            success: true,
            message: "Delivery agent created successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              GET MY PROFILE                               */
    /* -------------------------------------------------------------------------- */
    /**
     * Get logged-in delivery agent profile
     *
     * Delivery Agent only.
     */
    getMyProfile = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const agent = await deliveryAgentService.getMyProfile(userId);
        return res.status(200).json({
            success: true,
            message: "Delivery agent profile retrieved successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                GET BY ID                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Get delivery agent by ID
     *
     * Admin only.
     */
    getById = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery agent id.",
            });
        }
        const agent = await deliveryAgentService.getById(id);
        return res.status(200).json({
            success: true,
            message: "Delivery agent retrieved successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                  GET ALL                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Get all delivery agents
     *
     * Admin only.
     */
    getAll = asyncHandler(async (_req, res) => {
        const agents = await deliveryAgentService.getAll();
        return res.status(200).json({
            success: true,
            message: "Delivery agents retrieved successfully.",
            data: agents,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                             GET ALL ACTIVE                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Get all active delivery agents
     *
     * Admin only.
     */
    getAllActive = asyncHandler(async (_req, res) => {
        const agents = await deliveryAgentService.getAllActive();
        return res.status(200).json({
            success: true,
            message: "Active delivery agents retrieved successfully.",
            data: agents,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                          GET AVAILABLE AGENTS                             */
    /* -------------------------------------------------------------------------- */
    /**
     * Get all available delivery agents
     *
     * Admin only.
     */
    getAvailableAgents = asyncHandler(async (_req, res) => {
        const agents = await deliveryAgentService.getAvailableAgents();
        return res.status(200).json({
            success: true,
            message: "Available delivery agents retrieved successfully.",
            data: agents,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                              UPDATE STATUS                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent status
     *
     * Delivery Agent only.
     */
    updateStatus = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery agent id.",
            });
        }
        const { status } = req.body;
        const agent = await deliveryAgentService.updateStatus(id, status);
        return res.status(200).json({
            success: true,
            message: "Delivery agent status updated successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                            UPDATE LOCATION                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent current location
     *
     * Delivery Agent only.
     */
    updateLocation = asyncHandler(async (req, res) => {
        const userId = req.user.userId;
        const { longitude, latitude } = req.body;
        if (longitude === undefined || latitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Longitude and latitude are required.",
            });
        }
        const agent = await deliveryAgentService.updateLocation(userId, Number(longitude), Number(latitude));
        return res.status(200).json({
            success: true,
            message: "Delivery agent location updated successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                             FIND NEARBY AGENTS                            */
    /* -------------------------------------------------------------------------- */
    /**
     * Find available agents near a location
     *
     * Admin / Internal system.
     *
     * Default radius = 5 km.
     */
    findNearbyAgents = asyncHandler(async (req, res) => {
        const { longitude, latitude, radius } = req.query;
        if (typeof longitude !== "string" || typeof latitude !== "string") {
            return res.status(400).json({
                success: false,
                message: "Longitude and latitude are required.",
            });
        }
        const longitudeNumber = Number(longitude);
        const latitudeNumber = Number(latitude);
        const radiusNumber = radius !== undefined ? Number(radius) : 5000;
        const agents = await deliveryAgentService.findNearbyAgents(longitudeNumber, latitudeNumber, radiusNumber);
        return res.status(200).json({
            success: true,
            message: "Nearby delivery agents retrieved successfully.",
            data: agents,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                  UPDATE                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent profile
     *
     * Admin only.
     */
    update = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery agent id.",
            });
        }
        const agent = await deliveryAgentService.update(id, req.body);
        return res.status(200).json({
            success: true,
            message: "Delivery agent updated successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                 ACTIVATE                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Activate delivery agent
     *
     * Admin only.
     */
    activate = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery agent id.",
            });
        }
        const agent = await deliveryAgentService.activate(id);
        return res.status(200).json({
            success: true,
            message: "Delivery agent activated successfully.",
            data: agent,
        });
    });
    /* -------------------------------------------------------------------------- */
    /*                                DEACTIVATE                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Deactivate delivery agent
     *
     * Admin only.
     */
    deactivate = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery agent id.",
            });
        }
        const agent = await deliveryAgentService.deactivate(id);
        return res.status(200).json({
            success: true,
            message: "Delivery agent deactivated successfully.",
            data: agent,
        });
    });
}
export const deliveryAgentController = new DeliveryAgentController();
//# sourceMappingURL=deliveryAgent.controller.js.map