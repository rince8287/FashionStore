import axios from "axios";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "fashionstore-token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// ERROR HANDLER
// ======================================================

const handleError = (error) => {
  console.error(
    "Order API Error:",
    error
  );

  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong.";

  throw new Error(message);
};

// ======================================================
// NORMALIZE ORDER
// ======================================================

const normalizeOrder = (order) => {
  if (!order) {
    return order;
  }

  return {
    ...order,

    // ==================================================
    // ORDER ID
    // ==================================================

    _id:
      order._id ||
      order.id ||
      "",

    orderNumber:
      order.orderNumber ||
      order.orderId ||
      "",

    // ==================================================
    // TOTAL AMOUNT
    // ==================================================

    totalAmount: Number(
      order?.priceDetails?.total ??
      order?.totalAmount ??
      0
    ),

    // ==================================================
    // PAYMENT STATUS
    // ==================================================

    paymentStatus:
      order?.payment?.status ||
      order?.paymentStatus ||
      "Pending",

    // ==================================================
    // PAYMENT METHOD
    // ==================================================

    paymentMethod:
      order?.payment?.method ||
      order?.paymentMethod ||
      "",

    // ==================================================
    // CUSTOMER
    // ==================================================

    customerName:
      order?.user?.name ||
      order?.shippingAddress?.fullName ||
      "-",

    customerEmail:
      order?.user?.email ||
      "",

    customerPhone:
      order?.user?.phone ||
      order?.shippingAddress?.phone ||
      "",

    // ==================================================
    // STATUS
    // ==================================================

    status:
      order?.status ||
      "Pending",
  };
};

// ======================================================
// NORMALIZE ORDER LIST RESPONSE
// ======================================================

const normalizeOrdersResponse = (
  response
) => {
  const data =
    response?.data || {};

  const orders =
    Array.isArray(data.orders)
      ? data.orders.map(
          normalizeOrder
        )
      : [];

  const currentPage =
    Number(data.page) || 1;

  const totalPages =
    Number(data.totalPages) || 1;

  const totalOrders =
    Number(data.totalOrders) || 0;

  return {
    ...data,

    orders,

    pagination: {
      currentPage,

      totalPages,

      totalOrders,

      hasNextPage:
        currentPage < totalPages,

      hasPrevPage:
        currentPage > 1,
    },
  };
};

// ======================================================
// ORDER SERVICE
// ======================================================

const orderService = {

  // ====================================================
  // CUSTOMER
  // PLACE ORDER
  // POST /orders
  // ====================================================

  async placeOrder(orderData) {
    if (!orderData) {
      throw new Error(
        "Order data is required."
      );
    }

    try {
      const response =
        await api.post(
          "/orders",
          orderData
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // BUY NOW
  // POST /orders/buy-now
  // ====================================================

  async buyNow(orderData) {
    if (!orderData) {
      throw new Error(
        "Buy Now data is required."
      );
    }

    try {
      const response =
        await api.post(
          "/orders/buy-now",
          orderData
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // GET MY ORDERS
  // GET /orders/my-orders
  // ====================================================

  async getMyOrders() {
    try {
      const response =
        await api.get(
          "/orders/my-orders"
        );

      return {
        ...response.data,

        orders:
          Array.isArray(
            response.data?.orders
          )
            ? response.data.orders.map(
                normalizeOrder
              )
            : [],
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // GET ORDER DETAILS
  // GET /orders/:orderId
  // ====================================================

  async getOrderDetails(orderId) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.get(
          `/orders/${orderId}`
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER ALIAS
  // ====================================================

  async getOrderById(orderId) {
    return this.getOrderDetails(
      orderId
    );
  },

  // ====================================================
  // CUSTOMER
  // TRACK ORDER
  // GET /orders/:orderId/track
  // ====================================================

  async trackOrder(orderId) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.get(
          `/orders/${orderId}/track`
        );

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // CANCEL ORDER
  // PATCH /orders/:orderId/cancel
  // ====================================================

  async cancelOrder(
    orderId,
    cancelReason = ""
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.patch(
          `/orders/${orderId}/cancel`,
          {
            cancelReason,
          }
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // RETURN ORDER
  // PATCH /orders/:orderId/return
  // ====================================================

  async returnOrder(
    orderId,
    returnReason = ""
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.patch(
          `/orders/${orderId}/return`,
          {
            returnReason,
          }
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // CUSTOMER
  // UPDATE PAYMENT STATUS
  // PATCH /orders/:orderId/payment
  // ====================================================

  async updatePaymentStatus(
    orderId,
    paymentData
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    if (!paymentData) {
      throw new Error(
        "Payment data is required."
      );
    }

    try {
      const response =
        await api.patch(
          `/orders/${orderId}/payment`,
          paymentData
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN
  // GET ALL ORDERS
  // GET /orders/admin/all
  // ====================================================

  async getOrders({
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    paymentStatus = "all",
  } = {}) {
    try {
      const params =
        new URLSearchParams();

      params.set(
        "page",
        String(page)
      );

      params.set(
        "limit",
        String(limit)
      );

      if (
        search &&
        search.trim()
      ) {
        params.set(
          "search",
          search.trim()
        );
      }

      if (
        status &&
        status !== "all"
      ) {
        params.set(
          "status",
          status
        );
      }

      if (
        paymentStatus &&
        paymentStatus !== "all"
      ) {
        params.set(
          "paymentStatus",
          paymentStatus
        );
      }

      const response =
        await api.get(
          `/orders/admin/all?${params.toString()}`
        );

      return normalizeOrdersResponse(
        response
      );
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN ALIAS
  // ====================================================

  async getAdminOrders(
    options = {}
  ) {
    return this.getOrders(
      options
    );
  },

  // ====================================================
  // ADMIN
  // GET SINGLE ORDER
  //
  // IMPORTANT:
  // Admin route is:
  // GET /orders/admin/:orderId
  // ====================================================

  async getAdminOrder(orderId) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.get(
          `/orders/admin/${orderId}`
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN ORDER DETAILS ALIAS
  // ====================================================

  async getAdminOrderDetails(
    orderId
  ) {
    return this.getAdminOrder(
      orderId
    );
  },

  // ====================================================
  // ADMIN
  // GET ORDER BY ID
  //
  // IMPORTANT:
  // OrderDetails.jsx uses:
  //
  // orderService.getOrderById(id)
  //
  // Therefore this method must use
  // the ADMIN endpoint.
  // ====================================================

  async getOrderById(orderId) {
    return this.getAdminOrder(
      orderId
    );
  },

  // ====================================================
  // ADMIN
  // UPDATE ORDER STATUS
  //
  // PATCH /orders/admin/:orderId/status
  // ====================================================

  async updateOrderStatus(
    orderId,
    statusData
  ) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    if (
      statusData === undefined ||
      statusData === null ||
      statusData === ""
    ) {
      throw new Error(
        "Status is required."
      );
    }

    // ==================================================
    // SUPPORT BOTH:
    //
    // updateOrderStatus(id, "Shipped")
    //
    // AND:
    //
    // updateOrderStatus(id, {
    //   status: "Shipped"
    // })
    // ==================================================

    const payload =
      typeof statusData === "string"
        ? {
            status: statusData,
          }
        : statusData;

    if (
      !payload?.status
    ) {
      throw new Error(
        "Order status is required."
      );
    }

    try {
      const response =
        await api.patch(
          `/orders/admin/${orderId}/status`,
          payload
        );

      return {
        ...response.data,

        order: normalizeOrder(
          response.data?.order
        ),
      };
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN STATUS ALIAS
  // ====================================================

  async adminUpdateOrderStatus(
    orderId,
    statusData
  ) {
    return this.updateOrderStatus(
      orderId,
      statusData
    );
  },

  // ====================================================
  // ADMIN
  // DELETE ORDER
  //
  // DELETE /orders/admin/:orderId
  // ====================================================

  async deleteOrder(orderId) {
    if (!orderId) {
      throw new Error(
        "Order ID is required."
      );
    }

    try {
      const response =
        await api.delete(
          `/orders/admin/${orderId}`
        );

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN DELETE ALIAS
  // ====================================================

  async adminDeleteOrder(
    orderId
  ) {
    return this.deleteOrder(
      orderId
    );
  },

  // ====================================================
  // ADMIN
  // ORDER STATISTICS
  //
  // GET /orders/admin/statistics
  // ====================================================

  async getOrderStatistics() {
    try {
      const response =
        await api.get(
          "/orders/admin/statistics"
        );

      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // ====================================================
  // ADMIN
  // RECENT ORDERS
  //
  // GET /orders/admin/recent
  // ====================================================

  async getRecentOrders() {
    try {
      const response =
        await api.get(
          "/orders/admin/recent"
        );

      return {
        ...response.data,

        orders:
          Array.isArray(
            response.data?.orders
          )
            ? response.data.orders.map(
                normalizeOrder
              )
            : [],
      };
    } catch (error) {
      return handleError(error);
    }
  },
};

// ======================================================
// EXPORT
// ======================================================

export default orderService;