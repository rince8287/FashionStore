import express from "express";

import {
  createNotification,
  getMyNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getUnreadCount,
  getNotificationStatistics,
} from "../controllers/notification.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// USER ROUTES
// ======================================================

// ==============================================
// GET MY NOTIFICATIONS
// GET /api/v1/notifications/my
// ==============================================

router.get(
  "/my",
  protect,
  getMyNotifications
);

// ==============================================
// GET UNREAD COUNT
// GET /api/v1/notifications/unread-count
// ==============================================

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

// ==============================================
// GET NOTIFICATION BY ID
// GET /api/v1/notifications/:id
// ==============================================

router.get(
  "/:id",
  protect,
  getNotificationById
);

// ==============================================
// MARK AS READ
// PATCH /api/v1/notifications/:id/read
// ==============================================

router.patch(
  "/:id/read",
  protect,
  markAsRead
);

// ==============================================
// MARK ALL AS READ
// PATCH /api/v1/notifications/read-all
// ==============================================

router.patch(
  "/read-all",
  protect,
  markAllAsRead
);

// ==============================================
// DELETE NOTIFICATION
// DELETE /api/v1/notifications/:id
// ==============================================

router.delete(
  "/:id",
  protect,
  deleteNotification
);

// ==============================================
// DELETE ALL NOTIFICATIONS
// DELETE /api/v1/notifications
// ==============================================

router.delete(
  "/",
  protect,
  deleteAllNotifications
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// ==============================================
// CREATE NOTIFICATION
// POST /api/v1/notifications
// ==============================================

router.post(
  "/",
  protect,
  authorize("admin"),
  createNotification
);

// ==============================================
// GET NOTIFICATION STATISTICS
// GET /api/v1/notifications/statistics
// ==============================================

router.get(
  "/statistics",
  protect,
  authorize("admin"),
  getNotificationStatistics
);

// ======================================================
// EXPORT
// ======================================================

export default router;