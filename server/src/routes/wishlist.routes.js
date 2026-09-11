import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  getWishlistCount,
  checkWishlist,
  moveToCart,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// ALL WISHLIST ROUTES ARE PROTECTED
//
// Wishlist sirf logged-in user access kar sakta hai.
// "protect" middleware JWT token verify karega.
// ======================================================

// ======================================================
// GET COMPLETE WISHLIST
//
// GET /api/v1/wishlist
// ======================================================

router.get(
  "/",
  protect,
  getWishlist
);

// ======================================================
// GET WISHLIST COUNT
//
// GET /api/v1/wishlist/count
//
// Header ke heart icon ❤️ ke badge ke liye.
//
// Example response:
//
// {
//   "success": true,
//   "itemCount": 3
// }
//
// IMPORTANT:
// Is route ko dynamic "/:productId" routes se
// pehle rakhna better hai.
// ======================================================

router.get(
  "/count",
  protect,
  getWishlistCount
);

// ======================================================
// CHECK PRODUCT IN WISHLIST
//
// GET /api/v1/wishlist/check/:productId
//
// Product card ya Product Details page par
// heart filled/unfilled dikhane ke liye.
//
// Example:
//
// GET /api/v1/wishlist/check/PRODUCT_ID
//
// Response:
//
// {
//   "success": true,
//   "inWishlist": true
// }
// ======================================================

router.get(
  "/check/:productId",
  protect,
  checkWishlist
);

// ======================================================
// ADD PRODUCT TO WISHLIST
//
// POST /api/v1/wishlist/:productId
//
// Example:
//
// POST /api/v1/wishlist/PRODUCT_ID
//
// Body ki zarurat nahi hai.
// ======================================================

router.post(
  "/:productId",
  protect,
  addToWishlist
);

// ======================================================
// TOGGLE WISHLIST
//
// POST /api/v1/wishlist/:productId/toggle
//
// Product wishlist me nahi hai:
//     → Add
//
// Product wishlist me already hai:
//     → Remove
//
// Product Card ke ❤️ button ke liye useful.
// ======================================================

router.post(
  "/:productId/toggle",
  protect,
  toggleWishlist
);

// ======================================================
// MOVE WISHLIST PRODUCT TO CART
//
// POST /api/v1/wishlist/:productId/move-to-cart
//
// Example Body:
//
// {
//   "quantity": 1,
//   "size": "M",
//   "color": "Black"
// }
//
// Product:
// Wishlist ❌
//      ↓
// Cart ✅
//
// Size/color product ke according required
// ya optional ho sakte hain.
// ======================================================

router.post(
  "/:productId/move-to-cart",
  protect,
  moveToCart
);

// ======================================================
// REMOVE PRODUCT FROM WISHLIST
//
// DELETE /api/v1/wishlist/:productId
//
// Example:
//
// DELETE /api/v1/wishlist/PRODUCT_ID
// ======================================================

router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);

// ======================================================
// CLEAR COMPLETE WISHLIST
//
// DELETE /api/v1/wishlist
//
// User ki complete wishlist empty ho jayegi.
// ======================================================

router.delete(
  "/",
  protect,
  clearWishlist
);

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;