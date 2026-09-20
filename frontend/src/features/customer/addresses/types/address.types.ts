export interface AddressLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface Address {
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

  addressType: string;
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

  addressType: string;

  location: AddressLocation;

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

  addressType?: string;

  location?: AddressLocation;

  isDefault?: boolean;
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: Address;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
}
