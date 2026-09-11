import express from "express";

import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  getUserTransactions,
  updateTransactionStatus,
  refundTransaction,
  deleteTransaction,
  getTransactionStatistics,
} from "../controllers/transaction.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// USER ROUTES
// ======================================================

// ==============================================
// CREATE TRANSACTION
// POST /api/v1/transactions
// ==============================================

router.post(
  "/",
  protect,
  createTransaction
);

// ==============================================
// MY TRANSACTIONS
// GET /api/v1/transactions/my
// ==============================================

router.get(
  "/my",
  protect,
  getUserTransactions
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// ==============================================
// TRANSACTION STATISTICS
// GET /api/v1/transactions/statistics
// ==============================================

router.get(
  "/statistics",
  protect,
  authorize("admin"),
  getTransactionStatistics
);

// ==============================================
// GET ALL TRANSACTIONS
// GET /api/v1/transactions
// ==============================================

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllTransactions
);

// ==============================================
// GET SINGLE TRANSACTION
// GET /api/v1/transactions/:id
// ==============================================

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getTransactionById
);

// ==============================================
// UPDATE TRANSACTION STATUS
// PATCH /api/v1/transactions/:id/status
// ==============================================

router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  updateTransactionStatus
);

// ==============================================
// REFUND TRANSACTION
// POST /api/v1/transactions/:id/refund
// ==============================================

router.post(
  "/:id/refund",
  protect,
  authorize("admin"),
  refundTransaction
);

// ==============================================
// DELETE TRANSACTION
// DELETE /api/v1/transactions/:id
// ==============================================

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteTransaction
);

// ======================================================
// EXPORT
// ======================================================

export default router;