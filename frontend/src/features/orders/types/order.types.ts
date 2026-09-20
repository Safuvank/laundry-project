import type { OrderStatus } from "@/lib/constants/order-status";
import type { PricingStatus } from "@/lib/constants/pricing-status";
import type { PaymentStatus } from "@/lib/constants/payment-status";

export interface Order {
  _id: string;

  /**
   * Customer
   */
  userId: string;

  /**
   * Pickup Address
   */
  addressId: string;

  /**
   * Selected Turnaround Plan
   */
  turnaroundPlanId: string;

  /**
   * Selected Laundry Services
   */
  laundryServiceIds: string[];

  /**
   * Pickup Date & Time
   */
  pickupDate: string;

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

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  addressId: string;
  turnaroundPlanId: string;
  laundryServiceIds: string[];

  pickupDate: string;
  pickupTimeSlot: string;

  detergentPreference?: string;
  fabricSoftener?: boolean;
  starchPreference?: boolean;
  foldingPreference?: string;

  customerNotes?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface CustomerOrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}
