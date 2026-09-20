// import type { OrderStatus } from "../../order/constants/orderStatus.js";

// /* =========================================================
//    CUSTOMER
// ========================================================= */

// export interface AdminOrderCustomer {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
// }

// /* =========================================================
//    ADDRESS / LOCATION
// ========================================================= */

// export interface AdminOrderLocation {
//   type: "Point";
//   coordinates: [number, number]; // [longitude, latitude]
// }

// export interface AdminOrderAddress {
//   _id: string;
//   fullName: string;
//   phoneNumber: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   location: AdminOrderLocation;
//   addressType?: string;
//   isDefault?: boolean;
//   isActive?: boolean;
// }

// /* =========================================================
//    ORDER
// ========================================================= */

// export interface AdminOrder {
//   _id: string;

//   userId: AdminOrderCustomer;

//   addressId: AdminOrderAddress;

//   status: OrderStatus;

//   totalAmount?: number;
//   finalPrice?: number;

//   paymentStatus?: string;

//   pricingStatus?: string;

//   createdAt: string;
//   updatedAt: string;

//   [key: string]: unknown;
// }

// /* =========================================================
//    API RESPONSE
// ========================================================= */

// export interface AdminOrderResponse {
//   success: boolean;
//   message: string;
//   data: AdminOrder;
// }

// /* =========================================================
//    ORDER LIST
// ========================================================= */

// export interface AdminOrdersResponse {
//   success: boolean;
//   message: string;

//   data: {
//     orders: AdminOrder[];

//     pagination?: {
//       page: number;
//       limit: number;
//       total: number;
//       totalPages: number;
//     };
//   };
// }

// /* =========================================================
//    DELIVERY ASSIGNMENT
// ========================================================= */

// export type AdminDeliveryAssignmentStatus =
//   | "PENDING"
//   | "OFFERED"
//   | "ACCEPTED"
//   | "REJECTED"
//   | "CANCELLED"
//   | "COMPLETED";

// export type AdminDeliveryAssignmentType = "PICKUP" | "DELIVERY";

// export interface AdminAssignmentOrder {
//   _id: string;
//   status: OrderStatus;
// }

// export interface AdminAssignmentDeliveryAgentUser {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string;
// }

// export interface AdminAssignmentDeliveryAgent {
//   _id: string;
//   userId: AdminAssignmentDeliveryAgentUser;
// }

// export interface AdminDeliveryAssignment {
//   _id: string;

//   orderId: AdminAssignmentOrder;

//   deliveryAgentId: AdminAssignmentDeliveryAgent;

//   assignmentType: AdminDeliveryAssignmentType;

//   status: AdminDeliveryAssignmentStatus;

//   isActive: boolean;

//   offeredAt?: string | null;
//   acceptedAt?: string | null;
//   rejectedAt?: string | null;
//   completedAt?: string | null;

//   rejectionReason?: string | null;

//   createdAt: string;
//   updatedAt: string;
// }

// export interface AdminAssignmentListQuery {
//   page?: number;
//   limit?: number;
//   status?: AdminDeliveryAssignmentStatus;
//   assignmentType?: AdminDeliveryAssignmentType;
//   deliveryAgentId?: string;
//   orderId?: string;
// }

// export interface AdminAssignmentPagination {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// }

// export interface AdminAssignmentsResponse {
//   success: boolean;
//   message: string;

//   data: {
//     assignments: AdminDeliveryAssignment[];
//     pagination: AdminAssignmentPagination;
//   };
// }

// export interface AdminAssignmentResponse {
//   success: boolean;
//   message: string;
//   data: AdminDeliveryAssignment;
// }
