import { Types, type ClientSession } from "mongoose";

import { Payment } from "../models/payment.model.js";

import type { IPayment } from "../interfaces/IPayment.js";

import { PaymentStatus } from "../constants/paymentStatus.js";

import { PaymentMethod } from "../constants/paymentMethod.js";

class PaymentRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create payment
   */
  async create(
    data: Partial<IPayment>,
    session?: ClientSession,
  ): Promise<IPayment> {
    if (session) {
      const payments = await Payment.create([data], {
        session,
      });

      const payment = payments[0];

      if (!payment) {
        throw new Error("Failed to create payment.");
      }

      return payment;
    }

    return Payment.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                FIND BY ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find payment by ID
   */
  async findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findById(id).session(session ?? null);
  }

  /**
   * Find payment by ID with populated references
   *
   * Password is excluded from the populated user.
   */
  async findByIdPopulated(
    id: string | Types.ObjectId,
  ): Promise<IPayment | null> {
    return Payment.findById(id)
      .populate("userId", "-password")
      .populate("orderId");
  }

  /* -------------------------------------------------------------------------- */
  /*                            FIND BY ORDER ID                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Find payment for an order
   */
  async findByOrderId(
    orderId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findOne({
      orderId,
    }).session(session ?? null);
  }

  /**
   * Find payment for an order with populated references
   */
  async findByOrderIdPopulated(
    orderId: string | Types.ObjectId,
  ): Promise<IPayment | null> {
    return Payment.findOne({
      orderId,
    })
      .populate("userId", "-password")
      .populate("orderId");
  }

  /* -------------------------------------------------------------------------- */
  /*                           FIND BY USER ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all payments belonging to a user
   *
   * Newest payments first.
   */
  async findByUserId(userId: string | Types.ObjectId): Promise<IPayment[]> {
    return Payment.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  }

  /**
   * Find all payments belonging to a user
   * with populated order information.
   */
  async findByUserIdPopulated(
    userId: string | Types.ObjectId,
  ): Promise<IPayment[]> {
    return Payment.find({
      userId,
    })
      .populate("orderId")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                              FIND BY STATUS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Find payments by status
   */
  async findByStatus(status: PaymentStatus): Promise<IPayment[]> {
    return Payment.find({
      status,
    }).sort({
      createdAt: -1,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                             FIND ALL PAYMENTS                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all payments
   *
   * Admin use.
   */
  async findAll(): Promise<IPayment[]> {
    return Payment.find()
      .populate("userId", "-password")
      .populate("orderId")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Update payment
   */
  async update(
    id: string | Types.ObjectId,
    data: Partial<IPayment>,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            UPDATE STATUS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Update payment status
   */
  async updateStatus(
    id: string | Types.ObjectId,
    status: PaymentStatus,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                         SET GATEWAY ORDER ID                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Save the gateway/Razorpay order ID.
   *
   * This connects the FreshFold payment
   * with the Razorpay order.
   */
  async setGatewayOrderId(
    paymentId: string | Types.ObjectId,
    gatewayOrderId: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      paymentId,
      {
        $set: {
          gatewayOrderId,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                       SET GATEWAY SIGNATURE                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Save the payment gateway signature.
   *
   * Used later during Razorpay payment verification.
   */
  async setGatewaySignature(
    paymentId: string | Types.ObjectId,
    gatewaySignature: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      paymentId,
      {
        $set: {
          gatewaySignature,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                           UPDATE SUCCESS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark payment as successful
   */
  async markAsSuccess(
    id: string | Types.ObjectId,
    transactionId: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: PaymentStatus.SUCCESS,
          transactionId,
          paidAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            UPDATE FAILURE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark payment as failed
   */
  async markAsFailed(
    id: string | Types.ObjectId,
    failureReason: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: PaymentStatus.FAILED,
          failureReason,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              REFUND                                        */
  /* -------------------------------------------------------------------------- */

  /**
   * Mark payment as refunded
   */
  async markAsRefunded(
    id: string | Types.ObjectId,
    refundId: string,
    refundReason: string,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: {
          status: PaymentStatus.REFUNDED,
          refundId,
          refundReason,
          refundedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            RESET FOR RETRY                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Reset a failed payment so the customer
   * can attempt the payment again.
   */
  async resetForRetry(
    id: string | Types.ObjectId,
    amount: number,
    paymentMethod: PaymentMethod,
    session?: ClientSession,
  ): Promise<IPayment | null> {
    return Payment.findByIdAndUpdate(
      id,
      {
        $set: {
          amount,
          paymentMethod,
          status: PaymentStatus.PENDING,
        },

        $unset: {
          failureReason: 1,
          transactionId: 1,
          gatewayOrderId: 1,
          gatewaySignature: 1,
          paidAt: 1,
          refundId: 1,
          refundReason: 1,
          refundedAt: 1,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }
}

export const paymentRepository = new PaymentRepository();
