import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getRelatedProducts,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getAdminProducts,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ======================================================
// ADMIN ONLY MIDDLEWARE
// ======================================================

const adminOnly = (req, res, next) => {
  // User must be logged in
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  // User must be admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

// ======================================================
// IMAGE UPLOAD MIDDLEWARE
// ======================================================
//
// Frontend FormData field:
// images
//
// Minimum:
// 4 images
//
// Maximum:
// 10 images
//
// Maximum size:
// 5MB per image
//
// NOTE:
// Minimum 4 images is validated inside controller/model.
// ======================================================

const uploadImages = (req, res, next) => {
  upload.array("images", 10)(
    req,
    res,
    (error) => {
      if (!error) {
        return next();
      }

      console.error(
        "IMAGE UPLOAD ERROR:",
        error
      );

      // ==================================================
      // MULTER ERRORS
      // ==================================================

      if (
        error.name ===
        "MulterError"
      ) {
        // ----------------------------------------------
        // File too large
        // ----------------------------------------------

        if (
          error.code ===
          "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Each image must be 5MB or smaller.",
          });
        }

        // ----------------------------------------------
        // Too many files
        // ----------------------------------------------

        if (
          error.code ===
          "LIMIT_FILE_COUNT"
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Maximum 10 images are allowed.",
          });
        }

        // ----------------------------------------------
        // Unexpected field
        // ----------------------------------------------

        if (
          error.code ===
          "LIMIT_UNEXPECTED_FILE"
        ) {
          return res.status(400).json({
            success: false,
            message:
              'Images must be uploaded using the "images" field.',
          });
        }

        // ----------------------------------------------
        // Other multer error
        // ----------------------------------------------

        return res.status(400).json({
          success: false,
          message:
            error.message ||
            "Image upload failed.",
        });
      }

      // ==================================================
      // FILE FILTER / OTHER UPLOAD ERROR
      // ==================================================

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Image upload failed.",
      });
    }
  );
};

// ======================================================
// PUBLIC ROUTES
// ======================================================

// ======================================================
// GET ALL PRODUCTS
// ======================================================
//
// GET /api/v1/products
//
// Examples:
//
// /products
// /products?search=shirt
// /products?gender=men
// /products?category=shirts
// /products?minPrice=500&maxPrice=2000
// /products?size=M
// /products?color=Black
// /products?sort=price-low-high
// /products?page=1&limit=20
//
// ======================================================

router.get(
  "/",
  getProducts
);

// ======================================================
// SPECIAL PUBLIC ROUTES
// ======================================================
//
// IMPORTANT:
// These routes MUST appear before "/:id".
//
// Otherwise Express could treat:
// featured
// trending
// new-arrivals
//
// as a product ID.
//
// ======================================================

// ======================================================
// FEATURED PRODUCTS
// ======================================================
//
// GET /api/v1/products/featured
//
// ======================================================

router.get(
  "/featured",
  getFeaturedProducts
);

// ======================================================
// TRENDING PRODUCTS
// ======================================================
//
// GET /api/v1/products/trending
//
// ======================================================

router.get(
  "/trending",
  getTrendingProducts
);

// ======================================================
// NEW ARRIVALS
// ======================================================
//
// GET /api/v1/products/new-arrivals
//
// ======================================================

router.get(
  "/new-arrivals",
  getNewArrivals
);

// ======================================================
// PRODUCT BY SLUG
// ======================================================
//
// GET /api/v1/products/slug/premium-t-shirt
//
// ======================================================

router.get(
  "/slug/:slug",
  getProductBySlug
);

// ======================================================
// ADMIN ROUTES
// ======================================================

// ======================================================
// GET ALL ADMIN PRODUCTS
// ======================================================
//
// GET /api/v1/products/admin/all
//
// Includes:
//
// Active products
// Inactive products
// Soft-deleted products
//
// ======================================================

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAdminProducts
);

// ======================================================
// CREATE PRODUCT
// ======================================================
//
// POST /api/v1/products
//
// ADMIN ONLY
//
// Content-Type:
// multipart/form-data
//
// Image field:
// images
//
// Minimum:
// 4 images
//
// Maximum:
// 10 images
//
// ======================================================

router.post(
  "/",
  protect,
  adminOnly,
  uploadImages,
  createProduct
);

// ======================================================
// PRODUCT ID ROUTES
// ======================================================

// ======================================================
// RELATED PRODUCTS
// ======================================================
//
// GET /api/v1/products/:id/related
//
// ======================================================

router.get(
  "/:id/related",
  getRelatedProducts
);

// ======================================================
// SINGLE PRODUCT
// ======================================================
//
// GET /api/v1/products/:id
//
// ======================================================

router.get(
  "/:id",
  getProductById
);

// ======================================================
// UPDATE PRODUCT
// ======================================================
//
// PUT /api/v1/products/:id
//
// ADMIN ONLY
//
// New images can be uploaded.
//
// Existing images remain stored unless
// controller replaces/removes them.
//
// Maximum new images per request:
// 10
//
// ======================================================

router.put(
  "/:id",
  protect,
  adminOnly,
  uploadImages,
  updateProduct
);

// ======================================================
// DELETE PRODUCT
// ======================================================
//
// DELETE /api/v1/products/:id
//
// ADMIN ONLY
//
// Soft delete:
// isActive = false
//
// ======================================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

// ======================================================
// RESTORE PRODUCT
// ======================================================
//
// PATCH /api/v1/products/:id/restore
//
// ADMIN ONLY
//
// Restores:
// isActive = true
//
// ======================================================

router.patch(
  "/:id/restore",
  protect,
  adminOnly,
  restoreProduct
);

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;