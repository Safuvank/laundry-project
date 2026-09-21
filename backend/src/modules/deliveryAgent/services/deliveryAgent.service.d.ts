import type { IDeliveryAgent } from "../interfaces/IDeliveryAgent.js";
import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";
declare class DeliveryAgentService {
    /**
     * Validate MongoDB ObjectId
     */
    private validateObjectId;
    /**
     * Get delivery agent or throw error
     */
    private getAgentOrFail;
    /**
     * Validate user and make sure
     * the user has DELIVERY_AGENT role.
     */
    private validateDeliveryAgentUser;
    /**
     * Create delivery agent
     *
     * Admin creates:
     *
     * 1. User account
     * 2. DeliveryAgent profile
     */
    create(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
        longitude: number;
        latitude: number;
    }): Promise<IDeliveryAgent>;
    /**
     * Get delivery agent by ID
     */
    getById(id: string): Promise<IDeliveryAgent>;
    /**
     * Get logged-in delivery agent profile
     */
    getMyProfile(userId: string): Promise<IDeliveryAgent>;
    /**
     * Get all delivery agents
     */
    getAll(): Promise<IDeliveryAgent[]>;
    /**
     * Get all active delivery agents
     */
    getAllActive(): Promise<IDeliveryAgent[]>;
    /**
     * Get all available delivery agents
     */
    getAvailableAgents(): Promise<IDeliveryAgent[]>;
    /**
     * Update delivery agent status
     */
    updateStatus(id: string, status: DeliveryAgentStatus): Promise<IDeliveryAgent>;
    /**
     * Update delivery agent location
     */
    updateLocation(userId: string, longitude: number, latitude: number): Promise<IDeliveryAgent>;
    /**
     * Find available delivery agents near a location
     *
     * Default radius = 5 km
     */
    findNearbyAgents(longitude: number, latitude: number, radiusInMeters?: number): Promise<IDeliveryAgent[]>;
    /**
     * Update delivery agent profile
     */
    update(id: string, data: Partial<IDeliveryAgent>): Promise<IDeliveryAgent>;
    /**
     * Activate delivery agent
     */
    activate(id: string): Promise<IDeliveryAgent>;
    /**
     * Deactivate delivery agent
     */
    deactivate(id: string): Promise<IDeliveryAgent>;
}
export declare const deliveryAgentService: DeliveryAgentService;
export {};
//# sourceMappingURL=deliveryAgent.service.d.ts.map