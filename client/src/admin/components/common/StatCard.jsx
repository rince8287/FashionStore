import PropTypes from "prop-types";

import {
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

// ======================================================
// ICON MAP
// ======================================================

const iconMap = {
  revenue: FiDollarSign,
  products: FiPackage,
  orders: FiShoppingCart,
  users: FiUsers,
  customers: FiUsers,
  reviews: FiStar,
  coupon: FiTag,
  coupons: FiTag,
};

// ======================================================
// STAT CARD
// ======================================================

function StatCard({
  title,
  value,
  icon,
  color = "text-accent",
  bgColor = "bg-brand-bg",
  change = "",
  changeType = "positive",
}) {
  // ====================================================
  // RESOLVE ICON
  // ====================================================

  let IconComponent = null;

  // If icon is a string
  if (typeof icon === "string") {
    IconComponent = iconMap[icon.toLowerCase()];
  }

  // If icon is already a React component
  if (typeof icon === "function") {
    IconComponent = icon;
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-accent
      "
    >
      {/* ==============================================
          TOP
      ============================================== */}

      <div className="flex items-center justify-between">
        {/* ============================================
            TEXT
        ============================================ */}

        <div className="min-w-0">
          <p className="text-sm font-medium text-text-secondary">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-text-primary">
            {value}
          </h2>
        </div>

        {/* ============================================
            ICON
        ============================================ */}

        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            ${bgColor}
            ${color}
          `}
        >
          {IconComponent ? (
            <IconComponent size={26} strokeWidth={1.8} />
          ) : (
            <FiPackage
              size={26}
              strokeWidth={1.8}
            />
          )}
        </div>
      </div>

      {/* ==============================================
          CHANGE / FOOTER
      ============================================== */}

      {change && (
        <div className="mt-6 flex items-center gap-2">
          {/* ==========================================
              CHANGE ICON
          ========================================== */}

          {changeType === "positive" ? (
            <FiTrendingUp
              size={16}
              className="shrink-0 text-green-400"
            />
          ) : (
            <FiTrendingDown
              size={16}
              className="shrink-0 text-red-400"
            />
          )}

          {/* ==========================================
              CHANGE VALUE
          ========================================== */}

          <span
            className={`
              text-sm
              font-medium
              ${
                changeType === "positive"
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >
            {change}
          </span>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}

          <span className="text-sm text-text-secondary">
            from last month
          </span>
        </div>
      )}
    </div>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

StatCard.propTypes = {
  title: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,

  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,

  color: PropTypes.string,

  bgColor: PropTypes.string,

  change: PropTypes.string,

  changeType: PropTypes.oneOf([
    "positive",
    "negative",
  ]),
};

// ======================================================
// DEFAULT PROPS
// ======================================================

StatCard.defaultProps = {
  color: "text-accent",
  bgColor: "bg-brand-bg",
  change: "",
  changeType: "positive",
};

// ======================================================
// EXPORT
// ======================================================

export default StatCard;