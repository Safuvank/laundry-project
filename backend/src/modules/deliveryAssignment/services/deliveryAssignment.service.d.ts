import type { IDeliveryAssignment } from "../interfaces/IDeliveryAssignment.js";
import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../constants/deliveryAssignmentType.js";
declare class DeliveryAssignmentService {
    /**
     * Validate MongoDB ObjectId
     */
    private validateObjectId;
    /**
     * Get assignment or throw error
     */
    private getAssignmentOrFail;
    /**
     * Verify that the authenticated delivery agent
     * owns the assignment.
     */
    private validateAssignmentOwnership;
    /**
     * Validate order
     */
    private validateOrder;
    /**
     * Validate delivery agent
     */
    private isAssignmentConflictError;
    private validateDeliveryAgent;
    /**
     * Create a delivery assignment
     *
     * The assignment starts as OFFERED.
     */
    create(orderId: string, deliveryAgentId: string, assignmentType: DeliveryAssignmentType): Promise<IDeliveryAssignment>;
    /**
     * Create a delivery assignment automatically
     *
     * Flow:
     *
     * READY_FOR_DELIVERY
     *        ↓
     * Find customer address
     *        ↓
     * Find available agents within 5 km
     *        ↓
     * Create DELIVERY assignment
     *        ↓
     * OFFERED
     *
     * The order becomes DELIVERY_ASSIGNED only
     * after the delivery agent accepts the assignment.
     */
    createDeliveryAssignment(orderId: string, adminLatitude: number, adminLongitude: number): Promise<IDeliveryAssignment>;
    /**
     * Get assignment by ID
     */
    getById(id: string): Promise<IDeliveryAssignment>;
    /**
     * Get all assignments for an order
     */
    getByOrderId(orderId: string): Promise<IDeliveryAssignment[]>;
    /**
     * Get active assignment for an order
     */
    getActiveByOrderId(orderId: string): Promise<IDeliveryAssignment | null>;
    /**
     * Get assignments for a delivery agent
     */
    getByAgentId(deliveryAgentId: string): Promise<IDeliveryAssignment[]>;
    /**
     * Get active assignment for a delivery agent
     */
    getActiveByAgentId(deliveryAgentId: string): Promise<IDeliveryAssignment | null>;
    /**
     * Delivery agent accepts assignment
     */
    accept(id: string, deliveryAgentId: string): Promise<IDeliveryAssignment>;
    /**
     * Delivery agent rejects assignment
     *
     * After rejection:
     *
     * 1. Current assignment becomes REJECTED
     * 2. Current assignment becomes inactive
     * 3. Find another available agent within 5 km
     * 4. Create a new OFFERED assignment
     *
     * If no agent is available:
     * The order remains in its current assignment state.
     */
    reject(id: string, deliveryAgentId: string, rejectionReason?: string): Promise<IDeliveryAssignment>;
    /**
     * Delivery agent starts delivery
     *
     * Flow:
     *
     * DELIVERY_ASSIGNED
     *       ↓
     * OUT_FOR_DELIVERY
     */
    startDelivery(id: string, deliveryAgentId: string): Promise<IDeliveryAssignment>;
    /**
     * Complete assignment
     *
     * Pickup:
     *
     * OUT_FOR_PICKUP
     *      ↓
     * PICKED_UP
     *
     * Delivery:
     *
     * OUT_FOR_DELIVERY
     *      ↓
     * DELIVERED
     *
     * After completion:
     *
     * Assignment → COMPLETED
     * Agent      → AVAILABLE
     */
    complete(id: string, deliveryAgentId: string): Promise<IDeliveryAssignment>;
    /**
     * Cancel delivery assignment
     */
    cancel(id: string): Promise<IDeliveryAssignment>;
    /**
     * Get all active assignments
     */
    getAllActive(): Promise<IDeliveryAssignment[]>;
    /**
     * Get assignments by status
     */
    getByStatus(status: DeliveryAssignmentStatus): Promise<IDeliveryAssignment[]>;
    /**
     * Delivery agent starts pickup
     *
     * Flow:
     *
     * PICKUP_ASSIGNED
     *       ↓
     * OUT_FOR_PICKUP
     */
    startPickup(id: string, deliveryAgentId: string): Promise<IDeliveryAssignment>;
}
export declare const deliveryAssignmentService: DeliveryAssignmentService;
export {};
//# sourceMappingURL=deliveryAssignment.service.d.ts.map