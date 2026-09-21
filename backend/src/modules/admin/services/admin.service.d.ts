import mongoose from "mongoose";
import type { IAdminUpdateUser, IAdminUserListQuery, IAdminOrderListQuery, IAdminDeliveryAgentListQuery, IAdminAssignmentListQuery, IAdminNotificationListQuery, IAdminPaymentListQuery } from "../interfaces/IAdmin.js";
declare class AdminService {
    getDashboard(): Promise<{
        orders: {
            total: number;
            today: number;
            pending: number;
            completed: number;
            cancelled: number;
        };
        deliveries: {
            activePickups: number;
            activeDeliveries: number;
        };
        agents: {
            total: number;
            available: number;
        };
        revenue: {
            total: any;
            today: any;
        };
    }>;
    getUsers(query: IAdminUserListQuery): Promise<{
        users: (import("../../auth/interfaces/IUser.js").IUser & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUserById(userId: string): Promise<import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateUser(userId: string, data: IAdminUpdateUser): Promise<import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    activateUser(userId: string): Promise<import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deactivateUser(userId: string): Promise<import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getOrders(query: IAdminOrderListQuery): Promise<{
        orders: (import("../../order/interfaces/IOrder.js").IOrder & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getOrderById(orderId: string): Promise<import("../../order/interfaces/IOrder.js").IOrder & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getDeliveryAgents(query: IAdminDeliveryAgentListQuery): Promise<{
        deliveryAgents: (import("../../deliveryAgent/interfaces/IDeliveryAgent.js").IDeliveryAgent & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getDeliveryAgentById(deliveryAgentId: string): Promise<import("../../deliveryAgent/interfaces/IDeliveryAgent.js").IDeliveryAgent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAssignments(query: IAdminAssignmentListQuery): Promise<{
        assignments: (import("../../deliveryAssignment/interfaces/IDeliveryAssignment.js").IDeliveryAssignment & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getAssignmentById(assignmentId: string): Promise<import("../../deliveryAssignment/interfaces/IDeliveryAssignment.js").IDeliveryAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getNotifications(query: IAdminNotificationListQuery): Promise<{
        notifications: (import("../../notification/interfaces/INotification.js").INotification & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getNotificationById(notificationId: string): Promise<import("../../notification/interfaces/INotification.js").INotification & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPayments(query: IAdminPaymentListQuery): Promise<{
        payments: (import("../../payment/interfaces/IPayment.js").IPayment & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getPaymentById(paymentId: string): Promise<import("../../payment/interfaces/IPayment.js").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getOverviewReport(): Promise<{
        users: {
            total: number;
            active: number;
            suspended: number;
            blocked: number;
        };
        orders: {
            total: number;
            completed: number;
            cancelled: number;
            active: number;
        };
        revenue: {
            total: any;
            paid: any;
            pending: any;
            failed: any;
            refunded: any;
        };
        deliveryAgents: {
            total: number;
            active: number;
            available: number;
            busy: number;
        };
    }>;
    getOrderStatistics(): Promise<{
        totalOrders: number;
        statusBreakdown: {
            status: any;
            count: any;
        }[];
        completedOrders: any;
        cancelledOrders: any;
        activeOrders: number;
    }>;
    getRevenueStatistics(startDate?: Date, endDate?: Date): Promise<{
        totalRevenue: any;
        paidRevenue: any;
        refundedAmount: any;
        netRevenue: number;
        data: {
            date: any;
            revenue: any;
        }[];
    }>;
    getPaymentStatistics(startDate?: Date, endDate?: Date): Promise<{
        totalPayments: number;
        totalAmount: any;
        statusBreakdown: {
            status: any;
            count: any;
            amount: any;
        }[];
    }>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=admin.service.d.ts.map