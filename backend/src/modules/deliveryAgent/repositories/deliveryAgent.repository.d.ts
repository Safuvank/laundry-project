import { Types } from "mongoose";
import type { IDeliveryAgent } from "../interfaces/IDeliveryAgent.js";
import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";
declare class DeliveryAgentRepository {
    /**
     * Create a delivery agent profile
     */
    create(data: Partial<IDeliveryAgent>): Promise<IDeliveryAgent>;
    /**
     * Find delivery agent by ID
     */
    findById(id: string | Types.ObjectId): Promise<IDeliveryAgent | null>;
    /**
     * Find delivery agent by User ID
     */
    findByUserId(userId: string | Types.ObjectId): Promise<IDeliveryAgent | null>;
    /**
     * Find all delivery agents
     */
    findAll(): Promise<IDeliveryAgent[]>;
    /**
     * Find all active delivery agents
     */
    findAllActive(): Promise<IDeliveryAgent[]>;
    /**
     * Find agents who are:
     *
     * 1. Active
     * 2. Available
     */
    findAvailableAgents(): Promise<IDeliveryAgent[]>;
    /**
     * Find available agents within a given radius.
     *
     * MongoDB uses meters for $maxDistance.
     *
     * Example:
     * 5 km = 5000 meters
     *
     * Coordinates must be:
     * [longitude, latitude]
     */
    findAvailableAgentsNearLocation(longitude: number, latitude: number, radiusInMeters: number): Promise<IDeliveryAgent[]>;
    /**
     * Update delivery agent
     */
    update(id: string | Types.ObjectId, data: Partial<IDeliveryAgent>): Promise<IDeliveryAgent | null>;
    /**
     * Update delivery agent status
     */
    updateStatus(id: string | Types.ObjectId, status: DeliveryAgentStatus): Promise<IDeliveryAgent | null>;
    /**
     * Update delivery agent current location
     */
    updateLocation(id: string | Types.ObjectId, longitude: number, latitude: number): Promise<IDeliveryAgent | null>;
    /**
     * Activate delivery agent
     */
    activate(id: string | Types.ObjectId): Promise<IDeliveryAgent | null>;
    /**
     * Deactivate delivery agent
     */
    deactivate(id: string | Types.ObjectId): Promise<IDeliveryAgent | null>;
}
export declare const deliveryAgentRepository: DeliveryAgentRepository;
export {};
//# sourceMappingURL=deliveryAgent.repository.d.ts.map