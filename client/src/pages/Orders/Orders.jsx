import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
  FiShoppingBag,
  FiSliders,
} from "react-icons/fi";

import {
  OrderCard,
  OrderSearch,
  OrderFilter,
  OrdersSkeleton,
  EmptyOrders,
} from "../../components/orders";

import {
  getOrders,
  cancelOrder,
} from "../../services/orderService";

import {
  DEFAULT_ORDER_FILTER,
  DEFAULT_PAYMENT_FILTER,
  DEFAULT_SORT,
} from "../../constants/orderConstants";


// ==========================================================
// HELPERS
// ==========================================================

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}


function getOrderAmount(order) {
  return Number(
    order?.totalAmount ??
    order?.totalPrice ??
    order?.total ??
    0
  );
}


function getOrderSearchText(order) {
  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const productText = items
    .map((item) => {
      const product =
        item?.product || item || {};

      return [
        product?.name,
        product?.brand,
        product?.title,
        product?.category,
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join(" ");


  return [
    order?.orderNumber,
    order?.orderId,
    order?._id,
    order?.shippingAddress?.fullName,
    order?.shippingAddress?.phone,
    order?.paymentMethod,
    order?.paymentStatus,
    order?.orderStatus,
    productText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


// ==========================================================
// COMPONENT
// ==========================================================

function Orders() {
  const navigate = useNavigate();


  // ========================================================
  // STATE
  // ========================================================

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [orderFilter, setOrderFilter] =
    useState(DEFAULT_ORDER_FILTER);

  const [paymentFilter, setPaymentFilter] =
    useState(DEFAULT_PAYMENT_FILTER);

  const [sortBy, setSortBy] =
    useState(DEFAULT_SORT);

  const [refreshing, setRefreshing] =
    useState(false);


  // ========================================================
  // LOAD ORDERS
  // ========================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getOrders();


      /*
       * Support:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR
       *
       * {
       *   orders: [...]
       * }
       *
       * OR
       *
       * {
       *   data: [...]
       * }
       */

      let orderData = [];

      if (Array.isArray(response)) {
        orderData = response;
      } else if (
        Array.isArray(response?.orders)
      ) {
        orderData = response.orders;
      } else if (
        Array.isArray(response?.data)
      ) {
        orderData = response.data;
      }


      setOrders(orderData);

    } catch (err) {
      console.error(
        "Load Orders Error:",
        err
      );

      setOrders([]);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load your orders. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // ========================================================
  // FIRST LOAD
  // ========================================================

  useEffect(() => {
    loadOrders();
  }, []);


  // ========================================================
  // REFRESH
  // ========================================================

  const handleRefresh = async () => {
    if (loading) {
      return;
    }

    try {
      setRefreshing(true);

      await loadOrders();

    } finally {
      setRefreshing(false);
    }
  };


  // ========================================================
  // RESET FILTERS
  // ========================================================

  const resetFilters = () => {
    setSearchQuery("");

    setOrderFilter(
      DEFAULT_ORDER_FILTER
    );

    setPaymentFilter(
      DEFAULT_PAYMENT_FILTER
    );

    setSortBy(DEFAULT_SORT);
  };


  // ========================================================
  // SEARCH + FILTER + SORT
  // ========================================================

  const filteredOrders = useMemo(() => {
    let data = [...orders];


    // ------------------------------------------------------
    // SEARCH
    // ------------------------------------------------------

    if (searchQuery.trim()) {
      const keyword =
        searchQuery
          .trim()
          .toLowerCase();

      data = data.filter((order) =>
        getOrderSearchText(
          order
        ).includes(keyword)
      );
    }


    // ------------------------------------------------------
    // ORDER STATUS
    // ------------------------------------------------------

    if (
      orderFilter &&
      orderFilter !== "all" &&
      orderFilter !==
        DEFAULT_ORDER_FILTER
    ) {
      data = data.filter(
        (order) =>
          normalize(
            order?.orderStatus
          ) === normalize(
            orderFilter
          )
      );
    }


    // ------------------------------------------------------
    // PAYMENT
    // ------------------------------------------------------

    if (
      paymentFilter &&
      paymentFilter !== "all" &&
      paymentFilter !==
        DEFAULT_PAYMENT_FILTER
    ) {
      data = data.filter(
        (order) => {

          const method =
            normalize(
              order?.paymentMethod
            );

          const status =
            normalize(
              order?.paymentStatus
            );

          const filter =
            normalize(
              paymentFilter
            );


          /*
           * Supports:
           *
           * online
           * razorpay
           * upi
           * card
           * wallet
           * netbanking
           *
           * AND
           *
           * cod
           * cash_on_delivery
           */

          if (
            filter === "online"
          ) {
            return [
              "online",
              "razorpay",
              "upi",
              "card",
              "wallet",
              "netbanking",
            ].includes(method);
          }


          if (
            filter === "cod"
          ) {
            return [
              "cod",
              "cash_on_delivery",
            ].includes(method);
          }


          return (
            method === filter ||
            status === filter
          );
        }
      );
    }


    // ------------------------------------------------------
    // SORT
    // ------------------------------------------------------

    switch (sortBy) {

      case "latest":
      case "newest":
        data.sort(
          (a, b) =>
            new Date(
              b?.createdAt || 0
            ) -
            new Date(
              a?.createdAt || 0
            )
        );
        break;


      case "oldest":
        data.sort(
          (a, b) =>
            new Date(
              a?.createdAt || 0
            ) -
            new Date(
              b?.createdAt || 0
            )
        );
        break;


      case "amount_high":
      case "amount-high":
        data.sort(
          (a, b) =>
            getOrderAmount(b) -
            getOrderAmount(a)
        );
        break;


      case "amount_low":
      case "amount-low":
        data.sort(
          (a, b) =>
            getOrderAmount(a) -
            getOrderAmount(b)
        );
        break;


      default:
        break;
    }


    return data;

  }, [
    orders,
    searchQuery,
    orderFilter,
    paymentFilter,
    sortBy,
  ]);


  // ========================================================
  // HANDLERS
  // ========================================================

  const handleSearchChange = (
    value
  ) => {
    setSearchQuery(value);
  };


  const handleOrderFilterChange = (
    value
  ) => {
    setOrderFilter(value);
  };


  const handlePaymentFilterChange = (
    value
  ) => {
    setPaymentFilter(value);
  };


  const handleSortChange = (
    value
  ) => {
    setSortBy(value);
  };


  // ========================================================
  // VIEW DETAILS
  // ========================================================

  const handleViewDetails = (
    order
  ) => {
    const id =
      order?.orderNumber ||
      order?.orderId ||
      order?._id;

    if (!id) {
      return;
    }

    navigate(
      `/orders/${id}`
    );
  };


  // ========================================================
  // TRACK ORDER
  // ========================================================

  const handleTrackOrder = (
    order
  ) => {
    const id =
      order?.orderNumber ||
      order?.orderId ||
      order?._id;

    if (!id) {
      return;
    }

    navigate(
      `/orders/${id}/track`
    );
  };


  // ========================================================
  // CANCEL ORDER
  // ========================================================

  const handleCancelOrder = async (
    order
  ) => {

    if (!order?._id) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );


    if (!confirmed) {
      return;
    }


    const reason =
      window.prompt(
        "Please enter cancellation reason:"
      );


    try {

      setLoading(true);

      await cancelOrder(
        order._id,
        reason || ""
      );


      await loadOrders();


      window.alert(
        "Order cancelled successfully."
      );

    } catch (err) {

      console.error(
        "Cancel Order Error:",
        err
      );

      window.alert(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to cancel order."
      );

      setLoading(false);
    }
  };


  // ========================================================
  // TRACK ACTIVE FILTERS
  // ========================================================

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    (
      orderFilter &&
      orderFilter !==
        DEFAULT_ORDER_FILTER &&
      orderFilter !== "all"
    ) ||
    (
      paymentFilter &&
      paymentFilter !==
        DEFAULT_PAYMENT_FILTER &&
      paymentFilter !== "all"
    );


  // ========================================================
  // RENDER
  // ========================================================

  return (
    <main className="min-h-screen bg-brand-bg">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="border-b border-border-subtle bg-surface/40">

        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div>

              {/* Small Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5">

                <FiShoppingBag
                  size={13}
                  className="text-accent"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Your Shopping
                </span>

              </div>


              {/* Heading */}

              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
                My Orders
              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base">
                View, track and manage all your FashionStore orders in one place.
              </p>

            </div>


            {/* Refresh */}

            <button
              type="button"
              onClick={
                handleRefresh
              }
              disabled={
                loading ||
                refreshing
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
            >

              <FiRefreshCw
                size={17}
                className={
                  loading ||
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Orders"}

            </button>

          </div>

        </div>

      </section>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="rounded-3xl border border-border-subtle bg-surface p-4 shadow-sm sm:p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft">

              <FiShoppingBag
                size={17}
                className="text-accent"
              />

            </div>

            <div>

              <h2 className="text-sm font-semibold text-text-primary">
                Find an Order
              </h2>

              <p className="text-xs text-text-muted">
                Search by order ID, product, brand or customer details
              </p>

            </div>

          </div>


          <OrderSearch
            searchQuery={
              searchQuery
            }
            onSearchChange={
              handleSearchChange
            }
          />

        </div>


        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="mt-5">

          <OrderFilter
            status={orderFilter}
            payment={paymentFilter}
            sort={sortBy}
            onStatusChange={
              handleOrderFilterChange
            }
            onPaymentChange={
              handlePaymentFilterChange
            }
            onSortChange={
              handleSortChange
            }
            onReset={
              resetFilters
            }
          />

        </div>


        {/* =================================================
            RESULTS BAR
        ================================================= */}

        {!loading &&
          !error && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <FiSliders
                  size={16}
                  className="text-accent"
                />

                <p className="text-sm text-text-secondary">

                  <span className="font-semibold text-text-primary">
                    {filteredOrders.length}
                  </span>

                  {" "}

                  {filteredOrders.length === 1
                    ? "order"
                    : "orders"}{" "}

                  found

                </p>

              </div>


              {hasActiveFilters && (

                <button
                  type="button"
                  onClick={
                    resetFilters
                  }
                  className="self-start text-xs font-semibold text-accent transition hover:text-accent-hover sm:self-auto"
                >
                  Clear all filters
                </button>

              )}

            </div>
          )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="mt-6 space-y-6">

            {[1, 2, 3].map(
              (item) => (
                <OrdersSkeleton
                  key={item}
                />
              )
            )}

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (

            <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">

                <FiAlertCircle
                  size={30}
                  className="text-red-400"
                />

              </div>


              <h2 className="mt-5 text-xl font-bold text-text-primary">
                Something Went Wrong
              </h2>


              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                {error}
              </p>


              <button
                type="button"
                onClick={
                  handleRefresh
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:bg-accent-hover"
              >

                <FiRefreshCw
                  size={16}
                />

                Try Again

              </button>

            </div>

          )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredOrders.length === 0 && (

            <div className="mt-6">

              <EmptyOrders
                title={
                  hasActiveFilters
                    ? "No Matching Orders"
                    : "No Orders Yet"
                }
                description={
                  hasActiveFilters
                    ? "We couldn't find any orders matching your search or selected filters. Try changing your search or filters."
                    : "Looks like you haven't placed any orders yet. Start shopping and your orders will appear here."
                }
                buttonText={
                  hasActiveFilters
                    ? "Clear Filters"
                    : "Continue Shopping"
                }
                buttonLink="/"
              />

              {hasActiveFilters && (

                <div className="mt-4 text-center">

                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                    className="text-sm font-semibold text-accent transition hover:text-accent-hover"
                  >
                    Reset all filters
                  </button>

                </div>

              )}

            </div>

          )}


        {/* =================================================
            ORDERS LIST
        ================================================= */}

        {!loading &&
          !error &&
          filteredOrders.length > 0 && (

            <div className="mt-6 space-y-6">

              {filteredOrders.map(
                (order) => (

                  <OrderCard
                    key={
                      order?._id ||
                      order?.orderId ||
                      order?.orderNumber
                    }
                    order={order}
                    onViewDetails={
                      handleViewDetails
                    }
                    onTrackOrder={
                      handleTrackOrder
                    }
                    onCancelOrder={
                      handleCancelOrder
                    }
                  />

                )
              )}

            </div>

          )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        {!loading &&
          !error &&
          filteredOrders.length > 0 && (

            <section className="mt-8 overflow-hidden rounded-3xl border border-border-subtle bg-surface">

              <div className="p-5 sm:p-6">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">

                        <FiShoppingBag
                          size={18}
                          className="text-accent"
                        />

                      </div>

                      <h2 className="font-display text-xl font-semibold text-text-primary">
                        Orders Summary
                      </h2>

                    </div>


                    <p className="mt-3 text-sm text-text-secondary">

                      Showing{" "}

                      <span className="font-semibold text-accent">
                        {filteredOrders.length}
                      </span>

                      {" "}

                      {filteredOrders.length ===
                      1
                        ? "order"
                        : "orders"}

                      {searchQuery && (
                        <>
                          {" "}matching{" "}

                          <span className="font-semibold text-accent">
                            "{searchQuery}"
                          </span>
                        </>
                      )}

                    </p>

                  </div>


                  <Link
                    to="/"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
                  >

                    Continue Shopping

                    <FiArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />

                  </Link>

                </div>

              </div>

            </section>

          )}


      </div>

    </main>
  );
}


export default Orders;