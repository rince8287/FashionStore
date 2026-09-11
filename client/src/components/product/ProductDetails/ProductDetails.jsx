import { useMemo, useState } from "react";
import {
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiCheck,
} from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

function ProductDetails({ product }) {
  const navigate = useNavigate();

  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
    loading: wishlistLoading,
  } = useWishlist();

  // =========================================================
  // PRODUCT ID
  // =========================================================

  const productId =
    product?._id || product?.id;

  // =========================================================
  // SIZES
  // =========================================================

  const sizes = useMemo(() => {
    if (!Array.isArray(product?.sizes)) {
      return [];
    }

    return product.sizes
      .map((item) => {
        if (typeof item === "string") {
          return {
            value: item,
            stock: null,
          };
        }

        return {
          value:
            item?.size ||
            item?.name ||
            "",
          stock:
            item?.stock !== undefined
              ? Number(item.stock)
              : null,
        };
      })
      .filter((item) => item.value);
  }, [product]);

  // =========================================================
  // COLORS
  // =========================================================

  const colors = useMemo(() => {
    if (!Array.isArray(product?.colors)) {
      return [];
    }

    return product.colors
      .map((item) => {
        if (typeof item === "string") {
          return {
            value: item,
            code: null,
          };
        }

        return {
          value:
            item?.name ||
            item?.color ||
            "",
          code:
            item?.code ||
            item?.hex ||
            null,
        };
      })
      .filter((item) => item.value);
  }, [product]);

  // =========================================================
  // STATE
  // =========================================================

  const [selectedSize, setSelectedSize] =
    useState("");

  const [selectedColor, setSelectedColor] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  // =========================================================
  // PRICE
  // =========================================================

  const originalPrice =
    Number(product?.price) || 0;

  const discountPrice =
    product?.discountPrice !== undefined &&
    product?.discountPrice !== null &&
    product?.discountPrice !== ""
      ? Number(product.discountPrice)
      : null;

  const hasDiscount =
    discountPrice !== null &&
    !Number.isNaN(discountPrice) &&
    discountPrice >= 0 &&
    discountPrice < originalPrice;

  const sellingPrice = hasDiscount
    ? discountPrice
    : originalPrice;

  const discountPercentage =
    hasDiscount &&
    originalPrice > 0
      ? Math.round(
          ((originalPrice -
            discountPrice) /
            originalPrice) *
            100
        )
      : 0;

  // =========================================================
  // RATING
  // =========================================================

  const rating =
    Number(product?.rating) || 0;

  const ratingsCount =
    Number(
      product?.ratingsCount ??
        product?.reviews
    ) || 0;

  // =========================================================
  // STOCK
  // =========================================================

  const totalStock =
    Number(product?.stock) || 0;

  const variantStock =
    sizes.reduce(
      (total, item) =>
        total +
        (typeof item.stock ===
        "number"
          ? item.stock
          : 0),
      0
    );

  const hasSizeStockData =
    sizes.some(
      (item) =>
        typeof item.stock ===
        "number"
    );

  const inStock =
    totalStock > 0 ||
    (hasSizeStockData &&
      variantStock > 0);

  // =========================================================
  // SELECTED SIZE STOCK
  // =========================================================

  const selectedSizeData =
    sizes.find(
      (item) =>
        item.value === selectedSize
    );

  const selectedSizeOutOfStock =
    selectedSizeData &&
    typeof selectedSizeData.stock ===
      "number" &&
    selectedSizeData.stock <= 0;

  // =========================================================
  // WISHLIST
  // =========================================================

  const wishlisted = productId
    ? isWishlisted(productId)
    : false;

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice = (price) =>
    Number(price).toLocaleString(
      "en-IN"
    );

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateSelection = () => {
    if (
      sizes.length > 0 &&
      !selectedSize
    ) {
      alert("Please select a size.");
      return false;
    }

    if (selectedSizeOutOfStock) {
      alert(
        "Selected size is out of stock."
      );
      return false;
    }

    if (
      colors.length > 0 &&
      !selectedColor
    ) {
      alert(
        "Please select a color."
      );
      return false;
    }

    return true;
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    if (!product || !productId) {
      return false;
    }

    if (!inStock) {
      alert(
        "This product is out of stock."
      );
      return false;
    }

    if (!validateSelection()) {
      return false;
    }

    try {
      await addToCart(
        {
          ...product,
          selectedSize,
          selectedColor,
        },
        quantity
      );

      return true;
    } catch (error) {
      console.error(
        "Add To Cart Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add product to cart."
      );

      return false;
    }
  };

  // =========================================================
  // BUY NOW
  // =========================================================

  const handleBuyNow = async () => {
    const success =
      await handleAddToCart();

    if (success) {
      navigate("/checkout");
    }
  };

  // =========================================================
  // WISHLIST
  // =========================================================

  const handleWishlist = async () => {
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

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update wishlist."
      );
    }
  };

  // =========================================================
  // QUANTITY
  // =========================================================

  const increaseQuantity = () => {
    let maxStock = totalStock;

    if (
      selectedSizeData &&
      typeof selectedSizeData.stock ===
        "number"
    ) {
      maxStock =
        selectedSizeData.stock;
    }

    if (
      maxStock > 0 &&
      quantity >= maxStock
    ) {
      return;
    }

    setQuantity(
      (prev) => prev + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity(
      (prev) =>
        Math.max(1, prev - 1)
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full">

      <div className="space-y-6">

        {/* =================================================
            BRAND
        ================================================= */}

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-accent">
            {product?.brand ||
              "FashionStore"}
          </p>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-tight text-text-primary sm:text-4xl xl:text-[46px]">
            {product?.name ||
              "Product"}
          </h1>

          {product?.shortDescription && (
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* =================================================
            RATING
        ================================================= */}

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-1.5">
            <FaStar className="text-sm text-accent" />

            <span className="text-sm font-semibold text-text-primary">
              {rating.toFixed(1)}
            </span>
          </div>

          <span className="h-4 w-px bg-border-subtle" />

          <span className="text-sm text-text-secondary">
            {ratingsCount}{" "}
            {ratingsCount === 1
              ? "Review"
              : "Reviews"}
          </span>
        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <span className="text-3xl font-bold text-accent sm:text-4xl">
              ₹
              {formatPrice(
                sellingPrice
              )}
            </span>

            {hasDiscount && (
              <span className="text-base text-text-muted line-through">
                ₹
                {formatPrice(
                  originalPrice
                )}
              </span>
            )}

            {discountPercentage > 0 && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-400">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {hasDiscount && (
            <p className="mt-1.5 text-xs text-text-muted">
              Inclusive of all applicable taxes
            </p>
          )}
        </div>

        {/* =================================================
            STOCK
        ================================================= */}

        <div className="flex items-center gap-2">

          <span
            className={`
              h-2
              w-2
              rounded-full
              ${
                inStock
                  ? "bg-green-400"
                  : "bg-red-400"
              }
            `}
          />

          <span
            className={`
              text-sm
              font-medium
              ${
                inStock
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >
            {inStock
              ? "In Stock"
              : "Out of Stock"}
          </span>
        </div>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="h-px bg-border-subtle" />

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div>
          <h2 className="mb-2 text-sm font-semibold text-text-primary">
            Description
          </h2>

          <p className="text-sm leading-6 text-text-secondary">
            {product?.description ||
              "Product description is not available."}
          </p>
        </div>

        {/* =================================================
            SIZE
        ================================================= */}

        {sizes.length > 0 && (
          <div>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                Select Size
              </h3>

              <span className="text-xs text-accent">
                Required
              </span>
            </div>

            <div className="flex flex-wrap gap-2">

              {sizes.map((item) => {
                const outOfStock =
                  typeof item.stock ===
                    "number" &&
                  item.stock <= 0;

                const selected =
                  selectedSize ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={
                      outOfStock
                    }
                    onClick={() => {
                      setSelectedSize(
                        item.value
                      );
                      setQuantity(1);
                    }}
                    className={`
                      flex
                      h-11
                      min-w-12
                      items-center
                      justify-center
                      rounded-lg
                      border
                      px-4
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      active:scale-95
                      ${
                        selected
                          ? "border-accent bg-accent text-black"
                          : "border-border-subtle bg-transparent text-text-primary hover:border-accent hover:text-accent"
                      }
                      ${
                        outOfStock
                          ? "cursor-not-allowed opacity-30 line-through"
                          : ""
                      }
                    `}
                  >
                    {selected && (
                      <FiCheck
                        size={13}
                        className="mr-1.5"
                      />
                    )}

                    {item.value}
                  </button>
                );
              })}

            </div>
          </div>
        )}

        {/* =================================================
            COLOR
        ================================================= */}

        {colors.length > 0 && (
          <div>

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">
                Select Color
              </h3>

              {selectedColor && (
                <span className="text-xs text-text-secondary">
                  {selectedColor}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">

              {colors.map((item) => {
                const selected =
                  selectedColor ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setSelectedColor(
                        item.value
                      )
                    }
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      px-3.5
                      py-2.5
                      text-sm
                      transition-all
                      duration-200
                      active:scale-95
                      ${
                        selected
                          ? "border-accent bg-accent text-black"
                          : "border-border-subtle text-text-primary hover:border-accent hover:text-accent"
                      }
                    `}
                  >
                    {item.code && (
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            item.code,
                        }}
                      />
                    )}

                    {item.value}

                    {selected && (
                      <FiCheck size={13} />
                    )}
                  </button>
                );
              })}

            </div>
          </div>
        )}

        {/* =================================================
            QUANTITY
        ================================================= */}

        {inStock && (
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-text-primary">
                Quantity
              </p>

              <p className="mt-0.5 text-xs text-text-muted">
                Select quantity
              </p>
            </div>

            <div className="flex h-11 items-center overflow-hidden rounded-lg border border-border-subtle">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
                className="flex h-full w-10 items-center justify-center text-text-secondary transition hover:bg-surface-elevated hover:text-accent disabled:opacity-30"
              >
                <FiMinus size={15} />
              </button>

              <span className="flex h-full min-w-11 items-center justify-center border-x border-border-subtle text-sm font-semibold text-text-primary">
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                className="flex h-full w-10 items-center justify-center text-text-secondary transition hover:bg-surface-elevated hover:text-accent"
              >
                <FiPlus size={15} />
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="space-y-2.5">

          {/* ADD CART + WISHLIST */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={
                handleAddToCart
              }
              disabled={
                !inStock ||
                cartLoading
              }
              className="
                group
                flex
                h-14
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-accent
                px-5
                text-sm
                font-bold
                text-black
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-accent-hover
                hover:shadow-[0_12px_30px_rgba(212,175,55,0.15)]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <FiShoppingBag
                size={18}
              />

              {cartLoading
                ? "Adding..."
                : inStock
                ? "Add To Cart"
                : "Out of Stock"}
            </button>

            <button
              type="button"
              onClick={
                handleWishlist
              }
              disabled={
                wishlistLoading
              }
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className={`
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                transition-all
                duration-300
                active:scale-90
                ${
                  wishlisted
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-accent text-accent hover:bg-accent hover:text-black"
                }
              `}
            >
              {wishlisted ? (
                <FaHeart size={18} />
              ) : (
                <FiHeart size={20} />
              )}
            </button>

          </div>

          {/* BUY NOW */}

          <button
            type="button"
            onClick={
              handleBuyNow
            }
            disabled={
              !inStock ||
              cartLoading
            }
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white
              text-sm
              font-bold
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-100
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {cartLoading
              ? "Please Wait..."
              : "Buy Now"}
          </button>
        </div>

        {/* =================================================
            SERVICE INFO
        ================================================= */}

        <div className="grid grid-cols-3 border-y border-border-subtle py-4">

          <Service
            icon={<FiTruck />}
            title="Delivery"
            text="Fast"
          />

          <Service
            icon={<FiShield />}
            title="Payment"
            text="Secure"
          />

          <Service
            icon={<FiRotateCcw />}
            title="Returns"
            text="Easy"
          />

        </div>

        {/* =================================================
            EXTRA INFO
        ================================================= */}

        {(product?.material ||
          product?.fit ||
          product?.pattern ||
          product?.occasion ||
          product?.countryOfOrigin) && (
          <div>

            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              Product Information
            </h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3">

              {product?.material && (
                <Meta
                  label="Material"
                  value={
                    product.material
                  }
                />
              )}

              {product?.fit && (
                <Meta
                  label="Fit"
                  value={product.fit}
                />
              )}

              {product?.pattern && (
                <Meta
                  label="Pattern"
                  value={
                    product.pattern
                  }
                />
              )}

              {product?.occasion && (
                <Meta
                  label="Occasion"
                  value={
                    product.occasion
                  }
                />
              )}

              {product?.countryOfOrigin && (
                <Meta
                  label="Country"
                  value={
                    product.countryOfOrigin
                  }
                />
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// =============================================================
// SERVICE
// =============================================================

function Service({
  icon,
  title,
  text,
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">

      <div className="text-accent">
        {icon}
      </div>

      <p className="text-[11px] font-semibold text-text-primary">
        {title}
      </p>

      <p className="text-[10px] text-text-muted">
        {text}
      </p>

    </div>
  );
}

// =============================================================
// META
// =============================================================

function Meta({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-muted">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}

export default ProductDetails;