// src/components/orders/OrderItemsPreview.jsx

import {
  FiBox,
  FiChevronRight,
  FiShoppingBag,
} from "react-icons/fi";


// ==========================================================
// HELPERS
// ==========================================================

function getProductImage(product) {
  if (
    Array.isArray(product?.images) &&
    product.images.length > 0
  ) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }
  }

  if (
    typeof product?.image === "string" &&
    product.image
  ) {
    return product.image;
  }

  return "/images/placeholder-product.png";
}


function formatPrice(value) {
  const amount = Number(value) || 0;

  return amount.toLocaleString("en-IN");
}


// ==========================================================
// EMPTY STATE
// ==========================================================

function EmptyOrderItems() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-dashed
        border-border-subtle
        bg-brand-bg
        px-6
        py-10
        text-center
      "
    >

      {/* Decorative Glow */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-32
          w-32
          -translate-x-1/2
          rounded-full
          bg-accent/5
          blur-3xl
        "
      />


      {/* Icon */}

      <div
        className="
          relative
          mx-auto
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          text-text-muted
        "
      >
        <FiShoppingBag size={25} />
      </div>


      {/* Content */}

      <h3
        className="
          relative
          mt-4
          text-sm
          font-bold
          text-text-primary
        "
      >
        No Products
      </h3>

      <p
        className="
          relative
          mx-auto
          mt-1.5
          max-w-xs
          text-xs
          leading-5
          text-text-muted
        "
      >
        This order doesn't contain any items.
      </p>

    </div>
  );
}


// ==========================================================
// ITEM CARD
// ==========================================================

function OrderItem({ item, index }) {
  const product = item?.product || item || {};

  const image = getProductImage(product);

  const price =
    item?.price ??
    product?.discountPrice ??
    product?.price ??
    0;

  const quantity =
    Number(item?.quantity) || 1;

  const itemTotal =
    Number(price) * quantity;


  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-brand-bg
        p-3
        transition-all
        duration-300

        hover:border-accent/30
        hover:bg-surface-elevated
        hover:shadow-lg

        sm:p-4
      "
    >

      {/* Subtle Hover Accent */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-0.5
          origin-bottom
          scale-y-0
          bg-accent
          transition-transform
          duration-300
          group-hover:scale-y-100
        "
      />


      <div
        className="
          flex
          items-center
          gap-3
          sm:gap-4
        "
      >

        {/* ==================================================
            PRODUCT IMAGE
        ================================================== */}

        <div
          className="
            relative
            h-[68px]
            w-[68px]
            shrink-0
            overflow-hidden
            rounded-xl
            border
            border-border-subtle
            bg-surface-elevated

            sm:h-20
            sm:w-20
          "
        >

          <img
            src={image}
            alt={product?.name || "Product"}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
            onError={(event) => {
              event.currentTarget.src =
                "/images/placeholder-product.png";
            }}
          />


          {/* Quantity Badge */}

          <span
            className="
              absolute
              bottom-1.5
              right-1.5
              flex
              min-h-5
              min-w-5
              items-center
              justify-center
              rounded-md
              border
              border-white/10
              bg-black/75
              px-1
              text-[10px]
              font-bold
              text-white
              backdrop-blur-sm
            "
          >
            ×{quantity}
          </span>

        </div>


        {/* ==================================================
            PRODUCT INFORMATION
        ================================================== */}

        <div className="min-w-0 flex-1">

          {/* Brand */}

          {product?.brand && (
            <p
              className="
                truncate
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-accent
                sm:text-[11px]
              "
            >
              {product.brand}
            </p>
          )}


          {/* Product Name */}

          <h3
            className="
              mt-1
              line-clamp-1
              text-sm
              font-semibold
              text-text-primary
              transition-colors
              duration-300
              group-hover:text-accent

              sm:text-base
            "
          >
            {product?.name || "Product"}
          </h3>


          {/* Variant Details */}

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              text-[11px]
              text-text-muted
              sm:text-xs
            "
          >

            {item?.size && (
              <span className="inline-flex items-center gap-1">
                Size:
                <strong className="text-text-secondary">
                  {item.size}
                </strong>
              </span>
            )}


            {item?.color && (
              <span className="inline-flex items-center gap-1">
                Color:
                <strong className="text-text-secondary">
                  {item.color}
                </strong>
              </span>
            )}


            <span className="inline-flex items-center gap-1">
              Qty:
              <strong className="text-text-secondary">
                {quantity}
              </strong>
            </span>

          </div>

        </div>


        {/* ==================================================
            PRICE
        ================================================== */}

        <div className="shrink-0 text-right">

          <p
            className="
              text-sm
              font-bold
              text-text-primary
              sm:text-base
            "
          >
            ₹{formatPrice(itemTotal)}
          </p>


          <p
            className="
              mt-1
              hidden
              text-[10px]
              text-text-muted
              sm:block
            "
          >
            ₹{formatPrice(price)} × {quantity}
          </p>

        </div>

      </div>

    </div>
  );
}


// ==========================================================
// MAIN COMPONENT
// ==========================================================

function OrderItemsPreview({
  items = [],
}) {

  // ========================================================
  // SAFE ARRAY
  // ========================================================

  const safeItems = Array.isArray(items)
    ? items
    : [];


  // ========================================================
  // EMPTY
  // ========================================================

  if (!safeItems.length) {
    return <EmptyOrderItems />;
  }


  // ========================================================
  // PREVIEW
  // ========================================================

  const previewItems =
    safeItems.slice(0, 3);


  const remainingItems =
    Math.max(
      safeItems.length -
        previewItems.length,
      0
    );


  // ========================================================
  // TOTAL QUANTITY
  // ========================================================

  const totalQuantity =
    safeItems.reduce(
      (total, item) =>
        total +
        (Number(item?.quantity) || 1),
      0
    );


  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="space-y-3">

      {/* ==================================================
          SECTION HEADER
      ================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >

        <div className="flex items-center gap-2.5">

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-accent/10
              text-accent
            "
          >
            <FiBox size={15} />
          </div>


          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.12em]
                text-text-primary
              "
            >
              Order Items
            </p>

            <p
              className="
                mt-0.5
                text-[11px]
                text-text-muted
              "
            >
              {safeItems.length}{" "}
              {safeItems.length === 1
                ? "product"
                : "products"}
              {" • "}
              {totalQuantity}{" "}
              {totalQuantity === 1
                ? "item"
                : "items"}
            </p>

          </div>

        </div>


        {/* Product Count */}

        <span
          className="
            hidden
            rounded-full
            border
            border-border-subtle
            bg-surface
            px-3
            py-1.5
            text-[10px]
            font-medium
            text-text-muted
            sm:inline-flex
          "
        >
          {safeItems.length}{" "}
          {safeItems.length === 1
            ? "Product"
            : "Products"}
        </span>

      </div>


      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <div className="space-y-2.5">

        {previewItems.map(
          (item, index) => (
            <OrderItem
              key={
                item?._id ||
                item?.id ||
                item?.product?._id ||
                index
              }
              item={item}
              index={index}
            />
          )
        )}

      </div>


      {/* ==================================================
          REMAINING ITEMS
      ================================================== */}

      {remainingItems > 0 && (
        <button
          type="button"
          className="
            group/more
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-accent/15
            bg-accent/5
            px-4
            py-3
            text-xs
            font-semibold
            text-accent
            transition-all
            duration-300

            hover:border-accent/30
            hover:bg-accent/10
          "
        >

          <span>
            +{remainingItems} more{" "}
            {remainingItems === 1
              ? "item"
              : "items"}
          </span>

          <FiChevronRight
            size={14}
            className="
              transition-transform
              duration-300
              group-hover/more:translate-x-1
            "
          />

        </button>
      )}

    </div>
  );
}


export default OrderItemsPreview;