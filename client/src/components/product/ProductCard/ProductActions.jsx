import { Link } from "react-router-dom";

import {
  FiShoppingBag,
  FiArrowUpRight,
} from "react-icons/fi";

import { useCart } from "../../../context/CartContext";

function ProductActions({ product }) {
  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  const productId =
    product?._id ||
    product?.id;

  if (!product || !productId) {
    return null;
  }

  // =========================================================
  // STOCK
  // =========================================================

  const inStock =
    Number(product?.stock || 0) >
      0 ||
    product?.sizes?.some(
      (item) =>
        Number(item?.stock || 0) >
        0
    );

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!inStock || cartLoading) {
      return;
    }

    try {
      await addToCart(
        product,
        1
      );
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );
    }
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <div
      className="
        mt-auto
        border-t
        border-border-subtle
        px-3
        pb-3
        pt-3
        sm:px-4
        sm:pb-4
      "
    >
      {!inStock ? (
        <button
          type="button"
          disabled
          className="
            flex
            h-9
            w-full
            cursor-not-allowed
            items-center
            justify-center
            rounded-lg
            bg-surface-elevated
            px-3
            text-[10px]
            font-semibold
            text-text-muted
            sm:h-10
            sm:text-xs
          "
        >
          Currently Unavailable
        </button>
      ) : (
        <div
          className="
            grid
            grid-cols-[1fr_auto]
            gap-2
          "
        >
          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="
              flex
              h-10
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-accent
              px-3
              text-xs
              font-bold
              text-black
              transition-all
              duration-200
              hover:bg-accent-hover
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:h-10
              sm:text-sm
            "
          >
            <FiShoppingBag
              size={15}
            />

            {cartLoading
              ? "Adding..."
              : "Add to Cart"}
          </button>

          {/* BUY */}

          <Link
            to="/checkout"
            onClick={async (
              event
            ) => {
              event.stopPropagation();

              try {
                await addToCart(
                  product,
                  1
                );
              } catch (error) {
                console.error(
                  "Buy Now Error:",
                  error
                );
              }
            }}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              border
              border-accent/50
              text-accent
              transition-all
              duration-200
              hover:bg-accent
              hover:text-black
              active:scale-95
              sm:w-11
            "
            aria-label="Buy now"
          >
            <FiArrowUpRight
              size={17}
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProductActions;