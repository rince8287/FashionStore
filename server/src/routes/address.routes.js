import express from "express";

import {
  getAddresses,
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  setDefaultAddress,
} from "../controllers/address.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// ALL ADDRESS ROUTES ARE PROTECTED
//
// Sirf logged-in user hi apne addresses
// access kar sakta hai.
// ======================================================

// ======================================================
// GET ALL ADDRESSES
//
// GET /api/v1/address
// ======================================================

router.get(
  "/",
  protect,
  getAddresses
);

// ======================================================
// GET DEFAULT ADDRESS
//
// GET /api/v1/address/default
//
// IMPORTANT:
// "/default" ko "/:id" se pehle rakhna hai.
// ======================================================

router.get(
  "/default",
  protect,
  getDefaultAddress
);

// ======================================================
// GET SINGLE ADDRESS
//
// GET /api/v1/address/:id
// ======================================================

router.get(
  "/:id",
  protect,
  getAddress
);

// ======================================================
// CREATE ADDRESS
//
// POST /api/v1/address
// ======================================================

router.post(
  "/",
  protect,
  createAddress
);

// ======================================================
// UPDATE ADDRESS
//
// PUT /api/v1/address/:id
// ======================================================

router.put(
  "/:id",
  protect,
  updateAddress
);

// ======================================================
// SET DEFAULT ADDRESS
//
// PATCH /api/v1/address/:id/default
// ======================================================

router.patch(
  "/:id/default",
  protect,
  setDefaultAddress
);

// ======================================================
// DELETE ADDRESS
//
// DELETE /api/v1/address/:id
// ======================================================

router.delete(
  "/:id",
  protect,
  deleteAddress
);

// ======================================================
// EXPORT
// ======================================================

export default router;