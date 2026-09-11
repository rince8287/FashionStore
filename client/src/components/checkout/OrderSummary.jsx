import {
  FiCheck,
  FiMinus,
  FiPackage,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiHeart,
} from "react-icons/fi";

function OrderSummary({
  items = [],
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
  onMoveToWishlist,
}) {
  // =========================================================
  // HELPERS
  // =========================================================

  const getItemId = (item) =>
    item?._id || item?.id;

  const getProduct = (item) =>
    item?.product || item;

  const getImage = (item) => {
    const product = getProduct(item);

    if (
      Array.isArray(product?.images) &&
      product.images.length > 0
    ) {
      const firstImage =
        product.images[0];

      if (
        typeof firstImage ===
        "string"
      ) {
        return firstImage;
      }

      if (
        typeof firstImage ===
          "object" &&
        firstImage?.url
      ) {
        return firstImage.url;
      }
    }

    return (
      product?.image ||
      "/images/placeholder-product.png"
    );
  };

  const getName = (item) =>
    getProduct(item)?.name ||
    "Product";

  const getPrice = (item) => {
    const product =
      getProduct(item);

    const discountPrice =
      Number(
        product?.discountPrice
      );

    const price = Number(
      product?.price ??
        item?.price ??
        0
    );

    if (
      Number.isFinite(
        discountPrice
      ) &&
      discountPrice > 0 &&
      discountPrice < price
    ) {
      return discountPrice;
    }

    return Number.isFinite(price)
      ? price
      : 0;
  };

  const getOldPrice = (item) => {
    const product =
      getProduct(item);

    const price = Number(
      product?.price
    );

    const discountPrice =
      Number(
        product?.discountPrice
      );

    if (
      Number.isFinite(price) &&
      Number.isFinite(discountPrice) &&
      discountPrice > 0 &&
      discountPrice < price
    ) {
      return price;
    }

    return null;
  };

  const getSize = (item) =>
    item?.size || null;

  const getColor = (item) =>
    item?.color || null;

  const getQuantity = (item) =>
    Math.max(
      Number(item?.quantity) || 1,
      1
    );

  const formatPrice = (value) =>
    Number(value).toLocaleString(
      "en-IN"
    );

  // =========================================================
  // TOTALS
  // =========================================================

  const totalItems =
    items.reduce(
      (total, item) =>
        total +
        getQuantity(item),
      0
    );

  const totalAmount =
    items.reduce(
      (total, item) =>
        total +
        getPrice(item) *
          getQuantity(item),
      0
    );

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!items.length) {
    return (
      <section
        className="
          w-full
          overflow-hidden
          rounded-xl
          border
          border-border-subtle
          bg-surface
        "
      >
        <div className="p-5 text-center sm:p-6">
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
              mt-3
              text-sm
              font-bold
              text-text-primary
            "
          >
            Your cart is empty
          </h2>

          <p
            className="
              mx-auto
              mt-1
              max-w-xs
              text-[9px]
              leading-4
              text-text-muted
            "
          >
            Add products to your cart
            to continue checkout.
          </p>
        </div>
      </section>
    );
  }

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        w-full
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        shadow-[0_14px_40px_rgba(0,0,0,0.08)]
        transition-all
        duration-300
        hover:border-accent/20
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          border-b
          border-border-subtle
          px-4
          py-3.5
          sm:px-5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-accent/20
              bg-accent-soft
              text-accent
            "
          >
            <FiShoppingBag
              size={16}
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-sm
                font-bold
                text-text-primary
                sm:text-[15px]
              "
            >
              Order Summary
            </h2>

            <p
              className="
                mt-0.5
                text-[9px]
                text-text-muted
                sm:text-[10px]
              "
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your order
            </p>
          </div>
        </div>

        {/* ITEM COUNT */}

        <div
          className="
            shrink-0
            rounded-full
            border
            border-accent/15
            bg-accent/[0.05]
            px-2.5
            py-1
            text-[8px]
            font-bold
            text-accent
          "
        >
          {totalItems}
        </div>
      </div>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <div className="divide-y divide-border-subtle">
        {items.map((item) => {
          const itemId =
            getItemId(item);

          const quantity =
            getQuantity(item);

          const price =
            getPrice(item);

          const oldPrice =
            getOldPrice(item);

          const size =
            getSize(item);

          const color =
            getColor(item);

          return (
            <article
              key={itemId}
              className="
                group
                p-3.5
                transition-colors
                duration-200
                hover:bg-accent/[0.015]
                sm:p-4
              "
            >
              <div
                className="
                  flex
                  gap-3
                  sm:gap-3.5
                "
              >
                {/* =================================================
                    IMAGE
                ================================================= */}

                <div
                  className="
                    relative
                    h-[76px]
                    w-[64px]
                    shrink-0
                    overflow-hidden
                    rounded-lg
                    border
                    border-border-subtle
                    bg-brand-bg
                    sm:h-[86px]
                    sm:w-[72px]
                  "
                >
                  <img
                    src={getImage(item)}
                    alt={getName(item)}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                    onError={(
                      event
                    ) => {
                      event.currentTarget.onerror =
                        null;

                      event.currentTarget.src =
                        "/images/placeholder-product.png";
                    }}
                  />

                  {/* QUANTITY BADGE */}

                  <span
                    className="
                      absolute
                      bottom-1
                      right-1
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-black/75
                      px-1
                      text-[8px]
                      font-bold
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    ×{quantity}
                  </span>
                </div>

                {/* =================================================
                    DETAILS
                ================================================= */}

                <div className="min-w-0 flex-1">
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-2
                    "
                  >
                    <div className="min-w-0">
                      <h3
                        className="
                          line-clamp-2
                          text-xs
                          font-semibold
                          leading-4
                          text-text-primary
                          sm:text-sm
                        "
                      >
                        {getName(item)}
                      </h3>

                      {/* SIZE / COLOR */}

                      {(size ||
                        color) && (
                        <div
                          className="
                            mt-1.5
                            flex
                            flex-wrap
                            gap-1.5
                          "
                        >
                          {size && (
                            <span
                              className="
                                rounded-md
                                border
                                border-border-subtle
                                bg-brand-bg
                                px-1.5
                                py-0.5
                                text-[8px]
                                text-text-muted
                              "
                            >
                              Size:{" "}
                              <strong className="text-text-secondary">
                                {size}
                              </strong>
                            </span>
                          )}

                          {color && (
                            <span
                              className="
                                rounded-md
                                border
                                border-border-subtle
                                bg-brand-bg
                                px-1.5
                                py-0.5
                                text-[8px]
                                text-text-muted
                              "
                            >
                              Color:{" "}
                              <strong className="text-text-secondary">
                                {color}
                              </strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* PRICE */}

                    <div
                      className="
                        shrink-0
                        text-right
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-bold
                          text-accent
                          sm:text-sm
                        "
                      >
                        ₹
                        {formatPrice(
                          price *
                            quantity
                        )}
                      </p>

                      {oldPrice && (
                        <p
                          className="
                            mt-0.5
                            text-[8px]
                            text-text-muted
                            line-through
                          "
                        >
                          ₹
                          {formatPrice(
                            oldPrice *
                              quantity
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      BOTTOM CONTROLS
                  ================================================= */}

                  <div
                    className="
                      mt-2.5
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    {/* QUANTITY */}

                    <div
                      className="
                        flex
                        h-7
                        items-center
                        overflow-hidden
                        rounded-md
                        border
                        border-border-subtle
                        bg-brand-bg
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onDecreaseQuantity?.(
                            itemId
                          )
                        }
                        disabled={
                          quantity <= 1
                        }
                        aria-label="Decrease quantity"
                        className="
                          flex
                          h-full
                          w-7
                          items-center
                          justify-center
                          text-text-muted
                          transition-colors
                          hover:bg-surface
                          hover:text-text-primary
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                        "
                      >
                        <FiMinus
                          size={10}
                        />
                      </button>

                      <span
                        className="
                          flex
                          h-full
                          min-w-7
                          items-center
                          justify-center
                          border-x
                          border-border-subtle
                          text-[9px]
                          font-bold
                          text-text-primary
                        "
                      >
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onIncreaseQuantity?.(
                            itemId
                          )
                        }
                        aria-label="Increase quantity"
                        className="
                          flex
                          h-full
                          w-7
                          items-center
                          justify-center
                          text-text-muted
                          transition-colors
                          hover:bg-surface
                          hover:text-accent
                        "
                      >
                        <FiPlus
                          size={10}
                        />
                      </button>
                    </div>

                    {/* ACTIONS */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          onMoveToWishlist?.(
                            itemId
                          )
                        }
                        aria-label="Move to wishlist"
                        title="Move to wishlist"
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          text-text-muted
                          transition-all
                          duration-200
                          hover:bg-accent-soft
                          hover:text-accent
                          active:scale-90
                        "
                      >
                        <FiHeart
                          size={13}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onRemove?.(
                            itemId
                          )
                        }
                        aria-label="Remove product"
                        title="Remove product"
                        className="
                          flex
                          h-7
                          w-7
                          items-center
                          justify-center
                          rounded-md
                          text-text-muted
                          transition-all
                          duration-200
                          hover:bg-red-500/10
                          hover:text-red-400
                          active:scale-90
                        "
                      >
                        <FiTrash2
                          size={13}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================
                  DELIVERY STATUS
              =================================================== */}

              <div
                className="
                  mt-2.5
                  flex
                  items-center
                  gap-1.5
                  pl-0.5
                "
              >
                <FiPackage
                  size={10}
                  className="text-green-400"
                />

                <span
                  className="
                    text-[8px]
                    font-medium
                    text-green-400
                  "
                >
                  In Stock
                </span>

                <span
                  className="
                    text-[8px]
                    text-text-muted
                  "
                >
                  •
                </span>

                <span
                  className="
                    text-[8px]
                    text-text-muted
                  "
                >
                  Delivery in 2–4 days
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* =====================================================
          TOTAL
      ===================================================== */}

      <div
        className="
          border-t
          border-border-subtle
          bg-brand-bg/30
          p-4
          sm:p-5
        "
      >
        {/* ITEMS */}

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[10px]
              text-text-muted
            "
          >
            Subtotal
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-text-primary
            "
          >
            ₹
            {formatPrice(
              totalAmount
            )}
          </span>
        </div>

        {/* DELIVERY */}

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
          "
        >
          <span
            className="
              text-[10px]
              text-text-muted
            "
          >
            Delivery
          </span>

          <span
            className="
              text-[9px]
              font-bold
              text-green-400
            "
          >
            FREE
          </span>
        </div>

        {/* TOTAL */}

        <div
          className="
            mt-3
            flex
            items-end
            justify-between
            border-t
            border-border-subtle
            pt-3
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                text-text-primary
              "
            >
              Total
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-text-muted
              "
            >
              Inclusive of selected items
            </p>
          </div>

          <span
            className="
              text-lg
              font-extrabold
              tracking-tight
              text-accent
              sm:text-xl
            "
          >
            ₹
            {formatPrice(
              totalAmount
            )}
          </span>
        </div>

        {/* ===================================================
            SECURE CHECKOUT
        =================================================== */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-green-500/15
            bg-green-500/[0.04]
            px-3
            py-2.5
          "
        >
          <div
            className="
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-green-500/10
              text-green-400
            "
          >
            <FiCheck
              size={11}
              strokeWidth={3}
            />
          </div>

          <div>
            <p
              className="
                text-[9px]
                font-semibold
                text-green-400
              "
            >
              Secure checkout
            </p>

            <p
              className="
                mt-0.5
                text-[8px]
                text-text-muted
              "
            >
              Your order details are protected.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSummary;