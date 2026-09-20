import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";

import authRoutes from "./modules/auth/routes/auth.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import addressRoutes from "./modules/address/routes/address.routes.js";
import turnaroundPlanRoutes from "./modules/turnaroundPlan/routes/turnaroundPlan.routes.js";
import laundryServiceRoutes from "./modules/laundryService/routes/laundryService.routes.js";
import pricingRoutes from "./modules/pricing/routes/pricing.routes.js";
import pickupSlotRoutes from "./modules/pickupSlot/routes/pickupSlot.routes.js";
import orderRoutes from "./modules/order/routes/order.routes.js";
import deliveryAgentRoutes from "./modules/deliveryAgent/routes/deliveryAgent.routes.js";
import deliveryAssignmentRoutes from "./modules/deliveryAssignment/routes/deliveryAssignment.routes.js";
import notificationRoutes from "./modules/notification/routes/notification.routes.js";
import paymentRoutes from "./modules/payment/routes/payment.routes.js";
import adminRoutes from "./modules/admin/routes/admin.routes.js";

import { errorHandler } from "./shared/middlewares/errorHandler.js";

const app = express();

/*
 * Middleware
 */
console.log("🌐 FRONTEND_URL:", env.FRONTEND_URL);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

/*
 * Health Check
 */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Laundry API Running",
  });
});

/*
 * Routes
 */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/turnaround-plans", turnaroundPlanRoutes);
app.use("/api/v1/laundry-services", laundryServiceRoutes);
app.use("/api/v1/pricing", pricingRoutes);
app.use("/api/v1/pickup-slots", pickupSlotRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/delivery-agents", deliveryAgentRoutes);
app.use("/api/v1/delivery-assignments", deliveryAssignmentRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);
/*
 * Global Error Handler
 */

app.use(errorHandler);

export default app;