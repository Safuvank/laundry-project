import type { IAddress } from "../interfaces/IAddress.js";
import { AddressType } from "../constants/addresstype.js";
interface CreateAddressData {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType: AddressType;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    isDefault?: boolean;
}
declare class AddressService {
    /**
     * Validate address ObjectId
     */
    private validateObjectId;
    /**
     * Validate user ObjectId
     */
    private validateUserId;
    /**
     * Validate GeoJSON location
     *
     * Coordinates:
     *
     * [longitude, latitude]
     */
    private validateLocation;
    /**
     * Get address or throw error
     */
    private getAddressOrFail;
    /**
     * Create address
     */
    create(userId: string, data: CreateAddressData): Promise<IAddress>;
    /**
     * Get all addresses
     *
     * Admin operation
     */
    getAll(): Promise<IAddress[]>;
    /**
     * Get user's address by ID
     */
    getById(userId: string, addressId: string): Promise<IAddress>;
    /**
     * Get all addresses belonging to user
     */
    getMyAddresses(userId: string): Promise<IAddress[]>;
    /**
     * Update user's address
     */
    update(userId: string, addressId: string, data: Partial<CreateAddressData>): Promise<IAddress>;
    /**
     * Set user's address as default
     */
    setDefault(userId: string, addressId: string): Promise<IAddress>;
    /**
     * Soft delete / deactivate address
     */
    deactivate(userId: string, addressId: string): Promise<IAddress>;
    /**
     * Delete address
     *
     * We use soft delete instead of
     * permanently removing the document.
     */
    delete(userId: string, addressId: string): Promise<IAddress>;
}
export declare const addressService: AddressService;
export {};
//# sourceMappingURL=address.service.d.ts.map