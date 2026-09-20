export type DeliveryAssignmentType =
  | "PICKUP"
  | "DELIVERY"
  | string;

export type DeliveryAssignmentStatus =
  | "OFFERED"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | string;

export interface DeliveryAssignmentAddress {
  _id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  addressType?: string;
  isDefault?: boolean;
}

export interface DeliveryAssignmentOrder {
  _id: string;
  status: string;
  addressId?: DeliveryAssignmentAddress;

}

export interface DeliveryAssignment {
  _id: string;
  orderId: DeliveryAssignmentOrder;
  deliveryAgentId: string;
  assignmentType: DeliveryAssignmentType;
  status: DeliveryAssignmentStatus;
  isActive: boolean;

  offeredAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  startedAt?: string;
  completedAt?: string;
  rejectionReason?: string;

  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAssignmentResponse {
  success: boolean;
  message: string;
  data: DeliveryAssignment;
}

export interface DeliveryAssignmentsResponse {
  success: boolean;
  message: string;
  data: DeliveryAssignment[];
}

export interface RejectAssignmentPayload {
  rejectionReason?: string;
}
