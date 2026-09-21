import { Document, Types } from "mongoose";
import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
export interface IOrder extends Document {
    /**
     * Customer
     */
    userId: Types.ObjectId;
    /**
     * Pickup Address
     */
    addressId: Types.ObjectId;
    /**
     * Customer Pickup Location
     *
     * Location captured from the customer's browser
     * at the time of booking.
     *
     * GeoJSON coordinates:
     * [longitude, latitude]
     */
    pickupLocation: {
        type: "Point";
        coordinates: [number, number];
    };
    /**
     * Selected Turnaround Plan
     */
    turnaroundPlanId: Types.ObjectId;
    /**
     * Selected Laundry Services
     * Example:
     * Wash & Fold
     * Dry Cleaning
     */
    laundryServiceIds: Types.ObjectId[];
    /**
     * Pickup Date & Time
     */
    pickupDate: Date;
    pickupTimeSlot: string;
    /**
     * Customer Preferences
     */
    detergentPreference?: string;
    fabricSoftener?: boolean;
    starchPreference?: boolean;
    foldingPreference?: string;
    customerNotes?: string;
    /**
     * Pricing
     */
    estimatedPrice: number;
    finalPrice?: number;
    pricingStatus: PricingStatus;
    /**
     * Payment
     */
    paymentStatus: PaymentStatus;
    /**
     * Order Lifecycle
     */
    status: OrderStatus;
    /**
     * Active / Cancelled
     */
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=IOrder.d.ts.map