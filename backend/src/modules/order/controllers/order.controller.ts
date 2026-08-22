import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { orderService } from "../services/order.service.js";

class OrderController {
  /**
   * Create Order
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const order = await orderService.create(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  });

  /**
   * Get My Orders
   */
  getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const orders = await orderService.getMyOrders(userId);

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  });

  /**
   * Get Order By ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.getById(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: order,
    });
  });

  /**
   * Cancel Order
   */
  cancel = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.cancel(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  });

  /**
   * Get All Orders
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderService.getAll();

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      data: orders,
    });
  });

  /**
   * Update Order Status
   */
  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { status } = req.body;

    const order = await orderService.updateStatus(orderId, status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });
  });

  /**
   * Mark Order As Received At Facility
   *
   * PICKED_UP
   *      ↓
   * RECEIVED_AT_FACILITY
   */
  markReceivedAtFacility = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.markReceivedAtFacility(orderId);

    return res.status(200).json({
      success: true,
      message: "Order received at facility successfully.",
      data: order,
    });
  });

  /**
   * Start Order Inspection
   *
   * RECEIVED_AT_FACILITY
   *          ↓
   * INSPECTION_IN_PROGRESS
   */
  startInspection = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.startInspection(orderId);

    return res.status(200).json({
      success: true,
      message: "Order inspection started successfully.",
      data: order,
    });
  });

  /**
   * Request Customer Approval
   *
   * PRICE_FINALIZED
   *        ↓
   * CUSTOMER_APPROVAL_PENDING
   */
  requestCustomerApproval = asyncHandler(
    async (req: Request, res: Response) => {
      const orderId = req.params.id;

      if (!orderId || Array.isArray(orderId)) {
        throw new ValidationError("Invalid order id.");
      }

      const order = await orderService.requestCustomerApproval(orderId);

      return res.status(200).json({
        success: true,
        message: "Customer approval requested successfully.",
        data: order,
      });
    },
  );

  /**
   * Approve Final Price
   *
   * Customer only
   *
   * CUSTOMER_APPROVAL_PENDING
   *          ↓
   *       APPROVE
   *          ↓
   *       PROCESSING
   */
  approvePrice = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.approvePrice(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order price approved successfully.",
      data: order,
    });
  });

  /**
   * Reject Final Price
   *
   * Customer only
   *
   * CUSTOMER_APPROVAL_PENDING
   *          ↓
   *        REJECT
   *          ↓
   *        ON_HOLD
   */
  rejectPrice = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.rejectPrice(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order price rejected successfully.",
      data: order,
    });
  });

  /**
   * Start Quality Check
   *
   * PROCESSING
   *      ↓
   * QUALITY_CHECK
   */
  startQualityCheck = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.startQualityCheck(orderId);

    return res.status(200).json({
      success: true,
      message: "Order quality check started successfully.",
      data: order,
    });
  });

  /**
   * Complete Quality Check
   *
   * QUALITY_CHECK
   *      ↓
   * READY_FOR_DELIVERY
   */
  completeQualityCheck = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.completeQualityCheck(orderId);

    return res.status(200).json({
      success: true,
      message: "Quality check completed successfully.",
      data: order,
    });
  });

  /**
   * Complete Order
   *
   * DELIVERED
   *      ↓
   * COMPLETED
   */
  completeOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderService.completeOrder(orderId);

    return res.status(200).json({
      success: true,
      message: "Order completed successfully.",
      data: order,
    });
  });

  /**
   * Update Pricing
   */
  updatePricing = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { finalPrice } = req.body;

    const order = await orderService.updatePricing(orderId, finalPrice);

    return res.status(200).json({
      success: true,
      message: "Order pricing updated successfully.",
      data: order,
    });
  });

  /**
   * Update Payment Status
   */
  updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { paymentStatus } = req.body;

    const order = await orderService.updatePaymentStatus(
      orderId,
      paymentStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully.",
      data: order,
    });
  });
}

export const orderController = new OrderController();
