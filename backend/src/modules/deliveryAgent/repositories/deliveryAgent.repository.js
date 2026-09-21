import { Types } from "mongoose";
import { DeliveryAgent } from "../models/deliveryAgent.model.js";
import { DeliveryAgentStatus } from "../constants/deliveryAgentStatus.js";
class DeliveryAgentRepository {
    /* -------------------------------------------------------------------------- */
    /*                                  CREATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Create a delivery agent profile
     */
    async create(data) {
        return DeliveryAgent.create(data);
    }
    /* -------------------------------------------------------------------------- */
    /*                               FIND BY ID                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Find delivery agent by ID
     */
    async findById(id) {
        return DeliveryAgent.findById(id).populate("userId", "-password");
    }
    /* -------------------------------------------------------------------------- */
    /*                            FIND BY USER ID                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Find delivery agent by User ID
     */
    async findByUserId(userId) {
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
    async findAll() {
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
    async findAllActive() {
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
    async findAvailableAgents() {
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
     *
     * Coordinates must be:
     * [longitude, latitude]
     */
    async findAvailableAgentsNearLocation(longitude, latitude, radiusInMeters) {
        console.log("==============================================");
        console.log("🔎 NEARBY DELIVERY AGENT SEARCH");
        console.log("==============================================");
        console.log("Search longitude:", longitude);
        console.log("Search latitude:", latitude);
        console.log("Search radius:", radiusInMeters, "meters");
        const agents = await DeliveryAgent.find({
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
        console.log("🚚 Nearby available agents found:", agents.length);
        if (agents.length > 0) {
            console.log("🚚 Nearby agents:", agents.map((agent) => ({
                id: agent._id.toString(),
                userId: agent.userId,
                status: agent.status,
                isActive: agent.isActive,
                currentLocation: agent.currentLocation,
            })));
        }
        else {
            console.log("❌ No available delivery agents found within radius.");
            console.log("Expected conditions:");
            console.log("  isActive =", true);
            console.log("  status =", DeliveryAgentStatus.AVAILABLE);
            console.log("  radius =", radiusInMeters, "meters");
        }
        console.log("==============================================");
        return agents;
    }
    /* -------------------------------------------------------------------------- */
    /*                                  UPDATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent
     */
    async update(id, data) {
        return DeliveryAgent.findByIdAndUpdate(id, {
            $set: data,
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                              UPDATE STATUS                                 */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent status
     */
    async updateStatus(id, status) {
        return DeliveryAgent.findByIdAndUpdate(id, {
            $set: {
                status,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                             UPDATE LOCATION                               */
    /* -------------------------------------------------------------------------- */
    /**
     * Update delivery agent current location
     */
    async updateLocation(id, longitude, latitude) {
        return DeliveryAgent.findByIdAndUpdate(id, {
            $set: {
                currentLocation: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                },
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                                ACTIVATE                                   */
    /* -------------------------------------------------------------------------- */
    /**
     * Activate delivery agent
     */
    async activate(id) {
        return DeliveryAgent.findByIdAndUpdate(id, {
            $set: {
                isActive: true,
                status: DeliveryAgentStatus.OFFLINE,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                               DEACTIVATE                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Deactivate delivery agent
     */
    async deactivate(id) {
        return DeliveryAgent.findByIdAndUpdate(id, {
            $set: {
                isActive: false,
                status: DeliveryAgentStatus.INACTIVE,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
}
export const deliveryAgentRepository = new DeliveryAgentRepository();
//# sourceMappingURL=deliveryAgent.repository.js.map