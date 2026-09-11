import { FiStar } from "react-icons/fi";

function ProductInfo({ product }) {
  const rating =
    Number(product?.rating) || 0;

  const ratingsCount =
    Number(
      product?.ratingsCount ??
      product?.reviews
    ) || 0;

  const originalPrice =
    Number(product?.price) || 0;

  const discountPrice =
    product?.discountPrice !== null &&
    product?.discountPrice !== undefined
      ? Number(
          product.discountPrice
        )
      : null;

  const hasDiscount =
    discountPrice !== null &&
    !Number.isNaN(discountPrice) &&
    discountPrice >= 0 &&
    discountPrice < originalPrice;

  const sellingPrice =
    hasDiscount
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

  const formatPrice = (
    price
  ) =>
    Number(price).toLocaleString(
      "en-IN"
    );

  const inStock =
    Number(product?.stock || 0) >
      0 ||
    product?.sizes?.some(
      (item) =>
        Number(item?.stock || 0) >
        0
    );

  return (
    <div
      className="
        min-w-0
        px-3
        pb-3
        pt-3
        sm:px-4
        sm:pb-4
      "
    >
      {/* TOP LINE */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <p
          className="
            min-w-0
            truncate
            text-[9px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-accent
            sm:text-[10px]
          "
        >
          {product?.brand ||
            "FashionStore"}
        </p>

        {product?.isTrending && (
          <span
            className="
              shrink-0
              rounded-full
              bg-accent/10
              px-2
              py-1
              text-[8px]
              font-semibold
              text-accent
              sm:text-[9px]
            "
          >
            ↗ Trending
          </span>
        )}
      </div>

      {/* NAME */}

      <h3
        className="
          mt-2
          line-clamp-1
          text-sm
          font-semibold
          leading-5
          text-text-primary
          sm:text-[15px]
        "
      >
        {product?.name ||
          "Product"}
      </h3>

      {/* RATING */}

      <div
        className="
          mt-2.5
          flex
          items-center
          gap-2
        "
      >
        <div
          className="
            flex
            items-center
            gap-1.5
            rounded-md
            bg-surface-elevated
            px-2
            py-1
          "
        >
          <FiStar
            size={11}
            className="
              fill-accent
              text-accent
            "
          />

          <span
            className="
              text-[10px]
              font-semibold
              text-text-primary
            "
          >
            {rating.toFixed(1)}
          </span>
        </div>

        <span
          className="
            text-[10px]
            text-text-muted
          "
        >
          {ratingsCount}{" "}
          {ratingsCount === 1
            ? "review"
            : "reviews"}
        </span>
      </div>

      {/* PRICE */}

      <div
        className="
          mt-3
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <span
          className="
            text-lg
            font-bold
            tracking-tight
            text-accent
            sm:text-xl
          "
        >
          ₹{formatPrice(
            sellingPrice
          )}
        </span>

        {hasDiscount && (
          <>
            <span
              className="
                text-[10px]
                text-text-muted
                line-through
              "
            >
              ₹{formatPrice(
                originalPrice
              )}
            </span>

            {discountPercentage >
              0 && (
              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-1.5
                  py-0.5
                  text-[8px]
                  font-bold
                  text-green-400
                "
              >
                {discountPercentage}% OFF
              </span>
            )}
          </>
        )}
      </div>

      {/* STOCK */}

      <div className="mt-2.5">
        {inStock ? (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              text-green-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            In Stock
          </span>
        ) : (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              text-[10px]
              font-semibold
              text-red-400
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Out of Stock
          </span>
        )}
      </div>
    </div>
  );
}

export default ProductInfo;