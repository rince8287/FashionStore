import axios from "axios";

// ======================================================
// API CONFIG
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const couponAPI = axios.create({
  baseURL: `${API_BASE_URL}/coupons`,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 15000,
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================
//
// Automatically attaches logged-in user's JWT token.
//
// Token key used by FashionStore:
// fashionstore-token
//
// ======================================================

couponAPI.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "fashionstore-token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

couponAPI.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    // --------------------------------------------------
    // Normalize API error
    // --------------------------------------------------

    if (error.response) {
      const message =
        error.response.data?.message ||
        "Something went wrong.";

      error.message = message;
    } else if (error.request) {
      error.message =
        "Unable to connect to the server.";
    } else {
      error.message =
        error.message ||
        "Request failed.";
    }

    return Promise.reject(error);
  }
);

// ======================================================
// COUPON SERVICE
// ======================================================

const couponService = {
  // ====================================================
  // ADMIN
  // GET ALL COUPONS
  // ====================================================

  getAllCoupons: async (
    params = {}
  ) => {
    const response =
      await couponAPI.get(
        "/",
        {
          params,
        }
      );

    return response.data;
  },

  // ====================================================
  // ADMIN
  // GET COUPON BY ID
  // ====================================================

  getCouponById: async (
    couponId
  ) => {
    if (!couponId) {
      throw new Error(
        "Coupon ID is required."
      );
    }

    const response =
      await couponAPI.get(
        `/${couponId}`
      );

    return response.data;
  },

  // ====================================================
  // ADMIN
  // CREATE COUPON
  // ====================================================

  createCoupon: async (
    couponData
  ) => {
    if (
      !couponData ||
      typeof couponData !==
        "object"
    ) {
      throw new Error(
        "Coupon data is required."
      );
    }

    const response =
      await couponAPI.post(
        "/",
        couponData
      );

    return response.data;
  },

  // ====================================================
  // ADMIN
  // UPDATE COUPON
  // ====================================================

  updateCoupon: async (
    couponId,
    couponData
  ) => {
    if (!couponId) {
      throw new Error(
        "Coupon ID is required."
      );
    }

    if (
      !couponData ||
      typeof couponData !==
        "object"
    ) {
      throw new Error(
        "Coupon data is required."
      );
    }

    const response =
      await couponAPI.put(
        `/${couponId}`,
        couponData
      );

    return response.data;
  },

  // ====================================================
  // ADMIN
  // DELETE COUPON
  // ====================================================

  deleteCoupon: async (
    couponId
  ) => {
    if (!couponId) {
      throw new Error(
        "Coupon ID is required."
      );
    }

    const response =
      await couponAPI.delete(
        `/${couponId}`
      );

    return response.data;
  },

  // ====================================================
  // ADMIN
  // TOGGLE COUPON STATUS
  // ====================================================

  toggleCouponStatus: async (
    couponId
  ) => {
    if (!couponId) {
      throw new Error(
        "Coupon ID is required."
      );
    }

    const response =
      await couponAPI.patch(
        `/${couponId}/toggle`
      );

    return response.data;
  },

  // ====================================================
  // CUSTOMER
  // GET ACTIVE COUPONS
  // ====================================================

  getActiveCoupons: async () => {
    const response =
      await couponAPI.get(
        "/active"
      );

    return response.data;
  },

  // ====================================================
  // CUSTOMER
  // VALIDATE COUPON
  // ====================================================

  validateCoupon: async (
    code
  ) => {
    if (!code?.trim()) {
      throw new Error(
        "Coupon code is required."
      );
    }

    const response =
      await couponAPI.post(
        "/validate",
        {
          code: code
            .trim()
            .toUpperCase(),
        }
      );

    return response.data;
  },

  // ====================================================
  // CUSTOMER
  // APPLY COUPON
  // ====================================================

  applyCoupon: async (
    code
  ) => {
    if (!code?.trim()) {
      throw new Error(
        "Coupon code is required."
      );
    }

    const response =
      await couponAPI.post(
        "/apply",
        {
          code: code
            .trim()
            .toUpperCase(),
        }
      );

    return response.data;
  },

  // ====================================================
  // CUSTOMER
  // REMOVE COUPON
  // ====================================================

  removeCoupon: async () => {
    const response =
      await couponAPI.post(
        "/remove"
      );

    return response.data;
  },

  // ====================================================
  // HELPER
  // GET ERROR MESSAGE
  // ====================================================

  getErrorMessage: (error) => {
    if (
      error?.response?.data
        ?.message
    ) {
      return error.response.data
        .message;
    }

    if (
      error?.message
    ) {
      return error.message;
    }

    return "Something went wrong. Please try again.";
  },
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default couponService;