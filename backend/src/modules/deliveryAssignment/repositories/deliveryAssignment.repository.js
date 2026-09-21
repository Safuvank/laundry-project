import { Types } from "mongoose";
import { DeliveryAssignment } from "../models/deliveryAssignment.model.js";
import { DeliveryAssignmentStatus } from "../constants/deliveryAssignmentStatus.js";
class DeliveryAssignmentRepository {
    /* -------------------------------------------------------------------------- */
    /*                                  CREATE                                    */
    /* -------------------------------------------------------------------------- */
    /**
     * Create a delivery assignment.
     */
    async create(data) {
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
    async findById(id) {
        return DeliveryAssignment.findById(id);
    }
    /**
     * Find assignment by ID with populated references.
     *
     * Used for detailed API responses.
     */
    async findByIdPopulated(id) {
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
    async findByOrderId(orderId) {
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
    async findActiveByOrderId(orderId) {
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
    async findByAgentId(deliveryAgentId) {
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
    async findActiveByAgentId(deliveryAgentId) {
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
    async findByStatus(status) {
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
    async findAllActive() {
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
    async update(id, data) {
        return DeliveryAssignment.findByIdAndUpdate(id, {
            $set: data,
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                            UPDATE STATUS                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Update assignment status.
     */
    async updateStatus(id, status) {
        return DeliveryAssignment.findByIdAndUpdate(id, {
            $set: {
                status,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                                 ACTIVATE                                  */
    /* -------------------------------------------------------------------------- */
    /**
     * Activate assignment.
     */
    async activate(id) {
        return DeliveryAssignment.findByIdAndUpdate(id, {
            $set: {
                isActive: true,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
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
    async unsetFields(id, fields) {
        return DeliveryAssignment.findByIdAndUpdate(id, {
            $unset: fields.reduce((acc, field) => {
                acc[field] = 1;
                return acc;
            }, {}),
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
    /* -------------------------------------------------------------------------- */
    /*                                DEACTIVATE                                */
    /* -------------------------------------------------------------------------- */
    /**
     * Deactivate assignment.
     */
    async deactivate(id) {
        return DeliveryAssignment.findByIdAndUpdate(id, {
            $set: {
                isActive: false,
            },
        }, {
            returnDocument: "after",
            runValidators: true,
        });
    }
}
export const deliveryAssignmentRepository = new DeliveryAssignmentRepository();
//# sourceMappingURL=deliveryAssignment.repository.js.map