import { Types } from "mongoose";

import { DeliveryAgent } from "../models/deliveryAgent.model.js";

import type { IDeliveryAgent } from "../interfaces/IDeliveryAgent.js";

import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";

class DeliveryAgentRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create a delivery agent profile
   */
  async create(data: Partial<IDeliveryAgent>): Promise<IDeliveryAgent> {
    return DeliveryAgent.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                               FIND BY ID                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Find delivery agent by ID
   */
  async findById(id: string | Types.ObjectId): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findById(id).populate("userId", "-password");
  }

  /* -------------------------------------------------------------------------- */
  /*                            FIND BY USER ID                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Find delivery agent by User ID
   */
  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findOne({
      userId,
    }).populate("userId", "-password");
  }
  /* -------------------------------------------------------------------------- */
  /*                                FIND ALL                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all delivery agents
   */
  async findAll(): Promise<IDeliveryAgent[]> {
    return DeliveryAgent.find().populate("userId", "-password").sort({
      createdAt: -1,
    });
  }
  /* -------------------------------------------------------------------------- */
  /*                           FIND ALL ACTIVE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find all active delivery agents
   */
  async findAllActive(): Promise<IDeliveryAgent[]> {
    return DeliveryAgent.find({
      isActive: true,
    })
      .populate("userId", "-password")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                         FIND AVAILABLE AGENTS                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Find agents who are:
   *
   * 1. Active
   * 2. Available
   */
  async findAvailableAgents(): Promise<IDeliveryAgent[]> {
    return DeliveryAgent.find({
      isActive: true,
      status: DeliveryAgentStatus.AVAILABLE,
    })
      .populate("userId", "-password")
      .sort({
        createdAt: -1,
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                    FIND AVAILABLE AGENTS NEAR LOCATION                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Find available agents within a given radius.
   *
   * MongoDB uses meters for $maxDistance.
   *
   * Example:
   * 5 km = 5000 meters
   */
  async findAvailableAgentsNearLocation(
    longitude: number,
    latitude: number,
    radiusInMeters: number,
  ): Promise<IDeliveryAgent[]> {
    return DeliveryAgent.find({
      isActive: true,

      status: DeliveryAgentStatus.AVAILABLE,

      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    }).populate("userId", "-password");
  }

  /* -------------------------------------------------------------------------- */
  /*                                  UPDATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent
   */
  async update(
    id: string | Types.ObjectId,
    data: Partial<IDeliveryAgent>,
  ): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findByIdAndUpdate(
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
  /*                              UPDATE STATUS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent status
   */
  async updateStatus(
    id: string | Types.ObjectId,
    status: DeliveryAgentStatus,
  ): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findByIdAndUpdate(
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
  /*                             UPDATE LOCATION                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent current location
   */
  async updateLocation(
    id: string | Types.ObjectId,
    longitude: number,
    latitude: number,
  ): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findByIdAndUpdate(
      id,
      {
        $set: {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                ACTIVATE                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Activate delivery agent
   */
  async activate(id: string | Types.ObjectId): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: true,
          status: DeliveryAgentStatus.OFFLINE,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                               DEACTIVATE                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Deactivate delivery agent
   */
  async deactivate(
    id: string | Types.ObjectId,
  ): Promise<IDeliveryAgent | null> {
    return DeliveryAgent.findByIdAndUpdate(
      id,
      {
        $set: {
          isActive: false,
          status: DeliveryAgentStatus.INACTIVE,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  }
}

export const deliveryAgentRepository = new DeliveryAgentRepository();
