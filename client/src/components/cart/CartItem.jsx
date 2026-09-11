import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiHeart,
  FiChevronRight,
} from "react-icons/fi";

import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  // =========================================================
  // CART ITEM
  // =========================================================

  const cartItemId =
    item?._id ||
    item?.id;

  const product =
    item?.product ||
    item;

  const productId =
    product?._id ||
    product?.id;

  // =========================================================
  // IMAGE
  // =========================================================

  const productImage =
    typeof product?.images?.[0] ===
    "object"
      ? product?.images?.[0]?.url
      : product?.images?.[0] ||
        product?.image ||
        "";

  // =========================================================
  // PRICE
  // =========================================================

  const price =
    Number(
      product?.discountPrice ??
        product?.price ??
        0
    ) || 0;

  const originalPrice =
    Number(
      product?.price ?? 0
    ) || 0;

  const hasDiscount =
    product?.discountPrice !==
      null &&
    product?.discountPrice !==
      undefined &&
    originalPrice > price;

  const discountPercentage =
    hasDiscount &&
    originalPrice > 0
      ? Math.round(
          ((originalPrice - price) /
            originalPrice) *
            100
        )
      : 0;

  // =========================================================
  // QUANTITY
  // =========================================================

  const quantity =
    Number(item?.quantity) || 1;

  // =========================================================
  // VARIANTS
  // =========================================================

  const selectedSize =
    item?.size ||
    item?.selectedSize ||
    "";

  const selectedColor =
    item?.color ||
    item?.selectedColor ||
    "";

  // =========================================================
  // TOTAL
  // =========================================================

  const itemTotal =
    price * quantity;

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (
    value
  ) =>
    Number(value).toLocaleString(
      "en-IN"
    );

  // =========================================================
  // QUANTITY HANDLERS
  // =========================================================

  const handleIncrease =
    async () => {
      if (!cartItemId) return;

      try {
        await increaseQuantity(
          cartItemId
        );
      } catch (error) {
        console.error(
          "Increase Quantity Error:",
          error
        );
      }
    };

  const handleDecrease =
    async () => {
      if (
        !cartItemId ||
        quantity <= 1
      ) {
        return;
      }

      try {
        await decreaseQuantity(
          cartItemId
        );
      } catch (error) {
        console.error(
          "Decrease Quantity Error:",
          error
        );
      }
    };

  // =========================================================
  // REMOVE
  // =========================================================

  const handleRemove =
    async () => {
      if (!cartItemId) return;

      try {
        await removeFromCart(
          cartItemId
        );
      } catch (error) {
        console.error(
          "Remove Cart Item Error:",
          error
        );
      }
    };

  // =========================================================
  // INVALID PRODUCT
  // =========================================================

  if (!item || !product) {
    return null;
  }

  // =========================================================
  // PRODUCT URL
  // =========================================================

  const productUrl = productId
    ? `/product/${productId}`
    : "#";

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        ease-out
        hover:-translate-y-0.5
        hover:border-accent/40
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
      "
    >
      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          flex
          gap-3
          p-3
          sm:gap-4
          sm:p-4
        "
      >
        {/* ===================================================
            PRODUCT IMAGE
        =================================================== */}

        <Link
          to={productUrl}
          aria-label={`View ${
            product?.name ||
            "product"
          }`}
          className="
            relative
            block
            w-[92px]
            shrink-0
            sm:w-[112px]
            md:w-[118px]
          "
        >
          <div
            className="
              relative
              aspect-[4/5]
              overflow-hidden
              rounded-lg
              bg-surface-elevated
            "
          >
            {productImage ? (
              <img
                src={productImage}
                alt={
                  product?.name ||
                  "Product"
                }
                loading="lazy"
                onError={(
                  event
                ) => {
                  event.currentTarget.onerror =
                    null;

                  event.currentTarget.src =
                    "https://placehold.co/400x500?text=FashionStore";
                }}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  ease-out
                  group-hover:scale-[1.045]
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  px-2
                  text-center
                  text-[10px]
                  text-text-muted
                "
              >
                No Image
              </div>
            )}

            {/* Image Overlay */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-black/0
                transition-all
                duration-300
                group-hover:bg-black/5
              "
            />

            {/* Discount */}

            {discountPercentage >
              0 && (
              <span
                className="
                  absolute
                  bottom-2
                  left-2
                  rounded-full
                  bg-green-500
                  px-2
                  py-0.5
                  text-[8px]
                  font-bold
                  text-white
                  shadow-md
                  sm:text-[9px]
                "
              >
                {discountPercentage}%
                OFF
              </span>
            )}
          </div>
        </Link>

        {/* ===================================================
            PRODUCT CONTENT
        =================================================== */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
          "
        >
          {/* =================================================
              TOP ROW
          ================================================= */}

          <div
            className="
              flex
              items-start
              justify-between
              gap-2
            "
          >
            <div className="min-w-0">
              {/* Brand */}

              {product?.brand && (
                <p
                  className="
                    truncate
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-accent
                    sm:text-[10px]
                  "
                >
                  {product.brand}
                </p>
              )}

              {/* Name */}

              <Link
                to={productUrl}
                className="
                  group/name
                  mt-1
                  block
                  max-w-[360px]
                "
              >
                <h2
                  className="
                    line-clamp-2
                    text-sm
                    font-semibold
                    leading-5
                    text-text-primary
                    transition-colors
                    duration-200
                    group-hover/name:text-accent
                    sm:text-[15px]
                    sm:leading-5
                  "
                >
                  {product?.name ||
                    "Product"}
                </h2>
              </Link>
            </div>

            {/* Product Link */}

            {productId && (
              <Link
                to={productUrl}
                aria-label="View product"
                className="
                  hidden
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border-subtle
                  text-text-muted
                  transition-all
                  duration-200
                  hover:border-accent
                  hover:bg-accent-soft
                  hover:text-accent
                  sm:flex
                "
              >
                <FiChevronRight
                  size={13}
                />
              </Link>
            )}
          </div>

          {/* =================================================
              VARIANTS
          ================================================= */}

          {(selectedSize ||
            selectedColor) && (
            <div
              className="
                mt-2.5
                flex
                flex-wrap
                gap-1.5
              "
            >
              {selectedSize && (
                <span
                  className="
                    rounded-md
                    border
                    border-border-subtle
                    bg-brand-bg
                    px-2
                    py-1
                    text-[9px]
                    text-text-secondary
                    sm:text-[10px]
                  "
                >
                  Size{" "}
                  <strong className="text-text-primary">
                    {selectedSize}
                  </strong>
                </span>
              )}

              {selectedColor && (
                <span
                  className="
                    rounded-md
                    border
                    border-border-subtle
                    bg-brand-bg
                    px-2
                    py-1
                    text-[9px]
                    text-text-secondary
                    sm:text-[10px]
                  "
                >
                  Color{" "}
                  <strong className="text-text-primary">
                    {selectedColor}
                  </strong>
                </span>
              )}
            </div>
          )}

          {/* =================================================
              PRICE
          ================================================= */}

          <div
            className="
              mt-2.5
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                text-base
                font-bold
                text-accent
                sm:text-lg
              "
            >
              ₹{formatPrice(price)}
            </span>

            {hasDiscount && (
              <span
                className="
                  text-[10px]
                  text-text-muted
                  line-through
                  sm:text-xs
                "
              >
                ₹
                {formatPrice(
                  originalPrice
                )}
              </span>
            )}
          </div>

          {/* =================================================
              BOTTOM AREA
          ================================================= */}

          <div
            className="
              mt-auto
              flex
              flex-wrap
              items-end
              justify-between
              gap-3
              pt-3
            "
          >
            {/* Quantity */}

            <div>
              <p
                className="
                  mb-1
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-text-muted
                "
              >
                Quantity
              </p>

              <div
                className="
                  inline-flex
                  h-8
                  items-center
                  overflow-hidden
                  rounded-lg
                  border
                  border-border-subtle
                  bg-brand-bg
                  sm:h-9
                "
              >
                <button
                  type="button"
                  onClick={
                    handleDecrease
                  }
                  disabled={
                    quantity <= 1
                  }
                  aria-label="Decrease quantity"
                  className="
                    flex
                    h-full
                    w-8
                    items-center
                    justify-center
                    text-text-secondary
                    transition-all
                    duration-200
                    hover:bg-surface-elevated
                    hover:text-accent
                    active:scale-90
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  <FiMinus
                    size={12}
                  />
                </button>

                <span
                  className="
                    flex
                    min-w-8
                    items-center
                    justify-center
                    border-x
                    border-border-subtle
                    px-1
                    text-xs
                    font-bold
                    text-text-primary
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    handleIncrease
                  }
                  aria-label="Increase quantity"
                  className="
                    flex
                    h-full
                    w-8
                    items-center
                    justify-center
                    text-text-secondary
                    transition-all
                    duration-200
                    hover:bg-surface-elevated
                    hover:text-accent
                    active:scale-90
                  "
                >
                  <FiPlus
                    size={12}
                  />
                </button>
              </div>
            </div>

            {/* Item Total */}

            <div className="text-right">
              <p
                className="
                  text-[8px]
                  uppercase
                  tracking-wider
                  text-text-muted
                "
              >
                Total
              </p>

              <p
                className="
                  mt-0.5
                  text-sm
                  font-bold
                  text-text-primary
                  sm:text-base
                "
              >
                ₹
                {formatPrice(
                  itemTotal
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ACTION BAR
      ===================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-border-subtle
          bg-brand-bg/35
          px-3
          py-2
          sm:px-4
        "
      >
        <span
          className="
            flex
            items-center
            gap-1.5
            text-[9px]
            text-text-muted
            sm:text-[10px]
          "
        >
          <FiHeart
            size={11}
            className="text-accent"
          />

          Saved in your cart
        </span>

        <button
          type="button"
          onClick={
            handleRemove
          }
          className="
            group/remove
            inline-flex
            items-center
            gap-1.5
            rounded-md
            px-2
            py-1
            text-[9px]
            font-semibold
            text-text-muted
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-400
            sm:text-[10px]
          "
        >
          <FiTrash2
            size={12}
            className="
              transition-transform
              duration-200
              group-hover/remove:scale-110
            "
          />

          Remove
        </button>
      </div>
    </article>
  );
}

export default CartItem;