import express from "express";

import { protect, authorize } from "../middleware/auth.middleware.js";

import {
  getDashboard,
} from "../controllers/admin.controller.js";

import {
  adminGetAllOrders,
  adminGetSingleOrder,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  getOrderStatistics,
  getRecentOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

// ======================================================
// ADMIN AUTH MIDDLEWARE
// ======================================================

router.use(protect);
router.use(authorize("admin"));

// ======================================================
// DASHBOARD
// ======================================================

// Complete Dashboard
router.get(
  "/dashboard",
  getDashboard
);

// Dashboard Statistics
router.get(
  "/dashboard/statistics",
  getOrderStatistics
);

// Recent Orders
router.get(
  "/dashboard/recent-orders",
  getRecentOrders
);

// ======================================================
// ORDER MANAGEMENT
// ======================================================

// Get All Orders
router.get(
  "/orders",
  adminGetAllOrders
);

// Get Single Order
router.get(
  "/orders/:orderId",
  adminGetSingleOrder
);

// Update Order Status
router.patch(
  "/orders/:orderId/status",
  adminUpdateOrderStatus
);

// Delete Order
router.delete(
  "/orders/:orderId",
  adminDeleteOrder
);

export default router;