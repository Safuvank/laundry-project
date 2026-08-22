import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { paymentService } from "../services/payment.service.js";

class PaymentController {
  /* -------------------------------------------------------------------------- */
  /*                            CREATE PAYMENT                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Create payment for an order
   *
   * POST /api/v1/payments
   *
   * Body:
   * {
   *   "orderId": "...",
   *   "paymentMethod": "UPI"
   * }
   *
   * IMPORTANT:
   * Amount is NOT accepted from the frontend.
   * PaymentService gets the amount from order.finalPrice.
   */
  createPayment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { orderId, paymentMethod } = req.body;

    const payment = await paymentService.createPayment(
      {
        orderId,
        paymentMethod,
      },
      userId,
    );

    return res.status(201).json({
      success: true,
      message: "Payment created successfully.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                              GET BY ID                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Get payment by ID
   *
   * GET /api/v1/payments/:id
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    const payment = await paymentService.getById(paymentId, userId);

    return res.status(200).json({
      success: true,
      message: "Payment retrieved successfully.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           GET BY ORDER ID                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Get payment for an order
   *
   * GET /api/v1/payments/order/:orderId
   */
  getByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const orderId = req.params.orderId;

    if (!orderId || Array.isArray(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const payment = await paymentService.getByOrderId(orderId, userId);

    return res.status(200).json({
      success: true,
      message: "Order payment retrieved successfully.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           GET MY PAYMENTS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all payments belonging to logged-in customer
   *
   * GET /api/v1/payments/my-payments
   */
  getMyPayments = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const payments = await paymentService.getMyPayments(userId);

    return res.status(200).json({
      success: true,
      message: "Payments retrieved successfully.",
      data: payments,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                         INITIATE PAYMENT                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Initiate payment
   *
   * PATCH /api/v1/payments/:id/initiate
   */
  initiatePayment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    const payment = await paymentService.initiatePayment(paymentId, userId);

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                           MARK SUCCESS                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark payment as successful
   *
   * Admin / verified payment flow
   *
   * PATCH /api/v1/payments/:id/success
   */
  markPaymentSuccess = asyncHandler(async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    const { transactionId } = req.body;

    if (!transactionId || typeof transactionId !== "string") {
      throw new ValidationError("Transaction id is required.");
    }

    const payment = await paymentService.markPaymentSuccess(
      paymentId,
      transactionId,
    );

    return res.status(200).json({
      success: true,
      message: "Payment completed successfully.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                            MARK FAILED                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark payment as failed
   *
   * ADMIN ONLY
   *
   * PATCH /api/v1/payments/:id/fail
   */
  markPaymentFailed = asyncHandler(async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    const { failureReason } = req.body;

    if (!failureReason || typeof failureReason !== "string") {
      throw new ValidationError("Failure reason is required.");
    }

    const payment = await paymentService.markPaymentFailed(
      paymentId,
      failureReason,
    );

    return res.status(200).json({
      success: true,
      message: "Payment marked as failed.",
      data: payment,
    });
  });

  /* -------------------------------------------------------------------------- */
  /*                            REFUND PAYMENT                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Refund payment
   *
   * ADMIN ONLY
   *
   * PATCH /api/v1/payments/:id/refund
   *
   * Body:
   * {
   *   "refundId": "TEST-REFUND-001",
   *   "refundReason": "Customer requested refund"
   * }
   *
   * IMPORTANT:
   * This endpoint is currently for development/testing.
   * In production, refundId should come from the payment gateway.
   */
  refundPayment = asyncHandler(async (req: Request, res: Response) => {
    const paymentId = req.params.id;

    if (!paymentId || Array.isArray(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    const { refundId, refundReason } = req.body;

    if (!refundId || typeof refundId !== "string") {
      throw new ValidationError("Refund ID is required.");
    }

    if (!refundReason || typeof refundReason !== "string") {
      throw new ValidationError("Refund reason is required.");
    }

    const payment = await paymentService.refundPayment(
      paymentId,
      refundId,
      refundReason,
    );

    return res.status(200).json({
      success: true,
      message: "Payment refunded successfully.",
      data: payment,
    });
  });
}

export const paymentController = new PaymentController();
