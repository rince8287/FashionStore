import PropTypes from "prop-types";

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
  size = "md",
  showDot = false,
}) {
  // ====================================================
  // NORMALIZE STATUS
  // ====================================================

  const normalizedStatus = String(
    status || ""
  )
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  // ====================================================
  // STATUS CONFIG
  // ====================================================

  const statusConfig = {
    // ================================================
    // ORDERS
    // ================================================

    pending: {
      label: "Pending",
      className:
        "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      dot:
        "bg-yellow-400",
    },

    processing: {
      label: "Processing",
      className:
        "bg-blue-500/15 text-blue-400 border-blue-500/30",
      dot:
        "bg-blue-400",
    },

    shipped: {
      label: "Shipped",
      className:
        "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      dot:
        "bg-indigo-400",
    },

    delivered: {
      label: "Delivered",
      className:
        "bg-green-500/15 text-green-400 border-green-500/30",
      dot:
        "bg-green-400",
    },

    cancelled: {
      label: "Cancelled",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },

    returned: {
      label: "Returned",
      className:
        "bg-orange-500/15 text-orange-400 border-orange-500/30",
      dot:
        "bg-orange-400",
    },

    // ================================================
    // PAYMENTS
    // ================================================

    paid: {
      label: "Paid",
      className:
        "bg-green-500/15 text-green-400 border-green-500/30",
      dot:
        "bg-green-400",
    },

    unpaid: {
      label: "Unpaid",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },

    refunded: {
      label: "Refunded",
      className:
        "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      dot:
        "bg-cyan-400",
    },

    failed: {
      label: "Failed",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },

    // ================================================
    // PRODUCTS
    // ================================================

    active: {
      label: "Active",
      className:
        "bg-green-500/15 text-green-400 border-green-500/30",
      dot:
        "bg-green-400",
    },

    inactive: {
      label: "Inactive",
      className:
        "bg-gray-500/15 text-gray-400 border-gray-500/30",
      dot:
        "bg-gray-400",
    },

    draft: {
      label: "Draft",
      className:
        "bg-purple-500/15 text-purple-400 border-purple-500/30",
      dot:
        "bg-purple-400",
    },

    outofstock: {
      label: "Out of Stock",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },

    lowstock: {
      label: "Low Stock",
      className:
        "bg-orange-500/15 text-orange-400 border-orange-500/30",
      dot:
        "bg-orange-400",
    },

    // ================================================
    // USERS
    // ================================================

    verified: {
      label: "Verified",
      className:
        "bg-green-500/15 text-green-400 border-green-500/30",
      dot:
        "bg-green-400",
    },

    unverified: {
      label: "Unverified",
      className:
        "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      dot:
        "bg-yellow-400",
    },

    blocked: {
      label: "Blocked",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },

    // ================================================
    // GENERIC
    // ================================================

    success: {
      label: "Success",
      className:
        "bg-green-500/15 text-green-400 border-green-500/30",
      dot:
        "bg-green-400",
    },

    warning: {
      label: "Warning",
      className:
        "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      dot:
        "bg-yellow-400",
    },

    error: {
      label: "Error",
      className:
        "bg-red-500/15 text-red-400 border-red-500/30",
      dot:
        "bg-red-400",
    },
  };

  // ====================================================
  // GET CONFIG
  // ====================================================

  const config =
    statusConfig[
      normalizedStatus
    ] || {
      label:
        status || "Unknown",

      className:
        "bg-slate-500/15 text-slate-300 border-slate-500/30",

      dot:
        "bg-slate-400",
    };

  // ====================================================
  // SIZE
  // ====================================================

  const sizeClasses = {
    sm: `
      px-2.5
      py-1
      text-[11px]
    `,

    md: `
      px-3
      py-1
      text-xs
    `,

    lg: `
      px-4
      py-1.5
      text-sm
    `,
  };

  const selectedSize =
    sizeClasses[size] ||
    sizeClasses.md;

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        whitespace-nowrap
        rounded-full
        border
        font-semibold
        tracking-wide
        ${selectedSize}
        ${config.className}
      `}
    >
      {/* ==============================================
          STATUS DOT
      ============================================== */}

      {showDot && (
        <span
          className={`
            h-1.5
            w-1.5
            rounded-full
            ${config.dot}
          `}
        />
      )}

      {/* ==============================================
          STATUS TEXT
      ============================================== */}

      {config.label}
    </span>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

StatusBadge.propTypes = {
  status:
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,

  size:
    PropTypes.oneOf([
      "sm",
      "md",
      "lg",
    ]),

  showDot:
    PropTypes.bool,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

StatusBadge.defaultProps = {
  size: "md",
  showDot: false,
};

// ======================================================
// EXPORT
// ======================================================

export default StatusBadge;