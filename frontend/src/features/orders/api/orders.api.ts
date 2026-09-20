import { api } from "@/lib/api/axios";

import type { CustomerOrdersResponse, Order } from "../types/order.types";

/**
 * Create Order
 */

export interface CreateOrderPayload {
  addressId: string;

  /**
   * Customer's location captured at booking time.
   *
   * Backend stores this as GeoJSON:
   * [longitude, latitude]
   */
  pickupLocation: {
    latitude: number;
    longitude: number;
  };

  turnaroundPlanId: string;
  laundryServiceIds: string[];
  pickupSlotId: string;

  detergentPreference?: string;
  fabricSoftener?: boolean;
  starchPreference?: boolean;
  foldingPreference?: string;
  customerNotes?: string;
}

interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const response = await api.post<CreateOrderResponse>("/orders", payload);

  return response.data.data;
};

/**
 * Get Customer Orders
 */

export const getCustomerOrders = async (): Promise<Order[]> => {
  const response = await api.get<CustomerOrdersResponse>("/orders/my-orders");

  return response.data.data;
};

/**
 * Get Order By ID
 */

interface GetOrderByIdResponse {
  success: boolean;
  message: string;
  data: Order;
}

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get<GetOrderByIdResponse>(`/orders/${orderId}`);

  return response.data.data;
};

/**
 * Approve Final Price
 *
 * Customer approves the finalized laundry price.
 *
 * Expected backend transition:
 * CUSTOMER_APPROVAL_PENDING → PROCESSING
 */

export const approveOrderPrice = async (orderId: string): Promise<Order> => {
  const response = await api.patch<GetOrderByIdResponse>(
    `/orders/${orderId}/approve-price`,
  );

  return response.data.data;
};

/**
 * Reject Final Price
 *
 * Customer rejects the finalized laundry price.
 *
 * Expected backend transition:
 * CUSTOMER_APPROVAL_PENDING → ON_HOLD
 */

export const rejectOrderPrice = async (orderId: string): Promise<Order> => {
  const response = await api.patch<GetOrderByIdResponse>(
    `/orders/${orderId}/reject-price`,
  );

  return response.data.data;
};
