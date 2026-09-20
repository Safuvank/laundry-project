import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { deliveryAssignmentService } from "../services/deliveryAssignment.service.js";

import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";

import { deliveryAgentRepository } from "../../deliveryAgent/repositories/deliveryAgent.repository.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

class DeliveryAssignmentController {
  /* -------------------------------------------------------------------------- */
  /*                              CREATE ASSIGNMENT                            */
  /* -------------------------------------------------------------------------- */

  /**
   * Create delivery assignment manually
   *
   * Admin only
   *
   * Admin provides:
   * - orderId
   * - deliveryAgentId
   * - assignmentType
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, deliveryAgentId, assignmentType } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required.",
      });
    }

    if (!deliveryAgentId) {
      return res.status(400).json({
        success: false,
        message: "Delivery agent id is required.",
      });
    }

    const assignment = await deliveryAssignmentService.create(
      orderId,
      deliveryAgentId,
      assignmentType,
    );

    return res.status(201).json({
      success: true,
      message: "Delivery assignment created successfully.",
      data: assignment,
    });
  });


/**
 * Automatically create delivery assignment
 *
 * Admin only
 *
 * Required body:
 * - orderId
 * - latitude
 * - longitude
 *
 * The admin's current location is required
 * when assigning a delivery agent.
 *
 * POST /api/v1/delivery-assignments/delivery
 */
createDeliveryAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId, latitude, longitude } = req.body;

    /* ---------------------------------------------------------------------- */
    /* Validate Order ID                                                      */
    /* ---------------------------------------------------------------------- */

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Admin Location                                                */
    /* ---------------------------------------------------------------------- */

    if (latitude === undefined || latitude === null) {
      return res.status(400).json({
        success: false,
        message: "Admin latitude is required.",
      });
    }

    if (longitude === undefined || longitude === null) {
      return res.status(400).json({
        success: false,
        message: "Admin longitude is required.",
      });
    }

    const adminLatitude = Number(latitude);
    const adminLongitude = Number(longitude);

    if (!Number.isFinite(adminLatitude)) {
      return res.status(400).json({
        success: false,
        message: "Admin latitude must be a valid number.",
      });
    }

    if (!Number.isFinite(adminLongitude)) {
      return res.status(400).json({
        success: false,
        message: "Admin longitude must be a valid number.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Coordinate Ranges                                             */
    /* ---------------------------------------------------------------------- */

    if (adminLatitude < -90 || adminLatitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Admin latitude must be between -90 and 90.",
      });
    }

    if (adminLongitude < -180 || adminLongitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Admin longitude must be between -180 and 180.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* Create Delivery Assignment                                             */
    /* ---------------------------------------------------------------------- */

    const assignment =
      await deliveryAssignmentService.createDeliveryAssignment(
        orderId,
        adminLatitude,
        adminLongitude,
      );

    /* ---------------------------------------------------------------------- */
    /* Response                                                               */
    /* ---------------------------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Delivery assignment created successfully.",
      data: assignment,
    });
  },
);

  /* -------------------------------------------------------------------------- */
  /*                                GET BY ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Get delivery assignment by ID
   *
   * Admin
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery assignment id.",
      });
    }

    const assignment = await deliveryAssignmentService.getById(id);

    return res.status(200).json({
      success: true,
      message: "Delivery assignment retrieved successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                             GET BY ORDER                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignments for an order
   *
   * Admin
   */
  getByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
    }

    const assignments = await deliveryAssignmentService.getByOrderId(orderId);

    return res.status(200).json({
      success: true,
      message: "Order delivery assignments retrieved successfully.",
      data: assignments,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                        GET ACTIVE BY ORDER                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Get active assignment for an order
   *
   * Admin
   */
  getActiveByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    if (typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid order id.",
      });
    }

    const assignment =
      await deliveryAssignmentService.getActiveByOrderId(orderId);

    return res.status(200).json({
      success: true,
      message: "Active order assignment retrieved successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                            GET BY AGENT                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignments for delivery agent
   *
   * Admin
   */
  getByAgentId = asyncHandler(async (req: Request, res: Response) => {
    const deliveryAgentId = req.params.deliveryAgentId;

    if (typeof deliveryAgentId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery agent id.",
      });
    }

    const assignments =
      await deliveryAssignmentService.getByAgentId(deliveryAgentId);

    return res.status(200).json({
      success: true,
      message: "Delivery agent assignments retrieved successfully.",
      data: assignments,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                     GET ACTIVE BY AGENT                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get active assignment for delivery agent
   *
   * Admin
   */
  getActiveByAgentId = asyncHandler(async (req: Request, res: Response) => {
    const deliveryAgentId = req.params.deliveryAgentId;

    if (typeof deliveryAgentId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery agent id.",
      });
    }

    const assignment =
      await deliveryAssignmentService.getActiveByAgentId(deliveryAgentId);

    return res.status(200).json({
      success: true,
      message: "Active delivery agent assignment retrieved successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                     AUTHENTICATED DELIVERY AGENT                          */
  /* -------------------------------------------------------------------------- */

  /**
   * Resolve the authenticated User ID to the DeliveryAgent document ID.
   *
   * req.user.userId is the User._id.
   * DeliveryAssignment.deliveryAgentId stores the DeliveryAgent._id.
   */
  private async getAuthenticatedDeliveryAgentId(
    userId: string,
  ): Promise<string> {
    const deliveryAgent = await deliveryAgentRepository.findByUserId(userId);

    if (!deliveryAgent) {
      throw new NotFoundError("Delivery agent profile not found.");
    }

    return deliveryAgent._id.toString();
  }

  /* -------------------------------------------------------------------------- */
  /*                         GET MY ASSIGNMENTS                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignments for the authenticated delivery agent
   *
   * Delivery Agent only
   *
   * GET /api/v1/delivery-assignments/me
   *
   * The authenticated User._id is resolved to the
   * DeliveryAgent._id internally.
   */
  getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const assignments =
      await deliveryAssignmentService.getByAgentId(deliveryAgentId);

    return res.status(200).json({
      success: true,
      message: "Delivery assignments retrieved successfully.",
      data: assignments,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                                ACCEPT                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Accept assignment
   *
   * Delivery Agent
   */
  accept = asyncHandler(async (req: Request, res: Response) => {
    const assignmentId = req.params.id;

    if (typeof assignmentId !== "string") {
      throw new ValidationError("Invalid delivery assignment id.");
    }

    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const assignment = await deliveryAssignmentService.accept(
      assignmentId,
      deliveryAgentId,
    );

    return res.status(200).json({
      success: true,
      message: "Delivery assignment accepted successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           START PICKUP                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Start pickup
   *
   * Delivery Agent
   *
   * Order:
   * PICKUP_ASSIGNED → OUT_FOR_PICKUP
   */
  startPickup = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Invalid delivery assignment id.");
    }

    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const assignment = await deliveryAssignmentService.startPickup(
      id,
      deliveryAgentId,
    );

    return res.status(200).json({
      success: true,
      message: "Pickup started successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */

  /**
   * Start delivery
   *
   * Delivery Agent
   *
   * Order:
   * DELIVERY_ASSIGNED → OUT_FOR_DELIVERY
   */
  startDelivery = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Invalid delivery assignment id.");
    }

    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const assignment = await deliveryAssignmentService.startDelivery(
      id,
      deliveryAgentId,
    );

    return res.status(200).json({
      success: true,
      message: "Delivery started successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */

  /**
   * Reject assignment
   *
   * Delivery Agent
   */
  reject = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Invalid delivery assignment id.");
    }

    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const { rejectionReason } = req.body;

    const assignment =
      rejectionReason !== undefined
        ? await deliveryAssignmentService.reject(
            id,
            deliveryAgentId,
            rejectionReason,
          )
        : await deliveryAssignmentService.reject(id, deliveryAgentId);

    return res.status(200).json({
      success: true,
      message: "Delivery assignment rejected successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */

  /**
   * Complete assignment
   *
   * Delivery Agent
   */
  complete = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      throw new ValidationError("Invalid delivery assignment id.");
    }

    const deliveryAgentId = await this.getAuthenticatedDeliveryAgentId(
      req.user.userId,
    );

    const assignment = await deliveryAssignmentService.complete(
      id,
      deliveryAgentId,
    );

    return res.status(200).json({
      success: true,
      message: "Delivery assignment completed successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */

  /**
   * Cancel assignment
   *
   * Admin
   */
  cancel = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery assignment id.",
      });
    }

    const assignment = await deliveryAssignmentService.cancel(id);

    return res.status(200).json({
      success: true,
      message: "Delivery assignment cancelled successfully.",
      data: assignment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           GET ALL ACTIVE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all active assignments
   *
   * Admin
   */
  getAllActive = asyncHandler(async (req: Request, res: Response) => {
    const assignments = await deliveryAssignmentService.getAllActive();

    return res.status(200).json({
      success: true,
      message: "Active delivery assignments retrieved successfully.",
      data: assignments,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                             GET BY STATUS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignments by status
   *
   * Admin
   */
  getByStatus = asyncHandler(async (req: Request, res: Response) => {
    const status = req.query.status;

    if (typeof status !== "string") {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    const assignmentStatus = status as DeliveryAssignmentStatus;

    const assignments =
      await deliveryAssignmentService.getByStatus(assignmentStatus);

    return res.status(200).json({
      success: true,
      message: "Delivery assignments retrieved successfully.",
      data: assignments,
    });
  });
}

export const deliveryAssignmentController = new DeliveryAssignmentController();
