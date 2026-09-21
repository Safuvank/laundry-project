import { Types } from "mongoose";
import type { IDeliveryAssignment } from "../interfaces/IDeliveryAssignment.js";
import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";
declare class DeliveryAssignmentRepository {
    /**
     * Create a delivery assignment.
     */
    create(data: Partial<IDeliveryAssignment>): Promise<IDeliveryAssignment>;
    /**
     * Find assignment by ID.
     *
     * Used internally by service/business logic.
     */
    findById(id: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
    /**
     * Find assignment by ID with populated references.
     *
     * Used for detailed API responses.
     */
    findByIdPopulated(id: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
    /**
     * Find all assignments for an order.
     */
    findByOrderId(orderId: string | Types.ObjectId): Promise<IDeliveryAssignment[]>;
    /**
     * Find the active assignment for an order.
     */
    findActiveByOrderId(orderId: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
    /**
     * Find all assignments for a delivery agent.
     *
     * The order's address is populated because the delivery dashboard
     * needs the customer's location for pickup/delivery information.
     */
    findByAgentId(deliveryAgentId: string | Types.ObjectId): Promise<IDeliveryAssignment[]>;
    /**
     * Find active assignment for a delivery agent.
     */
    findActiveByAgentId(deliveryAgentId: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
    /**
     * Find assignments by status.
     */
    findByStatus(status: DeliveryAssignmentStatus): Promise<IDeliveryAssignment[]>;
    /**
     * Find all active assignments.
     */
    findAllActive(): Promise<IDeliveryAssignment[]>;
    /**
     * Update assignment.
     */
    update(id: string | Types.ObjectId, data: Partial<IDeliveryAssignment>): Promise<IDeliveryAssignment | null>;
    /**
     * Update assignment status.
     */
    updateStatus(id: string | Types.ObjectId, status: DeliveryAssignmentStatus): Promise<IDeliveryAssignment | null>;
    /**
     * Activate assignment.
     */
    activate(id: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
    /**
     * Remove fields from an assignment document.
     *
     * Useful when rolling back an accepted assignment and
     * removing timestamps such as acceptedAt.
     */
    unsetFields(id: string | Types.ObjectId, fields: string[]): Promise<IDeliveryAssignment | null>;
    /**
     * Deactivate assignment.
     */
    deactivate(id: string | Types.ObjectId): Promise<IDeliveryAssignment | null>;
}
export declare const deliveryAssignmentRepository: DeliveryAssignmentRepository;
export {};
//# sourceMappingURL=deliveryAssignment.repository.d.ts.map