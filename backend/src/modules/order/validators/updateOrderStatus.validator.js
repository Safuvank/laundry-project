import { z } from "zod";
import { OrderStatus } from "../constants/orderStatus.js";
export const updateOrderStatusSchema = z.object({
    status: z.enum(Object.values(OrderStatus)),
});
//# sourceMappingURL=updateOrderStatus.validator.js.map