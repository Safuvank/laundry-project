export interface AdminDashboardOrders {
  total: number;
  today: number;
  pending: number;
  completed: number;
  cancelled: number;
}

export interface AdminDashboardDeliveries {
  activePickups: number;
  activeDeliveries: number;
}

export interface AdminDashboardAgents {
  total: number;
  available: number;
}

export interface AdminDashboardRevenue {
  total: number;
  today: number;
}

export interface AdminDashboard {
  orders: AdminDashboardOrders;
  deliveries: AdminDashboardDeliveries;
  agents: AdminDashboardAgents;
  revenue: AdminDashboardRevenue;
}

export interface AdminDashboardResponse {
  success: boolean;
  message: string;
  data: AdminDashboard;
}

export type AdminUserRole = "USER" | "DELIVERY_AGENT" | "ADMIN";

export type AdminUserAccountStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED";

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: AdminUserRole;
  isEmailVerified: boolean;
  accountStatus: AdminUserAccountStatus;
  profileImage?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole;
  accountStatus?: AdminUserAccountStatus;
}

export interface AdminUserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    pagination: AdminUserPagination;
  };
}

export interface AdminUserResponse {
  success: boolean;
  message: string;
  data: AdminUser;
}

export interface AdminUpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  role?: AdminUserRole;
  accountStatus?: AdminUserAccountStatus;
}

/*
 * --------------------------------------------------------------------------
 * Admin Orders
 * --------------------------------------------------------------------------
 */

export type AdminOrderStatus =
  | "DRAFT"
  | "BOOKED"
  | "PICKUP_ASSIGNED"
  | "OUT_FOR_PICKUP"
  | "PICKED_UP"
  | "RECEIVED_AT_FACILITY"
  | "INSPECTION_IN_PROGRESS"
  | "PRICE_FINALIZED"
  | "CUSTOMER_APPROVAL_PENDING"
  | "PROCESSING"
  | "QUALITY_CHECK"
  | "READY_FOR_DELIVERY"
  | "DELIVERY_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "PICKUP_FAILED"
  | "DELIVERY_FAILED"
  | "ON_HOLD";

export type AdminOrderPaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface AdminOrderCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
}



export interface AdminOrderLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface AdminOrderAddress {
  _id: string;
  fullName: string;
  phoneNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location: AdminOrderLocation;
  addressType?: string;
  isDefault?: boolean;
  isActive?: boolean;
}





export interface AdminOrder {
  _id: string;

  userId: AdminOrderCustomer;

  addressId: AdminOrderAddress;

  turnaroundPlanId: string;

  laundryServiceIds: string[];

  pickupDate: string;

  pickupTimeSlot: string;

  estimatedPrice?: number;

  finalPrice?: number;

  pricingStatus: string;

  paymentStatus: AdminOrderPaymentStatus;

  status: AdminOrderStatus;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface AdminOrderListQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: AdminOrderStatus;

  paymentStatus?: AdminOrderPaymentStatus;
}

export interface AdminOrderPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface AdminOrdersResponse {
  success: boolean;

  message: string;

  data: {
    orders: AdminOrder[];

    pagination: AdminOrderPagination;
  };
}

export interface AdminOrderResponse {
  success: boolean;

  message: string;

  data: AdminOrder;
}

// admin delivery agents

export type AdminDeliveryAgentStatus =
  | "AVAILABLE"
  | "BUSY"
  | "OFFLINE"
  | "INACTIVE";

export interface AdminDeliveryAgentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  accountStatus: string;
  isEmailVerified: boolean;
}

export interface AdminDeliveryAgentLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface AdminDeliveryAgent {
  _id: string;
  userId: AdminDeliveryAgentUser;
  status: AdminDeliveryAgentStatus;
  phoneNumber?: string | null;
  currentLocation?: AdminDeliveryAgentLocation;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDeliveryAgentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminDeliveryAgentStatus;
  isActive?: boolean;
}

export interface AdminDeliveryAgentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminDeliveryAgentsResponse {
  success: boolean;
  message: string;
  data: {
    deliveryAgents: AdminDeliveryAgent[];
    pagination: AdminDeliveryAgentPagination;
  };
}

export interface AdminDeliveryAgentResponse {
  success: boolean;
  message: string;
  data: AdminDeliveryAgent;
}

/*
 * --------------------------------------------------------------------------
 * Admin Delivery Assignments
 * --------------------------------------------------------------------------
 */

export type AdminDeliveryAssignmentStatus =
  | "PENDING"
  | "OFFERED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type AdminDeliveryAssignmentType = "PICKUP" | "DELIVERY";

export interface AdminAssignmentOrder {
  _id: string;
  status: AdminOrderStatus;
}

export interface AdminAssignmentDeliveryAgentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: "USER" | "DELIVERY_AGENT" | "ADMIN";
  accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
  isEmailVerified: boolean;
}

export interface AdminAssignmentDeliveryAgent {
  _id: string;

  userId: AdminAssignmentDeliveryAgentUser;

  status: "AVAILABLE" | "BUSY" | "OFFLINE" | "INACTIVE";

  phoneNumber?: string | null;

  currentLocation?: {
    type: "Point";
    coordinates: [number, number];
  };

  isActive: boolean;
}

export interface AdminDeliveryAssignment {
  _id: string;

  /*
   * Populated Order
   */
  orderId: AdminAssignmentOrder;

  /*
   * Populated Delivery Agent
   * including nested User information.
   */
  deliveryAgentId: AdminAssignmentDeliveryAgent;

  assignmentType: AdminDeliveryAssignmentType;

  status: AdminDeliveryAssignmentStatus;

  isActive: boolean;

  offeredAt?: string | null;

  acceptedAt?: string | null;

  rejectedAt?: string | null;

  completedAt?: string | null;

  rejectionReason?: string | null;

  createdAt: string;

  updatedAt: string;
}

export interface AdminAssignmentListQuery {
  page?: number;

  limit?: number;

  search?: string;

  status?: AdminDeliveryAssignmentStatus;

  assignmentType?: AdminDeliveryAssignmentType;

  isActive?: boolean;
}

export interface AdminAssignmentPagination {
  page: number;

  limit: number;

  total: number;

  totalPages: number;
}

export interface AdminAssignmentsResponse {
  success: boolean;

  message: string;

  data: {
    assignments: AdminDeliveryAssignment[];

    pagination: AdminAssignmentPagination;
  };
}

export interface AdminAssignmentResponse {
  success: boolean;

  message: string;

  data: AdminDeliveryAssignment;
}

