import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FiRefreshCw } from "react-icons/fi";

import dashboardService from "../services/dashboardService";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import DataTable from "../components/common/DataTable";
import EmptyState from "../components/common/EmptyState";

import RevenueChart from "../components/charts/RevenueChart";
import OrdersChart from "../components/charts/OrdersChart";


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  // ====================================================
  // STATES
  // ====================================================

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  const [error, setError] = useState("");


  // ====================================================
  // LOAD DASHBOARD
  // ====================================================

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await dashboardService.getDashboard();

      console.log(
        "========== DASHBOARD RESPONSE =========="
      );

      console.log(
        "Dashboard Data:",
        response
      );

      // ------------------------------------------------
      // Support different API response structures
      // ------------------------------------------------

      const dashboardData =
        response?.data ||
        response?.dashboard ||
        response;

      setDashboard(
        dashboardData || {}
      );

    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load dashboard.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }, []);


  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);


  // ====================================================
  // RECENT ORDERS
  // ====================================================

  const recentOrders = useMemo(() => {

    if (!dashboard) {
      return [];
    }

    if (
      Array.isArray(
        dashboard.recentOrders
      )
    ) {
      return dashboard.recentOrders;
    }

    return [];

  }, [dashboard]);


  // ====================================================
  // LOW STOCK PRODUCTS
  // ====================================================

  const lowStockProducts = useMemo(() => {

    if (!dashboard) {
      return [];
    }

    if (
      Array.isArray(
        dashboard.lowStockProducts
      )
    ) {
      return dashboard.lowStockProducts;
    }

    return [];

  }, [dashboard]);


  // ====================================================
  // REVENUE CHART
  // ====================================================

  const revenueChart = useMemo(() => {

    if (!dashboard) {
      return [];
    }

    if (
      Array.isArray(
        dashboard.revenueChart
      )
    ) {
      return dashboard.revenueChart;
    }

    return [];

  }, [dashboard]);


  // ====================================================
  // ORDERS CHART
  // ====================================================

  const ordersChart = useMemo(() => {

    if (!dashboard) {
      return [];
    }

    if (
      Array.isArray(
        dashboard.ordersChart
      )
    ) {
      return dashboard.ordersChart;
    }

    return [];

  }, [dashboard]);


  // ====================================================
  // FORMAT CURRENCY
  // ====================================================

  const formatCurrency = (value) => {

    const amount =
      Number(value) || 0;

    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  };


  // ====================================================
  // ORDER TABLE COLUMNS
  // ====================================================

  const orderColumns = useMemo(
    () => [
      {
        Header: "Order",
        accessor: "order",
      },

      {
        Header: "Customer",
        accessor: "customer",
      },

      {
        Header: "Amount",
        accessor: "amount",
      },

      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );


  // ====================================================
  // STOCK TABLE COLUMNS
  // ====================================================

  const stockColumns = useMemo(
    () => [
      {
        Header: "Product",
        accessor: "product",
      },

      {
        Header: "Stock",
        accessor: "stock",
      },

      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );


  // ====================================================
  // RECENT ORDERS TABLE DATA
  // ====================================================

  const recentOrdersTable = useMemo(() => {

    return recentOrders.map(
      (order) => {

        const status =
          order?.status ||
          "Pending";

        let statusClass =
          "bg-accent/20 text-accent";

        if (
          String(status).toLowerCase() ===
          "delivered"
        ) {
          statusClass =
            "bg-green-500/20 text-green-400";
        }

        if (
          String(status).toLowerCase() ===
          "cancelled"
        ) {
          statusClass =
            "bg-red-500/20 text-red-400";
        }

        return {

          order:
            order?.orderNumber ||
            order?._id ||
            "N/A",

          customer:
            order?.customer?.name ||
            order?.user?.name ||
            order?.customerName ||
            "Unknown",

          amount:
            formatCurrency(
              order?.totalAmount ??
              order?.total ??
              0
            ),

          status: (
            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${statusClass}
              `}
            >
              {status}
            </span>
          ),
        };
      }
    );

  }, [recentOrders]);


  // ====================================================
  // LOW STOCK TABLE DATA
  // ====================================================

  const lowStockTable = useMemo(() => {

    return lowStockProducts.map(
      (product) => ({

        product:
          product?.name ||
          "Unnamed Product",

        stock:
          product?.stock ??
          product?.quantity ??
          0,

        status: (
          <span
            className="
              inline-flex
              rounded-full
              bg-red-500/20
              px-3
              py-1
              text-xs
              font-semibold
              text-red-400
            "
          >
            Low Stock
          </span>
        ),

      })
    );

  }, [lowStockProducts]);


  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-8">


      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <PageHeader
        title="Dashboard"
        subtitle="Welcome back, Admin 👋"
        breadcrumbs={[
          "Admin",
          "Dashboard",
        ]}
        action={
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-border-subtle
              bg-surface
              px-5
              py-3
              text-text-primary
              transition-all
              duration-200
              hover:border-accent
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            <FiRefreshCw
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            {loading
              ? "Refreshing..."
              : "Refresh"}

          </button>
        }
      />


      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            p-4
            text-sm
            text-red-400
          "
        >
          <div className="flex items-center justify-between gap-4">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadDashboard}
              className="
                rounded-lg
                border
                border-red-500/30
                px-3
                py-2
                text-xs
                font-semibold
                hover:bg-red-500/10
              "
            >
              Retry
            </button>

          </div>
        </div>
      )}


      {/* ==================================================
          MAIN STAT CARDS
      ================================================== */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        <StatCard
          title="Total Revenue"
          value={formatCurrency(
            dashboard?.totalRevenue
          )}
          icon="revenue"
          color="text-green-400"
          bgColor="bg-green-500/10"
          loading={loading}
        />


        <StatCard
          title="Products"
          value={
            dashboard?.totalProducts || 0
          }
          icon="products"
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          loading={loading}
        />


        <StatCard
          title="Orders"
          value={
            dashboard?.totalOrders || 0
          }
          icon="orders"
          color="text-yellow-400"
          bgColor="bg-yellow-500/10"
          loading={loading}
        />


        <StatCard
          title="Customers"
          value={
            dashboard?.totalUsers ||
            dashboard?.totalCustomers ||
            0
          }
          icon="users"
          color="text-purple-400"
          bgColor="bg-purple-500/10"
          loading={loading}
        />


        <StatCard
          title="Reviews"
          value={
            dashboard?.totalReviews || 0
          }
          icon="reviews"
          color="text-pink-400"
          bgColor="bg-pink-500/10"
          loading={loading}
        />


        <StatCard
          title="Coupons"
          value={
            dashboard?.totalCoupons || 0
          }
          icon="coupon"
          color="text-cyan-400"
          bgColor="bg-cyan-500/10"
          loading={loading}
        />

      </div>


      {/* ==================================================
          CHARTS
      ================================================== */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-2
        "
      >

        <RevenueChart
          data={revenueChart}
          loading={loading}
        />

        <OrdersChart
          data={ordersChart}
          loading={loading}
        />

      </div>


      {/* ==================================================
          RECENT ORDERS + LOW STOCK
      ================================================== */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >


        {/* =================================================
            RECENT ORDERS
        ================================================= */}

        <div>

          {recentOrders.length > 0 ? (

            <DataTable
              title="Recent Orders"
              columns={orderColumns}
              loading={loading}
              data={recentOrdersTable}
            />

          ) : (

            <EmptyState
              title="No Orders"
              description="No recent orders found."
            />

          )}

        </div>


        {/* =================================================
            LOW STOCK PRODUCTS
        ================================================= */}

        <div>

          {lowStockProducts.length > 0 ? (

            <DataTable
              title="Low Stock Products"
              columns={stockColumns}
              loading={loading}
              data={lowStockTable}
            />

          ) : (

            <EmptyState
              title="Inventory Healthy"
              description="No low stock products."
            />

          )}

        </div>

      </div>


      {/* ==================================================
          QUICK SUMMARY
      ================================================== */}

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <StatCard
          title="Pending Orders"
          value={
            dashboard?.pendingOrders || 0
          }
          icon="orders"
          color="text-yellow-400"
          bgColor="bg-yellow-500/10"
          loading={loading}
        />


        <StatCard
          title="Delivered Orders"
          value={
            dashboard?.deliveredOrders || 0
          }
          icon="orders"
          color="text-green-400"
          bgColor="bg-green-500/10"
          loading={loading}
        />


        <StatCard
          title="Today's Revenue"
          value={formatCurrency(
            dashboard?.todayRevenue
          )}
          icon="revenue"
          color="text-blue-400"
          bgColor="bg-blue-500/10"
          loading={loading}
        />


        <StatCard
          title="Out Of Stock"
          value={
            dashboard?.outOfStockProducts || 0
          }
          icon="products"
          color="text-red-400"
          bgColor="bg-red-500/10"
          loading={loading}
        />

      </div>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
          text-center
        "
      >

        <h3
          className="
            text-lg
            font-semibold
            text-text-primary
          "
        >
          FashionStore Admin Dashboard
        </h3>

        <p
          className="
            mt-2
            text-sm
            text-text-secondary
          "
        >
          Manage products, orders, users,
          coupons, inventory and analytics
          from one place.
        </p>

      </div>

    </div>
  );
}


// ======================================================
// EXPORT
// ======================================================

export default Dashboard;