import mongoose, { Types } from "mongoose";

import { paymentRepository } from "../repositories/payment.repository.js";

import { orderRepository } from "../../order/repositories/order.repostitory.js";

import { PaymentStatus } from "../constants/paymentStatus.js";

import { PaymentMethod } from "../constants/paymentMethod.js";

import { PaymentStatus as OrderPaymentStatus } from "../../order/constants/paymentStatus.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

export class PaymentService {
  /* -------------------------------------------------------------------------- */
  /*                              CREATE PAYMENT                                */
  /* -------------------------------------------------------------------------- */

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

    if (order.userId.toString() !== userId) {
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

    const existingPayment = await paymentRepository.findByOrderId(data.orderId);

    if (existingPayment) {
      if (existingPayment.status === PaymentStatus.FAILED) {
        return paymentRepository.resetForRetry(
          existingPayment._id!,
          order.finalPrice,
          data.paymentMethod,
        );
      }

      throw new ValidationError("A payment already exists for this order.");
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
  /*                                GET BY ID                                   */
  /* -------------------------------------------------------------------------- */

  async getById(paymentId: string, userId: string) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findByIdPopulated(paymentId);

    if (!payment) {
      throw new NotFoundError("Payment not found.");
    }

    if (payment.userId.toString() !== userId) {
      throw new ValidationError("Payment does not belong to this user.");
    }

    return payment;
  }

  /* -------------------------------------------------------------------------- */
  /*                           GET BY ORDER ID                                  */
  /* -------------------------------------------------------------------------- */

  async getByOrderId(orderId: string, userId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const payment = await paymentRepository.findByOrderIdPopulated(orderId);

    if (!payment) {
      throw new NotFoundError("Payment not found for this order.");
    }

    if (payment.userId.toString() !== userId) {
      throw new ValidationError("Payment does not belong to this user.");
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

  async initiatePayment(paymentId: string, userId: string) {
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

    if (payment.userId.toString() !== userId) {
      throw new ValidationError("Payment does not belong to this user.");
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new ValidationError("Payment has already been completed.");
    }

    if (payment.status === PaymentStatus.REFUNDED) {
      throw new ValidationError("Refunded payment cannot be initiated.");
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
  /*                           PAYMENT SUCCESS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Payment:
   *
   * INITIATED → SUCCESS
   *
   * Order:
   *
   * paymentStatus → PAID
   */
  async markPaymentSuccess(paymentId: string, transactionId: string) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!transactionId || !transactionId.trim()) {
      throw new ValidationError("Transaction id is required.");
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(paymentId, session);

        if (!payment) {
          throw new NotFoundError("Payment not found.");
        }

        if (payment.status === PaymentStatus.SUCCESS) {
          throw new ValidationError("Payment has already been completed.");
        }

        if (payment.status === PaymentStatus.REFUNDED) {
          throw new ValidationError("Refunded payment cannot be completed.");
        }

        if (payment.status !== PaymentStatus.INITIATED) {
          throw new ValidationError(
            "Only initiated payments can be completed.",
          );
        }

        const order = await orderRepository.findById(payment.orderId, session);

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment = await paymentRepository.markAsSuccess(
          paymentId,
          transactionId.trim(),
          session,
        );

        if (!updatedPayment) {
          throw new NotFoundError("Payment could not be completed.");
        }

        const updatedOrder = await orderRepository.updatePaymentStatus(
          payment.orderId,
          OrderPaymentStatus.PAID,
          session,
        );

        if (!updatedOrder) {
          throw new NotFoundError("Order payment status could not be updated.");
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

  async markPaymentFailed(paymentId: string, failureReason: string) {
    if (!Types.ObjectId.isValid(paymentId)) {
      throw new ValidationError("Invalid payment id.");
    }

    if (!failureReason || !failureReason.trim()) {
      throw new ValidationError("Failure reason is required.");
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(paymentId, session);

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

        const order = await orderRepository.findById(payment.orderId, session);

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment = await paymentRepository.markAsFailed(
          paymentId,
          failureReason.trim(),
          session,
        );

        if (!updatedPayment) {
          throw new NotFoundError("Payment could not be marked as failed.");
        }

        const updatedOrder = await orderRepository.updatePaymentStatus(
          payment.orderId,
          OrderPaymentStatus.FAILED,
          session,
        );

        if (!updatedOrder) {
          throw new NotFoundError("Order payment status could not be updated.");
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
      throw new ValidationError("Refund id is required.");
    }

    if (!refundReason || !refundReason.trim()) {
      throw new ValidationError("Refund reason is required.");
    }

    const session = await mongoose.startSession();

    try {
      let updatedPayment;

      await session.withTransaction(async () => {
        const payment = await paymentRepository.findById(paymentId, session);

        if (!payment) {
          throw new NotFoundError("Payment not found.");
        }

        if (payment.status === PaymentStatus.REFUNDED) {
          throw new ValidationError("Payment has already been refunded.");
        }

        if (payment.status !== PaymentStatus.SUCCESS) {
          throw new ValidationError(
            "Only successful payments can be refunded.",
          );
        }

        const order = await orderRepository.findById(payment.orderId, session);

        if (!order) {
          throw new NotFoundError("Order not found.");
        }

        updatedPayment = await paymentRepository.markAsRefunded(
          paymentId,
          refundId.trim(),
          refundReason.trim(),
          session,
        );

        if (!updatedPayment) {
          throw new NotFoundError("Payment could not be refunded.");
        }

        const updatedOrder = await orderRepository.updatePaymentStatus(
          payment.orderId,
          OrderPaymentStatus.REFUNDED,
          session,
        );

        if (!updatedOrder) {
          throw new NotFoundError("Order payment status could not be updated.");
        }
      });

      return updatedPayment;
    } finally {
      await session.endSession();
    }
  }
}

export const paymentService = new PaymentService();
