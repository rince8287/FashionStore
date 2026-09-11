import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

// ======================================================
// ROUTES
// ======================================================

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

// ======================================================
// CONTROLLERS
// ======================================================

import {
  razorpayWebhook,
} from "./controllers/payment.controller.js";

// ======================================================
// APP
// ======================================================

const app = express();

// ======================================================
// BASIC CONFIGURATION
// ======================================================

app.disable("x-powered-by");
app.disable("etag");

// ======================================================
// ENVIRONMENT
// ======================================================

const NODE_ENV =
  process.env.NODE_ENV ||
  "development";

const CLIENT_URL =
  process.env.CLIENT_URL ||
  "http://localhost:5173";

// Support multiple frontend URLs:
//
// CLIENT_URL=http://localhost:5173,http://localhost:3000
//

const allowedOrigins = CLIENT_URL
  .split(",")
  .map((origin) =>
    origin.trim().replace(/\/$/, "")
  )
  .filter(Boolean);

console.log(
  "=========================================="
);

console.log(
  "🚀 FashionStore Backend Starting..."
);

console.log(
  "🌍 Environment:",
  NODE_ENV
);

console.log(
  "🌐 Allowed Client URL:",
  CLIENT_URL
);

console.log(
  "=========================================="
);

// ======================================================
// SECURITY HEADERS
// ======================================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ======================================================
// CORS
// ======================================================

const corsOptions = {
  origin: (
    origin,
    callback
  ) => {
    // --------------------------------------------------
    // Allow requests without Origin
    //
    // Examples:
    // Postman
    // Server-to-server
    // Some health checks
    // --------------------------------------------------

    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin =
      origin
        .trim()
        .replace(/\/$/, "");

    // --------------------------------------------------
    // Check allowed frontend
    // --------------------------------------------------

    if (
      allowedOrigins.includes(
        normalizedOrigin
      )
    ) {
      return callback(
        null,
        true
      );
    }

    // --------------------------------------------------
    // Block unknown origin
    // --------------------------------------------------

    console.error(
      "❌ CORS blocked origin:",
      origin
    );

    return callback(
      new Error(
        `CORS blocked origin: ${origin}`
      )
    );
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Razorpay-Signature",
  ],

  optionsSuccessStatus: 204,
};

// ======================================================
// APPLY CORS
// ======================================================
//
// IMPORTANT:
// Do NOT use:
// app.options("*", ...)
//
// Your Express/path-to-regexp version throws:
//
// Missing parameter name at index 1: *
//
// app.use(cors(...)) already handles CORS middleware.
//

app.use(
  cors(corsOptions)
);

// ======================================================
// RAZORPAY WEBHOOK
// ======================================================
//
// IMPORTANT:
//
// Razorpay webhook needs the ORIGINAL RAW BODY
// for signature verification.
//
// Therefore this route MUST come before:
//
// express.json()
// express.urlencoded()
//
// ======================================================

app.post(
  "/api/v1/payments/webhook",

  express.raw({
    type: "application/json",
    limit: "2mb",
  }),

  razorpayWebhook
);

// ======================================================
// BODY PARSERS
// ======================================================

app.use(
  express.json({
    limit: "10mb",
    strict: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ======================================================
// COOKIE PARSER
// ======================================================

app.use(
  cookieParser()
);

// ======================================================
// COMPRESSION
// ======================================================

app.use(
  compression()
);

// ======================================================
// HTTP LOGGER
// ======================================================

app.use(
  morgan(
    NODE_ENV ===
      "production"
      ? "combined"
      : "dev"
  )
);

// ======================================================
// ROOT HEALTH CHECK
// ======================================================

app.get(
  "/",
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "🚀 FashionStore Backend Running Successfully",

      environment:
        NODE_ENV,

      timestamp:
        new Date().toISOString(),
    });
  }
);

// ======================================================
// API HEALTH CHECK
// ======================================================

app.get(
  "/api/v1/health",
  (req, res) => {
    return res.status(200).json({
      success: true,

      message:
        "FashionStore API is healthy.",

      environment:
        NODE_ENV,

      timestamp:
        new Date().toISOString(),
    });
  }
);

// ======================================================
// API ROUTES
// ======================================================

// ======================================================
// AUTH
// ======================================================

app.use(
  "/api/v1/auth",
  authRoutes
);

// ======================================================
// USERS
// ======================================================

app.use(
  "/api/v1/users",
  userRoutes
);

// ======================================================
// CATEGORIES
// ======================================================

app.use(
  "/api/v1/categories",
  categoryRoutes
);

// ======================================================
// PRODUCTS
// ======================================================

app.use(
  "/api/v1/products",
  productRoutes
);

// ======================================================
// CART
// ======================================================

app.use(
  "/api/v1/cart",
  cartRoutes
);

// ======================================================
// WISHLIST
// ======================================================

app.use(
  "/api/v1/wishlist",
  wishlistRoutes
);

// ======================================================
// ADDRESS
// ======================================================

app.use(
  "/api/v1/address",
  addressRoutes
);

// ======================================================
// ORDERS
// ======================================================

app.use(
  "/api/v1/orders",
  orderRoutes
);

// ======================================================
// PAYMENTS
// ======================================================

app.use(
  "/api/v1/payments",
  paymentRoutes
);

// ======================================================
// ADMIN
// ======================================================

app.use(
  "/api/v1/admin",
  adminRoutes
);

// ======================================================
// UPLOAD
// ======================================================

app.use(
  "/api/v1/upload",
  uploadRoutes
);

// ======================================================
// COUPONS
// ======================================================

app.use(
  "/api/v1/coupons",
  couponRoutes
);

// ======================================================
// TRANSACTIONS
// ======================================================

app.use(
  "/api/v1/transactions",
  transactionRoutes
);

// ======================================================
// REVIEWS
// ======================================================

app.use(
  "/api/v1/reviews",
  reviewRoutes
);

// ======================================================
// NOTIFICATIONS
// ======================================================

app.use(
  "/api/v1/notifications",
  notificationRoutes
);

// ======================================================
// SETTINGS
// ======================================================

app.use(
  "/api/v1/settings",
  settingsRoutes
);

// ======================================================
// ANALYTICS
// ======================================================

app.use(
  "/api/v1/analytics",
  analyticsRoutes
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,

      message:
        "Route not found.",

      method:
        req.method,

      path:
        req.originalUrl,
    });
  }
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (
    error,
    req,
    res
  ) => {
    console.error(
      "❌ Server Error:",
      error
    );

    // ==================================================
    // CORS ERROR
    // ==================================================

    if (
      error?.message?.startsWith(
        "CORS blocked origin"
      )
    ) {
      return res.status(403).json({
        success: false,

        message:
          error.message,
      });
    }

    // ==================================================
    // INVALID JSON
    // ==================================================

    if (
      error instanceof
        SyntaxError &&
      error.status === 400 &&
      (
        "body" in error ||
        error.type ===
          "entity.parse.failed"
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid JSON data.",
      });
    }

    // ==================================================
    // REQUEST TOO LARGE
    // ==================================================

    if (
      error?.type ===
        "entity.too.large" ||
      error?.status === 413
    ) {
      return res.status(413).json({
        success: false,

        message:
          "Request payload is too large.",
      });
    }

    // ==================================================
    // FILE TOO LARGE
    // ==================================================

    if (
      error?.code ===
      "LIMIT_FILE_SIZE"
    ) {
      return res.status(413).json({
        success: false,

        message:
          "Uploaded file is too large.",
      });
    }

    // ==================================================
    // TOO MANY FILES
    // ==================================================

    if (
      error?.code ===
      "LIMIT_FILE_COUNT"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Too many files uploaded.",
      });
    }

    // ==================================================
    // MONGOOSE VALIDATION ERROR
    // ==================================================

    if (
      error?.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors || {}
        )
          .map(
            (item) =>
              item.message
          )
          .filter(Boolean);

      return res.status(400).json({
        success: false,

        message:
          messages.length > 0
            ? messages.join(" ")
            : "Validation failed.",

        ...(NODE_ENV ===
        "development"
          ? {
              errors:
                error.errors,
            }
          : {}),
      });
    }

    // ==================================================
    // INVALID MONGODB OBJECT ID
    // ==================================================

    if (
      error?.name ===
      "CastError"
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid resource ID.",
      });
    }

    // ==================================================
    // DUPLICATE KEY
    // ==================================================

    if (
      error?.code === 11000
    ) {
      const duplicateFields =
        Object.keys(
          error.keyPattern ||
            error.keyValue ||
            {}
        );

      const field =
        duplicateFields[0] ||
        "field";

      return res.status(409).json({
        success: false,

        message:
          `${field} already exists.`,
      });
    }

    // ==================================================
    // JWT INVALID
    // ==================================================

    if (
      error?.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Invalid authentication token.",
      });
    }

    // ==================================================
    // JWT EXPIRED
    // ==================================================

    if (
      error?.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,

        message:
          "Authentication token has expired.",
      });
    }

    // ==================================================
    // DEFAULT ERROR
    // ==================================================

    const requestedStatus =
      Number(
        error?.statusCode ||
          error?.status ||
          500
      );

    const statusCode =
      requestedStatus >= 400 &&
      requestedStatus < 600
        ? requestedStatus
        : 500;

    // ==================================================
    // PRODUCTION SAFE MESSAGE
    // ==================================================

    let message =
      "Internal Server Error.";

    if (
      NODE_ENV ===
      "development"
    ) {
      message =
        error?.message ||
        message;
    } else if (
      statusCode !== 500 &&
      error?.message
    ) {
      message =
        error.message;
    }

    return res.status(
      statusCode
    ).json({
      success: false,
      message,
    });
  }
);

// ======================================================
// EXPORT
// ======================================================

export default app;