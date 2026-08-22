import { Types, type ClientSession } from "mongoose";

import type { IOrder } from "../interfaces/IOrder.js";

import { Order } from "../models/order.model.js";

import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";

class OrderRepository {
  /**
   * Create Order
   */
  async create(
    data: Partial<IOrder>,
    session?: ClientSession,
  ): Promise<IOrder> {
    if (session) {
      const orders = await Order.create([data], {
        session,
      });

      const order = orders[0];

      if (!order) {
        throw new Error("Failed to create order.");
      }

      return order;
    }

    return Order.create(data);
  }

  /**
   * Find Order By ID
   *
   * Used for customer-owned order operations.
   */
  async findById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findById(id)
      .session(session ?? null)
      .populate("addressId")
      .populate("turnaroundPlanId")
      .populate("laundryServiceIds");
  }

  /**
   * Find Orders By User
   */
  async findByUser(userId: string): Promise<IOrder[]> {
    return Order.find({
      userId,
      isActive: true,
    })
      .populate("addressId")
      .populate("turnaroundPlanId")
      .populate("laundryServiceIds")
      .sort({ createdAt: -1 });
  }

  /**
   * Get All Orders
   */
  async findAll(): Promise<IOrder[]> {
    return Order.find()
      .populate("userId")
      .populate("addressId")
      .populate("turnaroundPlanId")
      .populate("laundryServiceIds")
      .sort({ createdAt: -1 });
  }

  /**
   * Find Orders By Status
   */
  async findByStatus(status: OrderStatus): Promise<IOrder[]> {
    return Order.find({
      status,
      isActive: true,
    }).sort({
      createdAt: -1,
    });
  }

  /**
   * Update Order
   */
  async update(
    id: string | Types.ObjectId,
    data: Partial<IOrder>,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
      session: session ?? null,
    });
  }

  /**
   * Update Order Status
   */
  async updateStatus(
    id: string | Types.ObjectId,
    status: OrderStatus,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /**
   * Update Pricing
   */
  async updatePricing(
    id: string | Types.ObjectId,
    finalPrice: number,
    pricingStatus: PricingStatus,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        finalPrice,
        pricingStatus,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /**
   * Update Payment Status
   *
   * Used when payment state changes.
   *
   * Payment SUCCESS  → PAID
   * Payment FAILED   → FAILED
   * Payment REFUNDED → REFUNDED
   */
  async updatePaymentStatus(
    id: string | Types.ObjectId,
    paymentStatus: PaymentStatus,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        paymentStatus,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }

  /**
   * Cancel Order (Soft Delete)
   */
  async cancel(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      {
        status: OrderStatus.CANCELLED,
        isActive: false,
      },
      {
        returnDocument: "after",
        runValidators: true,
        session: session ?? null,
      },
    );
  }
}

export const orderRepository = new OrderRepository();
