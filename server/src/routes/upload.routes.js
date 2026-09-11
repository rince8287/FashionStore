import express from "express";

import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
} from "../controllers/upload.controller.js";

import upload from "../middleware/upload.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// ======================================================
// SINGLE IMAGE
// POST /api/v1/upload/single
// ======================================================

router.post(
  "/single",
  protect,
  authorize("admin"),
  upload.single("image"),
  uploadSingleImage
);

// ======================================================
// MULTIPLE IMAGES
// POST /api/v1/upload/multiple
// ======================================================

router.post(
  "/multiple",
  protect,
  authorize("admin"),
  upload.array("images", 10),
  uploadMultipleImages
);

// ======================================================
// DELETE IMAGE
// DELETE /api/v1/upload/:publicId
// ======================================================

router.delete(
  "/:publicId",
  protect,
  authorize("admin"),
  deleteImage
);

export default router;