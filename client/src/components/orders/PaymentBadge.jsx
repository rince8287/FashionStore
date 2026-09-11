import {
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";


// ==========================================================
// PAYMENT METHOD CONFIG
// ==========================================================

const PAYMENT_METHOD_CONFIG = {
  online: {
    label: "Online Payment",
    icon: FiCreditCard,
    className:
      "border-sky-500/20 bg-sky-500/10 text-sky-400",
  },

  razorpay: {
    label: "Razorpay",
    icon: FiCreditCard,
    className:
      "border-sky-500/20 bg-sky-500/10 text-sky-400",
  },

  upi: {
    label: "UPI",
    icon: FiCreditCard,
    className:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",
  },

  card: {
    label: "Card",
    icon: FiCreditCard,
    className:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  },

  credit_card: {
    label: "Credit Card",
    icon: FiCreditCard,
    className:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  },

  debit_card: {
    label: "Debit Card",
    icon: FiCreditCard,
    className:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  },

  wallet: {
    label: "Wallet",
    icon: FiCreditCard,
    className:
      "border-purple-500/20 bg-purple-500/10 text-purple-400",
  },

  netbanking: {
    label: "Net Banking",
    icon: FiCreditCard,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  net_banking: {
    label: "Net Banking",
    icon: FiCreditCard,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  cod: {
    label: "Cash on Delivery",
    icon: FiDollarSign,
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },

  cash_on_delivery: {
    label: "Cash on Delivery",
    icon: FiDollarSign,
    className:
      "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },
};


// ==========================================================
// PAYMENT STATUS CONFIG
// ==========================================================

const PAYMENT_STATUS_CONFIG = {
  paid: {
    label: "Paid",
    icon: FiCheckCircle,
    className:
      "border-green-500/20 bg-green-500/10 text-green-400",
  },

  pending: {
    label: "Pending",
    icon: FiClock,
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },

  processing: {
    label: "Processing",
    icon: FiClock,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },

  failed: {
    label: "Failed",
    icon: FiXCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  cancelled: {
    label: "Cancelled",
    icon: FiXCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  refunded: {
    label: "Refunded",
    icon: FiRefreshCw,
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },

  partially_refunded: {
    label: "Partially Refunded",
    icon: FiRefreshCw,
    className:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  },
};


// ==========================================================
// NORMALIZE VALUE
// ==========================================================

function normalizeValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}


// ==========================================================
// FALLBACK CONFIG
// ==========================================================

const DEFAULT_METHOD =
  PAYMENT_METHOD_CONFIG.online;

const DEFAULT_STATUS =
  PAYMENT_STATUS_CONFIG.pending;


// ==========================================================
// COMPONENT
// ==========================================================

function PaymentBadge({
  paymentMethod = "online",
  paymentStatus = "pending",
  size = "default",
}) {

  // --------------------------------------------------------
  // Normalize backend values
  // --------------------------------------------------------

  const methodKey =
    normalizeValue(paymentMethod);

  const statusKey =
    normalizeValue(paymentStatus);


  // --------------------------------------------------------
  // Get configuration
  // --------------------------------------------------------

  const method =
    PAYMENT_METHOD_CONFIG[
      methodKey
    ] || DEFAULT_METHOD;

  const status =
    PAYMENT_STATUS_CONFIG[
      statusKey
    ] || DEFAULT_STATUS;


  // --------------------------------------------------------
  // Icons
  // --------------------------------------------------------

  const MethodIcon =
    method.icon;

  const StatusIcon =
    status.icon;


  // --------------------------------------------------------
  // Size
  // --------------------------------------------------------

  const sizeClasses =
    size === "small"
      ? "px-2.5 py-1 text-[11px]"
      : size === "large"
        ? "px-4 py-2 text-sm"
        : "px-3 py-1.5 text-xs";


  const iconSize =
    size === "large"
      ? 16
      : 14;


  // --------------------------------------------------------
  // Render
  // --------------------------------------------------------

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-2.5
      "
    >

      {/* ==================================================
          PAYMENT METHOD
      ================================================== */}

      <span
        title={`Payment method: ${method.label}`}
        aria-label={`Payment method: ${method.label}`}
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
          ${method.className}
        `}
      >

        <MethodIcon
          size={iconSize}
          strokeWidth={2.2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {method.label}
        </span>

      </span>


      {/* ==================================================
          PAYMENT STATUS
      ================================================== */}

      <span
        title={`Payment status: ${status.label}`}
        aria-label={`Payment status: ${status.label}`}
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
          ${status.className}
        `}
      >

        <StatusIcon
          size={iconSize}
          strokeWidth={2.2}
          className="shrink-0"
          aria-hidden="true"
        />

        <span className="truncate">
          {status.label}
        </span>

      </span>

    </div>
  );
}


export default PaymentBadge;