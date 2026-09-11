// src/constants/orderConstants.js

/* ==========================================
   ORDER STATUS
========================================== */

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PACKED: "packed",
  SHIPPED: "shipped",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
  REFUNDED: "refunded",
};

/* ==========================================
   PAYMENT METHOD
========================================== */

export const PAYMENT_METHOD = {
  ONLINE: "online",
  COD: "cod",
};

/* ==========================================
   PAYMENT STATUS
========================================== */

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
};

/* ==========================================
   ORDER FILTERS
========================================== */

export const ORDER_FILTERS = [
  {
    label: "All Orders",
    value: "all",
  },
  {
    label: "Pending",
    value: ORDER_STATUS.PENDING,
  },
  {
    label: "Confirmed",
    value: ORDER_STATUS.CONFIRMED,
  },
  {
    label: "Packed",
    value: ORDER_STATUS.PACKED,
  },
  {
    label: "Shipped",
    value: ORDER_STATUS.SHIPPED,
  },
  {
    label: "Out For Delivery",
    value: ORDER_STATUS.OUT_FOR_DELIVERY,
  },
  {
    label: "Delivered",
    value: ORDER_STATUS.DELIVERED,
  },
  {
    label: "Cancelled",
    value: ORDER_STATUS.CANCELLED,
  },
  {
    label: "Returned",
    value: ORDER_STATUS.RETURNED,
  },
  {
    label: "Refunded",
    value: ORDER_STATUS.REFUNDED,
  },
];

/* ==========================================
   PAYMENT FILTERS
========================================== */

export const PAYMENT_FILTERS = [
  {
    label: "All Payments",
    value: "all",
  },
  {
    label: "Online Payment",
    value: PAYMENT_METHOD.ONLINE,
  },
  {
    label: "Cash On Delivery",
    value: PAYMENT_METHOD.COD,
  },
];

/* ==========================================
   SORT OPTIONS
========================================== */

export const ORDER_SORT_OPTIONS = [
  {
    label: "Newest First",
    value: "newest",
  },
  {
    label: "Oldest First",
    value: "oldest",
  },
  {
    label: "Highest Amount",
    value: "amount-high",
  },
  {
    label: "Lowest Amount",
    value: "amount-low",
  },
];

/* ==========================================
   RAZORPAY EVENTS
========================================== */

export const RAZORPAY_EVENTS = {
  PAYMENT_SUCCESS: "payment.success",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_VERIFIED: "payment.verified",
};

/* ==========================================
   ORDER ACTIONS
========================================== */

export const ORDER_ACTIONS = {
  VIEW_DETAILS: "view_details",
  TRACK_ORDER: "track_order",
  CANCEL_ORDER: "cancel_order",
  DOWNLOAD_INVOICE: "download_invoice",
  RETURN_ORDER: "return_order",
};

/* ==========================================
   API ENDPOINTS (Future Backend)
========================================== */

export const ORDER_API = {
  GET_ALL: "/orders",
  GET_ONE: "/orders/:id",
  CREATE: "/orders",
  CANCEL: "/orders/:id/cancel",
  TRACK: "/orders/:id/track",
  VERIFY_PAYMENT: "/payments/verify",
};

/* ==========================================
   DEFAULT VALUES
========================================== */

export const DEFAULT_ORDER_FILTER = "all";

export const DEFAULT_PAYMENT_FILTER = "all";

export const DEFAULT_SORT = "newest";

export const DEFAULT_PAYMENT_METHOD =
  PAYMENT_METHOD.ONLINE;

export const DEFAULT_PAYMENT_STATUS =
  PAYMENT_STATUS.PENDING;