import { Types } from "mongoose";

import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";

import type { IDeliveryAssignment } from "../interfaces/IDeliveryAssignment.js";

import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";

class DeliveryAssignmentRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a delivery assignment.
   */
  async create(
    data: Partial<IDeliveryAssignment>,
  ): Promise<IDeliveryAssignment> {
    return DeliveryAssignment.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                FIND BY ID                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find assignment by ID.
   *
   * Used internally by service/business logic.
   */
  async findById(
    id: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findById(id);
  }

  /**
   * Find assignment by ID with populated references.
   *
   * Used for detailed API responses.
   */
  async findByIdPopulated(
    id: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findById(id)
      .populate("orderId")
      .populate("deliveryAgentId");
  }

  /* -------------------------------------------------------------------------- */
  /*                            FIND BY ORDER ID                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all assignments for an order.
   */
  async findByOrderId(
    orderId: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment[]> {
    return DeliveryAssignment.find({
      orderId,
    })
      .populate("deliveryAgentId")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                       FIND ACTIVE BY ORDER ID                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Find the active assignment for an order.
   */
  async findActiveByOrderId(
    orderId: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findOne({
      orderId,
      isActive: true,
    })
      .populate("orderId")
      .populate("deliveryAgentId");
  }

  /* -------------------------------------------------------------------------- */
  /*                           FIND BY AGENT ID                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all assignments for a delivery agent.
   *
   * The order's address is populated because the delivery dashboard
   * needs the customer's location for pickup/delivery information.
   */
  async findByAgentId(
    deliveryAgentId: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment[]> {
    return DeliveryAssignment.find({
      deliveryAgentId,
    })
      .populate({
        path: "orderId",
        populate: {
          path: "addressId",
        },
      })
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                     FIND ACTIVE BY AGENT ID                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Find active assignment for a delivery agent.
   */
  async findActiveByAgentId(
    deliveryAgentId: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findOne({
      deliveryAgentId,
      isActive: true,
    })
      .populate("orderId")
      .populate("deliveryAgentId");
  }

  /* -------------------------------------------------------------------------- */
  /*                              FIND BY STATUS                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Find assignments by status.
   */
  async findByStatus(
    status: DeliveryAssignmentStatus,
  ): Promise<IDeliveryAssignment[]> {
    return DeliveryAssignment.find({
      status,
    })
      .populate("orderId")
      .populate("deliveryAgentId")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                                FIND ACTIVE                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all active assignments.
   */
  async findAllActive(): Promise<IDeliveryAssignment[]> {
    return DeliveryAssignment.find({
      isActive: true,
    })
      .populate("orderId")
      .populate("deliveryAgentId")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Update assignment.
   */
  async update(
    id: string | Types.ObjectId,
    data: Partial<IDeliveryAssignment>,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            UPDATE STATUS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Update assignment status.
   */
  async updateStatus(
    id: string | Types.ObjectId,
    status: DeliveryAssignmentStatus,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                 ACTIVATE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Activate assignment.
   */
  async activate(
    id: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: true,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              UNSET FIELDS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Remove fields from an assignment document.
   *
   * Useful when rolling back an accepted assignment and
   * removing timestamps such as acceptedAt.
   */
  async unsetFields(
    id: string | Types.ObjectId,
    fields: string[],
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findByIdAndUpdate(
      id,
      {
        $unset: fields.reduce<Record<string, 1>>((acc, field) => {
          acc[field] = 1;
          return acc;
        }, {}),
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                DEACTIVATE                                */
  /* -------------------------------------------------------------------------- */

  /**
   * Deactivate assignment.
   */
  async deactivate(
    id: string | Types.ObjectId,
  ): Promise<IDeliveryAssignment | null> {
    return DeliveryAssignment.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                       FIND AVAILABLE NEAR LOCATION                         */
  /* -------------------------------------------------------------------------- */

  /**
   * This repository is intentionally focused on assignment persistence.
   *
   * Nearby-agent lookup belongs to DeliveryAgentRepository because the
   * geospatial query is performed against DeliveryAgent.currentLocation.
   *
   * DeliveryAssignmentService calls:
   * deliveryAgentRepository.findAvailableAgentsNearLocation(...)
   */
}

export const deliveryAssignmentRepository = new DeliveryAssignmentRepository();
