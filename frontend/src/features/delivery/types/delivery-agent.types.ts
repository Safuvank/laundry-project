export type DeliveryAgentStatus = "OFFLINE" | "AVAILABLE" | "BUSY" | string;

export interface DeliveryAgentLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface DeliveryAgentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isEmailVerified: boolean;
  accountStatus: string;
  profileImage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAgent {
  _id: string;
  userId: DeliveryAgentUser;
  status: DeliveryAgentStatus;
  currentLocation?: DeliveryAgentLocation;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryAgentResponse {
  success: boolean;
  message: string;
  data: DeliveryAgent;
}

export interface UpdateLocationPayload {
  longitude: number;
  latitude: number;
}

export interface UpdateAvailabilityPayload {
  status: DeliveryAgentStatus;
}
