import { Types } from "mongoose";
import { Payment } from "../models/payment.model.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
import { PaymentMethod } from "../constants/paymentMethod.js";
class PaymentRepository {
    /* -------------------------------------------------------------------------- */
    /*                                  CREATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Create payment
     */
    async create(data, session) {
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
    async findById(id, session) {
        return Payment.findById(id).session(session ?? null);
    }
    /**
     * Find payment by ID with populated references
     *
     * Password is excluded from the populated user.
     */
    async findByIdPopulated(id) {
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
    async findByOrderId(orderId, session) {
        return Payment.findOne({
            orderId,
        }).session(session ?? null);
    }
    /**
     * Find payment for an order with populated references
     */
    async findByOrderIdPopulated(orderId) {
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
    async findByUserId(userId) {
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
    async findByUserIdPopulated(userId) {
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
    async findByStatus(status) {
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
    async findAll() {
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
    async update(id, data, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: data,
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                            UPDATE STATUS                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Update payment status
     */
    async updateStatus(id, status, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: {
                status,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                           UPDATE SUCCESS                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Mark payment as successful
     */
    async markAsSuccess(id, transactionId, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: {
                status: PaymentStatus.SUCCESS,
                transactionId,
                paidAt: new Date(),
            },
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                            UPDATE FAILURE                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Mark payment as failed
     */
    async markAsFailed(id, failureReason, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: {
                status: PaymentStatus.FAILED,
                failureReason,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                              REFUND                                        */
    /* -------------------------------------------------------------------------- */
    /**
     * Mark payment as refunded
     */
    async markAsRefunded(id, refundId, refundReason, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: {
                status: PaymentStatus.REFUNDED,
                refundId,
                refundReason,
                refundedAt: new Date(),
            },
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                            RESET FOR RETRY                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Reset a failed payment so the customer
     * can attempt the payment again.
     */
    async resetForRetry(id, amount, paymentMethod, session) {
        return Payment.findByIdAndUpdate(id, {
            $set: {
                amount,
                paymentMethod,
                status: PaymentStatus.PENDING,
            },
            $unset: {
                failureReason: 1,
                transactionId: 1,
                paidAt: 1,
                refundId: 1,
                refundReason: 1,
                refundedAt: 1,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
}
export const paymentRepository = new PaymentRepository();
//# sourceMappingURL=payment.repository.js.map