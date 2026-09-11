import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  FiArrowRight,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";

import { useFilter } from "../../../context/FilterContext";


// ==========================================================
// TRENDING SEARCHES
// ==========================================================

const trendingSearches = [
  "Summer Dresses",
  "Linen Shirts",
  "Co-ords",
  "Evening Wear",
  "Accessories",
];


// ==========================================================
// SAFE HELPERS
// ==========================================================

const getProductId = (product) => {
  return product?._id || product?.id || "";
};


// ----------------------------------------------------------
// IMAGE
// ----------------------------------------------------------

const getProductImage = (product) => {
  return (
    product?.images?.[0]?.url ||
    product?.images?.[0] ||
    product?.image ||
    product?.thumbnail ||
    ""
  );
};


// ----------------------------------------------------------
// BRAND
// ----------------------------------------------------------

const getBrandName = (product) => {
  const brand = product?.brand;

  if (!brand) {
    return "";
  }

  if (typeof brand === "string") {
    return brand;
  }

  if (typeof brand === "object") {
    return (
      brand.name ||
      brand.title ||
      ""
    );
  }

  return "";
};


// ----------------------------------------------------------
// CATEGORY
// ----------------------------------------------------------

const getCategoryName = (product) => {
  const category = product?.category;

  if (!category) {
    return "";
  }

  if (typeof category === "string") {
    return category;
  }

  if (typeof category === "object") {
    return (
      category.name ||
      category.title ||
      ""
    );
  }

  return "";
};


// ----------------------------------------------------------
// PRICE
// ----------------------------------------------------------

const getProductPrice = (product) => {
  const discountPrice =
    product?.discountPrice;

  const originalPrice =
    product?.price;

  if (
    discountPrice !== null &&
    discountPrice !== undefined &&
    Number(discountPrice) >= 0 &&
    Number(discountPrice) <
      Number(originalPrice)
  ) {
    return Number(discountPrice);
  }

  return Number(originalPrice) || 0;
};


// ----------------------------------------------------------
// DISCOUNT
// ----------------------------------------------------------

const hasProductDiscount = (product) => {
  return (
    product?.discountPrice !== null &&
    product?.discountPrice !== undefined &&
    Number(product.discountPrice) <
      Number(product.price)
  );
};


// ----------------------------------------------------------
// PRICE FORMAT
// ----------------------------------------------------------

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString(
    "en-IN"
  );
};


// ==========================================================
// COMPONENT
// ==========================================================

function SearchOverlay({
  isOpen,
  onClose,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filteredProducts = [],
  } = useFilter();

  const searchInputRef =
    useRef(null);


  // ========================================================
  // OPEN EFFECT
  // ========================================================

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const timer =
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.clearTimeout(timer);

      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isOpen]);


  // ========================================================
  // CLOSE
  // ========================================================

  const handleClose = () => {
    setSearchQuery("");
    onClose?.();
  };


  // ========================================================
  // TRENDING SEARCH
  // ========================================================

  const handleTrendingSearch = (
    searchTerm
  ) => {
    setSearchQuery(searchTerm);

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };


  // ========================================================
  // CLEAR
  // ========================================================

  const handleClearSearch = () => {
    setSearchQuery("");

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };


  // ========================================================
  // CLOSED
  // ========================================================

  if (!isOpen) {
    return null;
  }


  // ========================================================
  // SAFE PRODUCTS
  // ========================================================

  const products = Array.isArray(
    filteredProducts
  )
    ? filteredProducts
    : [];

  const visibleProducts =
    products.slice(0, 6);

  const hasSearch =
    searchQuery.trim().length > 0;


  // ========================================================
  // UI
  // ========================================================

  return (
    <div className="fixed inset-0 z-[70]">

      {/* ==================================================
          BACKDROP
      ================================================== */}

      <button
        type="button"
        onClick={handleClose}
        aria-label="Close search"
        className="
          absolute
          inset-0
          h-full
          w-full
          bg-black/70
          backdrop-blur-md
          animate-[fadeIn_200ms_ease-out]
        "
      />


      {/* ==================================================
          MAIN SEARCH PANEL
      ================================================== */}

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        className="
          relative
          mx-auto
          flex
          max-h-[92dvh]
          w-full
          flex-col
          overflow-hidden
          border-b
          border-border-subtle
          bg-surface
          shadow-2xl
          animate-[slideDown_250ms_ease-out]

          sm:mt-3
          sm:max-w-[1100px]
          sm:rounded-3xl
          sm:border
        "
      >

        {/* Top Accent */}

        <div
          className="
            h-[2px]
            w-full
            shrink-0
            bg-gradient-to-r
            from-transparent
            via-accent
            to-transparent
          "
        />


        {/* ==================================================
            SEARCH HEADER
        ================================================== */}

        <div
          className="
            shrink-0
            border-b
            border-border-subtle
            px-4
            py-4
            sm:px-6
            sm:py-5
            lg:px-8
          "
        >

          <div className="flex items-center gap-3">

            {/* Search Input */}

            <div
              className="
                group
                relative
                flex
                min-h-12
                flex-1
                items-center
                rounded-2xl
                border
                border-border-subtle
                bg-brand-bg
                px-4
                transition-all
                duration-300
                focus-within:border-accent
                focus-within:ring-4
                focus-within:ring-accent/10
                sm:min-h-14
              "
            >

              <FiSearch
                size={20}
                className="
                  shrink-0
                  text-text-muted
                  transition-colors
                  group-focus-within:text-accent
                "
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search products, brands, styles..."
                autoComplete="off"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  px-3
                  text-sm
                  text-text-primary
                  outline-none
                  placeholder:text-text-muted
                  sm:text-base
                "
              />


              {/* Clear */}

              {hasSearch && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  aria-label="Clear search"
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    text-text-muted
                    transition
                    hover:bg-surface-elevated
                    hover:text-text-primary
                  "
                >
                  <FiX size={16} />
                </button>
              )}

            </div>


            {/* Close */}

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close search"
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-border-subtle
                bg-brand-bg
                text-text-secondary
                transition-all
                duration-300
                hover:border-accent
                hover:bg-accent-soft
                hover:text-accent
                active:scale-95
                sm:h-14
                sm:w-14
              "
            >
              <FiX size={22} />
            </button>

          </div>


          {/* Hint */}

          <p className="mt-3 text-xs text-text-muted">
            {hasSearch
              ? `${visibleProducts.length} result${
                  visibleProducts.length === 1
                    ? ""
                    : "s"
                } found`
              : "Discover your next favourite piece"}
          </p>

        </div>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            py-6
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              SEARCH RESULTS
          ================================================= */}

          {hasSearch ? (

            <div>

              <div className="flex items-end justify-between gap-4">

                <div>

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.3em]
                      text-accent
                      sm:text-xs
                    "
                  >
                    Search Results
                  </p>

                  <h2
                    className="
                      mt-2
                      text-xl
                      font-semibold
                      text-text-primary
                      sm:text-2xl
                    "
                  >
                    Results for{" "}
                    <span className="text-accent">
                      "{searchQuery}"
                    </span>
                  </h2>

                </div>


                {visibleProducts.length > 0 && (
                  <Link
                    to={`/shop?search=${encodeURIComponent(
                      searchQuery.trim()
                    )}`}
                    onClick={handleClose}
                    className="
                      hidden
                      items-center
                      gap-1
                      text-xs
                      font-semibold
                      text-text-secondary
                      transition
                      hover:text-accent
                      sm:flex
                    "
                  >
                    View All
                    <FiArrowRight size={14} />
                  </Link>
                )}

              </div>


              {/* =================================================
                  PRODUCTS
              ================================================= */}

              {visibleProducts.length > 0 ? (

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    gap-3
                    md:grid-cols-2
                  "
                >

                  {visibleProducts.map(
                    (product, index) => {

                      const productId =
                        getProductId(
                          product
                        );

                      const image =
                        getProductImage(
                          product
                        );

                      const brand =
                        getBrandName(
                          product
                        );

                      const category =
                        getCategoryName(
                          product
                        );

                      const price =
                        getProductPrice(
                          product
                        );

                      const discounted =
                        hasProductDiscount(
                          product
                        );

                      const rating =
                        Number(
                          product?.rating
                        ) || 0;


                      return (
                        <Link
                          key={
                            productId ||
                            `${product?.name}-${index}`
                          }
                          to={
                            productId
                              ? `/product/${productId}`
                              : "/shop"
                          }
                          onClick={
                            handleClose
                          }
                          className="
                            group
                            flex
                            min-w-0
                            gap-3
                            rounded-2xl
                            border
                            border-border-subtle
                            bg-brand-bg
                            p-2.5
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            hover:border-accent/50
                            hover:bg-surface-elevated
                            hover:shadow-lg
                          "
                        >

                          {/* Image */}

                          <div
                            className="
                              relative
                              h-[92px]
                              w-[76px]
                              shrink-0
                              overflow-hidden
                              rounded-xl
                              bg-surface-elevated
                              sm:h-[104px]
                              sm:w-[86px]
                            "
                          >

                            {image ? (

                              <img
                                src={image}
                                alt={
                                  product?.name ||
                                  "Product"
                                }
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                  transition-transform
                                  duration-500
                                  group-hover:scale-105
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
                                  text-xs
                                  text-text-muted
                                "
                              >
                                No Image
                              </div>

                            )}


                            {discounted && (
                              <span
                                className="
                                  absolute
                                  left-1.5
                                  top-1.5
                                  rounded-md
                                  bg-green-500
                                  px-1.5
                                  py-0.5
                                  text-[9px]
                                  font-bold
                                  text-white
                                "
                              >
                                SALE
                              </span>
                            )}

                          </div>


                          {/* Product Info */}

                          <div
                            className="
                              min-w-0
                              flex-1
                              py-1
                            "
                          >

                            {/* Brand */}

                            {brand && (
                              <p
                                className="
                                  truncate
                                  text-[9px]
                                  font-bold
                                  uppercase
                                  tracking-[0.18em]
                                  text-accent
                                "
                              >
                                {brand}
                              </p>
                            )}


                            {/* Name */}

                            <h3
                              className="
                                mt-1
                                line-clamp-2
                                text-sm
                                font-semibold
                                leading-5
                                text-text-primary
                                transition-colors
                                group-hover:text-accent
                              "
                            >
                              {product?.name ||
                                "Product"}
                            </h3>


                            {/* Rating + Category */}

                            <div
                              className="
                                mt-2
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <span
                                className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  rounded-md
                                  bg-accent/10
                                  px-1.5
                                  py-0.5
                                  text-[10px]
                                  font-semibold
                                  text-accent
                                "
                              >
                                <FiStar
                                  size={9}
                                  className="fill-current"
                                />

                                {rating
                                  ? rating.toFixed(1)
                                  : "New"}
                              </span>


                              {/* IMPORTANT:
                                  category object ko
                                  directly render nahi karna
                              */}

                              {category && (
                                <span
                                  className="
                                    truncate
                                    text-[10px]
                                    text-text-muted
                                  "
                                >
                                  {category}
                                </span>
                              )}

                            </div>


                            {/* Price */}

                            <div
                              className="
                                mt-2
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <span
                                className="
                                  text-sm
                                  font-bold
                                  text-accent
                                "
                              >
                                ₹
                                {formatPrice(
                                  price
                                )}
                              </span>


                              {discounted && (
                                <span
                                  className="
                                    text-[10px]
                                    text-text-muted
                                    line-through
                                  "
                                >
                                  ₹
                                  {formatPrice(
                                    product.price
                                  )}
                                </span>
                              )}

                            </div>

                          </div>


                          {/* Arrow */}

                          <div
                            className="
                              hidden
                              self-center
                              pr-1
                              text-text-muted
                              transition-all
                              duration-300
                              group-hover:translate-x-1
                              group-hover:text-accent
                              sm:block
                            "
                          >
                            <FiArrowRight
                              size={17}
                            />
                          </div>

                        </Link>
                      );
                    }
                  )}

                </div>

              ) : (

                /* =================================================
                   NO RESULT
                ================================================= */

                <div
                  className="
                    mt-6
                    rounded-3xl
                    border
                    border-dashed
                    border-border-subtle
                    bg-brand-bg
                    px-6
                    py-14
                    text-center
                  "
                >

                  <div
                    className="
                      mx-auto
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-2xl
                      bg-surface-elevated
                      text-text-muted
                    "
                  >
                    <FiSearch size={26} />
                  </div>


                  <h3
                    className="
                      mt-5
                      text-lg
                      font-semibold
                      text-text-primary
                    "
                  >
                    No products found
                  </h3>


                  <p
                    className="
                      mx-auto
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-text-secondary
                    "
                  >
                    We couldn't find anything
                    matching{" "}
                    <span className="font-semibold text-text-primary">
                      "{searchQuery}"
                    </span>
                  </p>


                  <button
                    type="button"
                    onClick={
                      handleClearSearch
                    }
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-accent
                      px-5
                      py-2.5
                      text-sm
                      font-semibold
                      text-accent
                      transition
                      hover:bg-accent
                      hover:text-brand-bg
                    "
                  >
                    Clear Search
                  </button>

                </div>
              )}

            </div>

          ) : (

            /* =================================================
               TRENDING
            ================================================= */

            <div>

              <div
                className="
                  mx-auto
                  max-w-2xl
                  text-center
                "
              >

                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-accent/10
                    text-accent
                  "
                >
                  <FiSearch size={24} />
                </div>


                <p
                  className="
                    mt-5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-accent
                  "
                >
                  Explore Fashion
                </p>


                <h2
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    text-text-primary
                    sm:text-3xl
                  "
                >
                  What are you looking for?
                </h2>


                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-text-secondary
                  "
                >
                  Search our latest collections,
                  trending styles and premium
                  essentials.
                </p>

              </div>


              {/* Trending */}

              <div className="mx-auto mt-8 max-w-3xl">

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <span className="h-px flex-1 bg-border-subtle" />

                  <p
                    className="
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.25em]
                      text-text-muted
                    "
                  >
                    Trending Searches
                  </p>

                  <span className="h-px flex-1 bg-border-subtle" />
                </div>


                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    justify-center
                    gap-2.5
                  "
                >

                  {trendingSearches.map(
                    (searchTerm) => (
                      <button
                        key={searchTerm}
                        type="button"
                        onClick={() =>
                          handleTrendingSearch(
                            searchTerm
                          )
                        }
                        className="
                          rounded-full
                          border
                          border-border-subtle
                          bg-brand-bg
                          px-4
                          py-2.5
                          text-xs
                          font-medium
                          text-text-secondary
                          transition-all
                          duration-300
                          hover:-translate-y-0.5
                          hover:border-accent
                          hover:bg-accent-soft
                          hover:text-accent
                          active:scale-95
                          sm:text-sm
                        "
                      >
                        {searchTerm}
                      </button>
                    )
                  )}

                </div>

              </div>

            </div>
          )}

        </div>

      </section>


      {/* ==================================================
          ANIMATIONS
      ================================================== */}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>

    </div>
  );
}

export default SearchOverlay;