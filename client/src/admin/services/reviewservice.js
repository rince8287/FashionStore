import axios from "axios";

// ============================================================
// API INSTANCE
// ============================================================

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/reviews`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// AUTH CONFIG
// ============================================================

const getAuthConfig = () => {
  const token = localStorage.getItem("fashionstore-token");

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ============================================================
// PRODUCT REVIEWS
// ============================================================

/**
 * Get reviews for a specific product
 *
 * @param {string} productId
 * @param {object} params
 */
export const getProductReviews = async (productId, params = {}) => {
  const { data } = await API.get(`/product/${productId}`, {
    ...getAuthConfig(),
    params,
  });

  return data;
};

// ============================================================
// SINGLE REVIEW
// ============================================================

/**
 * Get a single review by ID
 *
 * @param {string} reviewId
 */
export const getReviewById = async (reviewId) => {
  const { data } = await API.get(`/${reviewId}`, getAuthConfig());

  return data;
};

// ============================================================
// CREATE REVIEW
// ============================================================

/**
 * Create a new product review
 *
 * @param {object} reviewData
 */
export const createReview = async (reviewData) => {
  const { data } = await API.post(
    "/",
    reviewData,
    getAuthConfig()
  );

  return data;
};

// ============================================================
// MY REVIEWS
// ============================================================

/**
 * Get reviews created by the logged-in user
 *
 * @param {object} params
 */
export const getMyReviews = async (params = {}) => {
  const { data } = await API.get("/my", {
    ...getAuthConfig(),
    params,
  });

  return data;
};

// ============================================================
// UPDATE REVIEW
// ============================================================

/**
 * Update user's own review
 *
 * @param {string} reviewId
 * @param {object} reviewData
 */
export const updateReview = async (reviewId, reviewData) => {
  const { data } = await API.put(
    `/${reviewId}`,
    reviewData,
    getAuthConfig()
  );

  return data;
};

// ============================================================
// DELETE REVIEW
// ============================================================

/**
 * Delete a review
 *
 * @param {string} reviewId
 */
export const deleteReview = async (reviewId) => {
  const { data } = await API.delete(
    `/${reviewId}`,
    getAuthConfig()
  );

  return data;
};

// ============================================================
// MARK REVIEW HELPFUL
// ============================================================

/**
 * Mark a review as helpful
 *
 * @param {string} reviewId
 */
export const markReviewHelpful = async (reviewId) => {
  const { data } = await API.post(
    `/${reviewId}/helpful`,
    {},
    getAuthConfig()
  );

  return data;
};

// ============================================================
// ADMIN - GET ALL REVIEWS
// ============================================================

/**
 * Get all reviews for admin panel
 *
 * Supported params:
 * - page
 * - limit
 * - search
 * - status
 * - rating
 * - verifiedPurchase
 * - sort
 *
 * @param {object} params
 */
export const getAllReviewsForAdmin = async (params = {}) => {
  const { data } = await API.get("/admin", {
    ...getAuthConfig(),
    params,
  });

  return data;
};

// ============================================================
// ADMIN - REPLY TO REVIEW
// ============================================================

/**
 * Admin reply to a review
 *
 * @param {string} reviewId
 * @param {object|string} replyData
 */
export const adminReplyToReview = async (reviewId, replyData) => {
  const payload =
    typeof replyData === "string"
      ? {
          message: replyData,
        }
      : replyData;

  const { data } = await API.post(
    `/${reviewId}/reply`,
    payload,
    getAuthConfig()
  );

  return data;
};

// ============================================================
// ADMIN - UPDATE REVIEW STATUS
// ============================================================

/**
 * Update review status
 *
 * Allowed statuses:
 * - Pending
 * - Approved
 * - Rejected
 *
 * @param {string} reviewId
 * @param {string} status
 */
export const updateReviewStatus = async (reviewId, status) => {
  const { data } = await API.patch(
    `/${reviewId}/status`,
    {
      status,
    },
    getAuthConfig()
  );

  return data;
};

// ============================================================
// ADMIN - REVIEW STATISTICS
// ============================================================

/**
 * Get review statistics for admin dashboard
 */
export const getReviewStatistics = async () => {
  const { data } = await API.get(
    "/statistics",
    getAuthConfig()
  );

  return data;
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const reviewService = {
  // Product
  getProductReviews,

  // Single Review
  getReviewById,

  // User
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,

  // Admin
  getAllReviewsForAdmin,
  adminReplyToReview,
  updateReviewStatus,
  getReviewStatistics,
};

export default reviewService;
console.log("✅ reviewservice.js LOADED - ADMIN EXPORT AVAILABLE");