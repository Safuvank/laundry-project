import { Types, type ClientSession } from "mongoose";
import type { IOrder } from "../interfaces/IOrder.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
declare class OrderRepository {
    /**
     * Create Order
     */
    create(data: Partial<IOrder>, session?: ClientSession): Promise<IOrder>;
    /**
     * Find Order By ID
     *
     * Used for customer-owned order operations.
     */
    findById(id: string | Types.ObjectId, session?: ClientSession): Promise<IOrder | null>;
    /**
     * Find Orders By User
     */
    findByUser(userId: string): Promise<IOrder[]>;
    /**
     * Get All Orders
     */
    findAll(): Promise<IOrder[]>;
    /**
     * Find Orders By Status
     */
    findByStatus(status: OrderStatus): Promise<IOrder[]>;
    /**
     * Update Order
     */
    update(id: string | Types.ObjectId, data: Partial<IOrder>, session?: ClientSession): Promise<IOrder | null>;
    /**
     * Update Order Status
     */
    updateStatus(id: string | Types.ObjectId, status: OrderStatus, session?: ClientSession): Promise<IOrder | null>;
    /**
     * Update Pricing
     */
    updatePricing(id: string | Types.ObjectId, finalPrice: number, pricingStatus: PricingStatus, session?: ClientSession): Promise<IOrder | null>;
    /**
     * Update Payment Status
     *
     * Used when payment state changes.
     *
     * Payment SUCCESS  → PAID
     * Payment FAILED   → FAILED
     * Payment REFUNDED → REFUNDED
     */
    updatePaymentStatus(id: string | Types.ObjectId, paymentStatus: PaymentStatus, session?: ClientSession): Promise<IOrder | null>;
    /**
     * Cancel Order (Soft Delete)
     */
    cancel(id: string | Types.ObjectId, session?: ClientSession): Promise<IOrder | null>;
}
export declare const orderRepository: OrderRepository;
export {};
//# sourceMappingURL=order.repostitory.d.ts.map