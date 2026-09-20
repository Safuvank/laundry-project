export interface LaundryService {
  _id: string;
  name: string;
  code: string;
  description: string;
  pricingMode: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LaundryServicesResponse {
  success: boolean;
  message: string;
  data: LaundryService[];
}
