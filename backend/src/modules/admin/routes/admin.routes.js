import { Router } from "express";
import { UserRole } from "../../auth/constants/roles.js";
import { authenticate } from "../../../shared/middlewares/authenticate.js";
import { authorize } from "../../../shared/middlewares/authorize.js";
import { adminController } from "../controllers/admin.controller.js";
const router = Router();
/*
 * --------------------------------------------------------------------------
 * Admin Dashboard
 * --------------------------------------------------------------------------
 */
router.get("/dashboard", authenticate, authorize(UserRole.ADMIN), adminController.getDashboard);
/*
 * --------------------------------------------------------------------------
 * Admin Users
 * --------------------------------------------------------------------------
 */
// Get all users
router.get("/users", authenticate, authorize(UserRole.ADMIN), adminController.getUsers);
// Get user by ID
router.get("/users/:id", authenticate, authorize(UserRole.ADMIN), adminController.getUserById);
// Update user
router.patch("/users/:id", authenticate, authorize(UserRole.ADMIN), adminController.updateUser);
// Activate user
router.patch("/users/:id/activate", authenticate, authorize(UserRole.ADMIN), adminController.activateUser);
// Deactivate user
router.patch("/users/:id/deactivate", authenticate, authorize(UserRole.ADMIN), adminController.deactivateUser);
/*
 * --------------------------------------------------------------------------
 * Admin Orders
 * --------------------------------------------------------------------------
 */
// Get all orders
router.get("/orders", authenticate, authorize(UserRole.ADMIN), adminController.getOrders);
// Get order by ID
router.get("/orders/:id", authenticate, authorize(UserRole.ADMIN), adminController.getOrderById);
/*
 * --------------------------------------------------------------------------
 * Admin Delivery Agents
 * --------------------------------------------------------------------------
 */
// Get all delivery agents
router.get("/delivery-agents", authenticate, authorize(UserRole.ADMIN), adminController.getDeliveryAgents);
// Get delivery agent by ID
router.get("/delivery-agents/:id", authenticate, authorize(UserRole.ADMIN), adminController.getDeliveryAgentById);
/*
 * --------------------------------------------------------------------------
 * Admin Assignments
 * --------------------------------------------------------------------------
 */
// Get all delivery assignments
router.get("/assignments", authenticate, authorize(UserRole.ADMIN), adminController.getAssignments);
// Get assignment by ID
router.get("/assignments/:id", authenticate, authorize(UserRole.ADMIN), adminController.getAssignmentById);
/*
 * --------------------------------------------------------------------------
 * Admin Notifications
 * --------------------------------------------------------------------------
 */
// Get all notifications
router.get("/notifications", authenticate, authorize(UserRole.ADMIN), adminController.getNotifications);
// Get notification by ID
router.get("/notifications/:id", authenticate, authorize(UserRole.ADMIN), adminController.getNotificationById);
/*
 * --------------------------------------------------------------------------
 * Admin Payments
 * --------------------------------------------------------------------------
 */
// Get all payments
router.get("/payments", authenticate, authorize(UserRole.ADMIN), adminController.getPayments);
// Get payment by ID
router.get("/payments/:id", authenticate, authorize(UserRole.ADMIN), adminController.getPaymentById);
/*
 * --------------------------------------------------------------------------
 * Admin Reports
 * --------------------------------------------------------------------------
 */
// Get overview report
router.get("/reports/overview", authenticate, authorize(UserRole.ADMIN), adminController.getOverviewReport);
// Get order statistics
router.get("/reports/orders", authenticate, authorize(UserRole.ADMIN), adminController.getOrderStatistics);
// Get revenue statistics
router.get("/reports/revenue", authenticate, authorize(UserRole.ADMIN), adminController.getRevenueStatistics);
// Get payment statistics
router.get("/reports/payments", authenticate, authorize(UserRole.ADMIN), adminController.getPaymentStatistics);
export default router;
//# sourceMappingURL=admin.routes.js.map