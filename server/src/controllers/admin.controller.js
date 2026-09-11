import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ======================================================
// GET ADMIN DASHBOARD
// ======================================================

export const getDashboard = async (req, res) => {
  try {
    // ==================================================
    // DISABLE CACHE
    // ==================================================

    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    // ==================================================
    // BASIC COUNTS
    // ==================================================

    const [
      totalUsers,
      totalProducts,
      totalOrders,
      activeProducts,
      outOfStockProducts,
      lowStockCount,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments(),

      Order.countDocuments(),

      Product.countDocuments({
        isActive: true,
      }),

      Product.countDocuments({
        isActive: true,
        stock: 0,
      }),

      Product.countDocuments({
        isActive: true,
        stock: {
          $gt: 0,
          $lte: 10,
        },
      }),

      Order.countDocuments({
        status: "Pending",
      }),

      Order.countDocuments({
        status: "Delivered",
      }),

      Order.countDocuments({
        status: "Cancelled",
      }),
    ]);

    // ==================================================
    // TOTAL REVENUE
    // ==================================================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "Cancelled",
          },
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$priceDetails.total",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? Number(revenueResult[0].totalRevenue || 0)
        : 0;

    // ==================================================
    // TODAY REVENUE
    // ==================================================

    const startOfToday = new Date();

    startOfToday.setHours(
      0,
      0,
      0,
      0
    );

    const endOfToday = new Date();

    endOfToday.setHours(
      23,
      59,
      59,
      999
    );

    const todayRevenueResult = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday,
          },

          status: {
            $ne: "Cancelled",
          },
        },
      },

      {
        $group: {
          _id: null,

          total: {
            $sum: "$priceDetails.total",
          },
        },
      },
    ]);

    const todayRevenue =
      todayRevenueResult.length > 0
        ? Number(todayRevenueResult[0].total || 0)
        : 0;

    // ==================================================
    // RECENT ORDERS
    // ==================================================

    const recentOrders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean();

    // ==================================================
    // LOW STOCK PRODUCTS
    // ==================================================

    const lowStockProductList =
      await Product.find({
        isActive: true,

        stock: {
          $gt: 0,
          $lte: 10,
        },
      })
        .select(
          "name stock slug images"
        )
        .sort({
          stock: 1,
        })
        .limit(5)
        .lean();

    // ==================================================
    // OUT OF STOCK PRODUCTS
    // ==================================================

    const outOfStockProductList =
      await Product.find({
        isActive: true,

        stock: 0,
      })
        .select(
          "name stock slug images"
        )
        .sort({
          updatedAt: -1,
        })
        .limit(5)
        .lean();

    // ==================================================
    // CURRENT YEAR
    // ==================================================

    const currentYear =
      new Date().getFullYear();

    // ==================================================
    // MONTHLY REVENUE
    // ==================================================

    const revenueChartResult =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                `${currentYear}-01-01T00:00:00.000Z`
              ),

              $lt: new Date(
                `${currentYear + 1}-01-01T00:00:00.000Z`
              ),
            },

            status: {
              $ne: "Cancelled",
            },
          },
        },

        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },

            revenue: {
              $sum: "$priceDetails.total",
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);

    // ==================================================
    // MONTHLY ORDERS
    // ==================================================

    const ordersChartResult =
      await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(
                `${currentYear}-01-01T00:00:00.000Z`
              ),

              $lt: new Date(
                `${currentYear + 1}-01-01T00:00:00.000Z`
              ),
            },
          },
        },

        {
          $group: {
            _id: {
              month: {
                $month: "$createdAt",
              },
            },

            orders: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);

    // ==================================================
    // MONTH NAMES
    // ==================================================

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // ==================================================
    // FORMAT REVENUE CHART
    // ==================================================

    const revenueChart = months.map(
      (month, index) => {
        const found =
          revenueChartResult.find(
            (item) =>
              item._id.month ===
              index + 1
          );

        return {
          month,

          revenue: Number(
            found?.revenue || 0
          ),
        };
      }
    );

    // ==================================================
    // FORMAT ORDERS CHART
    // ==================================================

    const ordersChart = months.map(
      (month, index) => {
        const found =
          ordersChartResult.find(
            (item) =>
              item._id.month ===
              index + 1
          );

        return {
          month,

          orders: Number(
            found?.orders || 0
          ),
        };
      }
    );

    // ==================================================
    // FORMAT RECENT ORDERS
    // ==================================================

    const formattedRecentOrders =
      recentOrders.map(
        (order) => ({
          _id: order._id,

          orderNumber:
            order.orderNumber ||
            order._id,

          customer: {
            name:
              order.user?.name ||
              "Unknown",

            email:
              order.user?.email ||
              "",
          },

          totalAmount: Number(
            order.priceDetails?.total ||
              0
          ),

          paymentStatus:
            order.payment?.status ||
            "Pending",

          status:
            order.status,

          createdAt:
            order.createdAt,
        })
      );

    // ==================================================
    // FORMAT LOW STOCK
    // ==================================================

    const formattedLowStock =
      lowStockProductList.map(
        (product) => ({
          _id: product._id,

          name:
            product.name,

          slug:
            product.slug,

          stock:
            product.stock,

          image:
            product.images?.[0] ||
            "",
        })
      );

    // ==================================================
    // FORMAT OUT OF STOCK
    // ==================================================

    const formattedOutOfStock =
      outOfStockProductList.map(
        (product) => ({
          _id: product._id,

          name:
            product.name,

          slug:
            product.slug,

          stock:
            product.stock,

          image:
            product.images?.[0] ||
            "",
        })
      );

    // ==================================================
    // DASHBOARD RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      message:
        "Dashboard fetched successfully.",

      data: {
        totalRevenue,

        todayRevenue,

        totalUsers,

        totalProducts,

        totalOrders,

        activeProducts,

        pendingOrders,

        deliveredOrders,

        cancelledOrders,

        outOfStockProducts,

        lowStockCount,

        recentOrders:
          formattedRecentOrders,

        lowStockProducts:
          formattedLowStock,

        outOfStockProductList:
          formattedOutOfStock,

        revenueChart,

        ordersChart,

        currentYear,
      },
    });
  } catch (error) {
    console.error(
      "❌ Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch dashboard.",

      error:
        process.env.NODE_ENV ===
        "development"
          ? error.message
          : undefined,
    });
  }
};