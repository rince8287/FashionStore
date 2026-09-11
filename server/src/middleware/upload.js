import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../config/cloudinary.js";

// ======================================================
// ALLOWED IMAGE TYPES
// ======================================================

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
];

const ALLOWED_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
];

// ======================================================
// CLOUDINARY STORAGE
// ======================================================

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (
      req,
      file
    ) => {
      // ----------------------------------------------
      // Original filename
      // ----------------------------------------------

      const originalName =
        file.originalname
          ?.split(".")
          .slice(0, -1)
          .join(".") ||
        "product-image";

      // ----------------------------------------------
      // Clean filename
      // ----------------------------------------------

      const cleanName =
        originalName
          .toString()
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          );

      // ----------------------------------------------
      // Unique public ID
      // ----------------------------------------------

      const publicId =
        `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}-${cleanName || "product-image"}`;

      return {
        folder:
          "FashionStore/products",

        resource_type:
          "image",

        allowed_formats:
          ALLOWED_FORMATS,

        public_id:
          publicId,
      };
    },
  });

// ======================================================
// FILE FILTER
// ======================================================

const fileFilter = (
  req,
  file,
  cb
) => {
  // ----------------------------------------------
  // Check MIME type
  // ----------------------------------------------

  if (
    ALLOWED_MIME_TYPES.includes(
      file.mimetype
    )
  ) {
    return cb(
      null,
      true
    );
  }

  // ----------------------------------------------
  // Reject unsupported file
  // ----------------------------------------------

  return cb(
    new Error(
      "Only JPG, JPEG, PNG, WEBP and AVIF images are allowed."
    ),
    false
  );
};

// ======================================================
// MULTER CONFIGURATION
// ======================================================
//
// Maximum:
// 10 images
//
// Maximum size:
// 5MB per image
//
// Field name:
// images
//
// ======================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,

    files: 10,
  },
});

// ======================================================
// EXPORT
// ======================================================

export default upload;