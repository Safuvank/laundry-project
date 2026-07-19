import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/routes/auth.routes.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import addressRoutes from "./modules/address/routes/address.routes.js";
import turnaroundPlanRoutes from "./modules/turnaroundPlan/routes/turnaroundPlan.routes.js";

import { errorHandler } from "./shared/middlewares/errorHandler.js";

const app = express();

/*
 Middleware
*/

app.use(cors());

app.use(express.json());

app.use(cookieParser());

/*
 Health Check
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Laundry API Running",
  });
});

/*
 Routes
*/

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/turnaround-plans", turnaroundPlanRoutes);

/*
 Global Error Handler
*/

app.use(errorHandler);

export default app;
