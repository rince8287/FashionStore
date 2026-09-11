import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiHash,
  FiTruck,
} from "react-icons/fi";

import {
  OrderStatusBadge,
  PaymentBadge,
} from "../../components/orders";

import {
  getOrderById,
  trackOrder,
} from "../../services/orderService";

import {
  formatCurrency,
} from "../../utils/formatCurrency";

// ======================================================
// TRACK ORDER
// ======================================================

function TrackOrder() {
  const navigate = useNavigate();

  const { id } = useParams();

  // ====================================================
  // STATE
  // ====================================================

  const [order, setOrder] =
    useState(null);

  const [tracking, setTracking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ====================================================
  // LOAD ORDER + TRACKING
  // ====================================================

  const loadOrder =
    useCallback(
      async (showLoader = true) => {
        if (!id) {
          setError(
            "Order ID is missing."
          );

          setLoading(false);

          return;
        }

        try {
          if (showLoader) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          setError("");

          // --------------------------------------------
          // ORDER DETAILS
          // --------------------------------------------

          const orderData =
            await getOrderById(id);

          setOrder(orderData);

          // --------------------------------------------
          // TRACKING DETAILS
          // --------------------------------------------

          try {
            const trackingData =
              await trackOrder(id);

            setTracking(
              trackingData?.tracking ||
                trackingData?.data ||
                trackingData ||
                null
            );
          } catch (
            trackingError
          ) {
            /*
              Order page should still work
              even if tracking endpoint
              doesn't have data yet.
            */

            console.warn(
              "Tracking API Error:",
              trackingError
            );

            setTracking(null);
          }
        } catch (error) {
          console.error(
            "Track Order Error:",
            error
          );

          setOrder(null);

          setError(
            error.message ||
              "Failed to load order."
          );
        } finally {
          setLoading(false);

          setRefreshing(false);
        }
      },
      [id]
    );

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border-subtle border-t-accent" />

          <p className="mt-4 text-text-secondary">
            Loading tracking
            information...
          </p>

        </div>

      </main>
    );
  }

  // ====================================================
  // ERROR / NOT FOUND
  // ====================================================

  if (
    error ||
    !order
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4">

        <div className="rounded-2xl border border-border-subtle bg-surface p-10 text-center">

          <h2 className="text-3xl font-bold text-text-primary">
            Order Not Found
          </h2>

          <p className="mt-4 text-text-secondary">
            {error ||
              "We couldn't find the order you're looking for."}
          </p>

          <Link
            to="/orders"
            className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg"
          >
            Back To Orders
          </Link>

        </div>

      </main>
    );
  }

  // ====================================================
  // SAFE VALUES
  // ====================================================

  const shippingAddress =
    order.shippingAddress || {};

  const status =
    String(
      order.orderStatus ||
        "pending"
    ).toLowerCase();

  const orderDate =
    order.createdAt
      ? new Date(
          order.createdAt
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "--";

  // ====================================================
  // ESTIMATED DELIVERY
  // ====================================================

  const estimatedDeliveryDate =
    order.estimatedDelivery ||
    order.estimatedDeliveryDate ||
    tracking?.estimatedDelivery ||
    tracking?.estimatedDeliveryDate;

  const estimatedDelivery =
    estimatedDeliveryDate
      ? new Date(
          estimatedDeliveryDate
        ).toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "Not available";

  // ====================================================
  // TRACKING VALUES
  // ====================================================

  const trackingId =
    order.trackingId ||
    tracking?.trackingId ||
    tracking?.trackingNumber ||
    "--";

  const courierPartner =
    order.courierPartner ||
    tracking?.courierPartner ||
    tracking?.courier ||
    "--";

  const awbNumber =
    order.awbNumber ||
    tracking?.awbNumber ||
    tracking?.awb ||
    "--";

  const deliveryType =
    order.deliveryType ||
    tracking?.deliveryType ||
    "Standard Delivery";

  // ====================================================
  // TRACKING ACTIVITY
  // ====================================================

  const trackingActivities =
    Array.isArray(
      tracking?.activities
    )
      ? tracking.activities
      : Array.isArray(
          tracking?.history
        )
      ? tracking.history
      : Array.isArray(
          tracking
        )
      ? tracking
      : [];

  // ====================================================
  // STATUS HELPERS
  // ====================================================

  const isShipped = [
    "shipped",
    "out_for_delivery",
    "delivered",
  ].includes(status);

  const isOutForDelivery = [
    "out_for_delivery",
    "delivered",
  ].includes(status);

  const isDelivered =
    status === "delivered";

  const isPacked = [
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
  ].includes(status);

  const paymentConfirmed =
    String(
      order.paymentStatus
    ).toLowerCase() === "paid";

  // ====================================================
  // JSX
  // ====================================================

  return (
    <main className="min-h-screen bg-brand-bg py-10">

      <div className="container mx-auto px-4">

        {/* =============================================
            BREADCRUMB
        ============================================= */}

        <div className="mb-6 text-sm">

          <Link
            to="/orders"
            className="text-text-secondary hover:text-accent"
          >
            My Orders
          </Link>

          <span className="mx-2 text-text-muted">
            /
          </span>

          <span className="text-text-primary">
            Track Order
          </span>

        </div>

        {/* =============================================
            BACK BUTTON
        ============================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-3 text-text-primary transition hover:border-accent hover:text-accent"
        >
          <FiArrowLeft
            size={18}
          />

          Back
        </button>

        {/* =============================================
            HEADER
        ============================================= */}

        <div className="rounded-2xl border border-border-subtle bg-surface p-6">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="mb-4 flex items-center gap-3">

                <div className="rounded-full bg-accent/10 p-3 text-accent">

                  <FiTruck
                    size={24}
                  />

                </div>

                <h1 className="text-3xl font-bold text-text-primary">
                  Track Your Order
                </h1>

              </div>

              <div className="flex flex-wrap gap-5 text-text-secondary">

                <div className="flex items-center gap-2">

                  <FiHash
                    size={16}
                  />

                  <span>
                    {order.orderId ||
                      order._id}
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <FiCalendar
                    size={16}
                  />

                  <span>
                    {orderDate}
                  </span>

                </div>

              </div>

            </div>

            <div className="space-y-3">

              <OrderStatusBadge
                status={
                  order.orderStatus
                }
              />

              <PaymentBadge
                paymentMethod={
                  order.paymentMethod
                }
                paymentStatus={
                  order.paymentStatus
                }
              />

            </div>

          </div>

        </div>

        {/* =============================================
            TRACKING SUMMARY
        ============================================= */}

        <div className="mt-8 grid gap-8 xl:grid-cols-3">

          {/* LEFT */}

          <div className="space-y-6 xl:col-span-2">

            {/* =========================================
                CURRENT STATUS
            ========================================= */}

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">

              <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                Current Delivery Status
              </h2>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <p className="text-text-secondary">
                      Current Status
                    </p>

                    <div className="mt-3">

                      <OrderStatusBadge
                        status={
                          order.orderStatus
                        }
                      />

                    </div>

                  </div>

                  <div className="text-left lg:text-right">

                    <p className="text-text-secondary">
                      Estimated Delivery
                    </p>

                    <h3 className="mt-2 text-xl font-bold text-accent">
                      {
                        estimatedDelivery
                      }
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* =========================================
                TRACKING DETAILS
            ========================================= */}

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">

              <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                Tracking Details
              </h2>

              <div className="grid gap-6 md:grid-cols-2">

                <div>

                  <p className="text-sm text-text-secondary">
                    Tracking ID
                  </p>

                  <h3 className="mt-2 break-all text-lg font-semibold text-text-primary">
                    {trackingId}
                  </h3>

                </div>

                <div>

                  <p className="text-sm text-text-secondary">
                    Courier Partner
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-text-primary">
                    {courierPartner}
                  </h3>

                </div>

                <div>

                  <p className="text-sm text-text-secondary">
                    AWB Number
                  </p>

                  <h3 className="mt-2 break-all text-lg font-semibold text-text-primary">
                    {awbNumber}
                  </h3>

                </div>

                <div>

                  <p className="text-sm text-text-secondary">
                    Delivery Type
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-green-400">
                    {deliveryType}
                  </h3>

                </div>

              </div>

            </div>

            {/* =========================================
                DELIVERY ADDRESS
            ========================================= */}

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">

              <h2 className="mb-6 text-2xl font-semibold text-text-primary">
                Delivery Address
              </h2>

              <div className="space-y-3">

                <h3 className="text-xl font-semibold text-text-primary">
                  {shippingAddress.fullName ||
                    shippingAddress.name ||
                    "--"}
                </h3>

                <p className="text-text-secondary">
                  {shippingAddress.phone ||
                    "--"}
                </p>

                <p className="leading-7 text-text-secondary">

                  {[
                    shippingAddress.house ||
                      shippingAddress.houseNo,

                    shippingAddress.street ||
                      shippingAddress.area,

                    shippingAddress.landmark,

                    shippingAddress.city,

                    shippingAddress.state,

                    shippingAddress.pincode,

                    shippingAddress.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}

                </p>

                {shippingAddress.type && (
                  <span className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent">
                    {
                      shippingAddress.type
                    }
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* ===========================================
              RIGHT
          =========================================== */}

          <div className="space-y-6">

            <div className="rounded-2xl border border-border-subtle bg-surface p-6">

              <h2 className="mb-6 text-xl font-semibold text-text-primary">
                Delivery Summary
              </h2>

              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <span className="text-text-secondary">
                    Order Total
                  </span>

                  <span className="font-semibold text-text-primary">
                    {formatCurrency(
                      order.totalAmount ||
                        order.total ||
                        0
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-text-secondary">
                    Payment
                  </span>

                  <PaymentBadge
                    paymentMethod={
                      order.paymentMethod
                    }
                    paymentStatus={
                      order.paymentStatus
                    }
                  />

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-text-secondary">
                    Delivery
                  </span>

                  {Number(
                    order.deliveryFee ||
                      order.shippingFee ||
                      0
                  ) === 0 ? (
                    <span className="font-semibold text-green-400">
                      FREE
                    </span>
                  ) : (
                    <span className="font-semibold text-text-primary">
                      {formatCurrency(
                        order.deliveryFee ||
                          order.shippingFee
                      )}
                    </span>
                  )}

                </div>

                <div className="border-t border-border-subtle pt-5">

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-text-primary">
                      Expected Arrival
                    </span>

                    <span className="font-bold text-accent">
                      {
                        estimatedDelivery
                      }
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =============================================
            DELIVERY PROGRESS
        ============================================= */}

        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6">

          <h2 className="mb-8 text-2xl font-semibold text-text-primary">
            Delivery Progress
          </h2>

          <div className="space-y-8">

            {/* ORDER PLACED */}

            <ProgressItem
              completed
              icon="✓"
              title="Order Placed"
              description="Your order has been placed successfully."
              detail={orderDate}
            />

            {/* PAYMENT */}

            <ProgressItem
              completed={
                paymentConfirmed
              }
              icon="✓"
              title="Payment Confirmed"
              description={
                paymentConfirmed
                  ? "Payment has been verified successfully."
                  : "Waiting for payment confirmation."
              }
              detail={
                paymentConfirmed
                  ? "Completed"
                  : "Pending"
              }
            />

            {/* PACKED */}

            <ProgressItem
              completed={isPacked}
              icon="📦"
              title="Order Packed"
              description="Your products are packed and ready for shipment."
            />

            {/* SHIPPED */}

            <ProgressItem
              completed={isShipped}
              icon="🚚"
              title="Shipped"
              description="Your package has left our warehouse."
            />

            {/* OUT FOR DELIVERY */}

            <ProgressItem
              completed={
                isOutForDelivery
              }
              icon="📍"
              title="Out For Delivery"
              description="Delivery partner is heading to your location."
            />

            {/* DELIVERED */}

            <ProgressItem
              completed={
                isDelivered
              }
              icon="🏠"
              title="Delivered"
              description="Your order has been delivered successfully."
              last
            />

          </div>

        </div>

        {/* =============================================
            LATEST TRACKING ACTIVITY
        ============================================= */}

        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6">

          <h2 className="mb-6 text-2xl font-semibold text-text-primary">
            Latest Tracking Activity
          </h2>

          {trackingActivities.length >
          0 ? (

            <div className="space-y-4">

              {trackingActivities.map(
                (
                  activity,
                  index
                ) => (
                  <div
                    key={
                      activity._id ||
                      index
                    }
                    className="rounded-xl border border-border-subtle p-4"
                  >

                    <h4 className="font-semibold text-text-primary">
                      {activity.status ||
                        activity.title ||
                        "Tracking Update"}
                    </h4>

                    {(activity.message ||
                      activity.description) && (
                      <p className="mt-1 text-text-secondary">
                        {activity.message ||
                          activity.description}
                      </p>
                    )}

                    {(activity.date ||
                      activity.createdAt ||
                      activity.timestamp) && (
                      <p className="mt-2 text-sm text-text-muted">

                        {new Date(
                          activity.date ||
                            activity.createdAt ||
                            activity.timestamp
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </p>
                    )}

                  </div>
                )
              )}

            </div>

          ) : (

            <p className="text-text-secondary">
              No tracking activity
              available yet.
            </p>

          )}

        </div>

        {/* =============================================
            DELIVERY PARTNER
        ============================================= */}

        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6">

          <h2 className="mb-6 text-2xl font-semibold text-text-primary">
            Delivery Partner
          </h2>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h3 className="text-xl font-semibold text-text-primary">
                {courierPartner}
              </h3>

              <p className="mt-2 text-text-secondary">
                Shipment delivery
                information provided by
                the order tracking
                service.
              </p>

              <div className="mt-5 space-y-2">

                <p className="text-text-secondary">
                  Tracking ID
                </p>

                <p className="break-all font-semibold text-text-primary">
                  {trackingId}
                </p>

              </div>

            </div>

            <div className="flex flex-wrap gap-4">

              <button
                type="button"
                onClick={() =>
                  loadOrder(false)
                }
                disabled={refreshing}
                className="rounded-xl border border-border-subtle px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing
                  ? "Refreshing..."
                  : "Refresh Tracking"}
              </button>

            </div>

          </div>

        </div>

        {/* =============================================
            HELP
        ============================================= */}

        <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6">

          <h2 className="mb-5 text-2xl font-semibold text-text-primary">
            Need Help?
          </h2>

          <p className="leading-7 text-text-secondary">
            If your order is delayed or
            you're facing any delivery
            issues, contact our support
            team for assistance.
          </p>

        </div>

        {/* =============================================
            BOTTOM BUTTONS
        ============================================= */}

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
            className="rounded-xl border border-border-subtle px-6 py-3 font-semibold text-text-primary transition hover:border-accent hover:text-accent"
          >
            Back To Orders
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="rounded-xl bg-accent px-6 py-3 font-semibold text-brand-bg transition hover:opacity-90"
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </main>
  );
}

// ======================================================
// PROGRESS ITEM
// ======================================================

function ProgressItem({
  completed,
  icon,
  title,
  description,
  detail,
  last = false,
}) {
  return (
    <div className="flex gap-5">

      <div className="flex flex-col items-center">

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            completed
              ? "bg-green-500 text-white"
              : "border border-border-subtle bg-brand-bg text-text-secondary"
          }`}
        >
          {icon}
        </div>

        {!last && (
          <div
            className={`mt-2 h-20 w-1 ${
              completed
                ? "bg-green-500"
                : "bg-border-subtle"
            }`}
          />
        )}

      </div>

      <div>

        <h3 className="text-lg font-semibold text-text-primary">
          {title}
        </h3>

        <p className="mt-1 text-text-secondary">
          {description}
        </p>

        {detail && (
          <span className="mt-2 block text-sm text-text-muted">
            {detail}
          </span>
        )}

      </div>

    </div>
  );
}

export default TrackOrder;