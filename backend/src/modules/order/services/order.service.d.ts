import type { IOrder } from "../interfaces/IOrder.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
interface CreateOrderData {
    addressId: string;
    turnaroundPlanId: string;
    laundryServiceIds: string[];
    pickupSlotId: string;
    /**
     * Customer location captured from the browser
     * at the time of booking.
     *
     * Coordinates are received as:
     * latitude + longitude
     *
     * They are stored in MongoDB as:
     * [longitude, latitude]
     */
    pickupLocation: {
        latitude: number;
        longitude: number;
    };
    detergentPreference?: string;
    fabricSoftener?: boolean;
    starchPreference?: boolean;
    foldingPreference?: string;
    customerNotes?: string;
}
declare class OrderService {
    /**
     * Validate MongoDB ObjectId
     */
    private validateObjectId;
    /**
     * Validate customer pickup location
     *
     * Latitude:
     *   -90 to 90
     *
     * Longitude:
     *   -180 to 180
     */
    private validatePickupLocation;
    /**
     * Find order or throw NotFoundError
     */
    private getOrderOrFail;
    /**
     * Validate customer address
     */
    private validateAddress;
    /**
     * Validate turnaround plan
     */
    private validateTurnaroundPlan;
    /**
     * Validate selected laundry services
     */
    private validateLaundryServices;
    /**
     * Validate pickup slot
     */
    private validatePickupSlot;
    /**
     * Calculate estimated order price
     */
    private calculateEstimatedPrice;
    /**
     * Find a nearby available delivery agent
     * and create a pickup assignment.
     *
     * Location source:
     * Customer's booking-time pickup location.
     *
     * Radius:
     * 5 km
     */
    private assignNearbyDeliveryAgent;
    /**
     * Create Order
     */
    create(userId: string, data: CreateOrderData): Promise<IOrder>;
    /**
     * Get logged-in customer's orders
     */
    getMyOrders(userId: string): Promise<IOrder[]>;
    /**
     * Get one order belonging to logged-in customer
     */
    getById(orderId: string, userId: string): Promise<IOrder>;
    /**
     * Cancel customer order
     */
    cancel(orderId: string, userId: string): Promise<IOrder>;
    /**
     * Get all orders
     */
    getAll(): Promise<IOrder[]>;
    /**
     * Update order status
     */
    updateStatus(orderId: string, status: OrderStatus): Promise<IOrder>;
    /**
     * Mark order as received at laundry facility
     *
     * Flow:
     *
     * PICKED_UP
     *     ↓
     * RECEIVED_AT_FACILITY
     */
    markReceivedAtFacility(orderId: string): Promise<IOrder>;
    /**
     * Start order inspection
     *
     * Flow:
     *
     * RECEIVED_AT_FACILITY
     *          ↓
     * INSPECTION_IN_PROGRESS
     */
    startInspection(orderId: string): Promise<IOrder>;
    /**
     * Update final pricing
     *
     * Flow:
     *
     * INSPECTION_IN_PROGRESS
     *          ↓
     *     PRICE_FINALIZED
     */
    updatePricing(orderId: string, finalPrice: number): Promise<IOrder>;
    /**
     * Request customer approval for finalized price
     *
     * Flow:
     *
     * PRICE_FINALIZED
     *       ↓
     * CUSTOMER_APPROVAL_PENDING
     */
    requestCustomerApproval(orderId: string): Promise<IOrder>;
    /**
     * Customer approves finalized price
     *
     * Flow:
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *       APPROVE
     *          ↓
     *      PROCESSING
     */
    approvePrice(orderId: string, userId: string): Promise<IOrder>;
    /**
     * Customer rejects finalized price
     *
     * Flow:
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *        REJECT
     *          ↓
     *        ON_HOLD
     */
    rejectPrice(orderId: string, userId: string): Promise<IOrder>;
    /**
     * Start quality check
     *
     * PROCESSING
     *     ↓
     * QUALITY_CHECK
     */
    startQualityCheck(orderId: string): Promise<IOrder>;
    /**
     * Complete quality check
     *
     * QUALITY_CHECK
     *      ↓
     * READY_FOR_DELIVERY
     */
    completeQualityCheck(orderId: string): Promise<IOrder>;
    /**
     * Complete order
     *
     * DELIVERED
     *     ↓
     * COMPLETED
     */
    completeOrder(orderId: string): Promise<IOrder>;
    /**
     * Update payment status
     */
    updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<IOrder>;
}
export declare const orderService: OrderService;
export {};
//# sourceMappingURL=order.service.d.ts.map