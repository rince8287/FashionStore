import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

/* ============================================================
   HELPERS
   ============================================================ */

/**
 * Get date range from period
 *
 * Supported:
 * 7d  -> last 7 days
 * 30d -> last 30 days
 * 90d -> last 90 days
 */
const getDateRange = (period = "30d") => {
  const endDate = new Date();
  const startDate = new Date(endDate);

  switch (period) {
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;

    case "90d":
      startDate.setDate(startDate.getDate() - 90);
      break;

    case "30d":
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  return {
    startDate,
    endDate,
  };
};

/**
 * Get previous period.
 *
 * Example:
 * Current = last 30 days
 * Previous = 30 days before that
 */
const getPreviousDateRange = (period = "30d") => {
  const { startDate, endDate } = getDateRange(period);

  const duration = endDate.getTime() - startDate.getTime();

  return {
    startDate: new Date(startDate.getTime() - duration),
    endDate: new Date(startDate),
  };
};

/**
 * Calculate percentage growth.
 */
const calculateGrowth = (current, previous) => {
  if (!previous || previous === 0) {
    if (current > 0) return 100;
    return 0;
  }

  return ((current - previous) / previous) * 100;
};

/**
 * Round number to 2 decimals.
 */
const round = (value) => {
  return Math.round((Number(value) || 0) * 100) / 100;
};

/**
 * Format percentage.
 */
const formatGrowth = (value) => {
  const rounded = round(value);

  return {
    value: rounded,
    formatted: `${rounded >= 0 ? "+" : ""}${rounded}%`,
    direction:
      rounded > 0
        ? "up"
        : rounded < 0
          ? "down"
          : "neutral",
  };
};

/**
 * Check whether an order should count as revenue.
 *
 * Cancelled / failed / refunded orders are excluded.
 */
const revenueOrderFilter = {
  status: {
    $nin: [
      "cancelled",
      "canceled",
      "failed",
      "refunded",
    ],
  },
};

/**
 * Safely extract order amount.
 *
 * Supports common ecommerce naming conventions.
 */
const getOrderAmountExpression = () => ({
  $ifNull: [
    "$totalAmount",
    {
      $ifNull: [
        "$grandTotal",
        {
          $ifNull: [
            "$total",
            0,
          ],
        },
      ],
    },
  ],
});

/* ============================================================
   1. GET ANALYTICS SUMMARY
   ============================================================ */

export const getAnalyticsSummary = async (req, res) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } = getDateRange(period);
    const previous = getPreviousDateRange(period);

    const currentOrderFilter = {
      ...revenueOrderFilter,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const previousOrderFilter = {
      ...revenueOrderFilter,
      createdAt: {
        $gte: previous.startDate,
        $lt: previous.endDate,
      },
    };

    const [
      currentRevenueResult,
      previousRevenueResult,
      currentOrders,
      previousOrders,
      customers,
      previousCustomers,
      productsSoldResult,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: currentOrderFilter,
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: getOrderAmountExpression(),
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: previousOrderFilter,
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: getOrderAmountExpression(),
            },
          },
        },
      ]),

      Order.countDocuments(currentOrderFilter),

      Order.countDocuments(previousOrderFilter),

      User.countDocuments({
        role: {
          $ne: "admin",
        },
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      User.countDocuments({
        role: {
          $ne: "admin",
        },
        createdAt: {
          $gte: previous.startDate,
          $lt: previous.endDate,
        },
      }),

      Order.aggregate([
        {
          $match: currentOrderFilter,
        },
        {
          $unwind: {
            path: "$items",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: null,
            productsSold: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const revenue = round(
      currentRevenueResult[0]?.revenue || 0
    );

    const previousRevenue = round(
      previousRevenueResult[0]?.revenue || 0
    );

    const productsSold =
      productsSoldResult[0]?.productsSold || 0;

    const revenueGrowth = calculateGrowth(
      revenue,
      previousRevenue
    );

    const orderGrowth = calculateGrowth(
      currentOrders,
      previousOrders
    );

    const customerGrowth = calculateGrowth(
      customers,
      previousCustomers
    );

    const overallGrowth = revenueGrowth;

    res.status(200).json({
      success: true,

      data: {
        period,

        revenue: {
          current: revenue,
          previous: previousRevenue,
          growth: formatGrowth(revenueGrowth),
        },

        orders: {
          current: currentOrders,
          previous: previousOrders,
          growth: formatGrowth(orderGrowth),
        },

        customers: {
          current: customers,
          previous: previousCustomers,
          growth: formatGrowth(customerGrowth),
        },

        productsSold,

        growth: formatGrowth(overallGrowth),
      },
    });
  } catch (error) {
    console.error(
      "Get analytics summary error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics summary",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   2. GET SALES ANALYTICS
   ============================================================ */

export const getSalesAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } = getDateRange(period);

    let groupFormat;

    if (period === "7d") {
      groupFormat = "%Y-%m-%d";
    } else if (period === "90d") {
      groupFormat = "%Y-%m";
    } else {
      groupFormat = "%Y-%m-%d";
    }

    const sales = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: "$createdAt",
            },
          },

          revenue: {
            $sum: getOrderAmountExpression(),
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        labels: sales.map((item) => item._id),

        revenue: sales.map((item) =>
          round(item.revenue)
        ),

        orders: sales.map((item) =>
          Number(item.orders || 0)
        ),

        series: sales.map((item) => ({
          date: item._id,
          revenue: round(item.revenue),
          orders: Number(item.orders || 0),
        })),
      },
    });
  } catch (error) {
    console.error(
      "Get sales analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch sales analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   3. GET REVENUE ANALYTICS
   ============================================================ */

export const getRevenueAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } = getDateRange(period);
    const previous = getPreviousDateRange(period);

    const [current, previousResult] =
      await Promise.all([
        Order.aggregate([
          {
            $match: {
              ...revenueOrderFilter,
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              revenue: {
                $sum: getOrderAmountExpression(),
              },
              orders: {
                $sum: 1,
              },
            },
          },
        ]),

        Order.aggregate([
          {
            $match: {
              ...revenueOrderFilter,
              createdAt: {
                $gte: previous.startDate,
                $lt: previous.endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              revenue: {
                $sum: getOrderAmountExpression(),
              },
              orders: {
                $sum: 1,
              },
            },
          },
        ]),
      ]);

    const revenue = round(
      current[0]?.revenue || 0
    );

    const previousRevenue = round(
      previousResult[0]?.revenue || 0
    );

    const orders =
      current[0]?.orders || 0;

    const previousOrders =
      previousResult[0]?.orders || 0;

    const averageOrderValue =
      orders > 0
        ? round(revenue / orders)
        : 0;

    const previousAOV =
      previousOrders > 0
        ? round(previousRevenue / previousOrders)
        : 0;

    const growth = calculateGrowth(
      revenue,
      previousRevenue
    );

    const aovGrowth = calculateGrowth(
      averageOrderValue,
      previousAOV
    );

    res.status(200).json({
      success: true,

      data: {
        period,

        revenue,

        previousRevenue,

        growth: formatGrowth(growth),

        orders,

        averageOrderValue,

        previousAverageOrderValue:
          previousAOV,

        averageOrderValueGrowth:
          formatGrowth(aovGrowth),
      },
    });
  } catch (error) {
    console.error(
      "Get revenue analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   4. GET ORDER ANALYTICS
   ============================================================ */

export const getOrderAnalytics = async (req, res) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } = getDateRange(period);

    const [statusBreakdown, totalOrders] =
      await Promise.all([
        Order.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },

          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
            },
          },
        ]),

        Order.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }),
      ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        totalOrders,

        statusBreakdown:
          statusBreakdown.map((item) => ({
            status: item._id || "unknown",
            count: item.count,
            percentage:
              totalOrders > 0
                ? round(
                    (item.count / totalOrders) *
                      100
                  )
                : 0,
          })),
      },
    });
  } catch (error) {
    console.error(
      "Get order analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch order analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   5. GET CUSTOMER ANALYTICS
   ============================================================ */

export const getCustomerAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } =
      getDateRange(period);

    const [
      newCustomers,
      totalCustomers,
      activeCustomers,
    ] = await Promise.all([
      User.countDocuments({
        role: {
          $ne: "admin",
        },
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      User.countDocuments({
        role: {
          $ne: "admin",
        },
      }),

      Order.distinct("user", {
        ...revenueOrderFilter,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        user: {
          $exists: true,
          $ne: null,
        },
      }),
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        newCustomers,

        totalCustomers,

        activeCustomers:
          activeCustomers.length,

        customerActivityRate:
          totalCustomers > 0
            ? round(
                (activeCustomers.length /
                  totalCustomers) *
                  100
              )
            : 0,
      },
    });
  } catch (error) {
    console.error(
      "Get customer analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   6. GET PRODUCT ANALYTICS
   ============================================================ */

export const getProductAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } =
      getDateRange(period);

    const products = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",

          quantitySold: {
            $sum: {
              $ifNull: [
                "$items.quantity",
                0,
              ],
            },
          },

          revenue: {
            $sum: {
              $multiply: [
                {
                  $ifNull: [
                    "$items.quantity",
                    0,
                  ],
                },
                {
                  $ifNull: [
                    "$items.price",
                    0,
                  ],
                },
              ],
            },
          },
        },
      },

      {
        $sort: {
          quantitySold: -1,
        },
      },

      {
        $limit: 20,
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        products: products.map((item) => ({
          productId: item._id,
          quantitySold:
            Number(item.quantitySold || 0),
          revenue: round(item.revenue),
        })),
      },
    });
  } catch (error) {
    console.error(
      "Get product analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch product analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   7. GET CATEGORY ANALYTICS
   ============================================================ */

export const getCategoryAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } =
      getDateRange(period);

    const categories = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.category",

          quantitySold: {
            $sum: {
              $ifNull: [
                "$items.quantity",
                0,
              ],
            },
          },

          revenue: {
            $sum: {
              $multiply: [
                {
                  $ifNull: [
                    "$items.quantity",
                    0,
                  ],
                },
                {
                  $ifNull: [
                    "$items.price",
                    0,
                  ],
                },
              ],
            },
          },
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        categories: categories.map(
          (item) => ({
            categoryId: item._id,
            quantitySold:
              Number(
                item.quantitySold || 0
              ),
            revenue: round(
              item.revenue
            ),
          })
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get category analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch category analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   8. GET TOP PRODUCTS
   ============================================================ */

export const getTopProducts = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";
    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const { startDate, endDate } =
      getDateRange(period);

    const products = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",

          quantitySold: {
            $sum: {
              $ifNull: [
                "$items.quantity",
                0,
              ],
            },
          },

          revenue: {
            $sum: {
              $multiply: [
                {
                  $ifNull: [
                    "$items.quantity",
                    0,
                  ],
                },
                {
                  $ifNull: [
                    "$items.price",
                    0,
                  ],
                },
              ],
            },
          },

          productName: {
            $first: "$items.name",
          },

          image: {
            $first: "$items.image",
          },
        },
      },

      {
        $sort: {
          quantitySold: -1,
        },
      },

      {
        $limit: limit,
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        products: products.map(
          (product, index) => ({
            rank: index + 1,

            productId:
              product._id,

            name:
              product.productName ||
              "Product",

            image:
              product.image ||
              null,

            quantitySold:
              Number(
                product.quantitySold || 0
              ),

            revenue:
              round(
                product.revenue
              ),
          })
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get top products error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   9. GET TOP CATEGORIES
   ============================================================ */

export const getTopCategories = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const limit = Math.min(
      Number(req.query.limit) || 10,
      50
    );

    const { startDate, endDate } =
      getDateRange(period);

    const categories = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.category",

          quantitySold: {
            $sum: {
              $ifNull: [
                "$items.quantity",
                0,
              ],
            },
          },

          revenue: {
            $sum: {
              $multiply: [
                {
                  $ifNull: [
                    "$items.quantity",
                    0,
                  ],
                },
                {
                  $ifNull: [
                    "$items.price",
                    0,
                  ],
                },
              ],
            },
          },

          categoryName: {
            $first:
              "$items.categoryName",
          },
        },
      },

      {
        $sort: {
          revenue: -1,
        },
      },

      {
        $limit: limit,
      },
    ]);

    res.status(200).json({
      success: true,

      data: {
        period,

        categories: categories.map(
          (category, index) => ({
            rank: index + 1,

            categoryId:
              category._id,

            name:
              category.categoryName ||
              "Category",

            quantitySold:
              Number(
                category.quantitySold ||
                  0
              ),

            revenue:
              round(
                category.revenue
              ),
          })
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get top categories error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch top categories",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   10. GET PERFORMANCE ANALYTICS
   ============================================================ */

export const getPerformanceAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } =
      getDateRange(period);

    const [
      revenueResult,
      orderCount,
      productsSoldResult,
      customers,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            ...revenueOrderFilter,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },

        {
          $group: {
            _id: null,

            revenue: {
              $sum:
                getOrderAmountExpression(),
            },
          },
        },
      ]),

      Order.countDocuments({
        ...revenueOrderFilter,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      Order.aggregate([
        {
          $match: {
            ...revenueOrderFilter,
            createdAt: {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },

        {
          $unwind: "$items",
        },

        {
          $group: {
            _id: null,

            productsSold: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },
          },
        },
      ]),

      Order.distinct("user", {
        ...revenueOrderFilter,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
        user: {
          $exists: true,
          $ne: null,
        },
      }),
    ]);

    const revenue = round(
      revenueResult[0]?.revenue || 0
    );

    const averageOrderValue =
      orderCount > 0
        ? round(revenue / orderCount)
        : 0;

    const productsSold =
      productsSoldResult[0]
        ?.productsSold || 0;

    res.status(200).json({
      success: true,

      data: {
        period,

        averageOrderValue,

        conversionRate: 0,

        returningCustomers:
          customers.length,

        productsSold,

        revenue,

        totalOrders:
          orderCount,
      },
    });
  } catch (error) {
    console.error(
      "Get performance analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch performance analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   11. GET ANALYTICS BY CUSTOM DATE RANGE
   ============================================================ */

export const getAnalyticsByDateRange = async (
  req,
  res
) => {
  try {
    const { startDate, endDate } =
      req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date format",
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message:
          "startDate cannot be after endDate",
      });
    }

    const orders = await Order.aggregate([
      {
        $match: {
          ...revenueOrderFilter,
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          revenue: {
            $sum:
              getOrderAmountExpression(),
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const totalRevenue = round(
      orders.reduce(
        (sum, item) =>
          sum + Number(item.revenue || 0),
        0
      )
    );

    const totalOrders = orders.reduce(
      (sum, item) =>
        sum + Number(item.orders || 0),
      0
    );

    res.status(200).json({
      success: true,

      data: {
        startDate,
        endDate,

        totalRevenue,

        totalOrders,

        averageOrderValue:
          totalOrders > 0
            ? round(
                totalRevenue /
                  totalOrders
              )
            : 0,

        labels: orders.map(
          (item) => item._id
        ),

        revenue: orders.map(
          (item) =>
            round(item.revenue)
        ),

        orders: orders.map(
          (item) =>
            Number(item.orders || 0)
        ),

        series: orders.map(
          (item) => ({
            date: item._id,
            revenue:
              round(item.revenue),
            orders:
              Number(
                item.orders || 0
              ),
          })
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get date range analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch date range analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   12. GET COMPLETE ANALYTICS
   ============================================================ */

export const getAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    const { startDate, endDate } =
      getDateRange(period);

    const previous =
      getPreviousDateRange(period);

    const currentOrderFilter = {
      ...revenueOrderFilter,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const previousOrderFilter = {
      ...revenueOrderFilter,
      createdAt: {
        $gte: previous.startDate,
        $lt: previous.endDate,
      },
    };

    const [
      currentRevenue,
      previousRevenue,
      currentOrders,
      previousOrders,
      currentCustomers,
      previousCustomers,
      productsSold,
      sales,
      topProducts,
      topCategories,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match:
            currentOrderFilter,
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum:
                getOrderAmountExpression(),
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match:
            previousOrderFilter,
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum:
                getOrderAmountExpression(),
            },
          },
        },
      ]),

      Order.countDocuments(
        currentOrderFilter
      ),

      Order.countDocuments(
        previousOrderFilter
      ),

      User.countDocuments({
        role: {
          $ne: "admin",
        },
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }),

      User.countDocuments({
        role: {
          $ne: "admin",
        },
        createdAt: {
          $gte: previous.startDate,
          $lt: previous.endDate,
        },
      }),

      Order.aggregate([
        {
          $match:
            currentOrderFilter,
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: null,
            count: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match:
            currentOrderFilter,
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format:
                  period === "90d"
                    ? "%Y-%m"
                    : "%Y-%m-%d",
                date: "$createdAt",
              },
            },

            revenue: {
              $sum:
                getOrderAmountExpression(),
            },

            orders: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      Order.aggregate([
        {
          $match:
            currentOrderFilter,
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.product",

            name: {
              $first:
                "$items.name",
            },

            quantitySold: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },

            revenue: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.quantity",
                      0,
                    ],
                  },
                  {
                    $ifNull: [
                      "$items.price",
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $sort: {
            quantitySold: -1,
          },
        },
        {
          $limit: 10,
        },
      ]),

      Order.aggregate([
        {
          $match:
            currentOrderFilter,
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id:
              "$items.category",

            name: {
              $first:
                "$items.categoryName",
            },

            quantitySold: {
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },

            revenue: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.quantity",
                      0,
                    ],
                  },
                  {
                    $ifNull: [
                      "$items.price",
                      0,
                    ],
                  },
                ],
              },
            },
          },
        },
        {
          $sort: {
            revenue: -1,
          },
        },
        {
          $limit: 10,
        },
      ]),
    ]);

    const revenue = round(
      currentRevenue[0]?.revenue || 0
    );

    const oldRevenue = round(
      previousRevenue[0]?.revenue || 0
    );

    const sold =
      productsSold[0]?.count || 0;

    const averageOrderValue =
      currentOrders > 0
        ? round(
            revenue /
              currentOrders
          )
        : 0;

    res.status(200).json({
      success: true,

      data: {
        period,

        dateRange: {
          startDate,
          endDate,
        },

        stats: {
          revenue,
          orders: currentOrders,
          customers:
            currentCustomers,
          productsSold: sold,

          averageOrderValue,

          growth: formatGrowth(
            calculateGrowth(
              revenue,
              oldRevenue
            )
          ),

          orderGrowth:
            formatGrowth(
              calculateGrowth(
                currentOrders,
                previousOrders
              )
            ),

          customerGrowth:
            formatGrowth(
              calculateGrowth(
                currentCustomers,
                previousCustomers
              )
            ),
        },

        chart: {
          labels: sales.map(
            (item) => item._id
          ),

          revenue: sales.map(
            (item) =>
              round(
                item.revenue
              )
          ),

          orders: sales.map(
            (item) =>
              Number(
                item.orders || 0
              )
          ),

          series: sales.map(
            (item) => ({
              date: item._id,

              revenue:
                round(
                  item.revenue
                ),

              orders:
                Number(
                  item.orders || 0
                ),
            })
          ),
        },

        topProducts:
          topProducts.map(
            (item, index) => ({
              rank: index + 1,

              productId:
                item._id,

              name:
                item.name ||
                "Product",

              quantitySold:
                Number(
                  item.quantitySold ||
                    0
                ),

              revenue:
                round(
                  item.revenue
                ),
            })
          ),

        topCategories:
          topCategories.map(
            (item, index) => ({
              rank: index + 1,

              categoryId:
                item._id,

              name:
                item.name ||
                "Category",

              quantitySold:
                Number(
                  item.quantitySold ||
                    0
                ),

              revenue:
                round(
                  item.revenue
                ),
            })
          ),
      },
    });
  } catch (error) {
    console.error(
      "Get complete analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

/* ============================================================
   13. REFRESH ANALYTICS
   ============================================================ */

export const refreshAnalytics = async (
  req,
  res
) => {
  try {
    const period = req.query.period || "30d";

    /*
     * Analytics are calculated directly from MongoDB,
     * so no separate cache/database refresh is required.
     *
     * Simply return the latest calculated analytics.
     */

    return getAnalytics(req, res);
  } catch (error) {
    console.error(
      "Refresh analytics error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to refresh analytics",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};