import { Link } from "react-router-dom";

import EmptyCart from "../../components/cart/EmptyCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems = [],
    loading,
    error,
    totalItems,
    refreshCart,
  } = useCart();

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          overflow-x-hidden
          bg-brand-bg
          text-text-primary
        "
      >
        <CartLoadingSkeleton />
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          overflow-x-hidden
          bg-brand-bg
          px-4
          py-12
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-red-500/15
            bg-surface
            px-6
            py-9
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            sm:px-8
          "
        >
          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              text-red-400
            "
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <p
            className="
              mt-4
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-accent
            "
          >
            FashionStore
          </p>

          <h1
            className="
              mt-2
              text-xl
              font-bold
              tracking-tight
              text-text-primary
              sm:text-2xl
            "
          >
            Unable to Load Cart
          </h1>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-text-secondary
              sm:text-sm
            "
          >
            {error}
          </p>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-2.5
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={refreshCart}
              className="
                flex
                h-10
                flex-1
                items-center
                justify-center
                rounded-lg
                bg-accent
                px-4
                text-xs
                font-bold
                text-black
                transition-all
                duration-300
                hover:bg-accent-hover
                active:scale-[0.98]
              "
            >
              Try Again
            </button>

            <Link
              to="/"
              className="
                flex
                h-10
                flex-1
                items-center
                justify-center
                rounded-lg
                border
                border-border-subtle
                px-4
                text-xs
                font-semibold
                text-text-primary
                transition-all
                duration-300
                hover:border-accent
                hover:text-accent
                active:scale-[0.98]
              "
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (!cartItems.length) {
    return (
      <main
        className="
          min-h-screen
          overflow-x-hidden
          bg-brand-bg
        "
      >
        <EmptyCart />
      </main>
    );
  }

  // =========================================================
  // CART PAGE
  // =========================================================

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-brand-bg
        text-text-primary
      "
    >
      <section
        className="
          relative
          py-8
          sm:py-10
          lg:py-12
        "
      >
        {/* SOFT BACKGROUND GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-64
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-accent/[0.018]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1240px]
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <header
            className="
              mb-7
              flex
              flex-col
              gap-4
              sm:mb-8
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-accent
                    shadow-[0_0_10px_rgba(212,175,55,0.45)]
                  "
                />

                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.24em]
                    text-accent
                  "
                >
                  Your Shopping Bag
                </p>
              </div>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-bold
                  tracking-tight
                  text-text-primary
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                Shopping Cart
              </h1>

              <p
                className="
                  mt-1.5
                  text-xs
                  text-text-secondary
                  sm:text-sm
                "
              >
                {totalItems || 0}{" "}
                {Number(totalItems) === 1
                  ? "item"
                  : "items"}{" "}
                ready for checkout.
              </p>
            </div>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-1.5
                rounded-lg
                border
                border-border-subtle
                bg-surface
                px-3.5
                py-2.5
                text-[10px]
                font-semibold
                text-text-secondary
                transition-all
                duration-300
                hover:border-accent
                hover:text-accent
                active:scale-95
                sm:text-xs
              "
            >
              <span
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-x-0.5
                "
              >
                ←
              </span>

              Continue Shopping
            </Link>
          </header>

          {/* =================================================
              CART LAYOUT
          ================================================= */}

          <div
            className="
              grid
              items-start
              gap-6
              lg:grid-cols-[minmax(0,1fr)_340px]
              lg:gap-7
              xl:grid-cols-[minmax(0,1fr)_360px]
              xl:gap-8
            "
          >
            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div
              className="
                min-w-0
                space-y-3
                sm:space-y-4
              "
            >
              {/* ITEMS HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-1
                "
              >
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-text-muted
                  "
                >
                  Cart Items
                </p>

                <span
                  className="
                    rounded-full
                    bg-surface
                    px-2.5
                    py-1
                    text-[9px]
                    font-semibold
                    text-text-secondary
                  "
                >
                  {cartItems.length}{" "}
                  {cartItems.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>

              {/* CART ITEMS */}

              {cartItems.map(
                (item, index) => {
                  /*
                    Backend cart item:

                    {
                      _id: "...",
                      product: {...},
                      quantity: 2,
                      size: "M",
                      color: "Black"
                    }
                  */

                  const itemId =
                    item?._id ||
                    item?.id ||
                    `${
                      item?.product?._id ||
                      item?.product?.id ||
                      "cart-item"
                    }-${index}`;

                  return (
                    <div
                      key={itemId}
                      className="
                        min-w-0
                        animate-[cartItemReveal_.35s_ease-out_both]
                      "
                      style={{
                        animationDelay: `${Math.min(
                          index * 45,
                          250
                        )}ms`,
                      }}
                    >
                      <CartItem
                        item={item}
                      />
                    </div>
                  );
                }
              )}
            </div>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <aside
              className="
                min-w-0
                lg:sticky
                lg:top-24
              "
            >
              <CartSummary />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

// =============================================================
// LOADING SKELETON
// =============================================================

function CartLoadingSkeleton() {
  return (
    <section
      className="
        py-8
        sm:py-10
        lg:py-12
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1240px]
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        {/* HEADER */}

        <div className="mb-8">
          <div
            className="
              h-2.5
              w-28
              animate-pulse
              rounded-full
              bg-surface
            "
          />

          <div
            className="
              mt-3
              h-8
              w-44
              animate-pulse
              rounded-lg
              bg-surface
              sm:h-9
            "
          />

          <div
            className="
              mt-2
              h-3
              w-40
              animate-pulse
              rounded-full
              bg-surface
            "
          />
        </div>

        {/* CONTENT */}

        <div
          className="
            grid
            items-start
            gap-6
            lg:grid-cols-[minmax(0,1fr)_340px]
            xl:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          {/* ITEMS */}

          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map(
              (item) => (
                <CartItemSkeleton
                  key={item}
                />
              )
            )}
          </div>

          {/* SUMMARY */}

          <div
            className="
              min-h-[300px]
              animate-pulse
              rounded-2xl
              border
              border-border-subtle
              bg-surface
            "
          />
        </div>
      </div>
    </section>
  );
}

// =============================================================
// CART ITEM SKELETON
// =============================================================

function CartItemSkeleton() {
  return (
    <div
      className="
        flex
        gap-3
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        p-3
        sm:gap-4
        sm:p-4
      "
    >
      {/* IMAGE */}

      <div
        className="
          h-24
          w-20
          shrink-0
          animate-pulse
          rounded-xl
          bg-surface-elevated
          sm:h-28
          sm:w-24
        "
      />

      {/* CONTENT */}

      <div
        className="
          min-w-0
          flex-1
          space-y-3
        "
      >
        <div
          className="
            h-2.5
            w-20
            animate-pulse
            rounded-full
            bg-surface-elevated
          "
        />

        <div
          className="
            h-4
            w-3/4
            animate-pulse
            rounded-full
            bg-surface-elevated
          "
        />

        <div
          className="
            h-3
            w-1/2
            animate-pulse
            rounded-full
            bg-surface-elevated
          "
        />

        <div
          className="
            h-8
            w-28
            animate-pulse
            rounded-lg
            bg-surface-elevated
          "
        />
      </div>
    </div>
  );
}

export default Cart;