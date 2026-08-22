import { Types } from "mongoose";

import { deliveryAssignmentRepository } from "../repositories/deliveryAssignment.repository.js";

import { orderRepository } from "../../order/repositories/order.repostitory.js";

import { deliveryAgentRepository } from "../../deliveryAgent/repositories/deliveryAgent.repository.js";

import type { IDeliveryAssignment } from "../interfaces/IDeliveryAssignment.js";

import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";

import { DeliveryAgentStatus } from "../../deliveryAgent/constants/deliveryAgentStatus.js";

import { OrderStatus } from "../../order/constants/orderStatus.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";

import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

import { addressRepository } from "../../address/repositories/address.repository.js";

import { DeliveryAssignmentType } from "../constants/deliveryAssignmentType.js";

import { notificationService } from "../../notification/services/notification.service.js";
import { NotificationType } from "../../notification/constants/notificationType.js";

class DeliveryAssignmentService {
  /* -------------------------------------------------------------------------- */
  /*                              PRIVATE HELPERS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid delivery assignment id.");
    }
  }

  /**
   * Get assignment or throw error
   */
  private async getAssignmentOrFail(id: string): Promise<IDeliveryAssignment> {
    this.validateObjectId(id);

    const assignment = await deliveryAssignmentRepository.findById(id);

    if (!assignment) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    return assignment;
  }

  /**
   * Verify that the authenticated delivery agent
   * owns the assignment.
   */
  private validateAssignmentOwnership(
    assignment: IDeliveryAssignment,
    deliveryAgentId: string,
  ): void {
    if (!Types.ObjectId.isValid(deliveryAgentId)) {
      throw new ValidationError("Invalid delivery agent id.");
    }

    if (assignment.deliveryAgentId.toString() !== deliveryAgentId) {
      throw new ValidationError(
        "You are not authorized to perform this action on this assignment.",
      );
    }
  }

  /**
   * Validate order
   */
  private async validateOrder(orderId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (!order.isActive) {
      throw new ValidationError("Order is inactive.");
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new ValidationError("Cancelled order cannot be assigned.");
    }

    return order;
  }

  /**
   * Validate delivery agent
   */
  private async validateDeliveryAgent(deliveryAgentId: string) {
    if (!Types.ObjectId.isValid(deliveryAgentId)) {
      throw new ValidationError("Invalid delivery agent id.");
    }

    const agent = await deliveryAgentRepository.findById(deliveryAgentId);

    if (!agent) {
      throw new NotFoundError("Delivery agent not found.");
    }

    if (!agent.isActive) {
      throw new ValidationError("Delivery agent is inactive.");
    }

    if (agent.status !== DeliveryAgentStatus.AVAILABLE) {
      throw new ValidationError("Delivery agent is not available.");
    }

    return agent;
  }

  /* -------------------------------------------------------------------------- */
  /*                              CREATE ASSIGNMENT                             */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a delivery assignment
   *
   * The assignment starts as OFFERED.
   */
  async create(
    orderId: string,
    deliveryAgentId: string,
    assignmentType: DeliveryAssignmentType,
  ): Promise<IDeliveryAssignment> {
    /* ---------------------------------------------------------------------- */
    /* Validate Order                                                         */
    /* ---------------------------------------------------------------------- */
    if (!Object.values(DeliveryAssignmentType).includes(assignmentType)) {
      throw new ValidationError("Invalid delivery assignment type.");
    }

    const order = await this.validateOrder(orderId);

    /* ---------------------------------------------------------------------- */
    /* Validate Delivery Agent                                               */
    /* ---------------------------------------------------------------------- */

    const agent = await this.validateDeliveryAgent(deliveryAgentId);

    /* ---------------------------------------------------------------------- */
    /* Check Existing Active Order Assignment                                */
    /* ---------------------------------------------------------------------- */

    const existingOrderAssignment =
      await deliveryAssignmentRepository.findActiveByOrderId(orderId);

    if (existingOrderAssignment) {
      throw new ValidationError(
        "Order already has an active delivery assignment.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Check Existing Active Agent Assignment                                */
    /* ---------------------------------------------------------------------- */

    const existingAgentAssignment =
      await deliveryAssignmentRepository.findActiveByAgentId(deliveryAgentId);

    if (existingAgentAssignment) {
      throw new ValidationError(
        "Delivery agent already has an active assignment.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Create Assignment                                                     */
    /* ---------------------------------------------------------------------- */

    const assignment = await deliveryAssignmentRepository.create({
      orderId: order._id,

      deliveryAgentId: agent._id,

      assignmentType,

      status: DeliveryAssignmentStatus.OFFERED,

      offeredAt: new Date(),

      isActive: true,
    });

    await notificationService.create({
      userId: order.userId.toString(),
      orderId: order._id.toString(),
      type:
        assignmentType === DeliveryAssignmentType.PICKUP
          ? NotificationType.PICKUP_ASSIGNED
          : NotificationType.DELIVERY_ASSIGNED,
      title:
        assignmentType === DeliveryAssignmentType.PICKUP
          ? "Pickup Assignment Created"
          : "Delivery Assignment Created",
      message:
        assignmentType === DeliveryAssignmentType.PICKUP
          ? "Your order has been assigned for pickup."
          : "Your order has been assigned for delivery.",
    });
    return assignment;
  }

  /* -------------------------------------------------------------------------- */
  /*                         CREATE DELIVERY ASSIGNMENT                         */
  /* -------------------------------------------------------------------------- */

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
  async createDeliveryAssignment(
    orderId: string,
  ): Promise<IDeliveryAssignment> {
    /* ---------------------------------------------------------------------- */
    /* Validate Order                                                         */
    /* ---------------------------------------------------------------------- */

    const order = await this.validateOrder(orderId);

    /* ---------------------------------------------------------------------- */
    /* Validate Order Status                                                  */
    /* ---------------------------------------------------------------------- */

    if (order.status !== OrderStatus.READY_FOR_DELIVERY) {
      throw new ValidationError(
        "Order must be READY_FOR_DELIVERY before delivery can be assigned.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Check Existing Active Assignment                                       */
    /* ---------------------------------------------------------------------- */

    const existingAssignment =
      await deliveryAssignmentRepository.findActiveByOrderId(orderId);

    if (existingAssignment) {
      throw new ValidationError(
        "Order already has an active delivery assignment.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Get Customer Address                                                   */
    /* ---------------------------------------------------------------------- */

    const addressId =
      order.addressId && typeof order.addressId === "object"
        ? order.addressId._id
        : order.addressId;

    if (!addressId) {
      throw new ValidationError("Order address id is missing.");
    }

    const address = await addressRepository.findById(addressId.toString());

    if (!address) {
      throw new NotFoundError("Customer address not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Customer Location                                             */
    /* ---------------------------------------------------------------------- */

    const longitude = address.location.coordinates[0];

    const latitude = address.location.coordinates[1];

    if (longitude === undefined || latitude === undefined) {
      throw new ValidationError("Customer address has invalid location.");
    }

    /* ---------------------------------------------------------------------- */
    /* Find Nearby Available Delivery Agents                                 */
    /* ---------------------------------------------------------------------- */

    /**
     * 5 km = 5000 meters
     */
    const nearbyAgents =
      await deliveryAgentRepository.findAvailableAgentsNearLocation(
        longitude,
        latitude,
        5000,
      );

    if (nearbyAgents.length === 0) {
      throw new ValidationError(
        "No available delivery agent found within 5 km.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Try To Assign An Agent                                                 */
    /* ---------------------------------------------------------------------- */

    for (const agent of nearbyAgents) {
      try {
        const assignment = await this.create(
          orderId,
          agent._id.toString(),
          DeliveryAssignmentType.DELIVERY,
        );

        return assignment;
      } catch (error) {
        /*
         * Another request may have assigned this agent
         * between finding the agent and creating the assignment.
         *
         * Try the next available agent.
         */
        if (error instanceof ValidationError) {
          continue;
        }

        throw error;
      }
    }

    /* ---------------------------------------------------------------------- */
    /* No Agent Could Be Assigned                                             */
    /* ---------------------------------------------------------------------- */

    throw new ValidationError(
      "Unable to assign a delivery agent. Please try again.",
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              GET BY ID                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignment by ID
   */
  async getById(id: string): Promise<IDeliveryAssignment> {
    return this.getAssignmentOrFail(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                            GET BY ORDER                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all assignments for an order
   */
  async getByOrderId(orderId: string): Promise<IDeliveryAssignment[]> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    await this.validateOrder(orderId);

    return deliveryAssignmentRepository.findByOrderId(orderId);
  }

  /**
   * Get active assignment for an order
   */
  async getActiveByOrderId(
    orderId: string,
  ): Promise<IDeliveryAssignment | null> {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new ValidationError("Invalid order id.");
    }

    return deliveryAssignmentRepository.findActiveByOrderId(orderId);
  }

  /* -------------------------------------------------------------------------- */
  /*                           GET BY DELIVERY AGENT                           */
  /* -------------------------------------------------------------------------- */

  /**
   * Get assignments for a delivery agent
   */
  async getByAgentId(deliveryAgentId: string): Promise<IDeliveryAssignment[]> {
    if (!Types.ObjectId.isValid(deliveryAgentId)) {
      throw new ValidationError("Invalid delivery agent id.");
    }

    return deliveryAssignmentRepository.findByAgentId(deliveryAgentId);
  }

  /**
   * Get active assignment for a delivery agent
   */
  async getActiveByAgentId(
    deliveryAgentId: string,
  ): Promise<IDeliveryAssignment | null> {
    if (!Types.ObjectId.isValid(deliveryAgentId)) {
      throw new ValidationError("Invalid delivery agent id.");
    }

    return deliveryAssignmentRepository.findActiveByAgentId(deliveryAgentId);
  }

  /* -------------------------------------------------------------------------- */
  /*                              ACCEPT                                        */
  /* -------------------------------------------------------------------------- */

  /**
   * Delivery agent accepts assignment
   */
  async accept(
    id: string,
    deliveryAgentId: string,
  ): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    this.validateAssignmentOwnership(assignment, deliveryAgentId);

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is inactive.");
    }

    if (assignment.status !== DeliveryAssignmentStatus.OFFERED) {
      throw new ValidationError("Only offered assignments can be accepted.");
    }

    const agent = await deliveryAgentRepository.findById(
      assignment.deliveryAgentId,
    );

    if (!agent) {
      throw new NotFoundError("Delivery agent not found.");
    }

    if (!agent.isActive) {
      throw new ValidationError("Delivery agent is inactive.");
    }

    if (agent.status !== DeliveryAgentStatus.AVAILABLE) {
      throw new ValidationError("Delivery agent is no longer available.");
    }

    const updated = await deliveryAssignmentRepository.update(assignment._id, {
      status: DeliveryAssignmentStatus.ACCEPTED,

      acceptedAt: new Date(),
    });

    if (!updated) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    await deliveryAgentRepository.updateStatus(
      assignment.deliveryAgentId.toString(),
      DeliveryAgentStatus.BUSY,
    );

    const nextOrderStatus =
      assignment.assignmentType === DeliveryAssignmentType.PICKUP
        ? OrderStatus.PICKUP_ASSIGNED
        : OrderStatus.DELIVERY_ASSIGNED;

    const updatedOrder = await orderRepository.updateStatus(
      assignment.orderId.toString(),
      nextOrderStatus,
    );

    if (!updatedOrder) {
      throw new NotFoundError("Order not found.");
    }

    const result = await deliveryAssignmentRepository.findById(updated._id);

    if (!result) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    await notificationService.create({
      userId: updatedOrder.userId.toString(),
      orderId: updatedOrder._id.toString(),
      type:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? NotificationType.PICKUP_ASSIGNED
          : NotificationType.DELIVERY_ASSIGNED,
      title:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? "Pickup Assigned"
          : "Delivery Assigned",
      message:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? "A delivery agent has accepted your pickup assignment."
          : "A delivery agent has accepted your delivery assignment.",
    });
    return result;
    // return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                              REJECT                                       */
  /* -------------------------------------------------------------------------- */

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
   * The order remains BOOKED.
   */
  async reject(
    id: string,
    deliveryAgentId: string,
    rejectionReason?: string,
  ): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    this.validateAssignmentOwnership(assignment, deliveryAgentId);

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment                                                   */
    /* ---------------------------------------------------------------------- */

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is inactive.");
    }

    if (assignment.status !== DeliveryAssignmentStatus.OFFERED) {
      throw new ValidationError("Only offered assignments can be rejected.");
    }

    /* ---------------------------------------------------------------------- */
    /* Update Current Assignment                                             */
    /* ---------------------------------------------------------------------- */

    const updateData: Partial<IDeliveryAssignment> = {
      status: DeliveryAssignmentStatus.REJECTED,

      rejectedAt: new Date(),

      isActive: false,
    };

    if (rejectionReason !== undefined) {
      updateData.rejectionReason = rejectionReason;
    }

    const updated = await deliveryAssignmentRepository.update(
      assignment._id,
      updateData,
    );

    if (!updated) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Get Order                                                             */
    /* ---------------------------------------------------------------------- */

    const order = await orderRepository.findById(assignment.orderId.toString());

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Get Customer Address                                                  */
    /* ---------------------------------------------------------------------- */

    const addressId =
      order.addressId && typeof order.addressId === "object"
        ? order.addressId._id
        : order.addressId;

    if (!addressId) {
      throw new ValidationError("Order address id is missing.");
    }

    const address = await addressRepository.findById(addressId.toString());

    if (!address) {
      throw new NotFoundError("Customer address not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Location                                                     */
    /* ---------------------------------------------------------------------- */

    const longitude = address.location.coordinates[0];

    const latitude = address.location.coordinates[1];

    if (longitude === undefined || latitude === undefined) {
      throw new ValidationError("Customer address has invalid location.");
    }

    /* ---------------------------------------------------------------------- */
    /* Find Nearby Available Agents                                          */
    /* ---------------------------------------------------------------------- */

    /**
     * 5 km = 5000 meters
     */
    const nearbyAgents =
      await deliveryAgentRepository.findAvailableAgentsNearLocation(
        longitude,
        latitude,
        5000,
      );

    /* ---------------------------------------------------------------------- */
    /* Try Another Agent                                                     */
    /* ---------------------------------------------------------------------- */

    for (const agent of nearbyAgents) {
      /*
       * Do not offer the assignment
       * back to the agent who rejected it.
       */
      if (agent._id.toString() === assignment.deliveryAgentId.toString()) {
        continue;
      }

      try {
        const newAssignment = await this.create(
          assignment.orderId.toString(),
          agent._id.toString(),
          assignment.assignmentType,
        );

        return newAssignment;
      } catch (error) {
        /*
         * Another request may have assigned
         * this agent between our search and
         * assignment creation.
         *
         * Try the next nearest agent.
         */
        if (error instanceof ValidationError) {
          continue;
        }

        throw error;
      }
    }

    /* ---------------------------------------------------------------------- */
    /* No Agent Available                                                     */
    /* ---------------------------------------------------------------------- */

    /**
     * No nearby agent is currently available.
     *
     * The order remains BOOKED.
     *
     * We return the rejected assignment because
     * there is no new assignment to return.
     */
    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                           START DELIVERY                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Delivery agent starts delivery
   *
   * Flow:
   *
   * DELIVERY_ASSIGNED
   *       ↓
   * OUT_FOR_DELIVERY
   */
  async startDelivery(
    id: string,
    deliveryAgentId: string,
  ): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    this.validateAssignmentOwnership(assignment, deliveryAgentId);

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment                                                   */
    /* ---------------------------------------------------------------------- */

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment Type                                              */
    /* ---------------------------------------------------------------------- */

    if (assignment.assignmentType !== DeliveryAssignmentType.DELIVERY) {
      throw new ValidationError(
        "Only delivery assignments can start delivery.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment Status                                            */
    /* ---------------------------------------------------------------------- */

    if (assignment.status !== DeliveryAssignmentStatus.ACCEPTED) {
      throw new ValidationError(
        "Only accepted assignments can start delivery.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Order                                                        */
    /* ---------------------------------------------------------------------- */

    const order = await orderRepository.findById(assignment.orderId.toString());

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    if (order.status !== OrderStatus.DELIVERY_ASSIGNED) {
      throw new ValidationError(
        "Order must be DELIVERY_ASSIGNED before starting delivery.",
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Update Order Status                                                   */
    /* ---------------------------------------------------------------------- */

    const updatedOrder = await orderRepository.updateStatus(
      assignment.orderId.toString(),
      OrderStatus.OUT_FOR_DELIVERY,
    );

    if (!updatedOrder) {
      throw new NotFoundError("Order not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Return Updated Assignment                                             */
    /* ---------------------------------------------------------------------- */

    const updatedAssignment = await deliveryAssignmentRepository.findById(
      assignment._id,
    );

    if (!updatedAssignment) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    await notificationService.create({
      userId: updatedOrder.userId.toString(),
      orderId: updatedOrder._id.toString(),
      type: NotificationType.OUT_FOR_DELIVERY,
      title: "Out for Delivery",
      message: "Your laundry order is now out for delivery.",
    });
    return updatedAssignment;
  }
  /* -------------------------------------------------------------------------- */
  /*                               COMPLETE                                     */
  /* -------------------------------------------------------------------------- */

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
  async complete(
    id: string,
    deliveryAgentId: string,
  ): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    this.validateAssignmentOwnership(assignment, deliveryAgentId);

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment                                                   */
    /* ---------------------------------------------------------------------- */

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /* Assignment Must Be Accepted                                            */
    /* ---------------------------------------------------------------------- */

    if (assignment.status !== DeliveryAssignmentStatus.ACCEPTED) {
      throw new ValidationError("Only accepted assignments can be completed.");
    }

    /* ---------------------------------------------------------------------- */
    /* Get Order                                                             */
    /* ---------------------------------------------------------------------- */

    const order = await orderRepository.findById(assignment.orderId.toString());

    if (!order) {
      throw new NotFoundError("Order not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Determine Next Order Status                                           */
    /* ---------------------------------------------------------------------- */

    let nextOrderStatus: OrderStatus;

    if (assignment.assignmentType === DeliveryAssignmentType.PICKUP) {
      if (order.status !== OrderStatus.OUT_FOR_PICKUP) {
        throw new ValidationError(
          "Order must be OUT_FOR_PICKUP before pickup can be completed.",
        );
      }

      nextOrderStatus = OrderStatus.PICKED_UP;
    } else if (assignment.assignmentType === DeliveryAssignmentType.DELIVERY) {
      if (order.status !== OrderStatus.OUT_FOR_DELIVERY) {
        throw new ValidationError(
          "Order must be OUT_FOR_DELIVERY before delivery can be completed.",
        );
      }

      nextOrderStatus = OrderStatus.DELIVERED;
    } else {
      throw new ValidationError("Invalid delivery assignment type.");
    }

    /* ---------------------------------------------------------------------- */
    /* Update Order                                                          */
    /* ---------------------------------------------------------------------- */

    const updatedOrder = await orderRepository.updateStatus(
      assignment.orderId.toString(),
      nextOrderStatus,
    );

    if (!updatedOrder) {
      throw new NotFoundError("Order not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Complete Assignment                                                   */
    /* ---------------------------------------------------------------------- */

    const completedAssignment = await deliveryAssignmentRepository.update(
      assignment._id,
      {
        status: DeliveryAssignmentStatus.COMPLETED,
        isActive: false,
        completedAt: new Date(),
      },
    );

    if (!completedAssignment) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Make Delivery Agent Available Again                                   */
    /* ---------------------------------------------------------------------- */

    await deliveryAgentRepository.updateStatus(
      assignment.deliveryAgentId,
      DeliveryAgentStatus.AVAILABLE,
    );

    /* ---------------------------------------------------------------------- */
    /* Return Updated Assignment                                             */
    /* ---------------------------------------------------------------------- */

    const updatedAssignment = await deliveryAssignmentRepository.findById(
      assignment._id,
    );

    if (!updatedAssignment) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    await notificationService.create({
      userId: updatedOrder.userId.toString(),
      orderId: updatedOrder._id.toString(),
      type:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? NotificationType.PICKED_UP
          : NotificationType.DELIVERED,
      title:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? "Order Picked Up"
          : "Order Delivered",
      message:
        assignment.assignmentType === DeliveryAssignmentType.PICKUP
          ? "Your laundry order has been picked up."
          : "Your laundry order has been delivered.",
    });
    return updatedAssignment;
  }

  /* -------------------------------------------------------------------------- */
  /*                               CANCEL                                       */
  /* -------------------------------------------------------------------------- */

  /**
   * Cancel delivery assignment
   */
  async cancel(id: string): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is already inactive.");
    }

    if (assignment.status === DeliveryAssignmentStatus.COMPLETED) {
      throw new ValidationError("Completed assignment cannot be cancelled.");
    }

    const updated = await deliveryAssignmentRepository.update(assignment._id, {
      status: DeliveryAssignmentStatus.CANCELLED,

      isActive: false,
    });

    if (!updated) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    /**
     * If the agent was busy with this assignment,
     * make the agent available again.
     */
    const agent = await deliveryAgentRepository.findById(
      assignment.deliveryAgentId,
    );

    if (agent && agent.isActive && agent.status === DeliveryAgentStatus.BUSY) {
      await deliveryAgentRepository.updateStatus(
        agent._id,
        DeliveryAgentStatus.AVAILABLE,
      );
    }

    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                              ADMIN APIs                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all active assignments
   */
  async getAllActive(): Promise<IDeliveryAssignment[]> {
    return deliveryAssignmentRepository.findAllActive();
  }

  /**
   * Get assignments by status
   */
  async getByStatus(
    status: DeliveryAssignmentStatus,
  ): Promise<IDeliveryAssignment[]> {
    if (!Object.values(DeliveryAssignmentStatus).includes(status)) {
      throw new ValidationError("Invalid delivery assignment status.");
    }

    return deliveryAssignmentRepository.findByStatus(status);
  }

  /* -------------------------------------------------------------------------- */
  /*                           START PICKUP                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Delivery agent starts pickup
   *
   * Flow:
   *
   * PICKUP_ASSIGNED
   *       ↓
   * OUT_FOR_PICKUP
   */
  async startPickup(
    id: string,
    deliveryAgentId: string,
  ): Promise<IDeliveryAssignment> {
    const assignment = await this.getAssignmentOrFail(id);

    this.validateAssignmentOwnership(assignment, deliveryAgentId);

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment                                                   */
    /* ---------------------------------------------------------------------- */

    if (!assignment.isActive) {
      throw new ValidationError("Assignment is inactive.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment Type                                              */
    /* ---------------------------------------------------------------------- */

    if (assignment.assignmentType !== DeliveryAssignmentType.PICKUP) {
      throw new ValidationError("Only pickup assignments can start pickup.");
    }

    /* ---------------------------------------------------------------------- */
    /* Validate Assignment Status                                            */
    /* ---------------------------------------------------------------------- */

    if (assignment.status !== DeliveryAssignmentStatus.ACCEPTED) {
      throw new ValidationError("Only accepted assignments can start pickup.");
    }

    /* ---------------------------------------------------------------------- */
    /* Update Order Status                                                   */
    /* ---------------------------------------------------------------------- */

    const updatedOrder = await orderRepository.updateStatus(
      assignment.orderId.toString(),
      OrderStatus.OUT_FOR_PICKUP,
    );

    if (!updatedOrder) {
      throw new NotFoundError("Order not found.");
    }

    /* ---------------------------------------------------------------------- */
    /* Return Updated Assignment                                             */
    /* ---------------------------------------------------------------------- */

    const updatedAssignment = await deliveryAssignmentRepository.findById(
      assignment._id,
    );

    if (!updatedAssignment) {
      throw new NotFoundError("Delivery assignment not found.");
    }

    await notificationService.create({
      userId: updatedOrder.userId.toString(),
      orderId: updatedOrder._id.toString(),
      type: NotificationType.OUT_FOR_PICKUP,
      title: "Out for Pickup",
      message: "Your delivery agent is now on the way to pick up your laundry.",
    });
    return updatedAssignment;
  }
}

export const deliveryAssignmentService = new DeliveryAssignmentService();
