import mongoose from "mongoose";
import { adminRepository } from "../repositories/admin.repository.js";
import { deliveryAgentRepository } from "../../deliveryAgent/repositories/deliveryAgent.repository.js";
import { UserRole } from "../../auth/constants/roles.js";
import { DeliveryAgentStatus } from "../../deliveryAgent/constants/deliveryAgentStatus.js";
class AdminService {
    /*
     * --------------------------------------------------------------------------
     * Admin Dashboard
     * --------------------------------------------------------------------------
     */
    async getDashboard() {
        return adminRepository.getDashboard();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Users
     * --------------------------------------------------------------------------
     */
    async getUsers(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findUsers({
            ...query,
            page,
            limit,
        });
        return {
            users: result.users,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getUserById(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID.");
        }
        const user = await adminRepository.findUserById(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        return user;
    }
    async updateUser(userId, data) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID.");
        }
        /*
         * Get the existing user first.
         *
         * We need the previous role so we can detect:
         *
         * USER → DELIVERY_AGENT
         *
         * or
         *
         * DELIVERY_AGENT → another role
         */
        const existingUser = await adminRepository.findUserById(userId);
        if (!existingUser) {
            throw new Error("User not found.");
        }
        const previousRole = existingUser.role;
        /*
         * Update the User document.
         */
        const user = await adminRepository.updateUser(userId, data);
        if (!user) {
            throw new Error("User not found.");
        }
        /*
         * ------------------------------------------------------------------------
         * USER → DELIVERY_AGENT
         * ------------------------------------------------------------------------
         *
         * Create a DeliveryAgent profile if one doesn't already exist.
         */
        if (data.role === UserRole.DELIVERY_AGENT &&
            previousRole !== UserRole.DELIVERY_AGENT) {
            const existingDeliveryAgent = await deliveryAgentRepository.findByUserId(userId);
            if (!existingDeliveryAgent) {
                if (!user.phoneNumber) {
                    throw new Error("A phone number is required before promoting the user to a delivery agent.");
                }
                await deliveryAgentRepository.create({
                    userId: new mongoose.Types.ObjectId(userId),
                    phoneNumber: user.phoneNumber,
                    status: DeliveryAgentStatus.OFFLINE,
                    isActive: true,
                    /*
                     * Initial placeholder location.
                     *
                     * The delivery agent's real browser/device location
                     * will replace this when location tracking starts.
                     */
                    currentLocation: {
                        type: "Point",
                        coordinates: [0, 0],
                    },
                });
            }
            else {
                /*
                 * If an old DeliveryAgent record already exists,
                 * reactivate it instead of creating a duplicate.
                 */
                await deliveryAgentRepository.activate(existingDeliveryAgent._id);
            }
        }
        /*
         * ------------------------------------------------------------------------
         * DELIVERY_AGENT → OTHER ROLE
         * ------------------------------------------------------------------------
         *
         * Don't delete the DeliveryAgent record because assignments/history
         * may reference it.
         *
         * Instead, deactivate it.
         */
        if (previousRole === UserRole.DELIVERY_AGENT &&
            data.role &&
            data.role !== UserRole.DELIVERY_AGENT) {
            const existingDeliveryAgent = await deliveryAgentRepository.findByUserId(userId);
            if (existingDeliveryAgent) {
                await deliveryAgentRepository.deactivate(existingDeliveryAgent._id);
            }
        }
        return user;
    }
    async activateUser(userId) {
        return this.updateUser(userId, {
            accountStatus: "ACTIVE",
        });
    }
    async deactivateUser(userId) {
        return this.updateUser(userId, {
            accountStatus: "SUSPENDED",
        });
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Orders
     * --------------------------------------------------------------------------
     */
    async getOrders(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findOrders({
            ...query,
            page,
            limit,
        });
        return {
            orders: result.orders,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getOrderById(orderId) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            throw new Error("Invalid order ID.");
        }
        const order = await adminRepository.findOrderById(orderId);
        if (!order) {
            throw new Error("Order not found.");
        }
        return order;
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Delivery Agents
     * --------------------------------------------------------------------------
     */
    async getDeliveryAgents(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findDeliveryAgents({
            ...query,
            page,
            limit,
        });
        return {
            deliveryAgents: result.deliveryAgents,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getDeliveryAgentById(deliveryAgentId) {
        if (!mongoose.Types.ObjectId.isValid(deliveryAgentId)) {
            throw new Error("Invalid delivery agent ID.");
        }
        const deliveryAgent = await adminRepository.findDeliveryAgentById(deliveryAgentId);
        if (!deliveryAgent) {
            throw new Error("Delivery agent not found.");
        }
        return deliveryAgent;
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Assignments
     * --------------------------------------------------------------------------
     */
    async getAssignments(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findAssignments({
            ...query,
            page,
            limit,
        });
        return {
            assignments: result.assignments,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getAssignmentById(assignmentId) {
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            throw new Error("Invalid assignment ID.");
        }
        const assignment = await adminRepository.findAssignmentById(assignmentId);
        if (!assignment) {
            throw new Error("Assignment not found.");
        }
        return assignment;
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Notifications
     * --------------------------------------------------------------------------
     */
    async getNotifications(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findNotifications({
            ...query,
            page,
            limit,
        });
        return {
            notifications: result.notifications,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getNotificationById(notificationId) {
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            throw new Error("Invalid notification ID.");
        }
        const notification = await adminRepository.findNotificationById(notificationId);
        if (!notification) {
            throw new Error("Notification not found.");
        }
        return notification;
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Payments
     * --------------------------------------------------------------------------
     */
    async getPayments(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
        const result = await adminRepository.findPayments({
            ...query,
            page,
            limit,
        });
        return {
            payments: result.payments,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        };
    }
    async getPaymentById(paymentId) {
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            throw new Error("Invalid payment ID.");
        }
        const payment = await adminRepository.findPaymentById(paymentId);
        if (!payment) {
            throw new Error("Payment not found.");
        }
        return payment;
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Reports
     * --------------------------------------------------------------------------
     */
    async getOverviewReport() {
        return adminRepository.getOverviewReport();
    }
    async getOrderStatistics() {
        return adminRepository.getOrderStatistics();
    }
    async getRevenueStatistics(startDate, endDate) {
        return adminRepository.getRevenueStatistics(startDate, endDate);
    }
    async getPaymentStatistics(startDate, endDate) {
        return adminRepository.getPaymentStatistics(startDate, endDate);
    }
}
export const adminService = new AdminService();
//# sourceMappingURL=admin.service.js.map