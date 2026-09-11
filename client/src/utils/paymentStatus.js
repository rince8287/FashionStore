// src/utils/paymentStatus.js

import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiRotateCcw,
  FiXCircle,
} from "react-icons/fi";

import {
  PAYMENT_METHOD,
  PAYMENT_STATUS,
} from "../constants/orderConstants";

/* ==========================================
   PAYMENT METHOD CONFIG
========================================== */

export const PAYMENT_METHOD_CONFIG = {
  [PAYMENT_METHOD.ONLINE]: {
    label: "Online Payment",
    icon: FiCreditCard,
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
  },

  [PAYMENT_METHOD.COD]: {
    label: "Cash On Delivery",
    icon: FiDollarSign,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
};

/* ==========================================
   PAYMENT STATUS CONFIG
========================================== */

export const PAYMENT_STATUS_CONFIG = {
  [PAYMENT_STATUS.PENDING]: {
    label: "Pending",
    icon: FiClock,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
  },

  [PAYMENT_STATUS.PAID]: {
    label: "Paid",
    icon: FiCheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },

  [PAYMENT_STATUS.FAILED]: {
    label: "Failed",
    icon: FiXCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },

  [PAYMENT_STATUS.REFUNDED]: {
    label: "Refunded",
    icon: FiRotateCcw,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
};

/* ==========================================
   GET PAYMENT METHOD
========================================== */

export const getPaymentMethod = (
  method = PAYMENT_METHOD.ONLINE
) => {
  return (
    PAYMENT_METHOD_CONFIG[method] ||
    PAYMENT_METHOD_CONFIG[PAYMENT_METHOD.ONLINE]
  );
};

/* ==========================================
   GET PAYMENT STATUS
========================================== */

export const getPaymentStatus = (
  status = PAYMENT_STATUS.PENDING
) => {
  return (
    PAYMENT_STATUS_CONFIG[status] ||
    PAYMENT_STATUS_CONFIG[PAYMENT_STATUS.PENDING]
  );
};

/* ==========================================
   PAYMENT HELPERS
========================================== */

export const isOnlinePayment = (
  method = ""
) => {
  return method === PAYMENT_METHOD.ONLINE;
};

export const isCashOnDelivery = (
  method = ""
) => {
  return method === PAYMENT_METHOD.COD;
};

export const isPaymentPending = (
  status = ""
) => {
  return status === PAYMENT_STATUS.PENDING;
};

export const isPaymentPaid = (
  status = ""
) => {
  return status === PAYMENT_STATUS.PAID;
};

export const isPaymentFailed = (
  status = ""
) => {
  return status === PAYMENT_STATUS.FAILED;
};

export const isPaymentRefunded = (
  status = ""
) => {
  return status === PAYMENT_STATUS.REFUNDED;
};

/* ==========================================
   RAZORPAY HELPERS
========================================== */

export const shouldVerifyPayment = (
  paymentMethod,
  paymentStatus
) => {
  return (
    paymentMethod === PAYMENT_METHOD.ONLINE &&
    paymentStatus === PAYMENT_STATUS.PENDING
  );
};

export const canInitiateRefund = (
  paymentMethod,
  paymentStatus
) => {
  return (
    paymentMethod === PAYMENT_METHOD.ONLINE &&
    paymentStatus === PAYMENT_STATUS.PAID
  );
};

export const requiresCashCollection = (
  paymentMethod,
  paymentStatus
) => {
  return (
    paymentMethod === PAYMENT_METHOD.COD &&
    paymentStatus === PAYMENT_STATUS.PENDING
  );
};

export default PAYMENT_STATUS_CONFIG;