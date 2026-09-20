import { api } from "@/lib/api/axios";

import type {
  AdminDashboardResponse,
  AdminUpdateUserPayload,
  AdminUserResponse,
  AdminUserListQuery,
  AdminUsersResponse,
  AdminOrderListQuery,
  AdminOrdersResponse,
  AdminOrderResponse,
  AdminDeliveryAgentListQuery,
  AdminDeliveryAgentsResponse,
  AdminDeliveryAgentResponse,
  AdminAssignmentListQuery,
  AdminAssignmentsResponse,
  AdminAssignmentResponse,
} from "../types/admin.types";

/*
 * --------------------------------------------------------------------------
 * Admin Dashboard
 * --------------------------------------------------------------------------
 */

export const getAdminDashboard = async (): Promise<AdminDashboardResponse> => {
  const response = await api.get<AdminDashboardResponse>("/admin/dashboard");

  return response.data;
};

/*
 * --------------------------------------------------------------------------
 * Admin Users
 * --------------------------------------------------------------------------
 */

export const getAdminUsers = async (
  query?: AdminUserListQuery,
): Promise<AdminUsersResponse> => {
  const response = await api.get<AdminUsersResponse>("/admin/users", {
    params: query,
  });

  return response.data;
};

export const getAdminUserById = async (
  userId: string,
): Promise<AdminUserResponse> => {
  const response = await api.get<AdminUserResponse>(`/admin/users/${userId}`);

  return response.data;
};

export const updateAdminUser = async (
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<AdminUserResponse> => {
  const response = await api.patch<AdminUserResponse>(
    `/admin/users/${userId}`,
    payload,
  );

  return response.data;
};

export const activateAdminUser = async (
  userId: string,
): Promise<AdminUserResponse> => {
  const response = await api.patch<AdminUserResponse>(
    `/admin/users/${userId}/activate`,
  );

  return response.data;
};

export const deactivateAdminUser = async (
  userId: string,
): Promise<AdminUserResponse> => {
  const response = await api.patch<AdminUserResponse>(
    `/admin/users/${userId}/deactivate`,
  );

  return response.data;
};

/*
 * --------------------------------------------------------------------------
 * Admin Orders
 * --------------------------------------------------------------------------
 */

export const getAdminOrders = async (
  query?: AdminOrderListQuery,
): Promise<AdminOrdersResponse> => {
  const response = await api.get<AdminOrdersResponse>("/admin/orders", {
    params: query,
  });

  return response.data;
};

export const getAdminOrderById = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.get<AdminOrderResponse>(
    `/admin/orders/${orderId}`,
  );

  return response.data;
};

/**
 * Receive Order at Facility
 *
 * PICKED_UP → RECEIVED_AT_FACILITY
 */
export const receiveOrderAtFacility = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/received-at-facility`,
  );

  return response.data;
};

/**
 * Start Order Inspection
 *
 * RECEIVED_AT_FACILITY → INSPECTION_IN_PROGRESS
 */
export const startOrderInspection = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/start-inspection`,
  );

  return response.data;
};

/**
 * Finalize Order Price
 *
 * INSPECTION_IN_PROGRESS → PRICE_FINALIZED
 */
export const updateOrderPricing = async (
  orderId: string,
  finalPrice: number,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/pricing`,
    {
      finalPrice,
    },
  );

  return response.data;
};

/**
 * Request Customer Price Approval
 *
 * PRICE_FINALIZED → CUSTOMER_APPROVAL_PENDING
 */
export const requestCustomerApproval = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/request-approval`,
  );

  return response.data;
};

/**
 * Start Order Quality Check
 *
 * PROCESSING → QUALITY_CHECK
 */
export const startOrderQualityCheck = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/start-quality-check`,
  );

  return response.data;
};

/**
 * Complete Order Quality Check
 *
 * QUALITY_CHECK → READY_FOR_DELIVERY
 */
export const completeOrderQualityCheck = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/complete-quality-check`,
  );

  return response.data;
};

/*
 * --------------------------------------------------------------------------
 * Admin Delivery Agents
 * --------------------------------------------------------------------------
 */

export const getAdminDeliveryAgents = async (
  query?: AdminDeliveryAgentListQuery,
): Promise<AdminDeliveryAgentsResponse> => {
  const response = await api.get<AdminDeliveryAgentsResponse>(
    "/admin/delivery-agents",
    {
      params: query,
    },
  );

  return response.data;
};

export const getAdminDeliveryAgentById = async (
  deliveryAgentId: string,
): Promise<AdminDeliveryAgentResponse> => {
  const response = await api.get<AdminDeliveryAgentResponse>(
    `/admin/delivery-agents/${deliveryAgentId}`,
  );

  return response.data;
};

/*
 * --------------------------------------------------------------------------
 * Admin Assignments
 * --------------------------------------------------------------------------
 */

export const getAdminAssignments = async (
  query?: AdminAssignmentListQuery,
): Promise<AdminAssignmentsResponse> => {
  const response = await api.get<AdminAssignmentsResponse>(
    "/admin/assignments",
    {
      params: query,
    },
  );

  return response.data;
};

export const getAdminAssignmentById = async (
  assignmentId: string,
): Promise<AdminAssignmentResponse> => {
  const response = await api.get<AdminAssignmentResponse>(
    `/admin/assignments/${assignmentId}`,
  );

  return response.data;
};

/*
 * --------------------------------------------------------------------------
 * Create Delivery Assignment
 * --------------------------------------------------------------------------
 *
 * Flow:
 *
 * READY_FOR_DELIVERY
 *        ↓
 * Admin gets current GPS location
 *        ↓
 * Send admin latitude + longitude
 *        ↓
 * Find AVAILABLE delivery agents within 5 km
 *        ↓
 * Create DELIVERY assignment
 *        ↓
 * Assignment = OFFERED
 * Order = DELIVERY_ASSIGNED
 */
export const createDeliveryAssignment = async (
  orderId: string,
  latitude: number,
  longitude: number,
): Promise<AdminAssignmentResponse> => {
  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("Invalid admin latitude.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("Invalid admin longitude.");
  }

  const response = await api.post<AdminAssignmentResponse>(
    "/delivery-assignments/delivery",
    {
      orderId,
      latitude,
      longitude,
    },
  );

  return response.data;
};


/**
 * Complete Order
 *
 * DELIVERED → COMPLETED
 */
export const completeOrder = async (
  orderId: string,
): Promise<AdminOrderResponse> => {
  const response = await api.patch<AdminOrderResponse>(
    `/orders/${orderId}/complete`,
  );

  return response.data;
};