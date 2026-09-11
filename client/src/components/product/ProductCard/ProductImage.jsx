import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import { useWishlist } from "../../../context/WishlistContext";

function ProductImage({ product }) {
  const {
    toggleWishlist,
    isWishlisted,
    loading,
  } = useWishlist();

  // =========================================================
  // PRODUCT ID
  // =========================================================

  const productId =
    product?._id ||
    product?.id;

  // =========================================================
  // IMAGE
  // =========================================================

  const getProductImage = () => {
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

    if (product?.image) {
      return product.image;
    }

    return "https://placehold.co/600x750?text=FashionStore";
  };

  const imageUrl =
    getProductImage();

  // =========================================================
  // WISHLIST
  // =========================================================

  const wishlisted =
    productId
      ? isWishlisted(productId)
      : false;

  // =========================================================
  // BADGE
  // =========================================================

  const getBadge = () => {
    if (product?.badge) {
      return product.badge;
    }

    if (product?.isNewArrival) {
      return "New";
    }

    if (product?.isTrending) {
      return "Trending";
    }

    if (product?.isFeatured) {
      return "Featured";
    }

    return null;
  };

  const badge =
    getBadge();

  // =========================================================
  // WISHLIST
  // =========================================================

  const handleWishlist = async (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product || !productId) {
      return;
    }

    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error(
        "Wishlist Error:",
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
        relative
        overflow-hidden
        bg-surface-elevated
      "
    >
      {/* BADGE */}

      {badge && (
        <span
          className="
            absolute
            left-3
            top-3
            z-10
            rounded-full
            bg-accent
            px-2.5
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-wide
            text-black
            shadow-lg
            sm:px-3
            sm:text-[10px]
          "
        >
          {badge}
        </span>
      )}

      {/* WISHLIST */}

      <button
        type="button"
        onClick={handleWishlist}
        disabled={loading}
        aria-label={
          wishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        className={`
          absolute
          right-3
          top-3
          z-10
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          backdrop-blur-md
          transition-all
          duration-300
          hover:scale-105
          active:scale-90
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:h-10
          sm:w-10
          ${
            wishlisted
              ? "border-red-500 bg-red-500 text-white"
              : "border-white/20 bg-black/35 text-white hover:border-accent hover:bg-black/55 hover:text-accent"
          }
        `}
      >
        {wishlisted ? (
          <FaHeart size={16} />
        ) : (
          <FiHeart size={17} />
        )}
      </button>

      {/* IMAGE */}

      <div
        className="
          relative
          aspect-[4/4.6]
          w-full
          overflow-hidden
          sm:aspect-[4/4.8]
        "
      >
        <img
          src={imageUrl}
          alt={
            product?.name ||
            "FashionStore Product"
          }
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror =
              null;

            event.currentTarget.src =
              "https://placehold.co/600x750?text=FashionStore";
          }}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.035]
          "
        />

        {/* IMAGE GRADIENT */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-20
            bg-gradient-to-t
            from-black/25
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* VIEW PRODUCT */}

        <span
          className="
            pointer-events-none
            absolute
            bottom-3
            left-1/2
            -translate-x-1/2
            translate-y-2
            whitespace-nowrap
            rounded-full
            bg-black/85
            px-3
            py-1.5
            text-[10px]
            font-semibold
            text-white
            opacity-0
            shadow-xl
            backdrop-blur-md
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
            sm:text-[11px]
          "
        >
          View Product
        </span>
      </div>
    </div>
  );
}

export default ProductImage;