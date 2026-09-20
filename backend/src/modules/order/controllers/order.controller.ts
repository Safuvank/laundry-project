import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { OrderStatus } from "../constants/orderStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
import { orderService } from "../services/order.service.js";

class OrderController {
  /**
   * Create Order
   *
   * Customer sends:
   * - addressId
   * - turnaroundPlanId
   * - laundryServiceIds
   * - pickupSlotId
   * - pickupLocation
   * - preferences
   *
   * pickupLocation is captured from the customer's
   * browser at booking time.
   *
   * Expected format:
   *
   * {
   *   latitude: number,
   *   longitude: number
   * }
   */
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const { pickupLocation } = req.body;

    // ---------------------------------------------------------------
    // Validate pickup location exists
    // ---------------------------------------------------------------

    if (!pickupLocation) {
      throw new ValidationError(
        "Pickup location is required to create an order.",
      );
    }

    // ---------------------------------------------------------------
    // Validate pickup location structure
    // ---------------------------------------------------------------

    if (typeof pickupLocation !== "object" || Array.isArray(pickupLocation)) {
      throw new ValidationError("Invalid pickup location.");
    }

    const { latitude, longitude } = pickupLocation;

    // ---------------------------------------------------------------
    // Validate latitude
    // ---------------------------------------------------------------

    if (
      typeof latitude !== "number" ||
      !Number.isFinite(latitude) ||
      latitude < -90 ||
      latitude > 90
    ) {
      throw new ValidationError("Invalid pickup latitude.");
    }

    // ---------------------------------------------------------------
    // Validate longitude
    // ---------------------------------------------------------------

    if (
      typeof longitude !== "number" ||
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new ValidationError("Invalid pickup longitude.");
    }

    // ---------------------------------------------------------------
    // Development debugging
    // ---------------------------------------------------------------
    // Remove this log in production because location data
    // should not be unnecessarily written to application logs.

    console.log("CREATE ORDER PICKUP LOCATION:", {
      latitude,
      longitude,
    });

    // ---------------------------------------------------------------
    // Create order
    // ---------------------------------------------------------------

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
   *
   * Validates that the received status is one of the
   * supported OrderStatus values before calling the service.
   */
  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { status } = req.body;

    if (!status || typeof status !== "string") {
      throw new ValidationError("Order status is required.");
    }

    // ---------------------------------------------------------------
    // Validate OrderStatus enum value
    // ---------------------------------------------------------------

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new ValidationError("Invalid order status.");
    }

    const order = await orderService.updateStatus(
      orderId,
      status as OrderStatus,
    );

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
   *
   * Body:
   * {
   *   finalPrice: number
   * }
   */
  updatePricing = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { finalPrice } = req.body;

    if (typeof finalPrice !== "number" || !Number.isFinite(finalPrice)) {
      throw new ValidationError("Final price must be a valid number.");
    }

    if (finalPrice < 0) {
      throw new ValidationError("Final price cannot be negative.");
    }

    const order = await orderService.updatePricing(orderId, finalPrice);

    return res.status(200).json({
      success: true,
      message: "Order pricing updated successfully.",
      data: order,
    });
  });

  /**
   * Update Payment Status
   *
   * Body:
   * {
   *   paymentStatus: PaymentStatus
   * }
   */
  updatePaymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const { paymentStatus } = req.body;

    if (!paymentStatus || typeof paymentStatus !== "string") {
      throw new ValidationError("Payment status is required.");
    }

    // ---------------------------------------------------------------
    // Validate PaymentStatus enum value
    // ---------------------------------------------------------------

    if (
      !Object.values(PaymentStatus).includes(paymentStatus as PaymentStatus)
    ) {
      throw new ValidationError("Invalid payment status.");
    }

    const order = await orderService.updatePaymentStatus(
      orderId,
      paymentStatus as PaymentStatus,
    );

    return res.status(200).json({
      success: true,
      message: "Order payment status updated successfully.",
      data: order,
    });
  });
}

export const orderController = new OrderController();
