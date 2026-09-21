import mongoose from "mongoose";
import { User } from "../../auth/models/user.model.js";
import { Order } from "../../order/models/order.model.js";
import { Payment } from "../../payment/models/payment.model.js";
import { DeliveryAgent } from "../../deliveryAgent/models/deliveryAgent.model.js";
import { DeliveryAssignment } from "../../deliveryAssignment/models/deliveryAssignment.model.js";
import { OrderStatus } from "../../order/constants/orderStatus.js";
import { PaymentStatus } from "../../order/constants/paymentStatus.js";
import { DeliveryAgentStatus } from "../../deliveryAgent/constants/deliveryAgentStatus.js";
import { DeliveryAssignmentStatus } from "../../deliveryAssignment/constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../../deliveryAssignment/constants/deliveryAssignmentType.js";
import { Notification } from "../../notification/models/notification.model.js";
class AdminRepository {
    /*
     * --------------------------------------------------------------------------
     * Admin Dashboard
     * --------------------------------------------------------------------------
     */
    async getDashboard() {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        /*
         * Pending order statuses
         *
         * Orders that are still somewhere in the workflow and
         * have not been completed or cancelled.
         */
        const pendingStatuses = [
            OrderStatus.BOOKED,
            OrderStatus.PICKUP_ASSIGNED,
            OrderStatus.OUT_FOR_PICKUP,
            OrderStatus.PICKED_UP,
            OrderStatus.RECEIVED_AT_FACILITY,
            OrderStatus.INSPECTION_IN_PROGRESS,
            OrderStatus.PRICE_FINALIZED,
            OrderStatus.CUSTOMER_APPROVAL_PENDING,
            OrderStatus.PROCESSING,
            OrderStatus.QUALITY_CHECK,
            OrderStatus.READY_FOR_DELIVERY,
            OrderStatus.DELIVERY_ASSIGNED,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
            OrderStatus.ON_HOLD,
        ];
        /*
         * Run independent database queries in parallel.
         */
        const [totalOrders, todayOrders, pendingOrders, completedOrders, cancelledOrders, activePickups, activeDeliveries, totalAgents, availableAgents, totalRevenueResult, todayRevenueResult,] = await Promise.all([
            /*
             * Total active orders
             */
            Order.countDocuments({
                isActive: true,
            }),
            /*
             * Today's orders
             */
            Order.countDocuments({
                isActive: true,
                createdAt: {
                    $gte: startOfToday,
                    $lte: endOfToday,
                },
            }),
            /*
             * Pending orders
             */
            Order.countDocuments({
                isActive: true,
                status: {
                    $in: pendingStatuses,
                },
            }),
            /*
             * Completed orders
             */
            Order.countDocuments({
                isActive: true,
                status: OrderStatus.COMPLETED,
            }),
            /*
             * Cancelled orders
             */
            Order.countDocuments({
                isActive: true,
                status: OrderStatus.CANCELLED,
            }),
            /*
             * Active pickup assignments
             */
            DeliveryAssignment.countDocuments({
                assignmentType: DeliveryAssignmentType.PICKUP,
                status: {
                    $in: [
                        DeliveryAssignmentStatus.IN_PROGRESS,
                        DeliveryAssignmentStatus.OFFERED,
                        DeliveryAssignmentStatus.ACCEPTED,
                    ],
                },
                isActive: true,
            }),
            /*
             * Active delivery assignments
             */
            DeliveryAssignment.countDocuments({
                assignmentType: DeliveryAssignmentType.DELIVERY,
                status: {
                    $in: [
                        DeliveryAssignmentStatus.IN_PROGRESS,
                        DeliveryAssignmentStatus.OFFERED,
                        DeliveryAssignmentStatus.ACCEPTED,
                    ],
                },
                isActive: true,
            }),
            /*
             * Total active delivery agents
             */
            DeliveryAgent.countDocuments({
                isActive: true,
            }),
            /*
             * Currently available agents
             */
            DeliveryAgent.countDocuments({
                isActive: true,
                status: DeliveryAgentStatus.AVAILABLE,
            }),
            /*
             * Total successful revenue
             */
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.PAID,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            /*
             * Today's successful revenue
             */
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.PAID,
                        paidAt: {
                            $gte: startOfToday,
                            $lte: endOfToday,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
        ]);
        return {
            orders: {
                total: totalOrders,
                today: todayOrders,
                pending: pendingOrders,
                completed: completedOrders,
                cancelled: cancelledOrders,
            },
            deliveries: {
                activePickups,
                activeDeliveries,
            },
            agents: {
                total: totalAgents,
                available: availableAgents,
            },
            revenue: {
                total: totalRevenueResult[0]?.total ?? 0,
                today: todayRevenueResult[0]?.total ?? 0,
            },
        };
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Users
     * --------------------------------------------------------------------------
     */
    async findUsers(query) {
        const { page = 1, limit = 10, search, role, accountStatus } = query;
        const filter = {};
        if (search) {
            filter.$or = [
                {
                    firstName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    lastName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    phoneNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
        if (role) {
            filter.role = role;
        }
        if (accountStatus) {
            filter.accountStatus = accountStatus;
        }
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(filter),
        ]);
        return {
            users,
            total,
        };
    }
    async findUserById(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return null;
        }
        return User.findById(userId).select("-password").lean();
    }
    async updateUser(userId, data) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return null;
        }
        return User.findByIdAndUpdate(userId, {
            $set: data,
        }, {
            new: true,
            runValidators: true,
        })
            .select("-password")
            .lean();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Delivery Agents
     * --------------------------------------------------------------------------
     */
    async findDeliveryAgents(query) {
        const { page = 1, limit = 10, search, status, isActive } = query;
        const filter = {};
        /*
         * Filter by delivery agent status
         */
        if (status) {
            filter.status = status;
        }
        /*
         * Filter by active/inactive state
         */
        if (typeof isActive === "boolean") {
            filter.isActive = isActive;
        }
        /*
         * Search delivery agent user information
         *
         * Delivery agent profile information is stored in User,
         * so first find matching users and then filter agents by userId.
         */
        if (search) {
            const matchingUsers = await User.find({
                $or: [
                    {
                        firstName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        lastName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        phoneNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            })
                .select("_id")
                .lean();
            const userIds = matchingUsers.map((user) => user._id);
            filter.userId = {
                $in: userIds,
            };
        }
        const skip = (page - 1) * limit;
        const [deliveryAgents, total] = await Promise.all([
            DeliveryAgent.find(filter)
                .populate({
                path: "userId",
                select: "firstName lastName email phoneNumber role accountStatus isEmailVerified",
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            DeliveryAgent.countDocuments(filter),
        ]);
        return {
            deliveryAgents,
            total,
        };
    }
    /*
     * Get a single delivery agent for admin
     */
    async findDeliveryAgentById(deliveryAgentId) {
        if (!mongoose.Types.ObjectId.isValid(deliveryAgentId)) {
            return null;
        }
        return DeliveryAgent.findById(deliveryAgentId)
            .populate({
            path: "userId",
            select: "firstName lastName email phoneNumber role accountStatus isEmailVerified",
        })
            .lean();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Orders
     * --------------------------------------------------------------------------
     */
    async findOrders(query) {
        const { page = 1, limit = 10, search, status, paymentStatus } = query;
        const filter = {
            isActive: true,
        };
        /*
         * Filter by order status
         */
        if (status) {
            filter.status = status;
        }
        /*
         * Filter by payment status
         */
        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }
        /*
         * Search customer information
         *
         * Customer information is stored in User,
         * so first find matching users.
         */
        if (search) {
            const matchingUsers = await User.find({
                $or: [
                    {
                        firstName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        lastName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        phoneNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            })
                .select("_id")
                .lean();
            const userIds = matchingUsers.map((user) => user._id);
            filter.userId = {
                $in: userIds,
            };
        }
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate({
                path: "userId",
                select: "firstName lastName email phoneNumber",
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            Order.countDocuments(filter),
        ]);
        return {
            orders,
            total,
        };
    }
    /*
     * Get a single order for admin
     */
    /**
     * Get a single order for admin
     */
    async findOrderById(orderId) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return null;
        }
        return Order.findById(orderId)
            /*
             * Populate customer information.
             */
            .populate({
            path: "userId",
            select: "firstName lastName email phoneNumber",
        })
            /*
             * Populate the customer's pickup address.
             *
             * The Order stores only addressId.
             * The Address document contains the actual
             * GeoJSON location:
             *
             * {
             *   type: "Point",
             *   coordinates: [longitude, latitude]
             * }
             */
            .populate({
            path: "addressId",
            select: "_id fullName phoneNumber addressLine1 addressLine2 city state postalCode country addressType isDefault isActive location",
        })
            .lean();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Assignments
     * --------------------------------------------------------------------------
     */
    async findAssignments(query) {
        const { page = 1, limit = 10, search, status, assignmentType, isActive, } = query;
        const filter = {};
        /*
         * Filter by assignment status
         */
        if (status) {
            filter.status = status;
        }
        /*
         * Filter by assignment type
         */
        if (assignmentType) {
            filter.assignmentType = assignmentType;
        }
        /*
         * Filter by active/inactive state
         */
        if (typeof isActive === "boolean") {
            filter.isActive = isActive;
        }
        /*
         * Search by delivery-agent user information.
         *
         * Assignment stores deliveryAgentId.
         * DeliveryAgent stores userId.
         * User stores firstName, lastName, email and phoneNumber.
         *
         * Therefore:
         *
         * search
         *   ↓
         * User
         *   ↓
         * DeliveryAgent
         *   ↓
         * DeliveryAssignment
         */
        if (search) {
            const matchingUsers = await User.find({
                $or: [
                    {
                        firstName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        lastName: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        email: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        phoneNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            })
                .select("_id")
                .lean();
            const userIds = matchingUsers.map((user) => user._id);
            const matchingAgents = await DeliveryAgent.find({
                userId: {
                    $in: userIds,
                },
            })
                .select("_id")
                .lean();
            const agentIds = matchingAgents.map((agent) => agent._id);
            filter.deliveryAgentId = {
                $in: agentIds,
            };
        }
        const skip = (page - 1) * limit;
        const [assignments, total] = await Promise.all([
            DeliveryAssignment.find(filter)
                /*
                 * Populate only the order fields required by
                 * the Admin Assignment frontend contract.
                 */
                .populate({
                path: "orderId",
                select: "_id status",
            })
                /*
                 * Populate delivery agent and then nested User.
                 *
                 * This is important because deliveryAgentId.userId
                 * must be an object in the Admin API response,
                 * not only a MongoDB ObjectId.
                 */
                .populate({
                path: "deliveryAgentId",
                populate: {
                    path: "userId",
                    select: "_id firstName lastName email phoneNumber role accountStatus isEmailVerified",
                },
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            DeliveryAssignment.countDocuments(filter),
        ]);
        return {
            assignments,
            total,
        };
    }
    /*
     * Get a single assignment for admin
     */
    async findAssignmentById(assignmentId) {
        if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
            return null;
        }
        return (DeliveryAssignment.findById(assignmentId)
            /*
             * Populate order reference.
             */
            .populate({
            path: "orderId",
            select: "_id status",
        })
            /*
             * Populate delivery agent reference
             * and nested user information.
             */
            .populate({
            path: "deliveryAgentId",
            populate: {
                path: "userId",
                select: "_id firstName lastName email phoneNumber role accountStatus isEmailVerified",
            },
        })
            .lean());
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Notifications
     * --------------------------------------------------------------------------
     */
    async findNotifications(query) {
        const { page = 1, limit = 10, type, isRead, userId, orderId } = query;
        const filter = {};
        /*
         * Filter by notification type
         */
        if (type) {
            filter.type = type;
        }
        /*
         * Filter by read/unread state
         */
        if (typeof isRead === "boolean") {
            filter.isRead = isRead;
        }
        /*
         * Filter by recipient user
         */
        if (userId) {
            filter.userId = userId;
        }
        /*
         * Filter by related order
         */
        if (orderId) {
            filter.orderId = orderId;
        }
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            Notification.find(filter)
                .populate({
                path: "userId",
                select: "_id firstName lastName email phoneNumber role accountStatus isEmailVerified",
            })
                .populate({
                path: "orderId",
                select: "_id status",
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            Notification.countDocuments(filter),
        ]);
        return {
            notifications,
            total,
        };
    }
    /*
     * Get a single notification for admin
     */
    async findNotificationById(notificationId) {
        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            return null;
        }
        return Notification.findById(notificationId)
            .populate({
            path: "userId",
            select: "_id firstName lastName email phoneNumber role accountStatus isEmailVerified",
        })
            .populate({
            path: "orderId",
            select: "_id status",
        })
            .lean();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Payments
     * --------------------------------------------------------------------------
     */
    async findPayments(query) {
        const { page = 1, limit = 10, search, status } = query;
        const filter = {};
        /*
         * Filter by payment status
         */
        if (status) {
            filter.status = status;
        }
        /*
         * Search by customer information or order ID.
         *
         * Order._id is a MongoDB ObjectId, so regex must not be used
         * directly against the _id field.
         */
        if (search?.trim()) {
            const normalizedSearch = search.trim();
            const matchingUsers = await User.find({
                $or: [
                    {
                        firstName: {
                            $regex: normalizedSearch,
                            $options: "i",
                        },
                    },
                    {
                        lastName: {
                            $regex: normalizedSearch,
                            $options: "i",
                        },
                    },
                    {
                        email: {
                            $regex: normalizedSearch,
                            $options: "i",
                        },
                    },
                    {
                        phoneNumber: {
                            $regex: normalizedSearch,
                            $options: "i",
                        },
                    },
                ],
            })
                .select("_id")
                .lean();
            const userIds = matchingUsers.map((user) => user._id);
            const orderIds = [];
            if (mongoose.Types.ObjectId.isValid(normalizedSearch)) {
                orderIds.push(new mongoose.Types.ObjectId(normalizedSearch));
            }
            filter.$or = [
                {
                    userId: {
                        $in: userIds,
                    },
                },
                {
                    orderId: {
                        $in: orderIds,
                    },
                },
            ];
        }
        const skip = (page - 1) * limit;
        const [payments, total] = await Promise.all([
            Payment.find(filter)
                .populate({
                path: "userId",
                select: "_id firstName lastName email phoneNumber",
            })
                .populate({
                path: "orderId",
                select: "_id status paymentStatus",
            })
                .sort({
                createdAt: -1,
            })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments(filter),
        ]);
        return {
            payments,
            total,
        };
    }
    /*
     * --------------------------------------------------------------------------
     * Get a single payment for admin
     * --------------------------------------------------------------------------
     */
    async findPaymentById(paymentId) {
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return null;
        }
        return Payment.findById(paymentId)
            .populate({
            path: "userId",
            select: "_id firstName lastName email phoneNumber",
        })
            .populate({
            path: "orderId",
            select: "_id status paymentStatus",
        })
            .lean();
    }
    /*
     * --------------------------------------------------------------------------
     * Admin Reports
     * --------------------------------------------------------------------------
     */
    /*
     * --------------------------------------------------------------------------
     * Overview Report
     * --------------------------------------------------------------------------
     */
    async getOverviewReport() {
        const [totalUsers, activeUsers, suspendedUsers, blockedUsers, totalOrders, completedOrders, cancelledOrders, totalDeliveryAgents, activeDeliveryAgents, availableDeliveryAgents, busyDeliveryAgents, totalRevenueResult, paidRevenueResult, pendingRevenueResult, failedRevenueResult, refundedRevenueResult,] = await Promise.all([
            /*
             * Users
             */
            User.countDocuments(),
            User.countDocuments({
                accountStatus: "ACTIVE",
            }),
            User.countDocuments({
                accountStatus: "SUSPENDED",
            }),
            User.countDocuments({
                accountStatus: "BLOCKED",
            }),
            /*
             * Orders
             */
            Order.countDocuments({
                isActive: true,
            }),
            Order.countDocuments({
                isActive: true,
                status: OrderStatus.COMPLETED,
            }),
            Order.countDocuments({
                isActive: true,
                status: OrderStatus.CANCELLED,
            }),
            /*
             * Delivery agents
             */
            DeliveryAgent.countDocuments(),
            DeliveryAgent.countDocuments({
                isActive: true,
            }),
            DeliveryAgent.countDocuments({
                isActive: true,
                status: DeliveryAgentStatus.AVAILABLE,
            }),
            DeliveryAgent.countDocuments({
                isActive: true,
                status: DeliveryAgentStatus.BUSY,
            }),
            /*
             * Revenue
             */
            Payment.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.PAID,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.PENDING,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.FAILED,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.REFUNDED,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
        ]);
        const activeOrders = totalOrders - completedOrders - cancelledOrders;
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                suspended: suspendedUsers,
                blocked: blockedUsers,
            },
            orders: {
                total: totalOrders,
                completed: completedOrders,
                cancelled: cancelledOrders,
                active: Math.max(0, activeOrders),
            },
            revenue: {
                total: totalRevenueResult[0]?.total ?? 0,
                paid: paidRevenueResult[0]?.total ?? 0,
                pending: pendingRevenueResult[0]?.total ?? 0,
                failed: failedRevenueResult[0]?.total ?? 0,
                refunded: refundedRevenueResult[0]?.total ?? 0,
            },
            deliveryAgents: {
                total: totalDeliveryAgents,
                active: activeDeliveryAgents,
                available: availableDeliveryAgents,
                busy: busyDeliveryAgents,
            },
        };
    }
    /*
     * --------------------------------------------------------------------------
     * Order Statistics
     * --------------------------------------------------------------------------
     */
    async getOrderStatistics() {
        const [totalOrders, statusBreakdown] = await Promise.all([
            Order.countDocuments({
                isActive: true,
            }),
            Order.aggregate([
                {
                    $match: {
                        isActive: true,
                    },
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
            ]),
        ]);
        const completedOrders = statusBreakdown.find((item) => item._id === OrderStatus.COMPLETED)
            ?.count ?? 0;
        const cancelledOrders = statusBreakdown.find((item) => item._id === OrderStatus.CANCELLED)
            ?.count ?? 0;
        const activeOrders = Math.max(0, totalOrders - completedOrders - cancelledOrders);
        return {
            totalOrders,
            statusBreakdown: statusBreakdown.map((item) => ({
                status: item._id,
                count: item.count,
            })),
            completedOrders,
            cancelledOrders,
            activeOrders,
        };
    }
    /*
     * --------------------------------------------------------------------------
     * Revenue Statistics
     * --------------------------------------------------------------------------
     */
    async getRevenueStatistics(startDate, endDate) {
        const match = {
            status: PaymentStatus.PAID,
        };
        if (startDate || endDate) {
            const paidAtFilter = {};
            if (startDate) {
                paidAtFilter.$gte = startDate;
            }
            if (endDate) {
                paidAtFilter.$lte = endDate;
            }
            match.paidAt = paidAtFilter;
        }
        const [totalRevenueResult, refundedResult, dailyRevenue] = await Promise.all([
            /*
             * Total successful revenue
             */
            Payment.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            /*
             * Refunded amount
             */
            Payment.aggregate([
                {
                    $match: {
                        status: PaymentStatus.REFUNDED,
                        ...(startDate || endDate
                            ? {
                                refundedAt: {
                                    ...(startDate && {
                                        $gte: startDate,
                                    }),
                                    ...(endDate && {
                                        $lte: endDate,
                                    }),
                                },
                            }
                            : {}),
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            /*
             * Revenue grouped by day
             */
            Payment.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$paidAt",
                            },
                        },
                        revenue: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
            ]),
        ]);
        const totalRevenue = totalRevenueResult[0]?.total ?? 0;
        const refundedAmount = refundedResult[0]?.total ?? 0;
        return {
            totalRevenue,
            paidRevenue: totalRevenue,
            refundedAmount,
            netRevenue: totalRevenue - refundedAmount,
            data: dailyRevenue.map((item) => ({
                date: item._id,
                revenue: item.revenue,
            })),
        };
    }
    /*
     * --------------------------------------------------------------------------
     * Payment Statistics
     * --------------------------------------------------------------------------
     */
    async getPaymentStatistics(startDate, endDate) {
        const match = {};
        if (startDate || endDate) {
            const createdAtFilter = {};
            if (startDate) {
                createdAtFilter.$gte = startDate;
            }
            if (endDate) {
                createdAtFilter.$lte = endDate;
            }
            match.createdAt = createdAtFilter;
        }
        const [totalPayments, totalAmountResult, statusBreakdown] = await Promise.all([
            /*
             * Total number of payments
             */
            Payment.countDocuments(match),
            /*
             * Total payment amount
             */
            Payment.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$amount",
                        },
                    },
                },
            ]),
            /*
             * Payment status breakdown
             */
            Payment.aggregate([
                {
                    $match: match,
                },
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1,
                        },
                        amount: {
                            $sum: "$amount",
                        },
                    },
                },
                {
                    $sort: {
                        count: -1,
                    },
                },
            ]),
        ]);
        return {
            totalPayments,
            totalAmount: totalAmountResult[0]?.total ?? 0,
            statusBreakdown: statusBreakdown.map((item) => ({
                status: item._id,
                count: item.count,
                amount: item.amount,
            })),
        };
    }
}
export const adminRepository = new AdminRepository();
//# sourceMappingURL=admin.repository.js.map