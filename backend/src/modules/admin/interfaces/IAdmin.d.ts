import { UserRole } from "../../auth/constants/roles.js";
import { OrderStatus } from "../../order/constants/orderStatus.js";
import { PaymentStatus } from "../../order/constants/paymentStatus.js";
import { DeliveryAgentStatus } from "../../deliveryAgent/constants/deliveryAgentStatus.js";
import { DeliveryAssignmentStatus } from "../../deliveryAssignment/constants/deliveryAssignmentStatus.js";
import { DeliveryAssignmentType } from "../../deliveryAssignment/constants/deliveryAssignmentType.js";
import { NotificationType } from "../../notification/constants/notificationType.js";
export interface IAdminUserListQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    accountStatus?: "ACTIVE" | "SUSPENDED" | "BLOCKED";
}
export interface IAdminUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    role: UserRole;
    isEmailVerified: boolean;
    accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
    profileImage?: string | null;
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminUsersResponse {
    users: IAdminUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IAdminUpdateUser {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string | null;
    role?: UserRole;
    accountStatus?: "ACTIVE" | "SUSPENDED" | "BLOCKED";
}
export interface IAdminOrderListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
}
export interface IAdminOrder {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string | null;
    };
    addressId: string;
    turnaroundPlanId: string;
    laundryServiceIds: string[];
    pickupDate: Date;
    pickupTimeSlot: string;
    estimatedPrice?: number;
    finalPrice?: number;
    pricingStatus: string;
    paymentStatus: PaymentStatus;
    status: OrderStatus;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminOrdersResponse {
    orders: IAdminOrder[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IAdminDeliveryAgentListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: DeliveryAgentStatus;
    isActive?: boolean;
}
export interface IAdminDeliveryAgent {
    _id: string;
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string | null;
        role: string;
        accountStatus: string;
        isEmailVerified: boolean;
    };
    status: DeliveryAgentStatus;
    phoneNumber?: string | null;
    currentLocation?: {
        type: "Point";
        coordinates: [number, number];
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminAssignmentListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: DeliveryAssignmentStatus;
    assignmentType?: DeliveryAssignmentType;
    isActive?: boolean;
}
export interface IAdminAssignmentOrder {
    _id: string;
    status: OrderStatus;
}
export interface IAdminAssignmentDeliveryAgentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    role: UserRole;
    accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
    isEmailVerified: boolean;
}
export interface IAdminAssignmentDeliveryAgent {
    _id: string;
    userId: IAdminAssignmentDeliveryAgentUser;
    status: DeliveryAgentStatus;
    phoneNumber?: string | null;
    currentLocation?: {
        type: "Point";
        coordinates: [number, number];
    };
    isActive: boolean;
}
export interface IAdminAssignment {
    _id: string;
    orderId: IAdminAssignmentOrder;
    deliveryAgentId: IAdminAssignmentDeliveryAgent;
    assignmentType: DeliveryAssignmentType;
    status: DeliveryAssignmentStatus;
    isActive: boolean;
    offeredAt?: Date | null;
    acceptedAt?: Date | null;
    rejectedAt?: Date | null;
    completedAt?: Date | null;
    rejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminAssignmentsResponse {
    assignments: IAdminAssignment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IAdminNotificationListQuery {
    page?: number;
    limit?: number;
    type?: NotificationType;
    isRead?: boolean;
    userId?: string;
    orderId?: string;
}
export interface IAdminNotificationUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
    role: UserRole;
    accountStatus: "ACTIVE" | "SUSPENDED" | "BLOCKED";
    isEmailVerified: boolean;
}
export interface IAdminNotificationOrder {
    _id: string;
    status: OrderStatus;
}
export interface IAdminNotification {
    _id: string;
    userId: IAdminNotificationUser;
    type: NotificationType;
    title: string;
    message: string;
    orderId?: IAdminNotificationOrder | null;
    isRead: boolean;
    readAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminNotificationsResponse {
    notifications: IAdminNotification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IAdminPaymentListQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: PaymentStatus;
}
export interface IAdminPaymentUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string | null;
}
export interface IAdminPaymentOrder {
    _id: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
}
export interface IAdminPayment {
    _id: string;
    orderId: IAdminPaymentOrder | null;
    userId: IAdminPaymentUser | null;
    amount: number;
    paymentMethod: string;
    status: PaymentStatus;
    paidAt?: Date | null;
    failedAt?: Date | null;
    refundedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminPaymentsResponse {
    payments: IAdminPayment[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface IAdminReportDateRange {
    startDate?: Date;
    endDate?: Date;
}
export interface IAdminOverviewReport {
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
        total: number;
        paid: number;
        pending: number;
        failed: number;
        refunded: number;
    };
    deliveryAgents: {
        total: number;
        active: number;
        available: number;
        busy: number;
    };
}
export interface IAdminOrderStatusCount {
    status: OrderStatus;
    count: number;
}
export interface IAdminOrderStatistics {
    totalOrders: number;
    statusBreakdown: IAdminOrderStatusCount[];
    completedOrders: number;
    cancelledOrders: number;
    activeOrders: number;
}
export interface IAdminRevenueData {
    date: string;
    revenue: number;
}
export interface IAdminRevenueStatistics {
    totalRevenue: number;
    paidRevenue: number;
    refundedAmount: number;
    netRevenue: number;
    data: IAdminRevenueData[];
}
export interface IAdminPaymentStatusCount {
    status: PaymentStatus;
    count: number;
    amount: number;
}
export interface IAdminPaymentStatistics {
    totalPayments: number;
    totalAmount: number;
    statusBreakdown: IAdminPaymentStatusCount[];
}
//# sourceMappingURL=IAdmin.d.ts.map