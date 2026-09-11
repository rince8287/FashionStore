import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
} from "react-icons/fi";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function WishlistItem({ product }) {
  const {
    removeFromWishlist,
    moveToCart,
  } = useWishlist();

  const {
    refreshCart,
  } = useCart();

  // ====================================================
  // STATE
  // ====================================================

  const [moving, setMoving] =
    useState(false);

  const [removing, setRemoving] =
    useState(false);

  // ====================================================
  // PRODUCT ID
  // ====================================================

  const productId =
    product?._id || product?.id;

  // ====================================================
  // PRODUCT IMAGE
  // ====================================================

  const productImage =
    product?.image ||
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    "";

  // ====================================================
  // PRICE
  // ====================================================

  const currentPrice =
    product?.discountPrice ??
    product?.price ??
    0;

  const originalPrice =
    product?.discountPrice != null
      ? product?.price
      : product?.oldPrice;

  // ====================================================
  // REVIEWS COUNT
  // ====================================================

  const reviewsCount =
    product?.ratingsCount ??
    product?.reviewsCount ??
    product?.reviews ??
    0;

  // ====================================================
  // MOVE TO CART
  // ====================================================

  const handleMoveToCart = async () => {
    if (!productId || moving) {
      return;
    }

    try {
      setMoving(true);

      /*
        Wishlist backend route:

        POST
        /api/v1/wishlist/:productId/move-to-cart

        Agar product ke liye size/color mandatory
        nahi hai to quantity enough hai.
      */

      await moveToCart(
        productId,
        {
          quantity: 1,
        }
      );

      /*
        Backend ne cart update kar diya hai.

        CartContext me refreshCart available hai
        to latest backend cart fetch kar lenge.
      */

      if (
        typeof refreshCart ===
        "function"
      ) {
        await refreshCart();
      }
    } catch (error) {
      console.error(
        "Move To Cart Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to move product to cart."
      );
    } finally {
      setMoving(false);
    }
  };

  // ====================================================
  // REMOVE
  // ====================================================

  const handleRemove = async () => {
    if (!productId || removing) {
      return;
    }

    try {
      setRemoving(true);

      await removeFromWishlist(
        productId
      );
    } catch (error) {
      console.error(
        "Remove Wishlist Error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove product from wishlist."
      );
    } finally {
      setRemoving(false);
    }
  };

  // ====================================================
  // COMPONENT
  // ====================================================

  return (
    <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface transition hover:border-accent hover:shadow-xl">

      {/* Product Image */}

      <Link
        to={`/product/${productId}`}
        className="block overflow-hidden"
      >
        {productImage ? (
          <img
            src={productImage}
            alt={
              product?.name ||
              "Product"
            }
            className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center bg-surface-elevated text-sm text-text-muted">
            No Image
          </div>
        )}
      </Link>

      {/* Product Information */}

      <div className="space-y-3 p-5">

        {/* Brand */}

        <p className="text-sm text-text-secondary">
          {product?.brand ||
            "FashionStore"}
        </p>

        {/* Name */}

        <Link
          to={`/product/${productId}`}
          className="block text-lg font-semibold text-text-primary transition hover:text-accent"
        >
          {product?.name ||
            "Product"}
        </Link>

        {/* Price */}

        <div className="flex flex-wrap items-center gap-3">

          <span className="text-xl font-bold text-accent">
            ₹{currentPrice}
          </span>

          {originalPrice &&
            Number(originalPrice) >
              Number(currentPrice) && (
              <span className="text-sm text-text-muted line-through">
                ₹{originalPrice}
              </span>
            )}

        </div>

        {/* Rating */}

        <div className="flex items-center gap-2 text-sm">

          <span className="text-yellow-400">
            ⭐{" "}
            {product?.rating ?? 0}
          </span>

          <span className="text-text-secondary">
            ({reviewsCount})
          </span>

        </div>

        {/* Move To Cart */}

        <button
          type="button"
          onClick={handleMoveToCart}
          disabled={
            moving ||
            removing ||
            !productId
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          <FiShoppingCart />

          {moving
            ? "Moving..."
            : "Move to Cart"}
        </button>

        {/* Remove */}

        <button
          type="button"
          onClick={handleRemove}
          disabled={
            removing ||
            moving ||
            !productId
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 py-3 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiTrash2 />

          {removing
            ? "Removing..."
            : "Remove"}
        </button>

      </div>

    </article>
  );
}

export default WishlistItem;