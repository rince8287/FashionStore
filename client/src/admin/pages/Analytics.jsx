import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import analyticsService from "../services/analyticsService";

/* ============================================================
   CONSTANTS
   ============================================================ */

const PERIODS = {
  "7d": {
    label: "Last 7 days",
    short: "7D",
  },

  "30d": {
    label: "Last 30 days",
    short: "30D",
  },

  "90d": {
    label: "Last 90 days",
    short: "90D",
  },
};

/* ============================================================
   HELPERS
   ============================================================ */

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
};

const formatCurrency = (value) => {
  const number = safeNumber(value);

  return `₹${number.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const formatNumber = (value) => {
  return safeNumber(value).toLocaleString("en-IN");
};

const formatPercentage = (value) => {
  const number = safeNumber(value);

  return `${number > 0 ? "+" : ""}${number.toFixed(
    number % 1 === 0 ? 0 : 1
  )}%`;
};

const getGrowthValue = (growth) => {
  if (
    growth &&
    typeof growth === "object"
  ) {
    return safeNumber(growth.value);
  }

  return safeNumber(growth);
};

const getGrowthDirection = (growth) => {
  const value = getGrowthValue(growth);

  if (value > 0) {
    return "up";
  }

  if (value < 0) {
    return "down";
  }

  return "neutral";
};

const normalizeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

/* ============================================================
   LOADING SKELETON
   ============================================================ */

const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl border border-border-subtle bg-surface"
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="h-[390px] rounded-2xl border border-border-subtle bg-surface" />

        <div className="h-[390px] rounded-2xl border border-border-subtle bg-surface" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 rounded-2xl border border-border-subtle bg-surface"
          />
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   ERROR STATE
   ============================================================ */

const AnalyticsError = ({
  message,
  onRetry,
}) => {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-8">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400">
          <AlertCircle size={26} />
        </div>

        <h2 className="mt-4 text-base font-bold text-text-primary">
          Unable to load analytics
        </h2>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          {message ||
            "Something went wrong while loading your analytics data."}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-xs font-bold text-black transition hover:brightness-110 active:scale-[0.97]"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   STAT CARD
   ============================================================ */

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  growth,
  delay = 0,
  currency = false,
}) => {
  const growthValue =
    getGrowthValue(growth);

  const direction =
    getGrowthDirection(growth);

  const isDown = direction === "down";

  return (
    <div
      className="analytics-fade-up group relative overflow-hidden rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-xl hover:shadow-black/10"
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/5 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-secondary">
            {title}
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-text-primary sm:text-[26px]">
            {currency
              ? formatCurrency(value)
              : formatNumber(value)}
          </h2>

          <p className="mt-1 text-[11px] text-text-muted">
            {description}
          </p>

          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={[
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                direction === "up"
                  ? "bg-emerald-500/5 text-emerald-400"
                  : "",
                direction === "down"
                  ? "bg-red-500/5 text-red-400"
                  : "",
                direction === "neutral"
                  ? "bg-text-muted/5 text-text-muted"
                  : "",
              ].join(" ")}
            >
              {direction === "up" && (
                <ArrowUpRight size={11} />
              )}

              {direction === "down" && (
                <ArrowDownRight size={11} />
              )}

              {direction === "neutral" && (
                <Activity size={10} />
              )}

              {formatPercentage(
                growthValue
              )}
            </span>

            <span className="text-[10px] text-text-muted">
              vs previous period
            </span>
          </div>
        </div>

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/10 bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/15">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   PERFORMANCE ITEM
   ============================================================ */

const PerformanceItem = ({
  icon: Icon,
  label,
  value,
  helper,
}) => {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-border-subtle bg-brand-bg/60 p-3.5 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.025]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-text-muted transition-colors group-hover:text-accent">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <span className="block truncate text-xs text-text-secondary">
            {label}
          </span>

          {helper && (
            <span className="mt-0.5 block text-[9px] text-text-muted">
              {helper}
            </span>
          )}
        </div>
      </div>

      <span className="ml-3 shrink-0 text-sm font-bold text-text-primary">
        {value}
      </span>
    </div>
  );
};

/* ============================================================
   MINI INSIGHT
   ============================================================ */

const MiniInsight = ({
  icon: Icon,
  title,
  value,
  description,
  percentage,
}) => {
  const progress = Math.max(
    0,
    Math.min(100, safeNumber(percentage))
  );

  return (
    <div className="group rounded-2xl border border-border-subtle bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/20 hover:shadow-lg hover:shadow-black/5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-muted">
            {title}
          </p>

          <p className="mt-2 text-xl font-bold text-text-primary">
            {value}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-text-muted">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
          <Icon size={18} />
        </div>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-border-subtle">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   TOP PRODUCT ITEM
   ============================================================ */

const TopProductItem = ({
  product,
  index,
  maxRevenue,
}) => {
  const revenue =
    safeNumber(product?.revenue);

  const quantity =
    safeNumber(product?.quantitySold);

  const progress =
    maxRevenue > 0
      ? Math.min(
          100,
          (revenue / maxRevenue) * 100
        )
      : 0;

  return (
    <div className="group rounded-xl border border-border-subtle bg-brand-bg/50 p-3 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.025]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[11px] font-bold text-accent">
          #{index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-text-primary">
            {product?.name ||
              "Product"}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-text-muted">
              {formatNumber(quantity)} sold
            </span>

            <span className="h-1 w-1 rounded-full bg-text-muted/40" />

            <span className="text-[10px] font-semibold text-accent">
              {formatCurrency(revenue)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-border-subtle">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   TOP CATEGORY ITEM
   ============================================================ */

const TopCategoryItem = ({
  category,
  index,
  maxRevenue,
}) => {
  const revenue =
    safeNumber(category?.revenue);

  const quantity =
    safeNumber(category?.quantitySold);

  const progress =
    maxRevenue > 0
      ? Math.min(
          100,
          (revenue / maxRevenue) * 100
        )
      : 0;

  return (
    <div className="group rounded-xl border border-border-subtle bg-brand-bg/50 p-3 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.025]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-[11px] font-bold text-accent">
          #{index + 1}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-text-primary">
            {category?.name ||
              "Category"}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-text-muted">
              {formatNumber(quantity)} sold
            </span>

            <span className="h-1 w-1 rounded-full bg-text-muted/40" />

            <span className="text-[10px] font-semibold text-accent">
              {formatCurrency(revenue)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-border-subtle">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
};

/* ============================================================
   SALES CHART
   ============================================================ */

const SalesChart = ({
  labels,
  revenue,
  orders,
  activeChart,
}) => {
  const values =
    activeChart === "revenue"
      ? revenue
      : orders;

  const normalizedLabels =
    normalizeArray(labels);

  const normalizedValues =
    normalizeArray(values).map(
      safeNumber
    );

  const maxValue = Math.max(
    ...normalizedValues,
    1
  );

  const hasData =
    normalizedValues.some(
      (value) => value > 0
    );

  if (!hasData) {
    return (
      <div className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-border-subtle bg-brand-bg/60 p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025),transparent_55%)]" />

        <div className="relative text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/10 bg-accent/5 text-accent">
            <BarChart3 size={26} />
          </div>

          <p className="mt-4 text-sm font-semibold text-text-secondary">
            No sales data yet
          </p>

          <p className="mx-auto mt-1 max-w-xs text-[11px] leading-5 text-text-muted">
            Completed orders will automatically appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] overflow-hidden rounded-2xl border border-border-subtle bg-brand-bg/60 p-4 sm:p-5">
      {/* GRID */}
      <div className="pointer-events-none absolute inset-x-5 top-5 bottom-12 flex flex-col justify-between">
        {[1, 2, 3, 4, 5].map(
          (line) => (
            <div
              key={line}
              className="border-t border-border-subtle/60"
            />
          )
        )}
      </div>

      {/* Y AXIS */}
      <div className="pointer-events-none absolute bottom-12 left-1 top-5 hidden w-10 flex-col justify-between sm:flex">
        {[1, 2, 3, 4, 5].map(
          (item) => {
            const value =
              (maxValue * item) /
              5;

            return (
              <span
                key={item}
                className="text-right text-[8px] text-text-muted"
              >
                {activeChart ===
                "revenue"
                  ? formatCompactCurrency(
                      value
                    )
                  : formatNumber(
                      Math.round(
                        value
                      )
                    )}
              </span>
            );
          }
        )}
      </div>

      {/* BARS */}
      <div className="relative ml-0 flex h-full items-end gap-2 pb-8 pt-5 sm:ml-8 sm:gap-3">
        {normalizedValues.map(
          (value, index) => {
            const height =
              Math.max(
                4,
                (value /
                  maxValue) *
                  100
              );

            return (
              <div
                key={`${normalizedLabels[index] || index}-${activeChart}`}
                className="group relative flex h-full flex-1 items-end justify-center"
              >
                {/* TOOLTIP */}
                <div className="pointer-events-none absolute bottom-[calc(var(--bar-height)+8px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-lg border border-border-subtle bg-surface px-2.5 py-1.5 text-[9px] font-semibold text-text-primary opacity-0 shadow-xl transition-all duration-200 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                  {activeChart ===
                  "revenue"
                    ? formatCurrency(
                        value
                      )
                    : `${formatNumber(
                        value
                      )} orders`}
                </div>

                <div
                  className="analytics-bar w-full max-w-12 rounded-t-lg bg-accent/80 transition-all duration-300 group-hover:bg-accent"
                  style={{
                    height: `${height}%`,
                    "--bar-height": `${height}%`,
                    animationDelay: `${index * 60}ms`,
                  }}
                />
              </div>
            );
          }
        )}
      </div>

      {/* X AXIS */}
      <div className="absolute bottom-3 left-5 right-5 flex justify-between gap-2 sm:left-13">
        {normalizedLabels.map(
          (label, index) => (
            <span
              key={`${label}-${index}`}
              className="min-w-0 flex-1 truncate text-center text-[8px] font-medium text-text-muted"
              title={String(label)}
            >
              {formatChartLabel(
                label
              )}
            </span>
          )
        )}
      </div>
    </div>
  );
};

/* ============================================================
   CHART LABEL
   ============================================================ */

const formatChartLabel = (
  label
) => {
  if (!label) return "-";

  const value = String(label);

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      value
    )
  ) {
    const date =
      new Date(
        `${value}T00:00:00`
      );

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );
    }
  }

  if (
    /^\d{4}-\d{2}$/.test(
      value
    )
  ) {
    const date =
      new Date(
        `${value}-01T00:00:00`
      );

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
          year: "2-digit",
        }
      );
    }
  }

  return value;
};

/* ============================================================
   COMPACT CURRENCY
   ============================================================ */

const formatCompactCurrency = (
  value
) => {
  const number =
    safeNumber(value);

  if (number >= 10000000) {
    return `₹${(
      number / 10000000
    ).toFixed(1)}Cr`;
  }

  if (number >= 100000) {
    return `₹${(
      number / 100000
    ).toFixed(1)}L`;
  }

  if (number >= 1000) {
    return `₹${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return `₹${Math.round(
    number
  )}`;
};

/* ============================================================
   MAIN ANALYTICS COMPONENT
   ============================================================ */

const Analytics = () => {
  const [period, setPeriod] =
    useState("30d");

  const [
    activeChart,
    setActiveChart,
  ] = useState("revenue");

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* ==========================================================
     FETCH ANALYTICS
     ========================================================== */

  const fetchAnalytics =
    useCallback(
      async ({
        showLoader = true,
      } = {}) => {
        try {
          if (showLoader) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          setError("");

          const response =
            await analyticsService.getAnalytics(
              period
            );

          if (
            !response?.success
          ) {
            throw new Error(
              response?.message ||
                "Failed to load analytics."
            );
          }

          setAnalytics(
            response?.data || {}
          );
        } catch (err) {
          console.error(
            "Analytics page error:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Unable to load analytics data."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [period]
    );

  /* ==========================================================
     INITIAL / PERIOD FETCH
     ========================================================== */

  useEffect(() => {
    fetchAnalytics({
      showLoader: true,
    });
  }, [fetchAnalytics]);

  /* ==========================================================
     REFRESH
     ========================================================== */

  const handleRefresh = () => {
    if (
      loading ||
      refreshing
    ) {
      return;
    }

    fetchAnalytics({
      showLoader: false,
    });
  };

  /* ==========================================================
     DATA
     ========================================================== */

  const stats =
    analytics?.stats || {};

  const chart =
    analytics?.chart || {};

  const topProducts =
    normalizeArray(
      analytics?.topProducts
    );

  const topCategories =
    normalizeArray(
      analytics?.topCategories
    );

  /* ==========================================================
     PERFORMANCE VALUES
     ========================================================== */

  const revenue =
    safeNumber(
      stats?.revenue
    );

  const orders =
    safeNumber(
      stats?.orders
    );

  const customers =
    safeNumber(
      stats?.customers
    );

  const productsSold =
    safeNumber(
      stats?.productsSold
    );

  const averageOrderValue =
    orders > 0
      ? revenue / orders
      : 0;

  /*
   * We intentionally do not invent conversion-rate data.
   * Conversion requires visitor/session data which is not
   * available from the current ecommerce database.
   */

  const conversionRate = null;

  /* ==========================================================
     TOP PRODUCT MAX
     ========================================================== */

  const maxProductRevenue =
    Math.max(
      ...topProducts.map(
        (item) =>
          safeNumber(
            item?.revenue
          )
      ),
      1
    );

  const maxCategoryRevenue =
    Math.max(
      ...topCategories.map(
        (item) =>
          safeNumber(
            item?.revenue
          )
      ),
      1
    );

  /* ==========================================================
     MINI INSIGHTS
     ========================================================== */

  const activityMetrics =
    useMemo(() => {
      const max =
        Math.max(
          orders,
          customers,
          productsSold,
          1
        );

      return {
        orders: Math.min(
          100,
          (orders / max) *
            100
        ),

        customers: Math.min(
          100,
          (customers / max) *
            100
        ),

        products: Math.min(
          100,
          (productsSold / max) *
            100
        ),
      };
    }, [
      orders,
      customers,
      productsSold,
    ]);

  /* ==========================================================
     STATS CONFIG
     ========================================================== */

  const statCards = [
    {
      title: "Total Revenue",
      value: revenue,
      description:
        "Revenue generated",
      icon: IndianRupee,
      growth:
        stats?.growth,
      currency: true,
    },

    {
      title: "Total Orders",
      value: orders,
      description:
        "Orders received",
      icon: ShoppingBag,
      growth:
        stats?.orderGrowth,
    },

    {
      title: "Customers",
      value: customers,
      description:
        "New customers in period",
      icon: Users,
      growth:
        stats?.customerGrowth,
    },

    {
      title: "Products Sold",
      value: productsSold,
      description:
        "Units sold in period",
      icon: Package,
      growth: 0,
    },
  ];

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <>
      <style>{`
        @keyframes analyticsFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes analyticsFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes analyticsGlow {
          0%,
          100% {
            opacity: .25;
            transform: scale(1);
          }

          50% {
            opacity: .55;
            transform: scale(1.08);
          }
        }

        @keyframes analyticsBar {
          from {
            opacity: 0;
            transform: scaleY(0);
            transform-origin: bottom;
          }

          to {
            opacity: 1;
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        .analytics-fade-up {
          animation: analyticsFadeUp .4s ease-out both;
        }

        .analytics-fade-in {
          animation: analyticsFadeIn .35s ease-out both;
        }

        .analytics-glow {
          animation: analyticsGlow 5s ease-in-out infinite;
        }

        .analytics-bar {
          animation: analyticsBar .6s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .analytics-fade-up,
          .analytics-fade-in,
          .analytics-glow,
          .analytics-bar {
            animation: none !important;
          }
        }
      `}</style>

      <main className="min-h-screen overflow-x-hidden bg-brand-bg">
        {/* ==================================================
            AMBIENT BACKGROUND
            ================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="analytics-glow absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />

          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/[0.025] blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {/* ==================================================
              HEADER
              ================================================== */}

          <header className="analytics-fade-up mb-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                {/* Breadcrumb */}
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-text-muted">
                  <span>
                    Admin
                  </span>

                  <span>
                    /
                  </span>

                  <span className="text-accent">
                    Analytics
                  </span>
                </div>

                {/* Title */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                    Analytics
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                    Live Dashboard
                  </span>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                  Track your store performance, sales and customer activity from one place.
                </p>
              </div>

              {/* HEADER ACTIONS */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* PERIOD */}
                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />

                  <select
                    value={period}
                    onChange={(event) =>
                      setPeriod(
                        event.target
                          .value
                      )
                    }
                    disabled={
                      loading ||
                      refreshing
                    }
                    className="h-10 appearance-none rounded-xl border border-border-subtle bg-surface pl-9 pr-9 text-xs font-semibold text-text-primary outline-none transition hover:border-accent/30 focus:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="7d">
                      Last 7 days
                    </option>

                    <option value="30d">
                      Last 30 days
                    </option>

                    <option value="90d">
                      Last 90 days
                    </option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                </div>

                {/* REFRESH */}
                <button
                  type="button"
                  onClick={
                    handleRefresh
                  }
                  disabled={
                    loading ||
                    refreshing
                  }
                  className="group inline-flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:border-accent/40 hover:text-accent active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={
                      refreshing
                        ? "animate-spin"
                        : "transition-transform group-hover:rotate-180"
                    }
                  />

                  <span className="hidden sm:inline">
                    {refreshing
                      ? "Refreshing..."
                      : "Refresh"}
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* ==================================================
              LOADING
              ================================================== */}

          {loading &&
          !analytics ? (
            <AnalyticsSkeleton />
          ) : error &&
            !analytics ? (
            <AnalyticsError
              message={error}
              onRetry={() =>
                fetchAnalytics({
                  showLoader:
                    true,
                })
              }
            />
          ) : (
            <>
              {/* ==================================================
                  ERROR BANNER
                  ================================================== */}

              {error && (
                <div className="analytics-fade-in mb-5 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-4">
                  <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0 text-red-400"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-red-300">
                      Analytics update failed
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-text-muted">
                      {error}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleRefresh
                    }
                    className="shrink-0 text-[10px] font-bold text-accent hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* ==================================================
                  STATS
                  ================================================== */}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map(
                  (
                    stat,
                    index
                  ) => (
                    <StatCard
                      key={
                        stat.title
                      }
                      {...stat}
                      delay={
                        index * 70
                      }
                    />
                  )
                )}
              </section>

              {/* ==================================================
                  MAIN ANALYTICS
                  ================================================== */}

              <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
                {/* ==================================================
                    SALES CHART
                    ================================================== */}

                <div className="analytics-fade-up rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6">
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-text-primary">
                          Sales Overview
                        </h2>

                        <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
                          {
                            PERIODS[
                              period
                            ]?.short
                          }
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-text-muted">
                        Revenue and order performance over time
                      </p>
                    </div>

                    {/* CHART TOGGLE */}
                    <div className="flex w-fit rounded-xl border border-border-subtle bg-brand-bg p-1">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveChart(
                            "revenue"
                          )
                        }
                        className={[
                          "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
                          activeChart ===
                          "revenue"
                            ? "bg-accent text-black shadow-sm"
                            : "text-text-muted hover:text-text-primary",
                        ].join(
                          " "
                        )}
                      >
                        Revenue
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveChart(
                            "orders"
                          )
                        }
                        className={[
                          "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all",
                          activeChart ===
                          "orders"
                            ? "bg-accent text-black shadow-sm"
                            : "text-text-muted hover:text-text-primary",
                        ].join(
                          " "
                        )}
                      >
                        Orders
                      </button>
                    </div>
                  </div>

                  <SalesChart
                    labels={
                      chart?.labels
                    }
                    revenue={
                      chart?.revenue
                    }
                    orders={
                      chart?.orders
                    }
                    activeChart={
                      activeChart
                    }
                  />
                </div>

                {/* ==================================================
                    PERFORMANCE
                    ================================================== */}

                <div
                  className="analytics-fade-up rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6"
                  style={{
                    animationDelay:
                      "120ms",
                  }}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-bold text-text-primary">
                        Performance
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        Store performance summary
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Activity
                        size={19}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <PerformanceItem
                      icon={
                        IndianRupee
                      }
                      label="Average Order Value"
                      value={formatCurrency(
                        averageOrderValue
                      )}
                      helper="Revenue ÷ orders"
                    />

                    <PerformanceItem
                      icon={
                        TrendingUp
                      }
                      label="Revenue Growth"
                      value={formatPercentage(
                        getGrowthValue(
                          stats?.growth
                        )
                      )}
                      helper="Compared with previous period"
                    />

                    <PerformanceItem
                      icon={
                        Users
                      }
                      label="Customers"
                      value={formatNumber(
                        customers
                      )}
                      helper="New customers in period"
                    />

                    <PerformanceItem
                      icon={
                        Package
                      }
                      label="Products Sold"
                      value={formatNumber(
                        productsSold
                      )}
                      helper="Total units sold"
                    />
                  </div>

                  {/* INSIGHT */}
                  <div className="mt-5 rounded-xl border border-accent/10 bg-accent/[0.035] p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={14}
                        className="text-accent"
                      />

                      <span className="text-[11px] font-semibold text-text-secondary">
                        Performance Insight
                      </span>
                    </div>

                    <p className="mt-2 text-[11px] leading-5 text-text-muted">
                      {revenue > 0
                        ? `Your store generated ${formatCurrency(
                            revenue
                          )} from ${formatNumber(
                            orders
                          )} order${
                            orders ===
                            1
                              ? ""
                              : "s"
                          } during the selected period.`
                        : "Once your first completed orders arrive, performance insights will appear here automatically."}
                    </p>
                  </div>

                  {/* CONVERSION NOTE */}
                  <div className="mt-3 rounded-xl border border-border-subtle bg-brand-bg/50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-medium text-text-muted">
                        Conversion Rate
                      </span>

                      <span className="text-[10px] font-semibold text-text-muted">
                        {conversionRate ===
                        null
                          ? "Not available"
                          : `${conversionRate}%`}
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] leading-4 text-text-muted">
                      Visitor/session analytics are required to calculate a true conversion rate.
                    </p>
                  </div>
                </div>
              </section>

              {/* ==================================================
                  ACTIVITY METRICS
                  ================================================== */}

              <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <MiniInsight
                  icon={
                    ShoppingBag
                  }
                  title="Order Activity"
                  value={formatNumber(
                    orders
                  )}
                  description={`Orders processed during ${PERIODS[period]?.label.toLowerCase()}.`}
                  percentage={
                    activityMetrics.orders
                  }
                />

                <MiniInsight
                  icon={Users}
                  title="Customer Activity"
                  value={formatNumber(
                    customers
                  )}
                  description={`New customers during ${PERIODS[period]?.label.toLowerCase()}.`}
                  percentage={
                    activityMetrics.customers
                  }
                />

                <MiniInsight
                  icon={
                    Package
                  }
                  title="Product Activity"
                  value={formatNumber(
                    productsSold
                  )}
                  description={`Units sold during ${PERIODS[period]?.label.toLowerCase()}.`}
                  percentage={
                    activityMetrics.products
                  }
                />
              </section>

              {/* ==================================================
                  TOP PRODUCTS + CATEGORIES
                  ================================================== */}

              <section className="mt-5 grid gap-5 lg:grid-cols-2">
                {/* TOP PRODUCTS */}

                <div className="analytics-fade-up rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-bold text-text-primary">
                        Top Products
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        Best performing products by sales
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Package
                        size={18}
                      />
                    </div>
                  </div>

                  {topProducts.length >
                  0 ? (
                    <div className="space-y-2.5">
                      {topProducts
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (
                            product,
                            index
                          ) => (
                            <TopProductItem
                              key={
                                product?.productId ||
                                index
                              }
                              product={
                                product
                              }
                              index={
                                index
                              }
                              maxRevenue={
                                maxProductRevenue
                              }
                            />
                          )
                        )}
                    </div>
                  ) : (
                    <EmptyAnalyticsState
                      icon={
                        Package
                      }
                      title="No product sales yet"
                      description="Top-selling products will appear here after orders are placed."
                    />
                  )}
                </div>

                {/* TOP CATEGORIES */}

                <div className="analytics-fade-up rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h2 className="font-bold text-text-primary">
                        Top Categories
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        Best performing categories by revenue
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <BarChart3
                        size={18}
                      />
                    </div>
                  </div>

                  {topCategories.length >
                  0 ? (
                    <div className="space-y-2.5">
                      {topCategories
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (
                            category,
                            index
                          ) => (
                            <TopCategoryItem
                              key={
                                category?.categoryId ||
                                index
                              }
                              category={
                                category
                              }
                              index={
                                index
                              }
                              maxRevenue={
                                maxCategoryRevenue
                              }
                            />
                          )
                        )}
                    </div>
                  ) : (
                    <EmptyAnalyticsState
                      icon={
                        BarChart3
                      }
                      title="No category sales yet"
                      description="Category performance will appear here after products are sold."
                    />
                  )}
                </div>
              </section>

              {/* ==================================================
                  SUMMARY
                  ================================================== */}

              <section className="mt-5 overflow-hidden rounded-2xl border border-accent/15 bg-accent/[0.035] p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/10 bg-accent/10 text-accent">
                    <TrendingUp
                      size={19}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-text-primary">
                        Analytics Dashboard
                      </h3>

                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-semibold text-accent">
                        LIVE DATA
                      </span>

                      <span className="rounded-full border border-border-subtle px-2 py-0.5 text-[9px] font-semibold text-text-muted">
                        {
                          PERIODS[
                            period
                          ]?.short
                        }
                      </span>
                    </div>

                    <p className="mt-2 max-w-4xl text-xs leading-5 text-text-secondary">
                      {revenue > 0
                        ? `During ${
                            PERIODS[
                              period
                            ]?.label.toLowerCase() ||
                            "the selected period"
                          }, your store generated ${formatCurrency(
                            revenue
                          )} across ${formatNumber(
                            orders
                          )} orders and sold ${formatNumber(
                            productsSold
                          )} product units to ${formatNumber(
                            customers
                          )} new customers.`
                        : `No completed sales have been recorded for ${
                            PERIODS[
                              period
                            ]?.label.toLowerCase() ||
                            "the selected period"
                          } yet.`}
                    </p>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-[9px] font-medium uppercase tracking-wider text-text-muted">
                      AOV
                    </p>

                    <p className="mt-1 text-lg font-bold text-accent">
                      {formatCurrency(
                        averageOrderValue
                      )}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
};

/* ============================================================
   EMPTY STATE
   ============================================================ */

const EmptyAnalyticsState = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="flex min-h-[190px] flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-brand-bg/40 px-5 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/5 text-accent">
        <Icon size={20} />
      </div>

      <p className="mt-3 text-xs font-semibold text-text-secondary">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-[10px] leading-5 text-text-muted">
        {description}
      </p>
    </div>
  );
};

export default Analytics;