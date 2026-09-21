import { z } from "zod";
import { OrderStatus } from "../constants/orderStatus.js";
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        DRAFT: OrderStatus.DRAFT;
        BOOKED: OrderStatus.BOOKED;
        PICKUP_ASSIGNED: OrderStatus.PICKUP_ASSIGNED;
        OUT_FOR_PICKUP: OrderStatus.OUT_FOR_PICKUP;
        PICKED_UP: OrderStatus.PICKED_UP;
        RECEIVED_AT_FACILITY: OrderStatus.RECEIVED_AT_FACILITY;
        INSPECTION_IN_PROGRESS: OrderStatus.INSPECTION_IN_PROGRESS;
        PRICE_FINALIZED: OrderStatus.PRICE_FINALIZED;
        CUSTOMER_APPROVAL_PENDING: OrderStatus.CUSTOMER_APPROVAL_PENDING;
        PROCESSING: OrderStatus.PROCESSING;
        QUALITY_CHECK: OrderStatus.QUALITY_CHECK;
        READY_FOR_DELIVERY: OrderStatus.READY_FOR_DELIVERY;
        DELIVERY_ASSIGNED: OrderStatus.DELIVERY_ASSIGNED;
        OUT_FOR_DELIVERY: OrderStatus.OUT_FOR_DELIVERY;
        DELIVERED: OrderStatus.DELIVERED;
        COMPLETED: OrderStatus.COMPLETED;
        CANCELLED: OrderStatus.CANCELLED;
        PICKUP_FAILED: OrderStatus.PICKUP_FAILED;
        DELIVERY_FAILED: OrderStatus.DELIVERY_FAILED;
        ON_HOLD: OrderStatus.ON_HOLD;
    }>;
}, z.core.$strip>;
//# sourceMappingURL=updateOrderStatus.validator.d.ts.map