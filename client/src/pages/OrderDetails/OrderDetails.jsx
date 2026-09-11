import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiHash,
  FiHome,
  FiLoader,
  FiMapPin,
  FiPackage,
  FiRefreshCw,
  FiRotateCcw,
  FiShield,
  FiShoppingBag,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";

import {
  OrderStatusBadge,
  PaymentBadge,
} from "../../components/orders";

import {
  cancelOrder,
  returnOrder,
  getOrderById,
} from "../../services/orderService";


// ==========================================================
// STATUS FLOW
// ==========================================================

const ORDER_STEPS = [
  {
    key: "confirmed",
    label: "Confirmed",
    description: "Your order has been confirmed",
    icon: FiCheckCircle,
  },
  {
    key: "packed",
    label: "Packed",
    description: "Your items are being packed",
    icon: FiPackage,
  },
  {
    key: "shipped",
    label: "Shipped",
    description: "Your order is on the way",
    icon: FiTruck,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    description: "Delivery partner is nearby",
    icon: FiMapPin,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Order delivered successfully",
    icon: FiCheck,
  },
];


// ==========================================================
// HELPERS
// ==========================================================

function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}


function formatCurrency(value) {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}


function getProductImage(product) {
  if (
    Array.isArray(product?.images) &&
    product.images.length
  ) {
    const firstImage = product.images[0];

    if (
      typeof firstImage === "object" &&
      firstImage !== null
    ) {
      return (
        firstImage.url ||
        firstImage.secure_url ||
        ""
      );
    }

    return firstImage || "";
  }

  return product?.image || "";
}


function formatDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}


function formatDateTime(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}


// ==========================================================
// COMPONENT
// ==========================================================

function OrderDetails() {
  const navigate = useNavigate();

  const { id } = useParams();


  // ========================================================
  // STATE
  // ========================================================

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionType, setActionType] =
    useState("");

  const [showAllItems, setShowAllItems] =
    useState(false);


  // ========================================================
  // FETCH ORDER
  // ========================================================

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Order ID is missing.");
      return;
    }


    let mounted = true;


    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getOrderById(id);

        if (mounted) {
          setOrder(data);
        }
      } catch (err) {
        console.error(
          "Fetch Order Error:",
          err
        );

        if (mounted) {
          setOrder(null);

          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to load order."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };


    fetchOrder();


    return () => {
      mounted = false;
    };
  }, [id]);


  // ========================================================
  // SAFE DATA
  // ========================================================

  const orderId =
    order?.orderNumber ||
    order?.orderId ||
    order?._id ||
    "N/A";


  const status =
    normalizeStatus(
      order?.orderStatus
    );


  const totalAmount =
    Number(
      order?.totalAmount ??
      order?.totalPrice ??
      order?.total ??
      0
    );


  const shipping =
    order?.shippingAddress || {};


  const paymentMethod =
    order?.paymentMethod ||
    "online";


  const paymentStatus =
    order?.paymentStatus ||
    "pending";


  const items =
    Array.isArray(order?.items)
      ? order.items
      : [];


  // ========================================================
  // ITEM COUNT
  // ========================================================

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total +
        (Number(item?.quantity) || 0),
      0
    );
  }, [items]);


  // ========================================================
  // ORDER STATUS INDEX
  // ========================================================

  const currentStepIndex =
    ORDER_STEPS.findIndex(
      (step) =>
        step.key === status
    );


  const activeStepIndex =
    currentStepIndex >= 0
      ? currentStepIndex
      : status === "pending"
        ? -1
        : 0;


  // ========================================================
  // ACTION CONDITIONS
  // ========================================================

  const canCancel = [
    "pending",
    "confirmed",
  ].includes(status);


  const canTrack = [
    "confirmed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ].includes(status);


  const canReturn =
    status === "delivered";


  // ========================================================
  // VISIBLE ITEMS
  // ========================================================

  const visibleItems =
    showAllItems
      ? items
      : items.slice(0, 4);


  const remainingItems =
    Math.max(
      items.length - 4,
      0
    );


  // ========================================================
  // CANCEL ORDER
  // ========================================================

  const handleCancelOrder =
    async () => {

      if (
        actionLoading ||
        !order?._id
      ) {
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
          "Please enter a cancellation reason:"
        );


      try {
        setActionLoading(true);
        setActionType("cancel");


        await cancelOrder(
          order._id,
          reason || ""
        );


        const updated =
          await getOrderById(
            order._id
          );


        setOrder(updated);


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
      } finally {
        setActionLoading(false);
        setActionType("");
      }
    };


  // ========================================================
  // RETURN ORDER
  // ========================================================

  const handleReturnOrder =
    async () => {

      if (
        actionLoading ||
        !order?._id
      ) {
        return;
      }


      const confirmed =
        window.confirm(
          "Do you want to request a return for this order?"
        );


      if (!confirmed) {
        return;
      }


      const reason =
        window.prompt(
          "Please enter a return reason:"
        );


      try {
        setActionLoading(true);
        setActionType("return");


        await returnOrder(
          order._id,
          {
            reason: reason || "",
          }
        );


        const updated =
          await getOrderById(
            order._id
          );


        setOrder(updated);


        window.alert(
          "Return request submitted successfully."
        );
      } catch (err) {
        console.error(
          "Return Order Error:",
          err
        );

        window.alert(
          err?.response?.data?.message ||
          err?.message ||
          "Unable to return order."
        );
      } finally {
        setActionLoading(false);
        setActionType("");
      }
    };


  // ========================================================
  // LOADING UI
  // ========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          {/* Top Skeleton */}

          <div className="animate-pulse">

            <div className="h-4 w-24 rounded bg-surface-elevated" />

            <div className="mt-6 h-10 w-56 rounded-lg bg-surface-elevated" />

            <div className="mt-4 h-4 w-72 rounded bg-surface-elevated" />

          </div>


          {/* Content Skeleton */}

          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            <div className="space-y-6 lg:col-span-2">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-border-subtle bg-surface p-6"
                >

                  <div className="h-6 w-44 rounded bg-surface-elevated" />

                  <div className="mt-6 space-y-4">

                    <div className="h-20 rounded-xl bg-surface-elevated" />

                    <div className="h-20 rounded-xl bg-surface-elevated" />

                  </div>

                </div>
              ))}

            </div>


            <div className="space-y-6">

              <div className="animate-pulse rounded-2xl border border-border-subtle bg-surface p-6">

                <div className="h-6 w-40 rounded bg-surface-elevated" />

                <div className="mt-8 h-28 rounded-xl bg-surface-elevated" />

                <div className="mt-5 h-12 rounded-xl bg-surface-elevated" />

              </div>

            </div>

          </div>

        </div>

      </main>
    );
  }


  // ========================================================
  // ERROR UI
  // ========================================================

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-16">

        <div className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-2xl">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">

            <FiAlertCircle
              size={38}
              className="text-red-400"
            />

          </div>


          <h1 className="mt-6 text-2xl font-bold text-text-primary">
            Order Not Found
          </h1>


          <p className="mt-3 text-sm leading-6 text-text-secondary">
            {error ||
              "We couldn't find the order you're looking for."}
          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
          >
            <FiArrowLeft size={17} />
            Back to Orders
          </button>

        </div>

      </main>
    );
  }


  // ========================================================
  // MAIN UI
  // ========================================================

  return (
    <main className="min-h-screen bg-brand-bg">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="border-b border-border-subtle bg-surface/40">

        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate(-1)
            }
            className="group inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-all duration-300 hover:text-accent"
          >

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle transition-all duration-300 group-hover:border-accent group-hover:bg-accent-soft">

              <FiArrowLeft size={16} />

            </span>

            Back

          </button>


          {/* Header Content */}

          <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  My Order
                </span>

                <span className="text-text-muted">
                  /
                </span>

                <span className="text-sm text-text-secondary">
                  Order Details
                </span>

              </div>


              <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Order Details
              </h1>


              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-text-secondary">

                <div className="flex items-center gap-2">

                  <FiHash
                    className="text-accent"
                    size={16}
                  />

                  <span className="font-medium text-text-primary">
                    {orderId}
                  </span>

                </div>


                <div className="h-1 w-1 rounded-full bg-border-subtle" />


                <div className="flex items-center gap-2">

                  <FiCalendar
                    className="text-accent"
                    size={16}
                  />

                  <span>
                    {formatDate(
                      order.createdAt
                    )}
                  </span>

                </div>


                <div className="h-1 w-1 rounded-full bg-border-subtle" />


                <span>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

            </div>


            <div className="self-start lg:self-auto">

              <OrderStatusBadge
                status={
                  order.orderStatus
                }
                size="large"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">


          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="min-w-0 space-y-6">


            {/* ==============================================
                ORDER PROGRESS
            ============================================== */}

            <section className="overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm">

              <div className="border-b border-border-subtle px-5 py-5 sm:px-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">

                    <FiTruck
                      size={20}
                      className="text-accent"
                    />

                  </div>

                  <div>

                    <h2 className="font-display text-xl font-semibold text-text-primary">
                      Order Progress
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Track your order journey
                    </p>

                  </div>

                </div>

              </div>


              <div className="px-5 py-6 sm:px-6 sm:py-7">

                {status === "cancelled" ? (

                  <div className="flex items-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10">

                      <FiXCircle
                        size={24}
                        className="text-red-400"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-red-400">
                        Order Cancelled
                      </h3>

                      <p className="mt-1 text-sm text-text-secondary">
                        This order has been cancelled and will not be delivered.
                      </p>

                    </div>

                  </div>

                ) : status === "returned" ? (

                  <div className="flex items-center gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500/10">

                      <FiRotateCcw
                        size={24}
                        className="text-orange-400"
                      />

                    </div>

                    <div>

                      <h3 className="font-semibold text-orange-400">
                        Return Requested
                      </h3>

                      <p className="mt-1 text-sm text-text-secondary">
                        Your return request is being processed.
                      </p>

                    </div>

                  </div>

                ) : (

                  <div className="overflow-x-auto pb-2">

                    <div className="flex min-w-[720px] items-start">

                      {ORDER_STEPS.map(
                        (step, index) => {

                          const Icon =
                            step.icon;

                          const completed =
                            activeStepIndex >= index;

                          const current =
                            activeStepIndex === index;

                          const isLast =
                            index ===
                            ORDER_STEPS.length - 1;


                          return (
                            <div
                              key={
                                step.key
                              }
                              className="flex flex-1 items-start"
                            >

                              <div className="flex flex-col items-center text-center">

                                <div
                                  className={`
                                    relative flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500
                                    ${
                                      completed
                                        ? "border-accent bg-accent text-brand-bg shadow-[0_0_0_5px_rgba(212,175,55,0.08)]"
                                        : "border-border-subtle bg-brand-bg text-text-muted"
                                    }
                                    ${
                                      current
                                        ? "scale-110"
                                        : ""
                                    }
                                  `}
                                >

                                  <Icon
                                    size={18}
                                  />

                                </div>


                                <h3
                                  className={`
                                    mt-3 text-xs font-semibold
                                    ${
                                      completed
                                        ? "text-text-primary"
                                        : "text-text-muted"
                                    }
                                  `}
                                >
                                  {step.label}
                                </h3>


                                <p className="mt-1 max-w-[105px] text-[10px] leading-4 text-text-muted">
                                  {step.description}
                                </p>

                              </div>


                              {!isLast && (
                                <div
                                  className={`
                                    mt-5 h-px flex-1 transition-all duration-700
                                    ${
                                      activeStepIndex >
                                      index
                                        ? "bg-accent"
                                        : "bg-border-subtle"
                                    }
                                  `}
                                />
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* ==============================================
                DELIVERY ADDRESS
            ============================================== */}

            <section className="group rounded-3xl border border-border-subtle bg-surface p-5 transition-all duration-300 hover:border-accent/20 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">

                    <FiHome
                      size={20}
                      className="text-accent"
                    />

                  </div>

                  <div>

                    <h2 className="font-display text-xl font-semibold text-text-primary">
                      Delivery Address
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Shipping information
                    </p>

                  </div>

                </div>


                <span className="hidden rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-green-400 sm:inline-flex">
                  Delivery
                </span>

              </div>


              <div className="mt-6 flex gap-4 rounded-2xl border border-border-subtle bg-brand-bg p-4 sm:p-5">

                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft sm:flex">

                  <FiMapPin
                    className="text-accent"
                    size={18}
                  />

                </div>


                <div className="min-w-0">

                  <h3 className="font-semibold text-text-primary">
                    {shipping.fullName ||
                      "Customer"}
                  </h3>


                  {shipping.phone && (
                    <p className="mt-1 text-xs text-text-muted">
                      {shipping.phone}
                    </p>
                  )}


                  <p className="mt-3 text-sm leading-6 text-text-secondary">

                    {shipping.house && (
                      <>
                        {shipping.house}
                        {shipping.street
                          ? `, ${shipping.street}`
                          : ""}
                      </>
                    )}

                    {shipping.landmark && (
                      <>
                        <br />
                        {shipping.landmark}
                      </>
                    )}

                    {(shipping.city ||
                      shipping.state) && (
                      <>
                        <br />
                        {shipping.city || ""}
                        {shipping.city &&
                        shipping.state
                          ? ", "
                          : ""}
                        {shipping.state || ""}
                      </>
                    )}

                    {shipping.pincode && (
                      <>
                        <br />
                        <span className="font-medium text-text-primary">
                          PIN:{" "}
                          {shipping.pincode}
                        </span>
                      </>
                    )}

                  </p>

                </div>

              </div>

            </section>


            {/* ==============================================
                PAYMENT
            ============================================== */}

            <section className="rounded-3xl border border-border-subtle bg-surface p-5 sm:p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">

                  <FiCreditCard
                    size={20}
                    className="text-accent"
                  />

                </div>

                <div>

                  <h2 className="font-display text-xl font-semibold text-text-primary">
                    Payment Information
                  </h2>

                  <p className="mt-1 text-xs text-text-secondary">
                    Payment method and status
                  </p>

                </div>

              </div>


              <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-border-subtle bg-brand-bg p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

                <PaymentBadge
                  paymentMethod={
                    paymentMethod
                  }
                  paymentStatus={
                    paymentStatus
                  }
                  size="large"
                />


                <div className="flex items-center gap-2 text-xs text-text-muted">

                  <FiShield
                    size={15}
                    className="text-green-400"
                  />

                  Secure Payment

                </div>

              </div>

            </section>


            {/* ==============================================
                PRODUCTS
            ============================================== */}

            <section className="rounded-3xl border border-border-subtle bg-surface p-5 sm:p-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">

                      <FiShoppingBag
                        size={20}
                        className="text-accent"
                      />

                    </div>

                    <div>

                      <h2 className="font-display text-xl font-semibold text-text-primary">
                        Ordered Products
                      </h2>

                      <p className="mt-1 text-xs text-text-secondary">
                        {totalItems}{" "}
                        {totalItems === 1
                          ? "item"
                          : "items"}{" "}
                        in this order
                      </p>

                    </div>

                  </div>

                </div>

                <span className="self-start rounded-full bg-surface-elevated px-3 py-1.5 text-xs font-medium text-text-secondary">
                  {items.length}{" "}
                  {items.length === 1
                    ? "Product"
                    : "Products"}
                </span>

              </div>


              <div className="mt-6 space-y-3">

                {visibleItems.map(
                  (item, index) => {

                    const product =
                      item?.product ||
                      item ||
                      {};

                    const productId =
                      product?._id ||
                      product?.id;

                    const image =
                      getProductImage(
                        product
                      );

                    const price =
                      Number(
                        item?.price ??
                        product?.discountPrice ??
                        product?.price ??
                        0
                      );

                    const quantity =
                      Number(
                        item?.quantity
                      ) || 1;

                    const itemTotal =
                      price * quantity;


                    return (
                      <div
                        key={
                          item?._id ||
                          item?.id ||
                          productId ||
                          index
                        }
                        className="group/item flex flex-col gap-4 rounded-2xl border border-border-subtle bg-brand-bg p-3 transition-all duration-300 hover:border-accent/30 hover:bg-surface-elevated sm:flex-row sm:items-center sm:p-4"
                      >

                        {/* Image */}

                        {productId ? (
                          <Link
                            to={`/product/${productId}`}
                            className="relative block shrink-0 overflow-hidden rounded-xl"
                          >

                            <div className="h-28 w-full overflow-hidden rounded-xl bg-surface-elevated sm:h-24 sm:w-20">

                              {image ? (
                                <img
                                  src={image}
                                  alt={
                                    product?.name ||
                                    "Product"
                                  }
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <FiPackage
                                    size={24}
                                    className="text-text-muted"
                                  />
                                </div>
                              )}

                            </div>

                          </Link>
                        ) : (
                          <div className="h-28 w-full overflow-hidden rounded-xl bg-surface-elevated sm:h-24 sm:w-20">

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product?.name ||
                                  "Product"
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <FiPackage
                                  size={24}
                                  className="text-text-muted"
                                />
                              </div>
                            )}

                          </div>
                        )}


                        {/* Details */}

                        <div className="min-w-0 flex-1">

                          {product?.brand && (
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                              {product.brand}
                            </p>
                          )}


                          {productId ? (
                            <Link
                              to={`/product/${productId}`}
                              className="mt-1 block"
                            >

                              <h3 className="line-clamp-2 text-base font-semibold text-text-primary transition-colors duration-300 hover:text-accent">
                                {product?.name ||
                                  "Product"}
                              </h3>

                            </Link>
                          ) : (
                            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-text-primary">
                              {product?.name ||
                                "Product"}
                            </h3>
                          )}


                          <div className="mt-3 flex flex-wrap gap-2">

                            {item?.size && (
                              <span className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
                                Size:{" "}
                                <strong className="text-text-primary">
                                  {item.size}
                                </strong>
                              </span>
                            )}


                            {item?.color && (
                              <span className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
                                Color:{" "}
                                <strong className="text-text-primary">
                                  {item.color}
                                </strong>
                              </span>
                            )}


                            <span className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1 text-[11px] text-text-secondary">
                              Qty:{" "}
                              <strong className="text-text-primary">
                                {quantity}
                              </strong>
                            </span>

                          </div>

                        </div>


                        {/* Price */}

                        <div className="flex items-center justify-between border-t border-border-subtle pt-3 sm:block sm:min-w-[110px] sm:border-0 sm:pt-0 sm:text-right">

                          <p className="text-[10px] uppercase tracking-wider text-text-muted">
                            Item Total
                          </p>

                          <p className="mt-1 text-lg font-bold text-accent">
                            ₹
                            {formatCurrency(
                              itemTotal
                            )}
                          </p>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>


              {/* More Products */}

              {remainingItems > 0 &&
                !showAllItems && (

                  <button
                    type="button"
                    onClick={() =>
                      setShowAllItems(true)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle py-3 text-sm font-semibold text-text-secondary transition-all duration-300 hover:border-accent hover:bg-accent-soft hover:text-accent"
                  >

                    View{" "}
                    {remainingItems}{" "}
                    more{" "}
                    {remainingItems === 1
                      ? "item"
                      : "items"}

                    <FiChevronRight
                      size={16}
                    />

                  </button>
                )}


              {showAllItems &&
                items.length > 4 && (

                  <button
                    type="button"
                    onClick={() =>
                      setShowAllItems(false)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle py-3 text-sm font-semibold text-text-secondary transition-all duration-300 hover:border-accent hover:text-accent"
                  >
                    Show Less
                  </button>
                )}

            </section>

          </div>


          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">


            {/* ==============================================
                ORDER SUMMARY
            ============================================== */}

            <section className="overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-sm">

              <div className="border-b border-border-subtle p-5 sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">

                    <FiCreditCard
                      size={20}
                      className="text-accent"
                    />

                  </div>

                  <div>

                    <h2 className="font-display text-xl font-semibold text-text-primary">
                      Order Summary
                    </h2>

                    <p className="mt-1 text-xs text-text-secondary">
                      Complete purchase overview
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-5 sm:p-6">

                <div className="space-y-4">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-text-secondary">
                      Total Items
                    </span>

                    <span className="font-semibold text-text-primary">
                      {totalItems}
                    </span>

                  </div>


                  <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-text-secondary">
                      Payment Method
                    </span>

                    <span className="max-w-[150px] truncate text-right text-sm font-semibold capitalize text-text-primary">
                      {String(
                        paymentMethod
                      ).replace(
                        /_/g,
                        " "
                      )}
                    </span>

                  </div>


                  <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-text-secondary">
                      Payment Status
                    </span>

                    <span className="text-sm font-semibold capitalize text-text-primary">
                      {String(
                        paymentStatus
                      ).replace(
                        /_/g,
                        " "
                      )}
                    </span>

                  </div>


                  <div className="border-t border-border-subtle pt-5">

                    <div className="flex items-end justify-between gap-4">

                      <div>

                        <p className="text-xs text-text-muted">
                          Total Amount
                        </p>

                        <p className="mt-1 text-sm font-medium text-text-secondary">
                          Inclusive order total
                        </p>

                      </div>


                      <span className="text-2xl font-bold tracking-tight text-accent sm:text-3xl">
                        ₹
                        {formatCurrency(
                          totalAmount
                        )}
                      </span>

                    </div>

                  </div>

                </div>


                {/* Security */}

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">

                  <FiShield
                    size={18}
                    className="mt-0.5 shrink-0 text-green-400"
                  />

                  <div>

                    <p className="text-xs font-semibold text-green-400">
                      Secure Shopping
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-text-secondary">
                      Your order and payment information are protected.
                    </p>

                  </div>

                </div>

              </div>

            </section>


            {/* ==============================================
                ORDER ACTIONS
            ============================================== */}

            <section className="rounded-3xl border border-border-subtle bg-surface p-5 sm:p-6">

              <h2 className="font-display text-xl font-semibold text-text-primary">
                Order Actions
              </h2>

              <p className="mt-1 text-xs text-text-secondary">
                Manage your order
              </p>


              <div className="mt-5 space-y-3">

                {/* Track */}

                {canTrack && (

                  <Link
                    to={`/orders/${orderId}/track`}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-brand-bg transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-lg"
                  >

                    <FiMapPin
                      size={17}
                    />

                    Track Order

                    <FiChevronRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />

                  </Link>

                )}


                {/* Cancel */}

                {canCancel && (

                  <button
                    type="button"
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleCancelOrder
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-5 py-3.5 text-sm font-semibold text-red-400 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {actionLoading &&
                    actionType ===
                      "cancel" ? (
                      <>
                        <FiLoader
                          className="animate-spin"
                          size={17}
                        />

                        Cancelling...
                      </>
                    ) : (
                      <>
                        <FiXCircle
                          size={17}
                        />

                        Cancel Order
                      </>
                    )}

                  </button>

                )}


                {/* Return */}

                {canReturn && (

                  <button
                    type="button"
                    disabled={
                      actionLoading
                    }
                    onClick={
                      handleReturnOrder
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/5 px-5 py-3.5 text-sm font-semibold text-blue-400 transition-all duration-300 hover:border-blue-500/60 hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {actionLoading &&
                    actionType ===
                      "return" ? (
                      <>
                        <FiLoader
                          className="animate-spin"
                          size={17}
                        />

                        Processing...
                      </>
                    ) : (
                      <>
                        <FiRotateCcw
                          size={17}
                        />

                        Return Order
                      </>
                    )}

                  </button>

                )}


                {/* Back */}

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/orders"
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-subtle bg-brand-bg px-5 py-3.5 text-sm font-semibold text-text-primary transition-all duration-300 hover:border-accent hover:bg-surface-elevated hover:text-accent"
                >

                  <FiArrowLeft
                    size={17}
                  />

                  Back to Orders

                </button>

              </div>

            </section>


            {/* ==============================================
                ORDER META
            ============================================== */}

            <section className="rounded-3xl border border-border-subtle bg-surface p-5">

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-brand-bg p-4">

                  <FiCalendar
                    size={17}
                    className="text-accent"
                  />

                  <p className="mt-3 text-[10px] uppercase tracking-wider text-text-muted">
                    Placed On
                  </p>

                  <p className="mt-1 text-xs font-semibold leading-5 text-text-primary">
                    {formatDateTime(
                      order.createdAt
                    )}
                  </p>

                </div>


                <div className="rounded-2xl bg-brand-bg p-4">

                  <FiPackage
                    size={17}
                    className="text-accent"
                  />

                  <p className="mt-3 text-[10px] uppercase tracking-wider text-text-muted">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {totalItems}
                  </p>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}


export default OrderDetails;