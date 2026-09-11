import express from "express";

import {
  getCart,
  addToCart,
  updateCartItem,
  updateCartItemVariant,
  removeCartItem,
  clearCart,
  getCartCount,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// ALL CART ROUTES ARE PROTECTED
//
// Cart sirf logged-in user access kar sakta hai.
// protect middleware JWT token verify karega.
// ======================================================

// ======================================================
// GET CART
//
// GET /api/v1/cart
//
// Logged-in user ka complete cart return karega.
// ======================================================

router.get(
  "/",
  protect,
  getCart
);

// ======================================================
// GET CART COUNT
//
// GET /api/v1/cart/count
//
// Header ke cart badge ke liye.
//
// Example:
//
// {
//   "success": true,
//   "itemCount": 3
// }
//
// IMPORTANT:
// "/count" ko "/:itemId" se pehle rakhna hai.
// ======================================================

router.get(
  "/count",
  protect,
  getCartCount
);

// ======================================================
// ADD PRODUCT TO CART
//
// POST /api/v1/cart
//
// Example Body:
//
// {
//   "productId": "PRODUCT_MONGODB_ID",
//   "quantity": 1,
//   "size": "M",
//   "color": "Black"
// }
//
// Size/color optional ho sakte hain depending on product.
// ======================================================

router.post(
  "/",
  protect,
  addToCart
);

// ======================================================
// UPDATE CART ITEM QUANTITY
//
// PUT /api/v1/cart/:itemId
//
// Example:
//
// PUT /api/v1/cart/68abc123...
//
// Body:
//
// {
//   "quantity": 3
// }
// ======================================================

router.put(
  "/:itemId",
  protect,
  updateCartItem
);

// ======================================================
// UPDATE SIZE / COLOR VARIANT
//
// PATCH /api/v1/cart/:itemId/variant
//
// Example Body:
//
// {
//   "size": "XL",
//   "color": "Black"
// }
// ======================================================

router.patch(
  "/:itemId/variant",
  protect,
  updateCartItemVariant
);

// ======================================================
// REMOVE SINGLE CART ITEM
//
// DELETE /api/v1/cart/:itemId
//
// Sirf selected item remove hoga.
// ======================================================

router.delete(
  "/:itemId",
  protect,
  removeCartItem
);

// ======================================================
// CLEAR COMPLETE CART
//
// DELETE /api/v1/cart
//
// User ke cart ke saare items remove honge.
// ======================================================

router.delete(
  "/",
  protect,
  clearCart
);

// ======================================================
// EXPORT
// ======================================================

export default router;