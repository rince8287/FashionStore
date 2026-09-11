// src/utils/orderStatus.js

import {
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiXCircle,
  FiRotateCcw,
} from "react-icons/fi";

import { ORDER_STATUS } from "../constants/orderConstants";

/* ==========================================
   STATUS CONFIG
========================================== */

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    label: "Pending",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    icon: FiClock,
  },

  [ORDER_STATUS.CONFIRMED]: {
    label: "Confirmed",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    icon: FiCheckCircle,
  },

  [ORDER_STATUS.PACKED]: {
    label: "Packed",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    icon: FiPackage,
  },

  [ORDER_STATUS.SHIPPED]: {
    label: "Shipped",
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    icon: FiTruck,
  },

  [ORDER_STATUS.OUT_FOR_DELIVERY]: {
    label: "Out For Delivery",
    color: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    icon: FiMapPin,
  },

  [ORDER_STATUS.DELIVERED]: {
    label: "Delivered",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    icon: FiCheckCircle,
  },

  [ORDER_STATUS.CANCELLED]: {
    label: "Cancelled",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    icon: FiXCircle,
  },

  [ORDER_STATUS.RETURNED]: {
    label: "Returned",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    icon: FiRotateCcw,
  },

  [ORDER_STATUS.REFUNDED]: {
    label: "Refunded",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    icon: FiRotateCcw,
  },
};

/* ==========================================
   GET STATUS DETAILS
========================================== */

export const getOrderStatus = (
  status = ORDER_STATUS.PENDING
) => {
  return (
    ORDER_STATUS_CONFIG[status] ||
    ORDER_STATUS_CONFIG[ORDER_STATUS.PENDING]
  );
};

/* ==========================================
   CAN CANCEL ORDER
========================================== */

export const canCancelOrder = (
  status = ""
) => {
  return [
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
  ].includes(status);
};

/* ==========================================
   CAN TRACK ORDER
========================================== */

export const canTrackOrder = (
  status = ""
) => {
  return [
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED,
  ].includes(status);
};

/* ==========================================
   CAN DOWNLOAD INVOICE
========================================== */

export const canDownloadInvoice = (
  status = ""
) => {
  return status === ORDER_STATUS.DELIVERED;
};

/* ==========================================
   CAN RETURN ORDER
========================================== */

export const canReturnOrder = (
  status = ""
) => {
  return status === ORDER_STATUS.DELIVERED;
};

/* ==========================================
   IS FINAL STATUS
========================================== */

export const isFinalOrderStatus = (
  status = ""
) => {
  return [
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.RETURNED,
    ORDER_STATUS.REFUNDED,
  ].includes(status);
};

export default ORDER_STATUS_CONFIG;