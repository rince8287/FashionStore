// src/components/orders/OrdersSkeleton.jsx


// ==========================================================
// SKELETON BLOCK
// ==========================================================

function SkeletonBlock({
  className = "",
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-lg
        bg-surface-elevated
        ${className}
      `}
    >
      {/* Shimmer */}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          -translate-x-full
          animate-[skeleton-shimmer_1.8s_infinite]
          bg-gradient-to-r
          from-transparent
          via-white/[0.04]
          to-transparent
        "
      />
    </div>
  );
}


// ==========================================================
// PRODUCT SKELETON
// ==========================================================

function ProductSkeleton() {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-border-subtle
        bg-brand-bg
        p-3

        sm:gap-4
        sm:p-4
      "
    >

      {/* Image */}

      <SkeletonBlock
        className="
          h-[68px]
          w-[68px]
          shrink-0
          rounded-xl

          sm:h-20
          sm:w-20
        "
      />


      {/* Product Information */}

      <div className="min-w-0 flex-1 space-y-2.5">

        {/* Brand */}

        <SkeletonBlock
          className="h-2.5 w-20 rounded-full"
        />

        {/* Product Name */}

        <SkeletonBlock
          className="
            h-4
            w-3/4
            max-w-[260px]
          "
        />

        {/* Variant */}

        <SkeletonBlock
          className="h-3 w-2/3 max-w-[180px]"
        />

      </div>


      {/* Price */}

      <div className="shrink-0">

        <SkeletonBlock
          className="h-5 w-20 sm:w-24"
        />

        <SkeletonBlock
          className="
            mt-2
            hidden
            h-2.5
            w-16
            sm:block
          "
        />

      </div>

    </div>
  );
}


// ==========================================================
// ORDER CARD SKELETON
// ==========================================================

function SkeletonCard() {
  return (
    <article
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        p-5
        shadow-sm

        sm:p-6
      "
    >

      {/* ====================================================
          TOP SHIMMER LINE
      ==================================================== */}

      <div
        aria-hidden="true"
        className="
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-accent/20
          to-transparent
        "
      />


      {/* ====================================================
          HEADER
      ==================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4

          lg:flex-row
          lg:items-start
          lg:justify-between
        "
      >

        {/* Order Info */}

        <div className="space-y-3">

          {/* Order ID */}

          <div className="flex items-center gap-2">

            <SkeletonBlock
              className="h-4 w-4 rounded-full"
            />

            <SkeletonBlock
              className="h-3.5 w-20"
            />

            <SkeletonBlock
              className="h-3.5 w-32"
            />

          </div>


          {/* Date */}

          <div className="flex items-center gap-2">

            <SkeletonBlock
              className="h-4 w-4 rounded-full"
            />

            <SkeletonBlock
              className="h-3.5 w-28"
            />

          </div>

        </div>


        {/* Status */}

        <SkeletonBlock
          className="
            h-8
            w-28
            rounded-full
          "
        />

      </div>


      {/* ====================================================
          PRODUCTS
      ==================================================== */}

      <div className="mt-6 space-y-2.5">

        {/* Section Heading */}

        <div className="flex items-center gap-2.5">

          <SkeletonBlock
            className="h-8 w-8 rounded-lg"
          />

          <div className="space-y-1.5">

            <SkeletonBlock
              className="h-3 w-20"
            />

            <SkeletonBlock
              className="h-2.5 w-28"
            />

          </div>

        </div>


        <ProductSkeleton />

        <ProductSkeleton />

      </div>


      {/* ====================================================
          PAYMENT
      ==================================================== */}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-4
          border-y
          border-border-subtle
          py-5

          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* Payment Badges */}

        <div className="flex flex-wrap gap-2">

          <SkeletonBlock
            className="h-8 w-32 rounded-full"
          />

          <SkeletonBlock
            className="h-8 w-28 rounded-full"
          />

        </div>


        {/* Amount */}

        <div
          className="
            space-y-2

            lg:text-right
          "
        >

          <SkeletonBlock
            className="
              h-3
              w-20

              lg:ml-auto
            "
          />

          <SkeletonBlock
            className="
              h-7
              w-32

              lg:ml-auto
            "
          />

        </div>

      </div>


      {/* ====================================================
          DELIVERY ADDRESS
      ==================================================== */}

      <div className="mt-6 space-y-3">

        {/* Heading */}

        <SkeletonBlock
          className="h-4 w-32"
        />


        {/* Address */}

        <div className="space-y-2">

          <SkeletonBlock
            className="h-3 w-full max-w-xl"
          />

          <SkeletonBlock
            className="h-3 w-5/6 max-w-lg"
          />

          <SkeletonBlock
            className="h-3 w-2/3 max-w-md"
          />

        </div>

      </div>


      {/* ====================================================
          ACTIONS
      ==================================================== */}

      <div
        className="
          mt-7
          flex
          flex-wrap
          gap-2.5

          sm:gap-3
        "
      >

        <SkeletonBlock
          className="h-10 w-32 rounded-lg"
        />

        <SkeletonBlock
          className="h-10 w-32 rounded-lg"
        />

        <SkeletonBlock
          className="h-10 w-32 rounded-lg"
        />

      </div>

    </article>
  );
}


// ==========================================================
// ORDERS SKELETON
// ==========================================================

function OrdersSkeleton({
  count = 3,
}) {

  const safeCount = Math.max(
    1,
    Number(count) || 3
  );


  return (
    <div
      className="
        space-y-5

        sm:space-y-6
      "
      aria-label="Loading orders"
      aria-busy="true"
    >

      {Array.from({
        length: safeCount,
      }).map((_, index) => (
        <SkeletonCard
          key={index}
        />
      ))}

    </div>
  );
}


export default OrdersSkeleton;