// src/components/orders/OrderStatusBadge.jsx

import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiPackage,
  FiRefreshCw,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";


// ==========================================================
// STATUS CONFIGURATION
// ==========================================================

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: FiClock,
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },

  confirmed: {
    label: "Confirmed",
    icon: FiCheckCircle,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  processing: {
    label: "Processing",
    icon: FiClock,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  packed: {
    label: "Packed",
    icon: FiPackage,
    className:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
  },

  shipped: {
    label: "Shipped",
    icon: FiTruck,
    className:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  },

  out_for_delivery: {
    label: "Out for Delivery",
    icon: FiTruck,
    className:
      "border-sky-500/20 bg-sky-500/10 text-sky-400",
  },

  delivered: {
    label: "Delivered",
    icon: FiCheckCircle,
    className:
      "border-green-500/20 bg-green-500/10 text-green-400",
  },

  cancelled: {
    label: "Cancelled",
    icon: FiXCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  returned: {
    label: "Returned",
    icon: FiRefreshCw,
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  refunded: {
    label: "Refunded",
    icon: FiRefreshCw,
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },

  payment_pending: {
    label: "Payment Pending",
    icon: FiCreditCard,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  payment_failed: {
    label: "Payment Failed",
    icon: FiAlertCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  failed: {
    label: "Failed",
    icon: FiAlertCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },
};


// ==========================================================
// NORMALIZE STATUS
// ==========================================================

function normalizeStatus(status) {
  if (
    status === null ||
    status === undefined
  ) {
    return "pending";
  }


  return String(status)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}


// ==========================================================
// FALLBACK STATUS
// ==========================================================

const FALLBACK_STATUS = {
  label: "Pending",
  icon: FiClock,
  className:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
};


// ==========================================================
// COMPONENT
// ==========================================================

function OrderStatusBadge({
  status = "pending",
  size = "default",
  showIcon = true,
}) {

  // --------------------------------------------------------
  // Normalize
  // --------------------------------------------------------

  const normalizedStatus =
    normalizeStatus(status);


  // --------------------------------------------------------
  // Find Config
  // --------------------------------------------------------

  const currentStatus =
    STATUS_CONFIG[
      normalizedStatus
    ] || FALLBACK_STATUS;


  // --------------------------------------------------------
  // Icon
  // --------------------------------------------------------

  const Icon =
    currentStatus.icon;


  // --------------------------------------------------------
  // Size
  // --------------------------------------------------------

  const sizeClasses =
    size === "small"
      ? "px-2.5 py-1 text-[11px]"
      : size === "large"
        ? "px-4 py-2 text-sm"
        : "px-3 py-1.5 text-xs";


  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------

  return (
    <span
      role="status"
      aria-label={`Order status: ${currentStatus.label}`}
      title={currentStatus.label}
      className={`
        inline-flex
        max-w-full
        items-center
        justify-center
        gap-1.5
        rounded-full
        border
        font-semibold
        leading-none
        tracking-wide
        whitespace-nowrap
        transition-all
        duration-300
        ${sizeClasses}
        ${currentStatus.className}
      `}
    >

      {/* Icon */}

      {showIcon && (
        <Icon
          size={
            size === "large"
              ? 16
              : 14
          }
          strokeWidth={2.2}
          aria-hidden="true"
          className="shrink-0"
        />
      )}


      {/* Label */}

      <span className="truncate">
        {currentStatus.label}
      </span>

    </span>
  );
}


export default OrderStatusBadge;