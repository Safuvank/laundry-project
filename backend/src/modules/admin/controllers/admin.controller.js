import { UserRole } from "../../auth/constants/roles.js";
import { OrderStatus } from "../../order/constants/orderStatus.js";
import { PaymentStatus } from "../../order/constants/paymentStatus.js";
import { DeliveryAgentStatus } from "../../deliveryAgent/constants/deliveryAgentStatus.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";
import { adminService } from "../services/admin.service.js";
import { DeliveryAssignmentStatus } from "../../deliveryAssignment/constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../../deliveryAssignment/constants/deliveryAssignmentType.js";
import { NotificationType } from "../../notification/constants/notificationType.js";
class AdminController {
    /*
     * --------------------------------------------------------------------------
     * Admin Dashboard
     * --------------------------------------------------------------------------
     */
    getDashboard = asyncHandler(async (_req, res) => {
        const dashboard = await adminService.getDashboard();
        return res.status(200).json({
            success: true,
            message: "Admin dashboard retrieved successfully.",
            data: dashboard,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Users
     * --------------------------------------------------------------------------
     */
    getUsers = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.search === "string" && {
                search: req.query.search,
            }),
            ...(typeof req.query.role === "string" && {
                role: req.query.role,
            }),
            ...(typeof req.query.accountStatus === "string" && {
                accountStatus: req.query.accountStatus,
            }),
        };
        const result = await adminService.getUsers(query);
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully.",
            data: result,
        });
    });
    getUserById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required.",
            });
        }
        const user = await adminService.getUserById(id);
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully.",
            data: user,
        });
    });
    updateUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required.",
            });
        }
        const user = await adminService.updateUser(id, req.body);
        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
            data: user,
        });
    });
    activateUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required.",
            });
        }
        const user = await adminService.activateUser(id);
        return res.status(200).json({
            success: true,
            message: "User activated successfully.",
            data: user,
        });
    });
    deactivateUser = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid user ID is required.",
            });
        }
        const user = await adminService.deactivateUser(id);
        return res.status(200).json({
            success: true,
            message: "User deactivated successfully.",
            data: user,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Orders
     * --------------------------------------------------------------------------
     */
    getOrders = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.search === "string" && {
                search: req.query.search,
            }),
            ...(typeof req.query.status === "string" && {
                status: req.query.status,
            }),
            ...(typeof req.query.paymentStatus === "string" && {
                paymentStatus: req.query.paymentStatus,
            }),
        };
        const result = await adminService.getOrders(query);
        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully.",
            data: result,
        });
    });
    getOrderById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid order ID is required.",
            });
        }
        const order = await adminService.getOrderById(id);
        return res.status(200).json({
            success: true,
            message: "Order retrieved successfully.",
            data: order,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Delivery Agents
     * --------------------------------------------------------------------------
     */
    getDeliveryAgents = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.search === "string" && {
                search: req.query.search,
            }),
            ...(typeof req.query.status === "string" && {
                status: req.query.status,
            }),
            ...(typeof req.query.isActive === "string" && {
                isActive: req.query.isActive === "true",
            }),
        };
        const result = await adminService.getDeliveryAgents(query);
        return res.status(200).json({
            success: true,
            message: "Delivery agents retrieved successfully.",
            data: result,
        });
    });
    getDeliveryAgentById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid delivery agent ID is required.",
            });
        }
        const deliveryAgent = await adminService.getDeliveryAgentById(id);
        return res.status(200).json({
            success: true,
            message: "Delivery agent retrieved successfully.",
            data: deliveryAgent,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Assignments
     * --------------------------------------------------------------------------
     */
    getAssignments = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.search === "string" && {
                search: req.query.search,
            }),
            ...(typeof req.query.status === "string" && {
                status: req.query.status,
            }),
            ...(typeof req.query.assignmentType === "string" && {
                assignmentType: req.query.assignmentType,
            }),
            ...(typeof req.query.isActive === "string" && {
                isActive: req.query.isActive === "true",
            }),
        };
        const result = await adminService.getAssignments(query);
        return res.status(200).json({
            success: true,
            message: "Delivery assignments retrieved successfully.",
            data: result,
        });
    });
    getAssignmentById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid assignment ID is required.",
            });
        }
        const assignment = await adminService.getAssignmentById(id);
        return res.status(200).json({
            success: true,
            message: "Delivery assignment retrieved successfully.",
            data: assignment,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Notifications
     * --------------------------------------------------------------------------
     */
    getNotifications = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.type === "string" && {
                type: req.query.type,
            }),
            ...(typeof req.query.isRead === "string" && {
                isRead: req.query.isRead === "true",
            }),
            ...(typeof req.query.userId === "string" && {
                userId: req.query.userId,
            }),
            ...(typeof req.query.orderId === "string" && {
                orderId: req.query.orderId,
            }),
        };
        const result = await adminService.getNotifications(query);
        return res.status(200).json({
            success: true,
            message: "Admin notifications retrieved successfully.",
            data: result,
        });
    });
    getNotificationById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid notification ID is required.",
            });
        }
        const notification = await adminService.getNotificationById(id);
        return res.status(200).json({
            success: true,
            message: "Admin notification retrieved successfully.",
            data: notification,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Payments
     * --------------------------------------------------------------------------
     */
    getPayments = asyncHandler(async (req, res) => {
        const query = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            ...(typeof req.query.search === "string" && {
                search: req.query.search,
            }),
            ...(typeof req.query.status === "string" && {
                status: req.query.status,
            }),
        };
        const result = await adminService.getPayments(query);
        return res.status(200).json({
            success: true,
            message: "Admin payments retrieved successfully.",
            data: result,
        });
    });
    getPaymentById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid payment ID is required.",
            });
        }
        const payment = await adminService.getPaymentById(id);
        return res.status(200).json({
            success: true,
            message: "Admin payment retrieved successfully.",
            data: payment,
        });
    });
    /*
     * --------------------------------------------------------------------------
     * Admin Reports
     * --------------------------------------------------------------------------
     */
    getOverviewReport = asyncHandler(async (_req, res) => {
        const report = await adminService.getOverviewReport();
        return res.status(200).json({
            success: true,
            message: "Admin overview report retrieved successfully.",
            data: report,
        });
    });
    getOrderStatistics = asyncHandler(async (_req, res) => {
        const report = await adminService.getOrderStatistics();
        return res.status(200).json({
            success: true,
            message: "Admin order statistics retrieved successfully.",
            data: report,
        });
    });
    getRevenueStatistics = asyncHandler(async (req, res) => {
        const startDate = typeof req.query.startDate === "string"
            ? new Date(req.query.startDate)
            : undefined;
        const endDate = typeof req.query.endDate === "string"
            ? new Date(req.query.endDate)
            : undefined;
        if (startDate && Number.isNaN(startDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid startDate.",
            });
        }
        if (endDate && Number.isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid endDate.",
            });
        }
        if (startDate && endDate && startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate must be before endDate.",
            });
        }
        const report = await adminService.getRevenueStatistics(startDate, endDate);
        return res.status(200).json({
            success: true,
            message: "Admin revenue statistics retrieved successfully.",
            data: report,
        });
    });
    getPaymentStatistics = asyncHandler(async (req, res) => {
        const startDate = typeof req.query.startDate === "string"
            ? new Date(req.query.startDate)
            : undefined;
        const endDate = typeof req.query.endDate === "string"
            ? new Date(req.query.endDate)
            : undefined;
        if (startDate && Number.isNaN(startDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid startDate.",
            });
        }
        if (endDate && Number.isNaN(endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid endDate.",
            });
        }
        if (startDate && endDate && startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "startDate must be before endDate.",
            });
        }
        const report = await adminService.getPaymentStatistics(startDate, endDate);
        return res.status(200).json({
            success: true,
            message: "Admin payment statistics retrieved successfully.",
            data: report,
        });
    });
}
export const adminController = new AdminController();
//# sourceMappingURL=admin.controller.js.map