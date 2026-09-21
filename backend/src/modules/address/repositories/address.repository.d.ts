import { Types } from "mongoose";
import type { IAddress } from "../interfaces/IAddress.js";
declare class AddressRepository {
    /**
     * Create a new address
     */
    create(data: Partial<IAddress>): Promise<IAddress>;
    /**
     * Find address by ID
     */
    findById(id: string | Types.ObjectId): Promise<IAddress | null>;
    /**
     * Find all addresses of a user
     */
    findAllByUser(userId: string | Types.ObjectId): Promise<IAddress[]>;
    /**
     * Find all addresses
     *
     * Admin use
     */
    findAll(): Promise<IAddress[]>;
    /**
     * Find default address of a user
     */
    findDefaultByUser(userId: string | Types.ObjectId): Promise<IAddress | null>;
    /**
     * Count user's addresses
     */
    countByUser(userId: string | Types.ObjectId): Promise<number>;
    /**
     * Update address
     */
    update(id: string | Types.ObjectId, data: Partial<IAddress>): Promise<IAddress | null>;
    /**
     * Delete address
     */
    delete(id: string | Types.ObjectId): Promise<IAddress | null>;
    /**
     * Remove default flag from all addresses of a user
     */
    clearDefaultAddress(userId: string | Types.ObjectId): Promise<void>;
    /**
     * Set an address as default
     */
    setDefaultAddress(id: string | Types.ObjectId): Promise<IAddress | null>;
    /**
     * Find all addresses belonging to a user
     */
    findByUserId(userId: string | Types.ObjectId): Promise<IAddress[]>;
    /**
     * Remove default status from all user addresses
     */
    clearDefault(userId: string | Types.ObjectId): Promise<void>;
    /**
     * Set an address as default
     */
    setDefault(id: string | Types.ObjectId): Promise<IAddress | null>;
    /**
     * Deactivate address
     */
    deactivate(id: string | Types.ObjectId): Promise<IAddress | null>;
}
export declare const addressRepository: AddressRepository;
export {};
//# sourceMappingURL=address.repository.d.ts.map