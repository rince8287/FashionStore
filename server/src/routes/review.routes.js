import express from "express";

import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getReviewById,
  getMyReviews,
  markHelpful,
  adminReply,
  updateReviewStatus,
  getReviewStatistics,
  getAllReviewsForAdmin,
} from "../controllers/review.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// PUBLIC ROUTES
// ======================================================

// GET /api/v1/reviews/product/:productId
// Get approved reviews for a product
router.get(
  "/product/:productId",
  getProductReviews
);

// ======================================================
// USER ROUTES
// ======================================================

// GET /api/v1/reviews/my
// Get logged-in user's reviews
router.get(
  "/my",
  protect,
  getMyReviews
);

// POST /api/v1/reviews
// Create a new review
router.post(
  "/",
  protect,
  createReview
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// GET /api/v1/reviews/admin
// Get all reviews for admin panel
router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAllReviewsForAdmin
);

// GET /api/v1/reviews/statistics
// Get review statistics
router.get(
  "/statistics",
  protect,
  authorize("admin"),
  getReviewStatistics
);

// ======================================================
// REVIEW ID BASED ROUTES
//
// IMPORTANT:
// These routes must stay AFTER special routes
// like /admin, /statistics, /my, etc.
// ======================================================

// POST /api/v1/reviews/:id/helpful
// Mark review as helpful
router.post(
  "/:id/helpful",
  protect,
  markHelpful
);

// POST /api/v1/reviews/:id/reply
// Admin reply to review
router.post(
  "/:id/reply",
  protect,
  authorize("admin"),
  adminReply
);

// PATCH /api/v1/reviews/:id/status
// Admin update review status
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateReviewStatus
);

// PUT /api/v1/reviews/:id
// Update own review
router.put(
  "/:id",
  protect,
  updateReview
);

// DELETE /api/v1/reviews/:id
// Delete own review or admin delete
router.delete(
  "/:id",
  protect,
  deleteReview
);

// GET /api/v1/reviews/:id
// Get single review
router.get(
  "/:id",
  getReviewById
);

// ======================================================
// EXPORT
// ======================================================

export default router;