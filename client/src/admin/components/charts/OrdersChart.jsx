import PropTypes from "prop-types";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// ======================================================
// ORDERS CHART
// ======================================================

function OrdersChart({
  data = [],
  loading = false,
}) {
  // ====================================================
  // SAFE DATA
  // ====================================================

  const ordersData = Array.isArray(data)
    ? data
    : [];

  // ====================================================
  // ACTIVE MONTHS
  // ====================================================

  const activeMonths =
    ordersData.filter(
      (item) =>
        Number(item?.orders || 0) > 0
    );

  const currentMonth =
    activeMonths.length > 0
      ? activeMonths[
          activeMonths.length - 1
        ]
      : null;

  const previousMonth =
    activeMonths.length > 1
      ? activeMonths[
          activeMonths.length - 2
        ]
      : null;

  const currentOrders = Number(
    currentMonth?.orders || 0
  );

  const previousOrders = Number(
    previousMonth?.orders || 0
  );

  // ====================================================
  // MONTHLY CHANGE
  // ====================================================

  let percentageChange = 0;

  if (previousOrders > 0) {
    percentageChange =
      ((currentOrders - previousOrders) /
        previousOrders) *
      100;
  }

  const isPositive =
    percentageChange >= 0;

  const formattedChange =
    `${isPositive ? "+" : ""}${percentageChange.toFixed(
      1
    )}%`;

  // ====================================================
  // TOOLTIP
  // ====================================================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const orders = Number(
      payload[0]?.value || 0
    );

    return (
      <div
        className="
          rounded-xl
          border
          border-border-subtle
          bg-surface-elevated
          px-4
          py-3
          shadow-xl
        "
      >
        <p className="mb-1 text-sm text-text-secondary">
          {label}
        </p>

        <p className="text-base font-bold text-text-primary">
          {orders.toLocaleString("en-IN")}{" "}
          {orders === 1
            ? "Order"
            : "Orders"}
        </p>
      </div>
    );
  };

  // ====================================================
  // LOADING STATE
  // ====================================================

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-6 w-40 animate-pulse rounded bg-surface-elevated" />

            <div className="mt-2 h-4 w-52 animate-pulse rounded bg-surface-elevated" />
          </div>

          <div className="h-9 w-20 animate-pulse rounded-xl bg-surface-elevated" />
        </div>

        <div className="h-[350px] animate-pulse rounded-xl bg-surface-elevated/40" />
      </div>
    );
  }

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex items-start justify-between gap-4">

        <div>

          <h2
            className="
              text-xl
              font-bold
              text-text-primary
            "
          >
            Orders Overview
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-text-secondary
            "
          >
            Monthly order growth
          </p>

        </div>

        {/* =================================================
            REAL MONTHLY CHANGE
        ================================================= */}

        {previousOrders > 0 && (
          <div
            className={`
              rounded-xl
              px-4
              py-2
              text-sm
              font-semibold
              ${
                isPositive
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }
            `}
          >
            {formattedChange}
          </div>
        )}

      </div>

      {/* ==================================================
          CHART
      ================================================== */}

      <div className="h-[350px] w-full">

        {ordersData.length > 0 ? (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={ordersData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >

              {/* ==========================================
                  GRID
              ========================================== */}

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#273043"
                vertical={false}
              />

              {/* ==========================================
                  X AXIS
              ========================================== */}

              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ==========================================
                  Y AXIS
              ========================================== */}

              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ==========================================
                  TOOLTIP
              ========================================== */}

              <Tooltip
                content={
                  <CustomTooltip />
                }
                cursor={{
                  fill:
                    "rgba(212,175,55,0.08)",
                }}
              />

              {/* ==========================================
                  BAR
              ========================================== */}

              <Bar
                dataKey="orders"
                fill="#D4AF37"
                radius={[
                  8,
                  8,
                  0,
                  0,
                ]}
                maxBarSize={42}
              />

            </BarChart>

          </ResponsiveContainer>

        ) : (

          // ==============================================
          // EMPTY STATE
          // ==============================================

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-border-subtle
            "
          >

            <div className="text-center">

              <p className="text-base font-medium text-text-primary">
                No order data available
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Orders will appear here once customers place orders.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

// ======================================================
// PROP TYPES
// ======================================================

OrdersChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,

      orders:
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]).isRequired,
    })
  ),

  loading: PropTypes.bool,
};

// ======================================================
// DEFAULT PROPS
// ======================================================

OrdersChart.defaultProps = {
  data: [],
  loading: false,
};

// ======================================================
// EXPORT
// ======================================================

export default OrdersChart;