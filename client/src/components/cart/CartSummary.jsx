import { Link } from "react-router-dom";
import {
  FiLock,
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";

function CartSummary() {
  // =========================================================
  // CART CONTEXT
  // =========================================================

  const {
    cartItems = [],
    totalItems = 0,
  } = useCart();

  // =========================================================
  // SUBTOTAL
  // =========================================================

  const subtotal = cartItems.reduce(
    (total, item) => {
      const product =
        item?.product || {};

      const originalPrice =
        Number(
          product?.price ??
            item?.price ??
            0
        ) || 0;

      const discountPrice =
        product?.discountPrice !==
          null &&
        product?.discountPrice !==
          undefined
          ? Number(
              product.discountPrice
            )
          : null;

      const finalPrice =
        discountPrice !== null &&
        !Number.isNaN(
          discountPrice
        ) &&
        discountPrice >= 0 &&
        discountPrice < originalPrice
          ? discountPrice
          : originalPrice;

      const quantity =
        Number(item?.quantity) || 1;

      return (
        total +
        finalPrice * quantity
      );
    },
    0
  );

  // =========================================================
  // SHIPPING
  // =========================================================

  const FREE_SHIPPING_LIMIT = 1000;
  const STANDARD_SHIPPING = 99;

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >=
        FREE_SHIPPING_LIMIT
      ? 0
      : STANDARD_SHIPPING;

  // =========================================================
  // GST
  // =========================================================

  const GST_RATE = 0.18;

  const gst = Math.round(
    subtotal * GST_RATE
  );

  // =========================================================
  // GRAND TOTAL
  // =========================================================

  const grandTotal =
    subtotal +
    shipping +
    gst;

  // =========================================================
  // FREE SHIPPING PROGRESS
  // =========================================================

  const remainingForFreeShipping =
    Math.max(
      FREE_SHIPPING_LIMIT -
        subtotal,
      0
    );

  const shippingProgress =
    Math.min(
      (subtotal /
        FREE_SHIPPING_LIMIT) *
        100,
      100
    );

  const hasFreeShipping =
    subtotal >=
    FREE_SHIPPING_LIMIT;

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (
    amount
  ) =>
    Number(
      amount || 0
    ).toLocaleString("en-IN");

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (!cartItems.length) {
    return (
      <aside
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-5
          sm:p-6
        "
      >
        <div className="text-center">
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-accent-soft
              text-accent
            "
          >
            <FiShoppingBag
              size={20}
            />
          </div>

          <h2
            className="
              mt-4
              text-lg
              font-bold
              text-text-primary
            "
          >
            Your cart is empty
          </h2>

          <p
            className="
              mx-auto
              mt-1.5
              max-w-[260px]
              text-xs
              leading-5
              text-text-secondary
            "
          >
            Add something you love
            and come back here to
            checkout.
          </p>

          <Link
            to="/shop"
            className="
              mt-5
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-accent
              px-5
              py-2.5
              text-sm
              font-semibold
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-accent-hover
              active:scale-[0.98]
            "
          >
            Start Shopping
            <FiArrowRight
              size={15}
            />
          </Link>
        </div>
      </aside>
    );
  }

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <aside
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        shadow-[0_12px_40px_rgba(0,0,0,0.12)]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          border-b
          border-border-subtle
          px-5
          py-4
          sm:px-6
          sm:py-5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-accent-soft
                text-accent
              "
            >
              <FiShoppingBag
                size={17}
              />
            </div>

            <div>
              <h2
                className="
                  text-base
                  font-bold
                  text-text-primary
                  sm:text-lg
                "
              >
                Order Summary
              </h2>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-text-muted
                  sm:text-xs
                "
              >
                Review before checkout
              </p>
            </div>
          </div>

          {/* Item Count */}

          <span
            className="
              shrink-0
              rounded-full
              border
              border-border-subtle
              bg-brand-bg
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-text-secondary
            "
          >
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}
          </span>
        </div>
      </div>

      {/* =====================================================
          SUMMARY CONTENT
      ===================================================== */}

      <div
        className="
          px-5
          py-5
          sm:px-6
        "
      >
        <div className="space-y-3.5">
          {/* =================================================
              SUBTOTAL
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              className="
                text-xs
                text-text-secondary
              "
            >
              Subtotal
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-text-primary
              "
            >
              ₹{formatCurrency(
                subtotal
              )}
            </span>
          </div>

          {/* =================================================
              SHIPPING
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div className="flex items-center gap-2">
              <FiTruck
                size={13}
                className="text-accent"
              />

              <span
                className="
                  text-xs
                  text-text-secondary
                "
              >
                Shipping
              </span>
            </div>

            {shipping === 0 ? (
              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-2
                  py-0.5
                  text-[10px]
                  font-bold
                  text-green-500
                "
              >
                FREE
              </span>
            ) : (
              <span
                className="
                  text-sm
                  font-semibold
                  text-text-primary
                "
              >
                ₹{formatCurrency(
                  shipping
                )}
              </span>
            )}
          </div>

          {/* =================================================
              GST
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <span
              className="
                text-xs
                text-text-secondary
              "
            >
              GST (18%)
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-text-primary
              "
            >
              ₹{formatCurrency(
                gst
              )}
            </span>
          </div>
        </div>

        {/* ===================================================
            FREE SHIPPING PROGRESS
        =================================================== */}

        {subtotal > 0 && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              p-3.5
            "
          >
            {hasFreeShipping ? (
              <div className="flex items-start gap-2.5">
                <div
                  className="
                    mt-0.5
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500/10
                    text-green-500
                  "
                >
                  <FiTruck
                    size={12}
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      font-semibold
                      text-green-500
                    "
                  >
                    You unlocked free
                    shipping!
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      leading-4
                      text-text-muted
                    "
                  >
                    Your order qualifies
                    for complimentary
                    delivery.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <p
                    className="
                      text-[10px]
                      leading-4
                      text-text-secondary
                    "
                  >
                    Add{" "}
                    <strong className="text-text-primary">
                      ₹
                      {formatCurrency(
                        remainingForFreeShipping
                      )}
                    </strong>{" "}
                    more for free
                    shipping.
                  </p>

                  <span
                    className="
                      shrink-0
                      text-[9px]
                      font-semibold
                      text-accent
                    "
                  >
                    {Math.round(
                      shippingProgress
                    )}
                    %
                  </span>
                </div>

                <div
                  className="
                    mt-2.5
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-surface-elevated
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-accent
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${shippingProgress}%`,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div
          className="
            my-5
            border-t
            border-border-subtle
          "
        />

        {/* ===================================================
            GRAND TOTAL
        =================================================== */}

        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-xs
                text-text-secondary
              "
            >
              Total Amount
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-text-muted
              "
            >
              Inclusive of applicable GST
            </p>
          </div>

          <span
            className="
              text-xl
              font-bold
              tracking-tight
              text-accent
              sm:text-2xl
            "
          >
            ₹{formatCurrency(
              grandTotal
            )}
          </span>
        </div>

        {/* ===================================================
            CHECKOUT BUTTON
        =================================================== */}

        <Link
          to="/checkout"
          className="
            group
            mt-5
            flex
            w-full
            items-center
            justify-center
            gap-2.5
            rounded-xl
            bg-accent
            px-5
            py-3.5
            text-sm
            font-bold
            text-black
            shadow-[0_8px_25px_rgba(0,0,0,0.15)]
            transition-all
            duration-300
            ease-out
            hover:-translate-y-0.5
            hover:bg-accent-hover
            hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]
            active:translate-y-0
          "
        >
          <span>
            Proceed to Checkout
          </span>

          <FiArrowRight
            size={16}
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          />
        </Link>

        {/* ===================================================
            CONTINUE SHOPPING
        =================================================== */}

        <Link
          to="/shop"
          className="
            mt-2.5
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-border-subtle
            bg-transparent
            px-5
            py-3
            text-xs
            font-semibold
            text-text-secondary
            transition-all
            duration-300
            hover:border-accent/60
            hover:bg-accent-soft
            hover:text-accent
          "
        >
          Continue Shopping
        </Link>

        {/* ===================================================
            SECURITY
        =================================================== */}

        <div
          className="
            mt-5
            flex
            items-start
            gap-3
            rounded-xl
            border
            border-green-500/15
            bg-green-500/5
            p-3.5
          "
        >
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-500/10
              text-green-500
            "
          >
            <FiLock
              size={13}
            />
          </div>

          <div>
            <p
              className="
                text-[10px]
                font-semibold
                text-green-500
              "
            >
              Secure Checkout
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                leading-4
                text-text-muted
              "
            >
              Your payment information
              is encrypted and processed
              securely.
            </p>
          </div>

          <FiShield
            size={14}
            className="
              ml-auto
              mt-1
              shrink-0
              text-green-500/70
            "
          />
        </div>
      </div>
    </aside>
  );
}

export default CartSummary;