import PropTypes from "prop-types";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// ======================================================
// REVENUE CHART
// ======================================================

function RevenueChart({
  data = [],
}) {
  // ====================================================
  // SAFE DATA
  // ====================================================

  const revenueData = Array.isArray(data)
    ? data
    : [];

  // ====================================================
  // CURRENT / PREVIOUS MONTH
  // ====================================================

  const activeMonths =
    revenueData.filter(
      (item) =>
        Number(item?.revenue || 0) > 0
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

  const currentRevenue = Number(
    currentMonth?.revenue || 0
  );

  const previousRevenue = Number(
    previousMonth?.revenue || 0
  );

  // ====================================================
  // MONTHLY CHANGE
  // ====================================================

  let percentageChange = 0;

  if (previousRevenue > 0) {
    percentageChange =
      ((currentRevenue - previousRevenue) /
        previousRevenue) *
      100;
  }

  const isPositive =
    percentageChange >= 0;

  const formattedChange =
    `${isPositive ? "+" : ""}${percentageChange.toFixed(
      1
    )}%`;

  // ====================================================
  // FORMAT RUPEES
  // ====================================================

  const formatCurrency = (value) => {
    const amount = Number(value || 0);

    if (amount >= 10000000) {
      return `₹${(
        amount / 10000000
      ).toFixed(1)}Cr`;
    }

    if (amount >= 100000) {
      return `₹${(
        amount / 100000
      ).toFixed(1)}L`;
    }

    if (amount >= 1000) {
      return `₹${(
        amount / 1000
      ).toFixed(0)}K`;
    }

    return `₹${amount}`;
  };

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

    const revenue = Number(
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
          {formatCurrency(revenue)}
        </p>
      </div>
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="w-full">
      {/* ================================================
          HEADER
      ================================================ */}

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2
            className="
              text-xl
              font-bold
              text-text-primary
            "
          >
            Revenue Overview
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-text-secondary
            "
          >
            Monthly revenue performance
          </p>
        </div>

        {/* ==============================================
            REAL MONTHLY CHANGE
        ============================================== */}

        {previousRevenue > 0 && (
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

      {/* ================================================
          CHART
      ================================================ */}

      <div className="h-[350px] w-full">
        {revenueData.length > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              {/* ========================================
                  GRID
              ======================================== */}

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#273043"
                vertical={false}
              />

              {/* ========================================
                  X AXIS
              ======================================== */}

              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
              />

              {/* ========================================
                  Y AXIS
              ======================================== */}

              <YAxis
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
                tick={{
                  fontSize: 12,
                }}
                tickFormatter={formatCurrency}
                width={60}
              />

              {/* ========================================
                  TOOLTIP
              ======================================== */}

              <Tooltip
                content={
                  <CustomTooltip />
                }
                cursor={{
                  stroke:
                    "#374151",
                  strokeDasharray:
                    "4 4",
                }}
              />

              {/* ========================================
                  LINE
              ======================================== */}

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#D4AF37",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 7,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          // ============================================
          // EMPTY STATE
          // ============================================

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
                No revenue data available
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                Revenue will appear here once orders are completed.
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

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,

      revenue:
        PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]).isRequired,
    })
  ),
};

// ======================================================
// EXPORT
// ======================================================

export default RevenueChart;