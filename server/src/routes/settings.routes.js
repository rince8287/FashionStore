import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/settings.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

// ======================================================
// ROUTER
// ======================================================

const router = express.Router();

// ======================================================
// GET SETTINGS
// ======================================================
//
// GET /api/v1/settings
//
// Sirf authenticated admin settings dekh sakta hai.
//
// ======================================================

router.get(
  "/",
  protect,
  authorize("admin"),
  getSettings
);

// ======================================================
// UPDATE SETTINGS
// ======================================================
//
// PUT /api/v1/settings
//
// Sirf authenticated admin settings update kar sakta hai.
//
// ======================================================

router.put(
  "/",
  protect,
  authorize("admin"),
  updateSettings
);

// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;