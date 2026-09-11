import express from "express";

import {
  createCategory,
  getCategories,
  getCategoryTree,
  getCategoryById,
  getCategoryBySlug,
  getSubcategories,
  updateCategory,
  deleteCategory,
  restoreCategory,
} from "../controllers/category.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// ADMIN MIDDLEWARE
// ======================================================

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

// ======================================================
// PUBLIC ROUTES
// ======================================================

// GET ALL CATEGORIES
// GET /api/v1/categories

router.get(
  "/",
  getCategories
);

// ======================================================
// CATEGORY TREE
// ======================================================

// GET /api/v1/categories/tree

router.get(
  "/tree",
  getCategoryTree
);

// ======================================================
// CATEGORY BY SLUG
// ======================================================

// GET /api/v1/categories/slug/men

router.get(
  "/slug/:slug",
  getCategoryBySlug
);

// ======================================================
// SUBCATEGORIES
// ======================================================

// GET /api/v1/categories/:id/subcategories

router.get(
  "/:id/subcategories",
  getSubcategories
);

// ======================================================
// SINGLE CATEGORY
// ======================================================

// GET /api/v1/categories/:id

router.get(
  "/:id",
  getCategoryById
);

// ======================================================
// ADMIN - CREATE
// ======================================================

// POST /api/v1/categories

router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

// ======================================================
// ADMIN - UPDATE
// ======================================================

// PUT /api/v1/categories/:id

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCategory
);

// ======================================================
// ADMIN - SOFT DELETE
// ======================================================

// DELETE /api/v1/categories/:id
//
// IMPORTANT:
// Category MongoDB se delete nahi hogi.
// Sirf isActive = false hoga.

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

// ======================================================
// ADMIN - RESTORE
// ======================================================

// PATCH /api/v1/categories/:id/restore

router.patch(
  "/:id/restore",
  protect,
  adminOnly,
  restoreCategory
);

// ======================================================
// EXPORT
// ======================================================

export default router;