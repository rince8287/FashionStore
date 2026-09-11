// src/services/orderService.js

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// GET TOKEN
// ======================================================

const getToken = () => {
  return localStorage.getItem(
    "fashionstore-token"
  );
};

// ======================================================
// COMMON REQUEST
// ======================================================

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...options.headers,
      },
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Request failed (${response.status})`
    );
  }

  return data;
};

// ======================================================
// PLACE ORDER
// POST /orders
// ======================================================

export const createOrder =
  async (orderData) => {
    return request("/orders", {
      method: "POST",
      body: JSON.stringify(
        orderData
      ),
    });
  };

// ======================================================
// BUY NOW
// POST /orders/buy-now
// ======================================================

export const buyNow =
  async (orderData) => {
    return request(
      "/orders/buy-now",
      {
        method: "POST",
        body: JSON.stringify(
          orderData
        ),
      }
    );
  };

// ======================================================
// GET MY ORDERS
// GET /orders/my-orders
// ======================================================

export const getOrders =
  async () => {
    const data =
      await request(
        "/orders/my-orders",
        {
          method: "GET",
        }
      );

    return (
      data.orders ||
      data.data ||
      []
    );
  };

// ======================================================
// GET SINGLE ORDER
// GET /orders/:orderId
// ======================================================

export const getOrderById =
  async (orderId) => {
    const data =
      await request(
        `/orders/${orderId}`,
        {
          method: "GET",
        }
      );

    return (
      data.order ||
      data.data ||
      data
    );
  };

// ======================================================
// TRACK ORDER
// GET /orders/:orderId/track
// ======================================================

export const trackOrder =
  async (orderId) => {
    return request(
      `/orders/${orderId}/track`,
      {
        method: "GET",
      }
    );
  };
  // ======================================================
// CANCEL ORDER
// PATCH /orders/:orderId/cancel
// ======================================================

export const cancelOrder =
  async (
    orderId,
    reason = ""
  ) => {
    return request(
      `/orders/${orderId}/cancel`,
      {
        method: "PATCH",
        body: JSON.stringify({
          reason,
        }),
      }
    );
  };

// ======================================================
// RETURN ORDER
// PATCH /orders/:orderId/return
// ======================================================

export const returnOrder =
  async (
    orderId,
    returnData = {}
  ) => {
    return request(
      `/orders/${orderId}/return`,
      {
        method: "PATCH",
        body: JSON.stringify(
          returnData
        ),
      }
    );
  };

// ======================================================
// UPDATE PAYMENT STATUS
// PATCH /orders/:orderId/payment
// ======================================================

export const updatePaymentStatus =
  async (
    orderId,
    paymentData
  ) => {
    return request(
      `/orders/${orderId}/payment`,
      {
        method: "PATCH",
        body: JSON.stringify(
          paymentData
        ),
      }
    );
  };

// ======================================================
// ADMIN APIs
// ======================================================

// All Orders

export const getAllOrders =
  async () => {
    return request(
      "/orders/admin/all",
      {
        method: "GET",
      }
    );
  };

// Statistics

export const getOrderStatistics =
  async () => {
    return request(
      "/orders/admin/statistics",
      {
        method: "GET",
      }
    );
  };

// Recent Orders

export const getRecentOrders =
  async () => {
    return request(
      "/orders/admin/recent",
      {
        method: "GET",
      }
    );
  };

// Single Order

export const getAdminOrder =
  async (orderId) => {
    return request(
      `/orders/admin/${orderId}`,
      {
        method: "GET",
      }
    );
  };

// Update Status

export const updateOrderStatus =
  async (
    orderId,
    statusData
  ) => {
    return request(
      `/orders/admin/${orderId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(
          statusData
        ),
      }
    );
  };

// Delete Order

export const deleteOrder =
  async (orderId) => {
    return request(
      `/orders/admin/${orderId}`,
      {
        method: "DELETE",
      }
    );
  };

// ======================================================
// DEFAULT EXPORT
// ======================================================

const orderService = {
  createOrder,
  buyNow,
  getOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
 returnOrder,
  updatePaymentStatus,

  // Admin
  getAllOrders,
  getOrderStatistics,
  getRecentOrders,
  getAdminOrder,
  updateOrderStatus,
  deleteOrder,
};

export default orderService;