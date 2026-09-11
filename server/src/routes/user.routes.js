// ======================================================
// USER ROUTES
// ======================================================

import express from "express";

import {
  adminGetAllUsers,
  adminGetSingleUser,
  adminGetUserStatistics,
  adminVerifyUser,
  adminBlockUser,
  adminUnblockUser,
  adminUpdateUser,
  adminDeleteUser,

  getMe,

  getMyBankDetails,
  updateMyBankDetails,

  getMyUpiDetails,
  updateMyUpiDetails,
} from "../controllers/user.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";


const router = express.Router();


// ======================================================
// CURRENT USER
// ======================================================

// GET /api/v1/users/me

router.get(
  "/me",
  protect,
  getMe
);


// ======================================================
// CURRENT USER - BANK DETAILS
// ======================================================

// GET /api/v1/users/me/bank-details

router.get(
  "/me/bank-details",
  protect,
  getMyBankDetails
);


// PUT /api/v1/users/me/bank-details

router.put(
  "/me/bank-details",
  protect,
  updateMyBankDetails
);


// ======================================================
// CURRENT USER - UPI DETAILS
// ======================================================

// GET /api/v1/users/me/upi-details

router.get(
  "/me/upi-details",
  protect,
  getMyUpiDetails
);


// PUT /api/v1/users/me/upi-details

router.put(
  "/me/upi-details",
  protect,
  updateMyUpiDetails
);


// ======================================================
// ADMIN CUSTOMER ROUTES
// ======================================================


// ======================================================
// GET ALL CUSTOMERS
//
// GET /api/v1/users/admin/all
// ======================================================

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  adminGetAllUsers
);


// ======================================================
// GET CUSTOMER STATISTICS
//
// GET /api/v1/users/admin/statistics
// ======================================================

router.get(
  "/admin/statistics",
  protect,
  authorize("admin"),
  adminGetUserStatistics
);


// ======================================================
// GET SINGLE CUSTOMER
//
// GET /api/v1/users/admin/:id
// ======================================================

router.get(
  "/admin/:id",
  protect,
  authorize("admin"),
  adminGetSingleUser
);


// ======================================================
// UPDATE CUSTOMER
//
// PUT /api/v1/users/admin/:id
// ======================================================

router.put(
  "/admin/:id",
  protect,
  authorize("admin"),
  adminUpdateUser
);


// ======================================================
// VERIFY CUSTOMER
//
// PATCH /api/v1/users/admin/:id/verify
// ======================================================

router.patch(
  "/admin/:id/verify",
  protect,
  authorize("admin"),
  adminVerifyUser
);


// ======================================================
// BLOCK CUSTOMER
//
// PATCH /api/v1/users/admin/:id/block
// ======================================================

router.patch(
  "/admin/:id/block",
  protect,
  authorize("admin"),
  adminBlockUser
);


// ======================================================
// UNBLOCK CUSTOMER
//
// PATCH /api/v1/users/admin/:id/unblock
// ======================================================

router.patch(
  "/admin/:id/unblock",
  protect,
  authorize("admin"),
  adminUnblockUser
);


// ======================================================
// DELETE CUSTOMER
//
// DELETE /api/v1/users/admin/:id
// ======================================================

router.delete(
  "/admin/:id",
  protect,
  authorize("admin"),
  adminDeleteUser
);


export default router;