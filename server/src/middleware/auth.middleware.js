import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ======================================================
// PROTECT MIDDLEWARE
// ======================================================
// Verifies JWT token and attaches authenticated user
// to req.user.
//
// Usage:
// router.get("/profile", protect, controller);
//
// ======================================================

export const protect = async (
  req,
  res,
  next
) => {
  try {
    // ==================================================
    // CHECK JWT SECRET
    // ==================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "AUTH ERROR: JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Authentication service is not configured properly.",
      });
    }

    // ==================================================
    // GET AUTHORIZATION HEADER
    // ==================================================

    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      typeof authorization !== "string"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Access denied. Please login first.",
      });
    }

    // ==================================================
    // CHECK BEARER FORMAT
    // ==================================================

    const parts =
      authorization.trim().split(/\s+/);

    if (
      parts.length !== 2 ||
      parts[0].toLowerCase() !== "bearer" ||
      !parts[1]
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication format.",
      });
    }

    const token = parts[1];

    // ==================================================
    // VERIFY JWT
    // ==================================================

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      // ----------------------------------------------
      // Token expired
      // ----------------------------------------------

      if (
        error.name ===
        "TokenExpiredError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Your session has expired. Please login again.",
        });
      }

      // ----------------------------------------------
      // Invalid token
      // ----------------------------------------------

      if (
        error.name ===
        "JsonWebTokenError"
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid authentication token.",
        });
      }

      // ----------------------------------------------
      // Other JWT errors
      // ----------------------------------------------

      console.error(
        "JWT verification error:",
        error.message
      );

      return res.status(401).json({
        success: false,
        message:
          "Authentication failed.",
      });
    }

    // ==================================================
    // VALIDATE DECODED TOKEN
    // ==================================================

    if (
      !decoded ||
      typeof decoded !== "object"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    // ==================================================
    // GET USER ID
    //
    // Your login/register JWT should contain:
    //
    // {
    //   id: user._id
    // }
    //
    // Also supporting _id/sub makes middleware
    // slightly more resilient.
    // ==================================================

    const userId =
      decoded.id ||
      decoded._id ||
      decoded.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token does not contain a user ID.",
      });
    }

    // ==================================================
    // VALIDATE USER ID
    // ==================================================

    if (
      typeof userId !== "string" &&
      typeof userId !== "object"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid user ID in authentication token.",
      });
    }

    // ==================================================
    // FIND USER
    // ==================================================

    const user =
      await User.findById(
        userId
      ).select("-password");

    // ==================================================
    // USER NOT FOUND
    // ==================================================

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists.",
      });
    }

    // ==================================================
    // ACCOUNT ACTIVE CHECK
    // ==================================================

    if (
      user.isActive === false
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive. Please contact support.",
      });
    }

    // ==================================================
    // NORMALIZE ROLE
    // ==================================================

    const normalizedRole =
      String(
        user.role || "user"
      )
        .trim()
        .toLowerCase();

    // ==================================================
    // ATTACH USER
    // ==================================================

    req.user = user;

    // Normalized role for controllers
    req.userRole =
      normalizedRole;

    // ==================================================
    // CONTINUE
    // ==================================================

    return next();
  } catch (error) {
    // ==================================================
    // DATABASE / UNEXPECTED ERROR
    // ==================================================

    console.error(
      "Auth middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Authentication service error.",
    });
  }
};

// ======================================================
// AUTHORIZE MIDDLEWARE
// ======================================================
//
// Usage:
//
// authorize("admin")
//
// Multiple roles:
//
// authorize("admin", "manager")
//
// Case-insensitive:
//
// authorize("ADMIN")
// authorize("Admin")
// authorize("admin")
//
// ======================================================

export const authorize =
  (...roles) => {
    return (
      req,
      res,
      next
    ) => {
      // ==================================================
      // AUTHENTICATION CHECK
      // ==================================================

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      // ==================================================
      // VALIDATE ROLES CONFIGURATION
      // ==================================================

      if (
        !Array.isArray(roles) ||
        roles.length === 0
      ) {
        console.error(
          "Authorization error: No roles configured."
        );

        return res.status(500).json({
          success: false,
          message:
            "Authorization configuration error.",
        });
      }

      // ==================================================
      // CURRENT USER ROLE
      // ==================================================

      const userRole =
        String(
          req.user.role || ""
        )
          .trim()
          .toLowerCase();

      // ==================================================
      // NORMALIZE ALLOWED ROLES
      // ==================================================

      const allowedRoles =
        roles
          .filter(
            (role) =>
              role !== undefined &&
              role !== null
          )
          .map((role) =>
            String(role)
              .trim()
              .toLowerCase()
          )
          .filter(Boolean);

      // ==================================================
      // ROLE CHECK
      // ==================================================

      if (
        !allowedRoles.includes(
          userRole
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "You are not authorized to access this resource.",
        });
      }

      // ==================================================
      // AUTHORIZED
      // ==================================================

      return next();
    };
  };