import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";

import orderService from "../services/orderService";

import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";
import StatusBadge from "../components/common/StatusBadge";
import DataTable from "../components/common/DataTable";
import EmptyState from "../components/common/EmptyState";

function Orders() {

  // ==========================================
  // STATES
  // ==========================================

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    orders,
    setOrders,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("all");

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState("all");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({

    currentPage: 1,

    totalPages: 1,

    totalOrders: 0,

    hasNextPage: false,

    hasPrevPage: false,

  });

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders =
    async () => {

      try {

        setLoading(true);

        const response =
          await orderService.getOrders({

            page,

            search,

            status,

            paymentStatus,

          });

        setOrders(
          response.orders || []
        );

        setPagination(

          response.pagination ||

          {

            currentPage: 1,

            totalPages: 1,

            totalOrders: 0,

            hasNextPage: false,

            hasPrevPage: false,

          }

        );

      } catch (error) {

        console.error(error);

        alert(
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

  // ==========================================
  // LOAD ON CHANGE
  // ==========================================

  useEffect(() => {

    loadOrders();

  }, [

    page,

    search,

    status,

    paymentStatus,

  ]);

  // ==========================================
  // TABLE COLUMNS
  // ==========================================

  const columns = useMemo(
    () => [

      {
        Header: "Order ID",
        accessor: "orderId",
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

      {
        Header: "Payment",
        accessor: "payment",
      },

      {
        Header: "Date",
        accessor: "date",
      },

      {
        Header: "Actions",
        accessor: "actions",
      },

    ],
    []
  );
    // ==========================================
  // TABLE DATA
  // ==========================================

  const tableData = useMemo(
    () =>

      orders.map((order) => ({

        orderId: (
          <span className="font-semibold text-text-primary">
            {order.orderNumber || order._id}
          </span>
        ),

        customer: (
          <div>
            <p className="font-medium text-text-primary">
              {order.user?.name || "-"}
            </p>

            <p className="text-sm text-text-secondary">
              {order.user?.email}
            </p>
          </div>
        ),

        amount: (
          <span className="font-semibold text-accent">
            ₹
            {Number(
              order.totalAmount || 0
            ).toLocaleString()}
          </span>
        ),

        status: (
          <StatusBadge
            status={order.status}
          />
        ),

        payment: (
          <StatusBadge
            status={
              order.paymentStatus
            }
          />
        ),

        date: (
          <span className="text-text-secondary">
            {new Date(
              order.createdAt
            ).toLocaleDateString()}
          </span>
        ),

        actions: (

          <Link
            to={`/admin/orders/${order._id}`}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-accent
              px-4
              py-2
              text-sm
              font-medium
              text-brand-bg
              transition
              hover:bg-accent-hover
            "
          >
            <FiEye size={16} />
            View
          </Link>

        ),

      })),

    [orders]
  );

  // ==========================================
  // JSX
  // ==========================================

  return (

    <div className="space-y-8">

      <PageHeader
        title="Orders"

        subtitle="Manage all customer orders."

        breadcrumbs={[
          "Admin",
          "Orders",
        ]}

        action={

          <button
            type="button"
            onClick={loadOrders}
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
              transition
              hover:border-accent
            "
          >

            <FiRefreshCw />

            Refresh

          </button>

        }
      />

      {/* ==========================================
          FILTERS
      ========================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
        "
      >

        <div className="grid gap-5 lg:grid-cols-3">

          {/* Search */}

          <SearchBar
            value={search}
            onChange={(value) => {

              setPage(1);

              setSearch(value);

            }}
            placeholder="Search order..."
          />

          {/* Order Status */}

          <select

            value={status}

            onChange={(event) => {

              setPage(1);

              setStatus(
                event.target.value
              );

            }}

            className="
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-4
              py-3
              text-text-primary
              outline-none
            "
          >

            <option value="all">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Confirmed">
              Confirmed
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

          {/* Payment Status */}

          <select

            value={paymentStatus}

            onChange={(event) => {

              setPage(1);

              setPaymentStatus(
                event.target.value
              );

            }}

            className="
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-4
              py-3
              text-text-primary
              outline-none
            "
          >

            <option value="all">
              All Payments
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Failed">
              Failed
            </option>

            <option value="Refunded">
              Refunded
            </option>

          </select>

        </div>

      </div>
            {/* ==========================================
          ORDERS TABLE
      ========================================== */}

      {loading ? (

        <DataTable
          title="Orders"
          columns={columns}
          data={[]}
          loading={true}
        />

      ) : tableData.length === 0 ? (

        <EmptyState
          title="No Orders Found"
          description="No orders match your current filters."
          buttonText="Refresh"
          onButtonClick={loadOrders}
        />

      ) : (

        <DataTable
          title="All Orders"
          columns={columns}
          data={tableData}
          loading={false}
        />

      )}

      {/* ==========================================
          ORDER STATISTICS
      ========================================== */}

      {!loading && orders.length > 0 && (

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* Total Orders */}

          <div
            className="
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-6
            "
          >

            <p className="text-sm text-text-secondary">
              Total Orders
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-bold
                text-text-primary
              "
            >
              {pagination.totalOrders}
            </h3>

          </div>

          {/* Pending */}

          <div
            className="
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-6
            "
          >

            <p className="text-sm text-text-secondary">
              Pending Orders
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-bold
                text-yellow-400
              "
            >
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Pending"
                ).length
              }
            </h3>

          </div>

          {/* Delivered */}

          <div
            className="
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-6
            "
          >

            <p className="text-sm text-text-secondary">
              Delivered
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-bold
                text-green-400
              "
            >
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Delivered"
                ).length
              }
            </h3>

          </div>

          {/* Revenue */}

          <div
            className="
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-6
            "
          >

            <p className="text-sm text-text-secondary">
              Revenue
            </p>

            <h3
              className="
                mt-2
                text-3xl
                font-bold
                text-accent
              "
            >
              ₹
              {orders
                .reduce(
                  (total, order) =>
                    total +
                    Number(
                      order.totalAmount || 0
                    ),
                  0
                )
                .toLocaleString()}
            </h3>

          </div>

        </div>

      )}
            {/* ==========================================
          PAGINATION
      ========================================== */}

      {pagination.totalPages > 1 && (

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-5
          "
        >

          {/* Previous */}

          <button
            type="button"
            disabled={!pagination.hasPrevPage}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            className="
              rounded-xl
              border
              border-border-subtle
              px-5
              py-3
              text-text-primary
              transition
              hover:border-accent
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Previous
          </button>

          {/* Page Info */}

          <div
            className="
              text-sm
              font-medium
              text-text-secondary
            "
          >
            Page{" "}

            <span className="text-accent">
              {pagination.currentPage}
            </span>

            {" "}of{" "}

            <span className="text-accent">
              {pagination.totalPages}
            </span>

          </div>

          {/* Next */}

          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="
              rounded-xl
              border
              border-border-subtle
              px-5
              py-3
              text-text-primary
              transition
              hover:border-accent
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Next
          </button>

        </div>

      )}

    </div>

  );

}

export default Orders;