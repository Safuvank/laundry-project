import mongoose from "mongoose";
import type { IAdminUpdateUser, IAdminUserListQuery, IAdminOrderListQuery, IAdminDeliveryAgentListQuery, IAdminAssignmentListQuery, IAdminNotificationListQuery, IAdminPaymentListQuery } from "../interfaces/IAdmin.js";
declare class AdminRepository {
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
    findUsers(query: IAdminUserListQuery): Promise<{
        users: (import("../../auth/interfaces/IUser.js").IUser & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findUserById(userId: string): Promise<(import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateUser(userId: string, data: IAdminUpdateUser): Promise<(import("../../auth/interfaces/IUser.js").IUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findDeliveryAgents(query: IAdminDeliveryAgentListQuery): Promise<{
        deliveryAgents: (import("../../deliveryAgent/interfaces/IDeliveryAgent.js").IDeliveryAgent & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findDeliveryAgentById(deliveryAgentId: string): Promise<(import("../../deliveryAgent/interfaces/IDeliveryAgent.js").IDeliveryAgent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findOrders(query: IAdminOrderListQuery): Promise<{
        orders: (import("../../order/interfaces/IOrder.js").IOrder & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    /**
     * Get a single order for admin
     */
    findOrderById(orderId: string): Promise<(import("../../order/interfaces/IOrder.js").IOrder & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findAssignments(query: IAdminAssignmentListQuery): Promise<{
        assignments: (import("../../deliveryAssignment/interfaces/IDeliveryAssignment.js").IDeliveryAssignment & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findAssignmentById(assignmentId: string): Promise<(import("../../deliveryAssignment/interfaces/IDeliveryAssignment.js").IDeliveryAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findNotifications(query: IAdminNotificationListQuery): Promise<{
        notifications: (import("../../notification/interfaces/INotification.js").INotification & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findNotificationById(notificationId: string): Promise<(import("../../notification/interfaces/INotification.js").INotification & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    findPayments(query: IAdminPaymentListQuery): Promise<{
        payments: (import("../../payment/interfaces/IPayment.js").IPayment & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        total: number;
    }>;
    findPaymentById(paymentId: string): Promise<(import("../../payment/interfaces/IPayment.js").IPayment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
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
export declare const adminRepository: AdminRepository;
export {};
//# sourceMappingURL=admin.repository.d.ts.map