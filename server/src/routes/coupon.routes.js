import express from "express";

import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  getCouponById,
  applyCoupon,
  removeCoupon,
  toggleCouponStatus,
  getActiveCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// PUBLIC / CUSTOMER ROUTES
// ======================================================

// ------------------------------------------------------
// GET ACTIVE COUPONS
// GET /api/v1/coupons/active
// ------------------------------------------------------
//
// Public:
// Users can see currently active coupons without login.
// ------------------------------------------------------

router.get(
  "/active",
  getActiveCoupons
);

// ======================================================
// AUTHENTICATED CUSTOMER ROUTES
// ======================================================

// ------------------------------------------------------
// VALIDATE COUPON
// POST /api/v1/coupons/validate
// ------------------------------------------------------

router.post(
  "/validate",
  protect,
  validateCoupon
);

// ------------------------------------------------------
// APPLY COUPON
// POST /api/v1/coupons/apply
// ------------------------------------------------------

router.post(
  "/apply",
  protect,
  applyCoupon
);

// ------------------------------------------------------
// REMOVE COUPON
// POST /api/v1/coupons/remove
// ------------------------------------------------------

router.post(
  "/remove",
  protect,
  removeCoupon
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// ------------------------------------------------------
// CREATE COUPON
// POST /api/v1/coupons
// ------------------------------------------------------

router.post(
  "/",
  protect,
  authorize("admin"),
  createCoupon
);

// ------------------------------------------------------
// GET ALL COUPONS
// GET /api/v1/coupons
// ------------------------------------------------------

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllCoupons
);

// ------------------------------------------------------
// GET COUPON BY ID
// GET /api/v1/coupons/:id
// ------------------------------------------------------

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getCouponById
);

// ------------------------------------------------------
// UPDATE COUPON
// PUT /api/v1/coupons/:id
// ------------------------------------------------------

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateCoupon
);

// ------------------------------------------------------
// DELETE COUPON
// DELETE /api/v1/coupons/:id
// ------------------------------------------------------

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCoupon
);

// ------------------------------------------------------
// TOGGLE COUPON STATUS
// PATCH /api/v1/coupons/:id/toggle
// ------------------------------------------------------

router.patch(
  "/:id/toggle",
  protect,
  authorize("admin"),
  toggleCouponStatus
);

// ======================================================
// EXPORT
// ======================================================

export default router;