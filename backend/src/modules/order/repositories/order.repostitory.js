import { Types } from "mongoose";
import { Order } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
class OrderRepository {
    /**
     * Create Order
     */
    async create(data, session) {
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
    async findById(id, session) {
        return Order.findById(id)
            .session(session ?? null)
            .populate("addressId")
            .populate("turnaroundPlanId")
            .populate("laundryServiceIds");
    }
    /**
     * Find Orders By User
     */
    // async findByUser(userId: string): Promise<IOrder[]> {
    //   return Order.find({
    //     userId,
    //     isActive: true,
    //   }).sort({ createdAt: -1 });
    // }
    async findByUser(userId) {
        return Order.find({
            userId,
            isActive: true,
        }).sort({ createdAt: -1 });
    }
    /**
     * Get All Orders
     */
    async findAll() {
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
    async findByStatus(status) {
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
    async update(id, data, session) {
        return Order.findByIdAndUpdate(id, data, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /**
     * Update Order Status
     */
    async updateStatus(id, status, session) {
        return Order.findByIdAndUpdate(id, {
            status,
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /**
     * Update Pricing
     */
    async updatePricing(id, finalPrice, pricingStatus, session) {
        return Order.findByIdAndUpdate(id, {
            finalPrice,
            pricingStatus,
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
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
    async updatePaymentStatus(id, paymentStatus, session) {
        return Order.findByIdAndUpdate(id, {
            paymentStatus,
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
    /**
     * Cancel Order (Soft Delete)
     */
    async cancel(id, session) {
        return Order.findByIdAndUpdate(id, {
            status: OrderStatus.CANCELLED,
            isActive: false,
        }, {
            returnDocument: "after",
            runValidators: true,
            session: session ?? null,
        });
    }
}
export const orderRepository = new OrderRepository();
//# sourceMappingURL=order.repostitory.js.map