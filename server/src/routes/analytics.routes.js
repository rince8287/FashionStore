import express from "express";

import {
  getAnalytics,
  getAnalyticsSummary,
  getSalesAnalytics,
  getRevenueAnalytics,
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getCategoryAnalytics,
  getTopProducts,
  getTopCategories,
  getPerformanceAnalytics,
  getAnalyticsByDateRange,
  refreshAnalytics,
} from "../controllers/analytics.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ============================================================
   ADMIN ANALYTICS PROTECTION
   ============================================================ */

/*
 * Every analytics endpoint requires:
 *
 * 1. Valid JWT
 * 2. Admin role
 */

router.use(protect);
router.use(authorize("admin"));

/* ============================================================
   COMPLETE ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics
 *
 * Query:
 * ?period=7d
 * ?period=30d
 * ?period=90d
 */
router.get(
  "/",
  getAnalytics
);

/* ============================================================
   ANALYTICS SUMMARY
   ============================================================ */

/**
 * GET /api/v1/analytics/summary
 *
 * Returns:
 * - Revenue
 * - Orders
 * - Customers
 * - Products sold
 * - Growth
 */
router.get(
  "/summary",
  getAnalyticsSummary
);

/* ============================================================
   SALES ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/sales
 *
 * Returns time-based:
 * - Revenue
 * - Orders
 * - Labels
 */
router.get(
  "/sales",
  getSalesAnalytics
);

/* ============================================================
   REVENUE ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/revenue
 *
 * Returns:
 * - Revenue
 * - Previous revenue
 * - Revenue growth
 * - Average order value
 * - AOV growth
 */
router.get(
  "/revenue",
  getRevenueAnalytics
);

/* ============================================================
   ORDER ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/orders
 *
 * Returns:
 * - Total orders
 * - Status breakdown
 */
router.get(
  "/orders",
  getOrderAnalytics
);

/* ============================================================
   CUSTOMER ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/customers
 *
 * Returns:
 * - New customers
 * - Total customers
 * - Active customers
 * - Customer activity rate
 */
router.get(
  "/customers",
  getCustomerAnalytics
);

/* ============================================================
   PRODUCT ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/products
 *
 * Returns:
 * - Products sold
 * - Revenue by product
 */
router.get(
  "/products",
  getProductAnalytics
);

/* ============================================================
   CATEGORY ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/categories
 *
 * Returns:
 * - Quantity sold
 * - Revenue by category
 */
router.get(
  "/categories",
  getCategoryAnalytics
);

/* ============================================================
   TOP PRODUCTS
   ============================================================ */

/**
 * GET /api/v1/analytics/top-products
 *
 * Query:
 * ?period=30d
 * ?limit=10
 */
router.get(
  "/top-products",
  getTopProducts
);

/* ============================================================
   TOP CATEGORIES
   ============================================================ */

/**
 * GET /api/v1/analytics/top-categories
 *
 * Query:
 * ?period=30d
 * ?limit=10
 */
router.get(
  "/top-categories",
  getTopCategories
);

/* ============================================================
   PERFORMANCE ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/performance
 *
 * Returns:
 * - Average order value
 * - Conversion rate
 * - Returning customers
 * - Products sold
 * - Revenue
 * - Orders
 */
router.get(
  "/performance",
  getPerformanceAnalytics
);

/* ============================================================
   CUSTOM DATE RANGE
   ============================================================ */

/**
 * GET /api/v1/analytics/date-range
 *
 * Query:
 * ?startDate=2026-09-01
 * &endDate=2026-09-11
 */
router.get(
  "/date-range",
  getAnalyticsByDateRange
);

/* ============================================================
   REFRESH ANALYTICS
   ============================================================ */

/**
 * GET /api/v1/analytics/refresh
 *
 * Returns latest calculated analytics.
 */
router.get(
  "/refresh",
  refreshAnalytics
);

/* ============================================================
   EXPORT
   ============================================================ */

export default router;