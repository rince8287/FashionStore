// src/components/orders/OrderCard.jsx

import {
  FiCalendar,
  FiChevronRight,
  FiHash,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";

import OrderStatusBadge from "./OrderStatusBadge";
import PaymentBadge from "./PaymentBadge";
import OrderItemsPreview from "./OrderItemsPreview";
import OrderActions from "./OrderActions";


// ==========================================================
// ORDER CARD
// ==========================================================

function OrderCard({
  order,
  onViewDetails,
  onTrackOrder,
  onCancelOrder,
  onReturnOrder,
}) {

  // ========================================================
  // ORDER ID
  // ========================================================

  const orderId =
    order?.orderNumber ||
    order?.orderId ||
    order?._id ||
    "N/A";


  // ========================================================
  // ORDER DATE
  // ========================================================

  const orderDate = order?.createdAt
    ? new Date(
        order.createdAt
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "-";


  // ========================================================
  // TOTAL
  // ========================================================

  const totalAmount =
    Number(
      order?.totalAmount ??
      order?.totalPrice ??
      0
    ) || 0;


  // ========================================================
  // SHIPPING ADDRESS
  // ========================================================

  const shipping =
    order?.shippingAddress || {};


  // ========================================================
  // BUILD ADDRESS SAFELY
  // ========================================================

  const addressParts = [
    shipping.house,
    shipping.street,
    shipping.landmark,
    shipping.city,
    shipping.state,
  ].filter(Boolean);


  const formattedAddress =
    addressParts.join(", ");


  // ========================================================
  // ITEM COUNT
  // ========================================================

  const items = Array.isArray(
    order?.items
  )
    ? order.items
    : [];


  const itemCount = items.reduce(
    (total, item) =>
      total +
      (Number(item?.quantity) || 1),
    0
  );


  // ========================================================
  // UI
  // ========================================================

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        shadow-sm
        transition-all
        duration-500

        hover:-translate-y-0.5
        hover:border-accent/30
        hover:shadow-xl
        hover:shadow-black/10
      "
    >

      {/* ====================================================
          TOP ACCENT LINE
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-accent/50
          to-transparent
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border-subtle
          p-5
          sm:p-6
          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        {/* LEFT */}

        <div className="min-w-0">

          {/* Order Number */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1.5
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-text-muted
              "
            >
              <FiHash
                size={15}
                className="text-accent"
              />

              <span className="text-xs">
                Order
              </span>
            </div>


            <span
              className="
                max-w-full
                truncate
                text-sm
                font-semibold
                text-text-primary
                sm:text-base
              "
              title={orderId}
            >
              {orderId}
            </span>

          </div>


          {/* Date + Items */}

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              text-xs
              text-text-muted
            "
          >

            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <FiCalendar size={14} />

              {orderDate}
            </span>


            <span
              className="
                h-1
                w-1
                rounded-full
                bg-border-subtle
              "
            />


            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <FiPackage size={14} />

              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}
            </span>

          </div>

        </div>


        {/* STATUS */}

        <div className="shrink-0">
          <OrderStatusBadge
            status={
              order?.orderStatus
            }
          />
        </div>

      </div>


      {/* ====================================================
          PRODUCTS
      ==================================================== */}

      <div className="p-5 sm:p-6">

        <div className="mb-4 flex items-center justify-between">

          <div>

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-accent
              "
            >
              Order Items
            </p>

            <h3
              className="
                mt-1
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Your selected products
            </h3>

          </div>


          <FiChevronRight
            size={17}
            className="
              text-text-muted
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />

        </div>


        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg
          "
        >
          <OrderItemsPreview
            items={items}
          />
        </div>

      </div>


      {/* ====================================================
          PAYMENT + TOTAL
      ==================================================== */}

      <div
        className="
          mx-5
          border-y
          border-border-subtle
          sm:mx-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-5
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* PAYMENT */}

          <div>

            <p
              className="
                mb-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-text-muted
              "
            >
              Payment
            </p>

            <PaymentBadge
              paymentMethod={
                order?.paymentMethod
              }
              paymentStatus={
                order?.paymentStatus
              }
            />

          </div>


          {/* TOTAL */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-8
              sm:block
              sm:text-right
            "
          >

            <p
              className="
                text-xs
                text-text-muted
              "
            >
              Total Amount
            </p>

            <p
              className="
                mt-1
                text-xl
                font-bold
                tracking-tight
                text-accent
                sm:text-2xl
              "
            >
              ₹
              {totalAmount.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

        </div>

      </div>


      {/* ====================================================
          DELIVERY ADDRESS
      ==================================================== */}

      <div className="p-5 sm:p-6">

        <div
          className="
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg
            p-4
            transition-colors
            duration-300
            group-hover:border-border-subtle
          "
        >

          {/* Heading */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-accent/10
              "
            >
              <FiMapPin
                size={15}
                className="text-accent"
              />
            </div>


            <div>

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-accent
                "
              >
                Delivery Address
              </p>

            </div>

          </div>


          {/* Name */}

          {shipping.fullName && (
            <p
              className="
                mt-3
                text-sm
                font-semibold
                text-text-primary
              "
            >
              {shipping.fullName}

              {shipping.phone && (
                <span
                  className="
                    ml-2
                    font-normal
                    text-text-muted
                  "
                >
                  • {shipping.phone}
                </span>
              )}
            </p>
          )}


          {/* Address */}

          {formattedAddress && (
            <p
              className="
                mt-1.5
                text-xs
                leading-5
                text-text-secondary
                sm:text-sm
                sm:leading-6
              "
            >
              {formattedAddress}

              {shipping.pincode && (
                <span className="font-medium text-text-primary">
                  {" "}
                  - {shipping.pincode}
                </span>
              )}
            </p>
          )}


          {/* No Address */}

          {!formattedAddress &&
            !shipping.fullName && (
              <p
                className="
                  mt-3
                  text-sm
                  text-text-muted
                "
              >
                Delivery address not available.
              </p>
            )}

        </div>


        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="mt-5">

          <OrderActions
            orderStatus={
              order?.orderStatus
            }

            onViewDetails={() =>
              onViewDetails?.(order)
            }

            onTrackOrder={() =>
              onTrackOrder?.(order)
            }

            onCancelOrder={() =>
              onCancelOrder?.(order)
            }

            onReturnOrder={() =>
              onReturnOrder?.(order)
            }
          />

        </div>

      </div>

    </article>
  );
}


export default OrderCard;