import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getPaymentStatus,
  markPaymentFailed,
  createRefund,
  getRefundStatus,
  razorpayWebhook,
} from "../controllers/payment.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// RAZORPAY WEBHOOK
//
// IMPORTANT:
// Is route par protect middleware nahi lagega,
// kyunki request directly Razorpay server se aayegi.
//
// Raw body handling app.js me configure hogi.
// ======================================================

router.post(
  "/webhook",
  razorpayWebhook
);

// ======================================================
// CREATE RAZORPAY ORDER
//
// POST /api/v1/payments/create-order
//
// Logged-in customer
// ======================================================

router.post(
  "/create-order",
  protect,
  createRazorpayOrder
);

// ======================================================
// VERIFY PAYMENT
//
// POST /api/v1/payments/verify
//
// Razorpay Checkout successful hone ke baad
// frontend ye endpoint call karega.
// ======================================================

router.post(
  "/verify",
  protect,
  verifyRazorpayPayment
);

// ======================================================
// PAYMENT FAILURE
//
// POST /api/v1/payments/failure
// ======================================================

router.post(
  "/failure",
  protect,
  markPaymentFailed
);

// ======================================================
// GET PAYMENT STATUS
//
// GET /api/v1/payments/:orderId/status
// ======================================================

router.get(
  "/:orderId/status",
  protect,
  getPaymentStatus
);

// ======================================================
// CREATE REFUND
//
// POST /api/v1/payments/:orderId/refund
//
// SECURITY:
// Refund sirf Admin initiate kar sakta hai.
// ======================================================

router.post(
  "/:orderId/refund",
  protect,
  authorize("admin"),
  createRefund
);

// ======================================================
// GET REFUND STATUS
//
// GET /api/v1/payments/:orderId/refund-status
//
// Admin only.
// ======================================================

router.get(
  "/:orderId/refund-status",
  protect,
  authorize("admin"),
  getRefundStatus
);

// ======================================================
// EXPORT
// ======================================================

export default router;
