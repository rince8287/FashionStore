// src/services/reviewservice.js

import axios from "axios";

// ======================================================
// API INSTANCE
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: `${API_URL}/reviews`,

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// HELPER — GET AUTH TOKEN
// ======================================================

const getAuthConfig = () => {
  const token = localStorage.getItem(
    "fashionstore-token"
  );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET PRODUCT REVIEWS
//
// GET /api/v1/reviews/product/:productId
//
// PUBLIC
// ======================================================

export const getProductReviews = async (
  productId,
  params = {}
) => {
  const { data } = await API.get(
    `/product/${productId}`,
    {
      params,
    }
  );

  return data;
};

// ======================================================
// GET SINGLE REVIEW
//
// GET /api/v1/reviews/:id
//
// PUBLIC
// ======================================================

export const getReviewById = async (
  reviewId
) => {
  const { data } = await API.get(
    `/${reviewId}`
  );

  return data;
};

// ======================================================
// CREATE REVIEW
//
// POST /api/v1/reviews
//
// LOGIN REQUIRED
//
// reviewData example:
//
// {
//   productId,
//   rating,
//   title,
//   comment,
//   images
// }
// ======================================================

export const createReview = async (
  reviewData
) => {
  const { data } = await API.post(
    "/",
    reviewData,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// GET MY REVIEWS
//
// GET /api/v1/reviews/my
//
// LOGIN REQUIRED
// ======================================================

export const getMyReviews = async (
  params = {}
) => {
  const { data } = await API.get(
    "/my",
    {
      ...getAuthConfig(),
      params,
    }
  );

  return data;
};

// ======================================================
// UPDATE REVIEW
//
// PUT /api/v1/reviews/:id
//
// LOGIN REQUIRED
// ======================================================

export const updateReview = async (
  reviewId,
  reviewData
) => {
  const { data } = await API.put(
    `/${reviewId}`,
    reviewData,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// DELETE REVIEW
//
// DELETE /api/v1/reviews/:id
//
// LOGIN REQUIRED
// ======================================================

export const deleteReview = async (
  reviewId
) => {
  const { data } = await API.delete(
    `/${reviewId}`,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// MARK REVIEW AS HELPFUL
//
// POST /api/v1/reviews/:id/helpful
//
// LOGIN REQUIRED
// ======================================================

export const markReviewHelpful = async (
  reviewId
) => {
  const { data } = await API.post(
    `/${reviewId}/helpful`,
    {},
    getAuthConfig()
  );

  return data;
};

// ======================================================
// ADMIN — REPLY TO REVIEW
//
// POST /api/v1/reviews/:id/reply
//
// ADMIN REQUIRED
// ======================================================

export const adminReplyToReview = async (
  reviewId,
  message
) => {
  const { data } = await API.post(
    `/${reviewId}/reply`,
    {
      message,
    },
    getAuthConfig()
  );

  return data;
};

// ======================================================
// ADMIN — UPDATE REVIEW STATUS
//
// PATCH /api/v1/reviews/:id/status
//
// status:
// "Pending"
// "Approved"
// "Rejected"
//
// ADMIN REQUIRED
// ======================================================

export const updateReviewStatus = async (
  reviewId,
  status
) => {
  const { data } = await API.patch(
    `/${reviewId}/status`,
    {
      status,
    },
    getAuthConfig()
  );

  return data;
};

// ======================================================
// ADMIN — GET REVIEW STATISTICS
//
// GET /api/v1/reviews/statistics
//
// ADMIN REQUIRED
// ======================================================

export const getReviewStatistics =
  async () => {
    const { data } = await API.get(
      "/statistics",
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// DEFAULT EXPORT
// ======================================================

const reviewService = {
  getProductReviews,
  getReviewById,
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  adminReplyToReview,
  updateReviewStatus,
  getReviewStatistics,
};

export default reviewService;