import express from "express";

import {
  placeOrder,
  buyNow,
  getMyOrders,
  getOrderDetails,
  cancelOrder,
  returnOrder,
  trackOrder,
  updatePaymentStatus,
  adminGetAllOrders,
  adminGetSingleOrder,
  adminUpdateOrderStatus,
  adminDeleteOrder,
  getOrderStatistics,
  getRecentOrders,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// CUSTOMER ROUTES
// ======================================================

// Place Order
router.post(
  "/",
  protect,
  placeOrder
);

// Buy Now
router.post(
  "/buy-now",
  protect,
  buyNow
);

// My Orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Order Details
router.get(
  "/:orderId",
  protect,
  getOrderDetails
);

// Track Order
router.get(
  "/:orderId/track",
  protect,
  trackOrder
);

// Cancel Order
router.patch(
  "/:orderId/cancel",
  protect,
  cancelOrder
);

// Return Order
router.patch(
  "/:orderId/return",
  protect,
  returnOrder
);

// Update Payment Status
router.patch(
  "/:orderId/payment",
  protect,
  updatePaymentStatus
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// All Orders
router.get(
  "/admin/all",
  protect,
  authorize("Admin"),
  adminGetAllOrders
);

// Statistics
router.get(
  "/admin/statistics",
  protect,
  authorize("Admin"),
  getOrderStatistics
);

// Recent Orders
router.get(
  "/admin/recent",
  protect,
  authorize("Admin"),
  getRecentOrders
);

// Single Order
router.get(
  "/admin/:orderId",
  protect,
  authorize("Admin"),
  adminGetSingleOrder
);

// Update Order Status
router.patch(
  "/admin/:orderId/status",
  protect,
  authorize("Admin"),
  adminUpdateOrderStatus
);

// Delete Order
router.delete(
  "/admin/:orderId",
  protect,
  authorize("Admin"),
  adminDeleteOrder
);

export default router;