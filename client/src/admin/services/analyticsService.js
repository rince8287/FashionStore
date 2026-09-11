import axios from "axios";

/* ============================================================
   ANALYTICS API SERVICE
   ============================================================ */

const API_URL = import.meta.env.VITE_API_URL;

const analyticsAPI = axios.create({
  baseURL: `${API_URL}/analytics`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================================
   AUTH CONFIG
   ============================================================ */

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

/* ============================================================
   GET DASHBOARD ANALYTICS
   ============================================================ */

/**
 * Fetch analytics summary + chart data.
 *
 * period:
 * - 7d  = Last 7 days
 * - 30d = Last 30 days
 * - 90d = Last 90 days
 */
export const getAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Analytics fetch error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET ANALYTICS SUMMARY
   ============================================================ */

export const getAnalyticsSummary = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/summary", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Analytics summary error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET SALES ANALYTICS
   ============================================================ */

export const getSalesAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/sales", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Sales analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET REVENUE ANALYTICS
   ============================================================ */

export const getRevenueAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/revenue", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Revenue analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET ORDER ANALYTICS
   ============================================================ */

export const getOrderAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/orders", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Order analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET CUSTOMER ANALYTICS
   ============================================================ */

export const getCustomerAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/customers", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Customer analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET PRODUCT ANALYTICS
   ============================================================ */

export const getProductAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/products", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Product analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET CATEGORY ANALYTICS
   ============================================================ */

export const getCategoryAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/categories", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Category analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET TOP PRODUCTS
   ============================================================ */

export const getTopProducts = async (period = "30d", limit = 10) => {
  try {
    const response = await analyticsAPI.get("/top-products", {
      ...getAuthConfig(),
      params: {
        period,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Top products analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET TOP CATEGORIES
   ============================================================ */

export const getTopCategories = async (period = "30d", limit = 10) => {
  try {
    const response = await analyticsAPI.get("/top-categories", {
      ...getAuthConfig(),
      params: {
        period,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Top categories analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET PERFORMANCE ANALYTICS
   ============================================================ */

export const getPerformanceAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/performance", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Performance analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   GET ANALYTICS BY CUSTOM DATE RANGE
   ============================================================ */

export const getAnalyticsByDateRange = async (
  startDate,
  endDate
) => {
  try {
    const response = await analyticsAPI.get("/date-range", {
      ...getAuthConfig(),
      params: {
        startDate,
        endDate,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Date range analytics error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   REFRESH ANALYTICS
   ============================================================ */

export const refreshAnalytics = async (period = "30d") => {
  try {
    const response = await analyticsAPI.get("/refresh", {
      ...getAuthConfig(),
      params: {
        period,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Analytics refresh error:",
      error?.response?.data || error.message
    );

    throw error;
  }
};

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */

const analyticsService = {
  getAnalytics,
  getAnalyticsSummary,
  getSalesAnalytics,
  getRevenueAnalytics,
  getOrderAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getCategoryAnalytics,
  getTopProducts,
  getTopCategories,
  getPerformanceAnalytics,
  getAnalyticsByDateRange,
  refreshAnalytics,
};

export default analyticsService;