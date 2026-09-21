import { Types } from "mongoose";
import { orderRepository } from "../repositories/order.repostitory.js";
import { addressRepository } from "../../address/repositories/address.repository.js";
import { turnaroundPlanRepository } from "../../turnaroundPlan/repositories/turnaroundPlan.repository.js";
import { laundryServiceRepository } from "../../laundryService/repositories/laundryService.repository.js";
import { pickupSlotRepository } from "../../pickupSlot/repositories/pickupSlot.repository.js";
import { pricingRepository } from "../../pricing/repositories/pricing.repository.js";
import { PricingType } from "../../pricing/constants/pricingType.js";
import { PricingAdjustmentType } from "../../pricing/constants/pricingAdjustmentType.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { PricingStatus } from "../constants/pricingStatus.js";
import { PaymentStatus } from "../constants/paymentStatus.js";
import { SlotStatus } from "../../pickupSlot/constants/slotStatus.js";
import { ValidationError } from "../../../shared/errors/ValidationError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundErrror.js";
import { deliveryAssignmentService } from "../../deliveryAssignment/services/deliveryAssignment.service.js";
import { deliveryAgentRepository } from "../../deliveryAgent/repositories/deliveryAgent.repository.js";
import { DeliveryAssignmentType } from "../../deliveryAssignment/constants/deliveryAssignmentType.js";
import { notificationService } from "../../notification/services/notification.service.js";
import { NotificationType } from "../../notification/constants/notificationType.js";
/* -------------------------------------------------------------------------- */
/*                          Order Status Transitions                         */
/* -------------------------------------------------------------------------- */
const allowedStatusTransitions = {
    [OrderStatus.DRAFT]: [OrderStatus.BOOKED, OrderStatus.CANCELLED],
    [OrderStatus.BOOKED]: [OrderStatus.PICKUP_ASSIGNED, OrderStatus.CANCELLED],
    [OrderStatus.PICKUP_ASSIGNED]: [
        OrderStatus.OUT_FOR_PICKUP,
        OrderStatus.PICKUP_FAILED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.OUT_FOR_PICKUP]: [
        OrderStatus.PICKED_UP,
        OrderStatus.PICKUP_FAILED,
    ],
    [OrderStatus.PICKED_UP]: [OrderStatus.RECEIVED_AT_FACILITY],
    [OrderStatus.RECEIVED_AT_FACILITY]: [OrderStatus.INSPECTION_IN_PROGRESS],
    [OrderStatus.INSPECTION_IN_PROGRESS]: [OrderStatus.PRICE_FINALIZED],
    [OrderStatus.PRICE_FINALIZED]: [OrderStatus.CUSTOMER_APPROVAL_PENDING],
    [OrderStatus.CUSTOMER_APPROVAL_PENDING]: [
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.PROCESSING]: [OrderStatus.QUALITY_CHECK],
    [OrderStatus.QUALITY_CHECK]: [OrderStatus.READY_FOR_DELIVERY],
    [OrderStatus.READY_FOR_DELIVERY]: [OrderStatus.DELIVERY_ASSIGNED],
    [OrderStatus.DELIVERY_ASSIGNED]: [OrderStatus.OUT_FOR_DELIVERY],
    [OrderStatus.OUT_FOR_DELIVERY]: [
        OrderStatus.DELIVERED,
        OrderStatus.DELIVERY_FAILED,
    ],
    [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.PICKUP_FAILED]: [
        OrderStatus.PICKUP_ASSIGNED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.DELIVERY_FAILED]: [
        OrderStatus.DELIVERY_ASSIGNED,
        OrderStatus.CANCELLED,
    ],
    [OrderStatus.ON_HOLD]: [
        OrderStatus.PICKUP_ASSIGNED,
        OrderStatus.PROCESSING,
        OrderStatus.CANCELLED,
    ],
};
/* -------------------------------------------------------------------------- */
/*                        Payment Status Transitions                         */
/* -------------------------------------------------------------------------- */
const allowedPaymentTransitions = {
    [PaymentStatus.PENDING]: [PaymentStatus.PAID, PaymentStatus.FAILED],
    [PaymentStatus.PAID]: [PaymentStatus.REFUNDED],
    [PaymentStatus.REFUNDED]: [],
    [PaymentStatus.FAILED]: [PaymentStatus.PENDING, PaymentStatus.PAID],
};
/* -------------------------------------------------------------------------- */
/*                              Order Service                                 */
/* -------------------------------------------------------------------------- */
class OrderService {
    /* ------------------------------------------------------------------------ */
    /*                              Private Helpers                            */
    /* ------------------------------------------------------------------------ */
    /**
     * Validate MongoDB ObjectId
     */
    validateObjectId(id, fieldName = "id") {
        if (!Types.ObjectId.isValid(id)) {
            throw new ValidationError(`Invalid ${fieldName}.`);
        }
    }
    /**
     * Validate customer pickup location
     *
     * Latitude:
     *   -90 to 90
     *
     * Longitude:
     *   -180 to 180
     */
    validatePickupLocation(pickupLocation) {
        const { latitude, longitude } = pickupLocation;
        if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
            throw new ValidationError("Invalid pickup latitude.");
        }
        if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
            throw new ValidationError("Invalid pickup longitude.");
        }
    }
    /**
     * Find order or throw NotFoundError
     */
    async getOrderOrFail(id) {
        this.validateObjectId(id, "order id");
        const order = await orderRepository.findById(id);
        if (!order) {
            throw new NotFoundError("Order not found.");
        }
        return order;
    }
    /**
     * Validate customer address
     */
    async validateAddress(addressId, userId) {
        this.validateObjectId(addressId, "address id");
        const address = await addressRepository.findById(addressId);
        if (!address) {
            throw new NotFoundError("Address not found.");
        }
        if (!address.isActive) {
            throw new ValidationError("Address is inactive.");
        }
        if (address.userId.toString() !== userId) {
            throw new ValidationError("Address does not belong to this user.");
        }
        return address;
    }
    /**
     * Validate turnaround plan
     */
    async validateTurnaroundPlan(turnaroundPlanId) {
        this.validateObjectId(turnaroundPlanId, "turnaround plan id");
        const turnaroundPlan = await turnaroundPlanRepository.findById(turnaroundPlanId);
        if (!turnaroundPlan) {
            throw new NotFoundError("Turnaround plan not found.");
        }
        if (!turnaroundPlan.isActive) {
            throw new ValidationError("Turnaround plan is inactive.");
        }
        return turnaroundPlan;
    }
    /**
     * Validate selected laundry services
     */
    async validateLaundryServices(laundryServiceIds) {
        if (laundryServiceIds.length === 0) {
            throw new ValidationError("Select at least one laundry service.");
        }
        const services = [];
        for (const serviceId of laundryServiceIds) {
            this.validateObjectId(serviceId, "laundry service id");
            const service = await laundryServiceRepository.findById(serviceId);
            if (!service) {
                throw new NotFoundError(`Laundry service not found: ${serviceId}`);
            }
            if (!service.isActive) {
                throw new ValidationError(`Laundry service "${service.name}" is inactive.`);
            }
            services.push(service);
        }
        return services;
    }
    /**
     * Validate pickup slot
     */
    async validatePickupSlot(pickupSlotId) {
        this.validateObjectId(pickupSlotId, "pickup slot id");
        const slot = await pickupSlotRepository.findById(pickupSlotId);
        if (!slot) {
            throw new NotFoundError("Pickup slot not found.");
        }
        if (!slot.isActive) {
            throw new ValidationError("Pickup slot is inactive.");
        }
        if (slot.status !== SlotStatus.AVAILABLE) {
            throw new ValidationError("Pickup slot is not available.");
        }
        if (slot.bookedCount >= slot.capacity) {
            throw new ValidationError("Pickup slot is full.");
        }
        return slot;
    }
    /**
     * Calculate estimated order price
     */
    async calculateEstimatedPrice(turnaroundPlanId, laundryServiceIds) {
        const turnaroundPlan = await this.validateTurnaroundPlan(turnaroundPlanId);
        const services = await this.validateLaundryServices(laundryServiceIds);
        let total = 0;
        for (const service of services) {
            const pricingRules = await pricingRepository.findByLaundryService(service._id.toString());
            const basePricing = pricingRules.find((rule) => rule.pricingType === PricingType.BASE);
            if (!basePricing) {
                throw new NotFoundError(`Base pricing not found for service "${service.name}".`);
            }
            total += basePricing.amount;
        }
        /*
         * Turnaround price adjustment
         */
        if (turnaroundPlan.adjustmentType === PricingAdjustmentType.FIXED) {
            total += turnaroundPlan.priceAdjustment;
        }
        if (turnaroundPlan.adjustmentType === PricingAdjustmentType.PERCENTAGE) {
            total += (total * turnaroundPlan.priceAdjustment) / 100;
        }
        return total;
    }
    /**
     * Find a nearby available delivery agent
     * and create a pickup assignment.
     *
     * Location source:
     * Customer's booking-time pickup location.
     *
     * Radius:
     * 5 km
     */
    async assignNearbyDeliveryAgent(order) {
        if (!order.pickupLocation) {
            throw new ValidationError("Order does not have a pickup location.");
        }
        const longitude = order.pickupLocation.coordinates[0];
        const latitude = order.pickupLocation.coordinates[1];
        if (longitude === undefined || latitude === undefined) {
            throw new ValidationError("Order has invalid pickup location.");
        }
        /*
         * 5 kilometers = 5000 meters
         */
        const nearbyAgents = await deliveryAgentRepository.findAvailableAgentsNearLocation(longitude, latitude, 5000);
        /*
         * No agent currently available.
         *
         * The order remains BOOKED.
         * Assignment can be attempted later.
         */
        if (nearbyAgents.length === 0) {
            return;
        }
        /*
         * MongoDB $near returns agents
         * from nearest to farthest.
         *
         * Try each available agent.
         *
         * This also protects us against a race condition
         * where another request assigns the nearest agent
         * between our search and assignment creation.
         */
        for (const agent of nearbyAgents) {
            try {
                await deliveryAssignmentService.create(order._id.toString(), agent._id.toString(), DeliveryAssignmentType.PICKUP);
                /*
                 * Assignment successfully created.
                 */
                return;
            }
            catch (error) {
                /*
                 * The agent may have become busy between
                 * the search and assignment creation.
                 *
                 * Try the next nearby agent.
                 */
                if (error instanceof ValidationError) {
                    continue;
                }
                throw error;
            }
        }
        /*
         * All nearby agents became unavailable.
         *
         * Order remains BOOKED.
         */
    }
    /* ------------------------------------------------------------------------ */
    /*                              Customer APIs                               */
    /* ------------------------------------------------------------------------ */
    /**
     * Create Order
     */
    async create(userId, data) {
        // 1. Validate user
        this.validateObjectId(userId, "user id");
        // 2. Validate address
        const address = await this.validateAddress(data.addressId, userId);
        // 3. Validate customer pickup location
        if (!data.pickupLocation) {
            throw new ValidationError("Pickup location is required to create an order.");
        }
        this.validatePickupLocation(data.pickupLocation);
        console.log("CREATE ORDER PICKUP LOCATION:", {
            latitude: data.pickupLocation.latitude,
            longitude: data.pickupLocation.longitude,
        });
        // 4. Validate turnaround plan
        const turnaroundPlan = await this.validateTurnaroundPlan(data.turnaroundPlanId);
        // 5. Validate services
        const services = await this.validateLaundryServices(data.laundryServiceIds);
        // 6. Validate pickup slot
        const pickupSlot = await this.validatePickupSlot(data.pickupSlotId);
        // 7. Calculate price
        const estimatedPrice = await this.calculateEstimatedPrice(data.turnaroundPlanId, data.laundryServiceIds);
        // 8. Reserve pickup slot
        const reservedSlot = await pickupSlotRepository.incrementBookedCount(data.pickupSlotId);
        if (!reservedSlot) {
            throw new ValidationError("Pickup slot is no longer available.");
        }
        let order;
        try {
            // 9. Create order
            order = await orderRepository.create({
                userId: new Types.ObjectId(userId),
                addressId: address._id,
                /**
                 * Customer's location at booking time.
                 *
                 * MongoDB GeoJSON format:
                 * [longitude, latitude]
                 */
                pickupLocation: {
                    type: "Point",
                    coordinates: [
                        data.pickupLocation.longitude,
                        data.pickupLocation.latitude,
                    ],
                },
                turnaroundPlanId: turnaroundPlan._id,
                laundryServiceIds: services.map((service) => service._id),
                pickupDate: pickupSlot.date,
                pickupTimeSlot: `${pickupSlot.startTime} - ${pickupSlot.endTime}`,
                ...(data.detergentPreference !== undefined && {
                    detergentPreference: data.detergentPreference,
                }),
                ...(data.fabricSoftener !== undefined && {
                    fabricSoftener: data.fabricSoftener,
                }),
                ...(data.starchPreference !== undefined && {
                    starchPreference: data.starchPreference,
                }),
                ...(data.foldingPreference !== undefined && {
                    foldingPreference: data.foldingPreference,
                }),
                ...(data.customerNotes !== undefined && {
                    customerNotes: data.customerNotes,
                }),
                estimatedPrice,
                pricingStatus: PricingStatus.ESTIMATED,
                paymentStatus: PaymentStatus.PENDING,
                status: OrderStatus.BOOKED,
                isActive: true,
            });
        }
        catch (error) {
            // Rollback pickup reservation when order creation fails.
            await pickupSlotRepository.decrementBookedCount(data.pickupSlotId);
            throw error;
        }
        /*
         * 10. Try to find and assign a nearby delivery agent.
         *
         * The customer's booking-time location is used as the
         * center of the 5 km search radius.
         *
         * Failure to assign an agent must NOT make the order
         * creation fail. The order remains BOOKED and can be
         * assigned later.
         */
        try {
            await this.assignNearbyDeliveryAgent(order);
        }
        catch (error) {
            console.error("Delivery agent assignment failed after order creation:", error);
        }
        // 11. Return successfully created order.
        return order;
    }
    /**
     * Get logged-in customer's orders
     */
    async getMyOrders(userId) {
        this.validateObjectId(userId, "user id");
        return orderRepository.findByUser(userId);
    }
    /**
     * Get one order belonging to logged-in customer
     */
    async getById(orderId, userId) {
        this.validateObjectId(userId, "user id");
        const order = await this.getOrderOrFail(orderId);
        if (order.userId.toString() !== userId) {
            throw new ValidationError("You are not authorized to view this order.");
        }
        return order;
    }
    /**
     * Cancel customer order
     */
    async cancel(orderId, userId) {
        this.validateObjectId(userId, "user id");
        const order = await this.getOrderOrFail(orderId);
        if (order.userId.toString() !== userId) {
            throw new ValidationError("You are not authorized to cancel this order.");
        }
        if (!order.isActive) {
            throw new ValidationError("Order is already inactive.");
        }
        const cancellableStatuses = [
            OrderStatus.DRAFT,
            OrderStatus.BOOKED,
            OrderStatus.PICKUP_ASSIGNED,
        ];
        if (!cancellableStatuses.includes(order.status)) {
            throw new ValidationError(`Order cannot be cancelled when status is "${order.status}".`);
        }
        const cancelledOrder = await orderRepository.cancel(orderId);
        if (!cancelledOrder) {
            throw new NotFoundError("Order not found.");
        }
        return cancelledOrder;
    }
    /* ------------------------------------------------------------------------ */
    /*                                Admin APIs                                */
    /* ------------------------------------------------------------------------ */
    /**
     * Get all orders
     */
    async getAll() {
        return orderRepository.findAll();
    }
    /**
     * Update order status
     */
    async updateStatus(orderId, status) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update status of an inactive order.");
        }
        const allowedStatuses = allowedStatusTransitions[order.status];
        if (!allowedStatuses.includes(status)) {
            throw new ValidationError(`Invalid status transition: ${order.status} → ${status}.`);
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, status);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        return updatedOrder;
    }
    /**
     * Mark order as received at laundry facility
     *
     * Flow:
     *
     * PICKED_UP
     *     ↓
     * RECEIVED_AT_FACILITY
     */
    async markReceivedAtFacility(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.PICKED_UP) {
            throw new ValidationError("Order must be PICKED_UP before it can be received at the facility.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.RECEIVED_AT_FACILITY);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.RECEIVED_AT_FACILITY,
            title: "Order Received",
            message: "Your laundry order has been received at our facility.",
        });
        return updatedOrder;
    }
    /**
     * Start order inspection
     *
     * Flow:
     *
     * RECEIVED_AT_FACILITY
     *          ↓
     * INSPECTION_IN_PROGRESS
     */
    async startInspection(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.RECEIVED_AT_FACILITY) {
            throw new ValidationError("Order must be RECEIVED_AT_FACILITY before inspection can start.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.INSPECTION_IN_PROGRESS);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.INSPECTION_STARTED,
            title: "Inspection Started",
            message: "Your laundry order is now being inspected.",
        });
        return updatedOrder;
    }
    /**
     * Update final pricing
     *
     * Flow:
     *
     * INSPECTION_IN_PROGRESS
     *          ↓
     *     PRICE_FINALIZED
     */
    async updatePricing(orderId, finalPrice) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.INSPECTION_IN_PROGRESS) {
            throw new ValidationError("Order must be in inspection before pricing can be finalized.");
        }
        if (finalPrice < 0) {
            throw new ValidationError("Final price cannot be negative.");
        }
        const updatedOrder = await orderRepository.update(orderId, {
            finalPrice,
            pricingStatus: PricingStatus.FINALIZED,
            status: OrderStatus.PRICE_FINALIZED,
        });
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.PRICE_FINALIZED,
            title: "Price Finalized",
            message: `The final price for your laundry order is ₹${updatedOrder.finalPrice}.`,
        });
        return updatedOrder;
    }
    /**
     * Request customer approval for finalized price
     *
     * Flow:
     *
     * PRICE_FINALIZED
     *       ↓
     * CUSTOMER_APPROVAL_PENDING
     */
    async requestCustomerApproval(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.PRICE_FINALIZED) {
            throw new ValidationError("Order must be PRICE_FINALIZED before requesting customer approval.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.CUSTOMER_APPROVAL_PENDING);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.CUSTOMER_APPROVAL_REQUIRED,
            title: "Price Approval Required",
            message: "Your laundry order price has been finalized. Please review and approve the price.",
        });
        return updatedOrder;
    }
    /**
     * Customer approves finalized price
     *
     * Flow:
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *       APPROVE
     *          ↓
     *      PROCESSING
     */
    async approvePrice(orderId, userId) {
        this.validateObjectId(orderId, "order id");
        this.validateObjectId(userId, "user id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot approve an inactive order.");
        }
        if (order.userId.toString() !== userId) {
            throw new ValidationError("Order does not belong to this user.");
        }
        if (order.status !== OrderStatus.CUSTOMER_APPROVAL_PENDING) {
            throw new ValidationError("Order is not waiting for customer approval.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.PROCESSING);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.PRICE_APPROVED,
            title: "Price Approved",
            message: "Your order has been approved and processing has started.",
        });
        return updatedOrder;
    }
    /**
     * Customer rejects finalized price
     *
     * Flow:
     *
     * CUSTOMER_APPROVAL_PENDING
     *          ↓
     *        REJECT
     *          ↓
     *        ON_HOLD
     */
    async rejectPrice(orderId, userId) {
        this.validateObjectId(orderId, "order id");
        this.validateObjectId(userId, "user id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot reject an inactive order.");
        }
        if (order.userId.toString() !== userId) {
            throw new ValidationError("Order does not belong to this user.");
        }
        if (order.status !== OrderStatus.CUSTOMER_APPROVAL_PENDING) {
            throw new ValidationError("Order is not waiting for customer approval.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.ON_HOLD);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.PRICE_REJECTED,
            title: "Price Rejected",
            message: "The finalized price was rejected. Your order has been placed on hold.",
        });
        return updatedOrder;
    }
    /**
     * Start quality check
     *
     * PROCESSING
     *     ↓
     * QUALITY_CHECK
     */
    async startQualityCheck(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.PROCESSING) {
            throw new ValidationError("Order must be PROCESSING before quality check can start.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.QUALITY_CHECK);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.QUALITY_CHECK_STARTED,
            title: "Quality Check Started",
            message: "Your laundry order is now undergoing quality checking.",
        });
        return updatedOrder;
    }
    /**
     * Complete quality check
     *
     * QUALITY_CHECK
     *      ↓
     * READY_FOR_DELIVERY
     */
    async completeQualityCheck(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update an inactive order.");
        }
        if (order.status !== OrderStatus.QUALITY_CHECK) {
            throw new ValidationError("Order must be in QUALITY_CHECK before it can be marked ready for delivery.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.READY_FOR_DELIVERY);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.READY_FOR_DELIVERY,
            title: "Order Ready",
            message: "Your laundry order is ready for delivery.",
        });
        return updatedOrder;
    }
    /**
     * Complete order
     *
     * DELIVERED
     *     ↓
     * COMPLETED
     */
    async completeOrder(orderId) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot complete an inactive order.");
        }
        if (order.status !== OrderStatus.DELIVERED) {
            throw new ValidationError("Order must be DELIVERED before it can be completed.");
        }
        const updatedOrder = await orderRepository.updateStatus(orderId, OrderStatus.COMPLETED);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        await notificationService.create({
            userId: updatedOrder.userId.toString(),
            orderId: updatedOrder._id.toString(),
            type: NotificationType.ORDER_COMPLETED,
            title: "Order Completed",
            message: "Your laundry order has been completed successfully.",
        });
        return updatedOrder;
    }
    /**
     * Update payment status
     */
    async updatePaymentStatus(orderId, paymentStatus) {
        this.validateObjectId(orderId, "order id");
        const order = await this.getOrderOrFail(orderId);
        if (!order.isActive) {
            throw new ValidationError("Cannot update payment status of an inactive order.");
        }
        const allowedStatuses = allowedPaymentTransitions[order.paymentStatus];
        if (!allowedStatuses.includes(paymentStatus)) {
            throw new ValidationError(`Invalid payment status transition: ${order.paymentStatus} → ${paymentStatus}.`);
        }
        const updatedOrder = await orderRepository.updatePaymentStatus(orderId, paymentStatus);
        if (!updatedOrder) {
            throw new NotFoundError("Order not found.");
        }
        return updatedOrder;
    }
}
export const orderService = new OrderService();
//# sourceMappingURL=order.service.js.map