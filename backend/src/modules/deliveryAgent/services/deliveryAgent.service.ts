import { Types } from "mongoose";

import { deliveryAgentRepository } from "../repositories/deliveryAgent.repository.js";

import { userRepository } from "../../user/repositories/user.repository.js";

import type { IDeliveryAgent } from "../interfaces/IDeliveryAgent.js";

import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";
import { UserRole } from "../../auth/constants/roles.js";

import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";

import { hashPassword } from "../../auth/utils/hash.js";

class DeliveryAgentService {
  /* -------------------------------------------------------------------------- */
  /*                              Private Helpers                              */
  /* -------------------------------------------------------------------------- */

  /**
   * Validate MongoDB ObjectId
   */
  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid delivery agent id.");
    }
  }

  /**
   * Get delivery agent or throw error
   */
  private async getAgentOrFail(id: string): Promise<IDeliveryAgent> {
    this.validateObjectId(id);

    const agent = await deliveryAgentRepository.findById(id);

    if (!agent) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return agent;
  }

  /**
   * Validate user and make sure
   * the user has DELIVERY_AGENT role.
   */
  private async validateDeliveryAgentUser(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (user.role !== UserRole.DELIVERY_AGENT) {
      throw new ValidationError("User is not a delivery agent.");
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  CREATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Create delivery agent
   *
   * Admin creates:
   *
   * 1. User account
   * 2. DeliveryAgent profile
   */
  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
  }): Promise<IDeliveryAgent> {
    /* ---------------------------------------------------------------------- */
    /*                         Validate email                                 */
    /* ---------------------------------------------------------------------- */

    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ValidationError("Email already exists.");
    }

    /* ---------------------------------------------------------------------- */
    /*                         Hash password                                  */
    /* ---------------------------------------------------------------------- */

    const hashedPassword = await hashPassword(data.password);

    /* ---------------------------------------------------------------------- */
    /*                           Create User                                  */
    /* ---------------------------------------------------------------------- */

    const user = await userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,

      role: UserRole.DELIVERY_AGENT,

      isEmailVerified: false,

      accountStatus: "ACTIVE",
    });

    /* ---------------------------------------------------------------------- */
    /*                     Create Delivery Agent                              */
    /* ---------------------------------------------------------------------- */

    const agentData: Partial<IDeliveryAgent> = {
      userId: user._id,

      phoneNumber: data.phoneNumber,

      status: DeliveryAgentStatus.OFFLINE,

      isActive: true,

      currentLocation: {
        type: "Point",
        coordinates: [data.longitude, data.latitude],
      },
    };

    const agent = await deliveryAgentRepository.create(agentData);

    return agent;
  }
  /* -------------------------------------------------------------------------- */
  /*                         DELIVERY AGENT APIs                               */
  /* -------------------------------------------------------------------------- */

  /**
   * Get delivery agent by ID
   */
  async getById(id: string): Promise<IDeliveryAgent> {
    return this.getAgentOrFail(id);
  }

  /**
   * Get logged-in delivery agent profile
   */
  async getMyProfile(userId: string): Promise<IDeliveryAgent> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    const agent = await deliveryAgentRepository.findByUserId(userId);

    if (!agent) {
      throw new NotFoundError("Delivery agent profile not found.");
    }

    return agent;
  }

  /* -------------------------------------------------------------------------- */
  /*                                ADMIN APIs                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Get all delivery agents
   */
  async getAll(): Promise<IDeliveryAgent[]> {
    return deliveryAgentRepository.findAll();
  }

  /**
   * Get all active delivery agents
   */
  async getAllActive(): Promise<IDeliveryAgent[]> {
    return deliveryAgentRepository.findAllActive();
  }

  /**
   * Get all available delivery agents
   */
  async getAvailableAgents(): Promise<IDeliveryAgent[]> {
    return deliveryAgentRepository.findAvailableAgents();
  }

  /* -------------------------------------------------------------------------- */
  /*                                STATUS                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent status
   */
  async updateStatus(
    id: string,
    status: DeliveryAgentStatus,
  ): Promise<IDeliveryAgent> {
    const agent = await this.getAgentOrFail(id);

    // Validate status
    if (!Object.values(DeliveryAgentStatus).includes(status)) {
      throw new ValidationError("Invalid delivery agent status.");
    }

    // Inactive agents cannot become
    // available, busy, or offline.
    if (!agent.isActive && status !== DeliveryAgentStatus.INACTIVE) {
      throw new ValidationError(
        "Inactive delivery agent cannot change status.",
      );
    }

    const updated = await deliveryAgentRepository.updateStatus(id, status);

    if (!updated) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                              LOCATION                                      */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent location
   */
  async updateLocation(
    userId: string,
    longitude: number,
    latitude: number,
  ): Promise<IDeliveryAgent> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError("Invalid user id.");
    }

    // Validate longitude
    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
      throw new ValidationError("Longitude must be between -180 and 180.");
    }

    // Validate latitude
    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
      throw new ValidationError("Latitude must be between -90 and 90.");
    }

    // Find agent
    const agent = await deliveryAgentRepository.findByUserId(userId);

    if (!agent) {
      throw new NotFoundError("Delivery agent profile not found.");
    }

    // Check active status
    if (!agent.isActive) {
      throw new ValidationError(
        "Inactive delivery agent cannot update location.",
      );
    }

    // Update location
    const updated = await deliveryAgentRepository.updateLocation(
      agent._id,
      longitude,
      latitude,
    );

    if (!updated) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                            NEARBY AGENTS                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Find available delivery agents near a location
   *
   * Default radius = 5 km
   */
  async findNearbyAgents(
    longitude: number,
    latitude: number,
    radiusInMeters = 5000,
  ): Promise<IDeliveryAgent[]> {
    // Validate longitude
    if (typeof longitude !== "number" || longitude < -180 || longitude > 180) {
      throw new ValidationError("Longitude must be between -180 and 180.");
    }

    // Validate latitude
    if (typeof latitude !== "number" || latitude < -90 || latitude > 90) {
      throw new ValidationError("Latitude must be between -90 and 90.");
    }

    // Validate radius
    if (typeof radiusInMeters !== "number" || radiusInMeters <= 0) {
      throw new ValidationError("Radius must be greater than zero.");
    }

    return deliveryAgentRepository.findAvailableAgentsNearLocation(
      longitude,
      latitude,
      radiusInMeters,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                UPDATE                                     */
  /* -------------------------------------------------------------------------- */

  /**
   * Update delivery agent profile
   */
  async update(
    id: string,
    data: Partial<IDeliveryAgent>,
  ): Promise<IDeliveryAgent> {
    const agent = await this.getAgentOrFail(id);

    // User cannot be changed
    if (data.userId) {
      throw new ValidationError("User cannot be changed.");
    }

    // Update profile
    const updated = await deliveryAgentRepository.update(agent._id, data);

    if (!updated) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                               ACTIVATE                                    */
  /* -------------------------------------------------------------------------- */

  /**
   * Activate delivery agent
   */
  async activate(id: string): Promise<IDeliveryAgent> {
    const agent = await this.getAgentOrFail(id);

    if (agent.isActive) {
      throw new ValidationError("Delivery agent is already active.");
    }

    const updated = await deliveryAgentRepository.activate(id);

    if (!updated) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return updated;
  }

  /* -------------------------------------------------------------------------- */
  /*                              DEACTIVATE                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Deactivate delivery agent
   */
  async deactivate(id: string): Promise<IDeliveryAgent> {
    const agent = await this.getAgentOrFail(id);

    if (!agent.isActive) {
      throw new ValidationError("Delivery agent is already inactive.");
    }

    const updated = await deliveryAgentRepository.deactivate(id);

    if (!updated) {
      throw new NotFoundError("Delivery agent not found.");
    }

    return updated;
  }
}

export const deliveryAgentService = new DeliveryAgentService();
