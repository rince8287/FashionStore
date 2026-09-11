import axios from "axios";

// ======================================================
// API CONFIG
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const couponAPI = axios.create({
  baseURL: `${API_URL}/coupons`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ======================================================
// REQUEST INTERCEPTOR
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
  (response) => response,

  (error) => {
    // Network/server unavailable
    if (!error.response) {
      error.normalizedMessage =
        "Unable to connect to server. Please try again.";
    } else {
      error.normalizedMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong.";
    }

    return Promise.reject(error);
  }
);

// ======================================================
// HELPERS
// ======================================================

const normalizeCode = (code) =>
  String(code || "")
    .trim()
    .toUpperCase();

const getResponseData = (
  response
) => {
  return response?.data || {};
};

const getErrorMessage = (
  error,
  fallback = "Something went wrong."
) => {
  if (
    error?.response?.data?.message
  ) {
    return error.response.data.message;
  }

  if (
    error?.response?.data?.error
  ) {
    return error.response.data.error;
  }

  if (
    error?.normalizedMessage
  ) {
    return error.normalizedMessage;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

// ======================================================
// CUSTOMER COUPON SERVICE
// ======================================================

const couponService = {
  // ====================================================
  // GET ACTIVE COUPONS
  //
  // GET /api/v1/coupons/active
  //
  // Public endpoint
  // ====================================================

  getActiveCoupons: async () => {
    try {
      const response =
        await couponAPI.get(
          "/active"
        );

      return getResponseData(
        response
      );
    } catch (error) {
      console.error(
        "Get Active Coupons Error:",
        error
      );

      throw error;
    }
  },

  // ====================================================
  // VALIDATE COUPON
  //
  // POST /api/v1/coupons/validate
  //
  // Does NOT apply coupon to cart.
  // Only checks whether coupon is valid.
  // ====================================================

  validateCoupon: async (
    code
  ) => {
    const normalizedCode =
      normalizeCode(code);

    if (!normalizedCode) {
      throw new Error(
        "Please enter a coupon code."
      );
    }

    try {
      const response =
        await couponAPI.post(
          "/validate",
          {
            code:
              normalizedCode,
          }
        );

      return getResponseData(
        response
      );
    } catch (error) {
      console.error(
        "Validate Coupon Error:",
        error
      );

      throw error;
    }
  },

  // ====================================================
  // APPLY COUPON
  //
  // POST /api/v1/coupons/apply
  //
  // This is the IMPORTANT endpoint.
  //
  // Backend:
  // - finds real coupon from MongoDB
  // - checks active status
  // - checks dates
  // - checks usage limit
  // - checks user eligibility
  // - checks cart
  // - checks product/category restrictions
  // - calculates discount
  // - saves coupon to cart
  // ====================================================

  applyCoupon: async (
    code
  ) => {
    const normalizedCode =
      normalizeCode(code);

    if (!normalizedCode) {
      throw new Error(
        "Please enter a coupon code."
      );
    }

    try {
      const response =
        await couponAPI.post(
          "/apply",
          {
            code:
              normalizedCode,
          }
        );

      const data =
        getResponseData(
          response
        );

      // ----------------------------------------------
      // Never silently accept an unsuccessful response
      // ----------------------------------------------

      if (
        data.success === false
      ) {
        const error =
          new Error(
            data.message ||
              "Unable to apply coupon."
          );

        error.response = {
          data,
          status:
            response.status,
        };

        throw error;
      }

      return data;
    } catch (error) {
      console.error(
        "Apply Coupon Error:",
        error
      );

      throw error;
    }
  },

  // ====================================================
  // REMOVE COUPON
  //
  // POST /api/v1/coupons/remove
  // ====================================================

  removeCoupon: async () => {
    try {
      const response =
        await couponAPI.post(
          "/remove"
        );

      const data =
        getResponseData(
          response
        );

      return data;
    } catch (error) {
      console.error(
        "Remove Coupon Error:",
        error
      );

      /*
       * Backend returns 400 when there is no coupon
       * currently applied.
       *
       * For frontend this is effectively an already
       * clean state, so don't show a scary server error
       * in that specific case.
       */

      if (
        error?.response?.status ===
          400 &&
        error?.response?.data
          ?.message ===
          "No coupon is currently applied."
      ) {
        return {
          success: true,
          message:
            "No coupon was applied.",
          alreadyRemoved: true,
        };
      }

      throw error;
    }
  },

  // ====================================================
  // GET ERROR MESSAGE
  // ====================================================

  getErrorMessage,
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default couponService;