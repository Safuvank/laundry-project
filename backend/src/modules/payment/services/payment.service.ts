import mongoose, { Types } from "mongoose";

import { paymentRepository } from "../repositories/payment.repository.js";

import { orderRepository } from "../../order/repositories/order.repostitory.js";

import { PaymentStatus } from "../constants/paymentStatus.js";

import { PaymentMethod } from "../constants/paymentMethod.js";

import { PaymentStatus as OrderPaymentStatus } from "../../order/constants/paymentStatus.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

import { razorpayService } from "./razorpay.service.js";

export class PaymentService {
  /* -------------------------------------------------------------------------- */
  /*                              PRIVATE HELPERS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Safely converts either:
   *
   * - MongoDB ObjectId
   * - populated Mongoose document
   *
   * into a string ObjectId.
   */
  private getObjectIdString(value: unknown): string {
    if (!value) {
      return "";
    }

    if (value instanceof Types.ObjectId) {
      return value.toString();
    }

    if (
      typeof value === "object" &&
      "_id" in value &&
      value._id instanceof Types.ObjectId
    ) {
      return value._id.toString();
    }

    return String(value);
  }

  /* -------------------------------------------------------------------------- */
  /*                              CREATE PAYMENT                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a FreshFold payment for an order.
   *
   * The payment amount is always taken from the order's finalPrice.
   *
   * The frontend must never provide the payment amount.
   */
  async createPayment(
    data: {
      orderId: string;
      paymentMethod: PaymentMethod;
    },
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(data.orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const order = await orderRepository.findById(data.orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    const orderUserId = this.getObjectIdString(order.userId);

    if (orderUserId !== userId) {
      throw new ValidationError("Order does not belong to this user.");
    }

    if (!order.finalPrice || order.finalPrice <= 0) {
      throw new ValidationError("Order does not have a valid final price.");
    }

    if (order.paymentStatus === OrderPaymentStatus.PAID) {
      throw new ValidationError("Order has already been paid.");
    }

    if (order.paymentStatus === OrderPaymentStatus.REFUNDED) {
      throw new ValidationError(
        "A refunded order cannot create a new payment.",
      );
    }

    const existingPayment = await paymentRepository.findByOrderId(
      data.orderId,
    );

    if (existingPayment) {
      if (existingPayment.status === PaymentStatus.FAILED) {
        return paymentRepository.resetForRetry(
          existingPayment._id!,
          order.finalPrice,
          data.paymentMethod,
        );
      }

      throw new ValidationError(
        "A payment already exists for this order.",
      );
    }

    return paymentRepository.create({
      orderId: new Types.ObjectId(data.orderId),
      userId: new Types.ObjectId(userId),
      amount: order.finalPrice,
      paymentMethod: data.paymentMethod,
      status: PaymentStatus.PENDING,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                         CREATE RAZORPAY ORDER                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a Razorpay order for an existing FreshFold payment.
   *
   * Flow:
   *
   * FreshFold Payment
   *        ↓
   * Validate ownership
   *        ↓
   * Validate payment status
   *        ↓
   * Get amount from FreshFold Payment
   *        ↓
   * Convert INR → paise
   *        ↓
   * Create Razorpay Order
   *        ↓
   * Save gatewayOrderId
   *        ↓
   * Payment PENDING → INITIATED
   */
  async createRazorpayOrder(
    paymentId: string,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    /* ---------------------------- OWNERSHIP CHECK --------------------------- */

    const paymentUserId = this.getObjectIdString(payment.userId);

    if (paymentUserId !== userId) {
      throw new ValidationError(
        "Payment does not belong to this user.",
      );
    }

    /* ---------------------------- STATUS CHECK ----------------------------- */

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new ValidationError(
        "Payment has already been completed.",
      );
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new ValidationError(
        "Refunded payment cannot be initiated.",
      );
    }

    if (payment.status === PaymentStatus.FAILED) {
      throw new ValidationError(
        "Failed payment must be retried before creating a Razorpay order.",
      );
    }

    if (
      payment.status !== PaymentStatus.PENDING &&
      payment.status !== PaymentStatus.INITIATED
    ) {
      throw new ValidationError(
        `Payment cannot be initiated from ${payment.status} status.`,
      );
    }

    /* ---------------------------- AMOUNT CHECK ----------------------------- */

    if (!Number.isFinite(payment.amount) || payment.amount <= 0) {
      throw new ValidationError(
        "Payment amount must be greater than zero.",
      );
    }

    /* ----------------------- EXISTING RAZORPAY ORDER ----------------------- */

    /**
     * If a Razorpay order was already created for this payment,
     * return the existing order instead of creating another one.
     *
     * This protects against duplicate requests from the frontend.
     */
    if (
      payment.status === PaymentStatus.INITIATED &&
      payment.gatewayOrderId
    ) {
      return {
        paymentId: payment._id!.toString(),
        gatewayOrderId: payment.gatewayOrderId,
        amount: payment.amount,
        amountInPaise: Math.round(payment.amount * 100),
        currency: "INR",
        status: "created",
      };
    }

    /* -------------------------- CREATE RAZORPAY ---------------------------- */

    const razorpayOrder = await razorpayService.createOrder({
      amount: payment.amount,
      currency: "INR",
      receipt: `freshfold_${payment._id!.toString()}`,
    });

    if (!razorpayOrder?.id) {
      throw new ValidationError(
        "Razorpay order could not be created.",
      );
    }

    /* ------------------------ SAVE GATEWAY ORDER ID ------------------------ */

    const updatedPayment = await paymentRepository.setGatewayOrderId(
      payment._id!,
      razorpayOrder.id,
    );

    if (!updatedPayment) {
      throw new NotFoundError(
        "Payment could not be updated with Razorpay order.",
      );
    }

    /* ------------------------ UPDATE PAYMENT STATUS ----------------------- */

    /**
     * Razorpay order has successfully been created.
     *
     * Therefore FreshFold payment moves:
     *
     * PENDING → INITIATED
     */
    if (payment.status === PaymentStatus.PENDING) {
      const initiatedPayment = await paymentRepository.updateStatus(
        payment._id!,
        PaymentStatus.INITIATED,
      );

      if (!initiatedPayment) {
        throw new NotFoundError(
          "Payment status could not be updated.",
        );
      }
    }

    /* ------------------------------ RESPONSE ------------------------------- */

    return {
      paymentId: payment._id!.toString(),
      gatewayOrderId: razorpayOrder.id,
      amount: payment.amount,
      amountInPaise: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: razorpayOrder.status,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                GET BY ID                                   */
  /* -------------------------------------------------------------------------- */

  async getById(
    paymentId: string,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findByIdPopulated(
      paymentId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    const paymentUserId = this.getObjectIdString(
      payment.userId,
    );

    if (paymentUserId !== userId) {
      throw new ValidationError(
        "Payment does not belong to this user.",
      );
    }

    return payment;
  }

  /* -------------------------------------------------------------------------- */
  /*                           GET BY ORDER ID                                  */
  /* -------------------------------------------------------------------------- */

  async getByOrderId(
    orderId: string,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findByOrderIdPopulated(
      orderId,
    );

    if (!payment) {
      throw new NotFoundError(
        "Payment not found for this order.",
      );
    }

    const paymentUserId = this.getObjectIdString(
      payment.userId,
    );

    const paymentOrderId = this.getObjectIdString(
      payment.orderId,
    );

    if (paymentUserId !== userId) {
      throw new ValidationError(
        "Payment does not belong to this user.",
      );
    }

    if (paymentOrderId !== orderId) {
      throw new ValidationError(
        "Payment does not belong to this order.",
      );
    }

    return payment;
  }

  /* -------------------------------------------------------------------------- */
  /*                           GET MY PAYMENTS                                 */
  /* -------------------------------------------------------------------------- */

  async getMyPayments(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    return paymentRepository.findByUserIdPopulated(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                           INITIATE PAYMENT                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Legacy/manual payment initiation.
   *
   * Razorpay flow should use createRazorpayOrder()
   * instead of this endpoint.
   */
  async initiatePayment(
    paymentId: string,
    userId: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findById(
      paymentId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    const paymentUserId = this.getObjectIdString(
      payment.userId,
    );

    if (paymentUserId !== userId) {
      throw new ValidationError(
        "Payment does not belong to this user.",
      );
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new ValidationError(
        "Payment has already been completed.",
      );
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new ValidationError(
        "Refunded payment cannot be initiated.",
      );
    }

    if (payment.status === PaymentStatus.FAILED) {
      throw new ValidationError(
        "Failed payment must be retried before initiation.",
      );
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new ValidationError(
        "Payment cannot be initiated from its current status.",
      );
    }

    const updatedPayment = await paymentRepository.updateStatus(
      paymentId,
      PaymentStatus.INITIATED,
    );

    if (!updatedPayment) {
      throw new NotFoundError("Payment not found.");
    }

    return updatedPayment;
  }

  /* -------------------------------------------------------------------------- */
  /*                         VERIFY RAZORPAY PAYMENT                            */
  /* -------------------------------------------------------------------------- */

  /**
   * Verify a Razorpay payment.
   *
   * Flow:
   *
   * Razorpay Checkout
   *        ↓
   * razorpay_payment_id
   * razorpay_order_id
   * razorpay_signature
   *        ↓
   * Validate FreshFold payment
   *        ↓
   * Validate Razorpay order ID
   *        ↓
   * Verify Razorpay signature
   *        ↓
   * Payment → SUCCESS
   *        ↓
   * Order.paymentStatus → PAID
   */
  async verifyRazorpayPayment(
    paymentId: string,
    userId: string,
    data: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
    },
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    if (
      !data.razorpayPaymentId ||
      !data.razorpayOrderId ||
      !data.razorpaySignature
    ) {
      throw new ValidationError(
        "Razorpay payment verification details are required.",
      );
    }

    const payment = await paymentRepository.findById(
      paymentId,
    );

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    /* ---------------------------- OWNERSHIP -------------------------------- */

    const paymentUserId = this.getObjectIdString(
      payment.userId,
    );

    if (paymentUserId !== userId) {
      throw new ValidationError(
        "Payment does not belong to this user.",
      );
    }

    /* ---------------------------- STATUS ----------------------------------- */

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new ValidationError(
        "Payment has already been completed.",
      );
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new ValidationError(
        "Refunded payment cannot be completed.",
      );
    }

    if (payment.status !== PaymentStatus.INITIATED) {
      throw new ValidationError(
        "Only initiated payments can be verified.",
      );
    }

    /* ------------------------ RAZORPAY ORDER ID ---------------------------- */

    if (!payment.gatewayOrderId) {
      throw new ValidationError(
        "Razorpay order ID is missing.",
      );
    }

    if (
      payment.gatewayOrderId !==
      data.razorpayOrderId
    ) {
      throw new ValidationError(
        "Razorpay order ID does not match the payment.",
      );
    }

    /* -------------------------- SIGNATURE ---------------------------------- */

    const isSignatureValid =
      razorpayService.verifyPayment({
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      });

    if (!isSignatureValid) {
      throw new ValidationError(
        "Invalid Razorpay payment signature.",
      );
    }

    /* -------------------------- DATABASE TRANSACTION ----------------------- */

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const currentPayment =
          await paymentRepository.findById(
            paymentId,
            session,
          );

        if (!currentPayment) {
          throw new NotFoundError("Payment not found.");
        }

        if (currentPayment.status === PaymentStatus.SUCCESS) {
          throw new ValidationError(
            "Payment has already been completed.",
          );
        }

        if (
          currentPayment.status !== PaymentStatus.INITIATED
        ) {
          throw new ValidationError(
            "Payment is no longer available for verification.",
          );
        }

        if (
          currentPayment.gatewayOrderId !==
          data.razorpayOrderId
        ) {
          throw new ValidationError(
            "Razorpay order ID does not match the payment.",
          );
        }

        const order = await orderRepository.findById(
          currentPayment.orderId,
          session,
        );

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment =
          await paymentRepository.markAsSuccess(
            paymentId,
            data.razorpayPaymentId,
            session,
          );

        if (!updatedPayment) {
          throw new NotFoundError(
            "Payment could not be completed.",
          );
        }

        const updatedPaymentWithSignature =
          await paymentRepository.setGatewaySignature(
            paymentId,
            data.razorpaySignature,
            session,
          );

        if (!updatedPaymentWithSignature) {
          throw new NotFoundError(
            "Payment signature could not be saved.",
          );
        }

        const updatedOrder =
          await orderRepository.updatePaymentStatus(
            currentPayment.orderId,
            OrderPaymentStatus.PAID,
            session,
          );

        if (!updatedOrder) {
          throw new NotFoundError(
            "Order payment status could not be updated.",
          );
        }
      });

      return updatedPayment;
    } finally {
      await session.endSession();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           PAYMENT SUCCESS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Development/testing success method.
   *
   * Production Razorpay payments should use
   * verifyRazorpayPayment().
   *
   * Payment:
   *
   * INITIATED → SUCCESS
   *
   * Order:
   *
   * paymentStatus → PAID
   */
  async markPaymentSuccess(
    paymentId: string,
    transactionId: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!transactionId || !transactionId.trim()) {
      throw new ValidationError(
        "Transaction id is required.",
      );
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(
          paymentId,
          session,
        );

        if (!payment) {
          throw new NotFoundError("Payment not found.");
        }

        if (payment.status === PaymentStatus.SUCCESS) {
          throw new ValidationError(
            "Payment has already been completed.",
          );
        }

        if (payment.status === PaymentStatus.REFUNDED) {
          throw new ValidationError(
            "Refunded payment cannot be completed.",
          );
        }

        if (payment.status !== PaymentStatus.INITIATED) {
          throw new ValidationError(
            "Only initiated payments can be completed.",
          );
        }

        const order = await orderRepository.findById(
          payment.orderId,
          session,
        );

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment =
          await paymentRepository.markAsSuccess(
            paymentId,
            transactionId.trim(),
            session,
          );

        if (!updatedPayment) {
          throw new NotFoundError(
            "Payment could not be completed.",
          );
        }

        const updatedOrder =
          await orderRepository.updatePaymentStatus(
            payment.orderId,
            OrderPaymentStatus.PAID,
            session,
          );

        if (!updatedOrder) {
          throw new NotFoundError(
            "Order payment status could not be updated.",
          );
        }
      });

      return updatedPayment;
    } finally {
      await session.endSession();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            PAYMENT FAILED                                 */
  /* -------------------------------------------------------------------------- */

  async markPaymentFailed(
    paymentId: string,
    failureReason: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!failureReason || !failureReason.trim()) {
      throw new ValidationError(
        "Failure reason is required.",
      );
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(
          paymentId,
          session,
        );

        if (!payment) {
          throw new NotFoundError("Payment not found.");
        }

        if (payment.status === PaymentStatus.SUCCESS) {
          throw new ValidationError(
            "A successful payment cannot be marked as failed.",
          );
        }

        if (payment.status === PaymentStatus.REFUNDED) {
          throw new ValidationError(
            "A refunded payment cannot be marked as failed.",
          );
        }

        if (payment.status !== PaymentStatus.INITIATED) {
          throw new ValidationError(
            "Only initiated payments can be marked as failed.",
          );
        }

        const order = await orderRepository.findById(
          payment.orderId,
          session,
        );

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment =
          await paymentRepository.markAsFailed(
            paymentId,
            failureReason.trim(),
            session,
          );

        if (!updatedPayment) {
          throw new NotFoundError(
            "Payment could not be marked as failed.",
          );
        }

        const updatedOrder =
          await orderRepository.updatePaymentStatus(
            payment.orderId,
            OrderPaymentStatus.FAILED,
            session,
          );

        if (!updatedOrder) {
          throw new NotFoundError(
            "Order payment status could not be updated.",
          );
        }
      });

      return updatedPayment;
    } finally {
      await session.endSession();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              REFUND PAYMENT                               */
  /* -------------------------------------------------------------------------- */

  async refundPayment(
    paymentId: string,
    refundId: string,
    refundReason: string,
  ) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!refundId || !refundId.trim()) {
      throw new ValidationError(
        "Refund id is required.",
      );
    }

    if (!refundReason || !refundReason.trim()) {
      throw new ValidationError(
        "Refund reason is required.",
      );
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(
          paymentId,
          session,
        );

        if (!payment) {
          throw new NotFoundError("Payment not found.");
        }

        if (payment.status === PaymentStatus.REFUNDED) {
          throw new ValidationError(
            "Payment has already been refunded.",
          );
        }

        if (payment.status !== PaymentStatus.SUCCESS) {
          throw new ValidationError(
            "Only successful payments can be refunded.",
          );
        }

        const order = await orderRepository.findById(
          payment.orderId,
          session,
        );

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment =
          await paymentRepository.markAsRefunded(
            paymentId,
            refundId.trim(),
            refundReason.trim(),
            session,
          );

        if (!updatedPayment) {
          throw new NotFoundError(
            "Payment could not be refunded.",
          );
        }

        const updatedOrder =
          await orderRepository.updatePaymentStatus(
            payment.orderId,
            OrderPaymentStatus.REFUNDED,
            session,
          );

        if (!updatedOrder) {
          throw new NotFoundError(
            "Order payment status could not be updated.",
          );
        }
      });

      return updatedPayment;
    } finally {
      await session.endSession();
    }
  }
}

export const paymentService = new PaymentService();