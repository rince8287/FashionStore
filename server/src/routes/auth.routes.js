import express from "express";

// ======================================================
// AUTH CONTROLLER
// ======================================================

import {
  registerUser,
  loginUser,
  googleLogin,
  appleLogin,
  getMe,
  updateProfile,
  changePassword,
  logoutUser,
  getBankDetails,
  getUpiDetails,
} from "../controllers/auth.controller.js";

// ======================================================
// AUTH MIDDLEWARE
// ======================================================

import { protect } from "../middleware/auth.middleware.js";


// ======================================================
// ROUTER
// ======================================================

const router = express.Router();


// ======================================================
// PUBLIC AUTH ROUTES
// ======================================================
//
// In routes par login ki zarurat nahi hai.
//
// POST /api/v1/auth/register
// POST /api/v1/auth/login
// POST /api/v1/auth/google
// POST /api/v1/auth/apple
//
// ======================================================


// ======================================================
// REGISTER
// ======================================================

router.post(
  "/register",
  registerUser
);


// ======================================================
// EMAIL / PASSWORD LOGIN
// ======================================================

router.post(
  "/login",
  loginUser
);


// ======================================================
// GOOGLE LOGIN
// ======================================================
//
// Frontend Google se ID token / credential lega
// aur yahan bhejega.
//
// POST /api/v1/auth/google
//
// Body:
//
// {
//   credential: "GOOGLE_ID_TOKEN"
// }
//
// ======================================================

router.post(
  "/google",
  googleLogin
);


// ======================================================
// APPLE LOGIN
// ======================================================
//
// Frontend Apple se identity token lega
// aur yahan bhejega.
//
// POST /api/v1/auth/apple
//
// Body:
//
// {
//   identityToken: "APPLE_IDENTITY_TOKEN",
//   name: "Optional Name"
// }
//
// ======================================================

router.post(
  "/apple",
  appleLogin
);


// ======================================================
// PROTECTED AUTH ROUTES
// ======================================================
//
// In routes ke liye valid FashionStore JWT required hai.
//
// ======================================================


// ======================================================
// GET CURRENT USER
// ======================================================
//
// GET /api/v1/auth/me
//
// ======================================================

router.get(
  "/me",
  protect,
  getMe
);


// ======================================================
// UPDATE PROFILE
// ======================================================
//
// PUT /api/v1/auth/profile
//
// ======================================================

router.put(
  "/profile",
  protect,
  updateProfile
);


// ======================================================
// CHANGE PASSWORD
// ======================================================
//
// PUT /api/v1/auth/password
//
// ======================================================

router.put(
  "/password",
  protect,
  changePassword
);


// ======================================================
// LOGOUT
// ======================================================
//
// POST /api/v1/auth/logout
//
// ======================================================

router.post(
  "/logout",
  protect,
  logoutUser
);


// ======================================================
// BANK DETAILS
// ======================================================
//
// GET /api/v1/auth/bank-details
//
// ======================================================

router.get(
  "/bank-details",
  protect,
  getBankDetails
);


// ======================================================
// UPI DETAILS
// ======================================================
//
// GET /api/v1/auth/upi-details
//
// ======================================================

router.get(
  "/upi-details",
  protect,
  getUpiDetails
);


// ======================================================
// EXPORT ROUTER
// ======================================================

export default router;