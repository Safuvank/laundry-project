export type AddressType = "HOME" | "WORK" | "OTHER";

export interface AddressLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface CustomerAddress {
  _id: string;
  userId: string;

  fullName: string;
  phoneNumber: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  location: AddressLocation;

  addressType: AddressType;

  isDefault: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  fullName: string;
  phoneNumber: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  location: AddressLocation;

  addressType: AddressType;

  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  fullName?: string;
  phoneNumber?: string;

  addressLine1?: string;
  addressLine2?: string;

  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  addressType?: AddressType;

  isDefault?: boolean;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: CustomerAddress[];
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: CustomerAddress;
}
