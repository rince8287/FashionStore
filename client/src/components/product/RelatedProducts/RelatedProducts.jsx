import {
  useEffect,
  useState,
} from "react";

import ProductCard from "../ProductCard/ProductCard";

import {
  getRelatedProducts,
} from "../../../services/productservice";

function RelatedProducts({
  currentProduct,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [
    relatedProducts,
    setRelatedProducts,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // CURRENT PRODUCT ID
  // =========================================================

  const currentProductId =
    currentProduct?._id ||
    currentProduct?.id;

  // =========================================================
  // FETCH RELATED PRODUCTS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchRelatedProducts =
      async () => {
        if (!currentProductId) {
          if (isMounted) {
            setRelatedProducts([]);
            setLoading(false);
          }

          return;
        }

        try {
          setLoading(true);
          setError("");

          const response =
            await getRelatedProducts(
              currentProductId,
              4
            );

          if (!isMounted) {
            return;
          }

          const products =
            Array.isArray(
              response?.products
            )
              ? response.products
              : [];

          setRelatedProducts(
            products.filter(
              (product) =>
                product?._id ||
                product?.id
            )
          );
        } catch (error) {
          if (!isMounted) {
            return;
          }

          console.error(
            "Related Products Error:",
            error
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to load related products.";

          setError(message);
          setRelatedProducts([]);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchRelatedProducts();

    return () => {
      isMounted = false;
    };
  }, [currentProductId]);

  // =========================================================
  // NO CURRENT PRODUCT
  // =========================================================

  if (
    !currentProduct ||
    !currentProductId
  ) {
    return null;
  }

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        border-t
        border-border-subtle
        bg-brand-bg
        py-14
        sm:py-16
        lg:py-20
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9 lg:mb-10">

          <div className="min-w-0">

            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.28em]
                text-accent
                sm:text-xs
              "
            >
              Curated For You
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-text-primary
                sm:text-3xl
                lg:text-4xl
              "
            >
              You May Also Like
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-5
                text-text-secondary
                sm:text-sm
                sm:leading-6
              "
            >
              Explore more styles that
              complement your selection.
            </p>

          </div>

          {/* Product count */}

          {!loading &&
            !error &&
            relatedProducts.length >
              0 && (
              <span
                className="
                  hidden
                  shrink-0
                  rounded-full
                  border
                  border-border-subtle
                  bg-surface
                  px-3
                  py-1.5
                  text-[10px]
                  font-medium
                  text-text-muted
                  sm:block
                "
              >
                {relatedProducts.length}{" "}
                {relatedProducts.length === 1
                  ? "item"
                  : "items"}
              </span>
            )}

        </div>

        {/* ===================================================
            LOADING SKELETON
        =================================================== */}

        {loading && (
          <div
            className="
              grid
              grid-cols-2
              gap-x-3
              gap-y-7
              sm:grid-cols-2
              sm:gap-x-5
              sm:gap-y-9
              lg:grid-cols-3
              lg:gap-x-6
              lg:gap-y-10
              xl:grid-cols-4
              xl:gap-x-6
            "
          >
            {[
              1,
              2,
              3,
              4,
            ].map((item) => (
              <RelatedProductSkeleton
                key={item}
              />
            ))}
          </div>
        )}

        {/* ===================================================
            ERROR STATE
        =================================================== */}

        {!loading && error && (
          <div
            className="
              flex
              min-h-[220px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-red-500/15
              bg-surface
              px-6
              py-10
              text-center
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-red-400
              "
            >
              !
            </div>

            <h3
              className="
                mt-4
                text-base
                font-semibold
                text-text-primary
              "
            >
              Couldn't load recommendations
            </h3>

            <p
              className="
                mt-1.5
                max-w-sm
                text-xs
                leading-5
                text-text-secondary
              "
            >
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setError("");
                setLoading(true);

                // Trigger a fresh effect
                // through a safe fetch.
                const retry =
                  async () => {
                    try {
                      const response =
                        await getRelatedProducts(
                          currentProductId,
                          4
                        );

                      const products =
                        Array.isArray(
                          response?.products
                        )
                          ? response.products
                          : [];

                      setRelatedProducts(
                        products.filter(
                          (product) =>
                            product?._id ||
                            product?.id
                        )
                      );
                    } catch (retryError) {
                      setError(
                        retryError
                          ?.response?.data
                          ?.message ||
                          retryError?.message ||
                          "Failed to load related products."
                      );
                    } finally {
                      setLoading(false);
                    }
                  };

                retry();
              }}
              className="
                mt-5
                rounded-lg
                bg-accent
                px-4
                py-2.5
                text-xs
                font-bold
                text-black
                transition-all
                duration-200
                hover:bg-accent-hover
                active:scale-95
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        {!loading &&
          !error &&
          relatedProducts.length >
            0 && (
            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-7
                sm:grid-cols-2
                sm:gap-x-5
                sm:gap-y-9
                lg:grid-cols-3
                lg:gap-x-6
                lg:gap-y-10
                xl:grid-cols-4
                xl:gap-x-6
                2xl:gap-x-7
              "
            >
              {relatedProducts.map(
                (
                  product,
                  index
                ) => {
                  const productId =
                    product?._id ||
                    product?.id;

                  if (!productId) {
                    return null;
                  }

                  return (
                    <div
                      key={productId}
                      className="
                        min-w-0
                        animate-[relatedReveal_.45s_ease-out_both]
                      "
                      style={{
                        animationDelay: `${Math.min(
                          index * 60,
                          240
                        )}ms`,
                      }}
                    >
                      <ProductCard
                        product={product}
                      />
                    </div>
                  );
                }
              )}
            </div>
          )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!loading &&
          !error &&
          relatedProducts.length ===
            0 && (
            <div
              className="
                flex
                min-h-[220px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-border-subtle
                bg-surface
                px-6
                py-10
                text-center
              "
            >
              <div
                className="
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
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                  />
                  <path d="m20 20-4-4" />
                </svg>
              </div>

              <h3
                className="
                  mt-4
                  text-base
                  font-semibold
                  text-text-primary
                "
              >
                More styles coming soon
              </h3>

              <p
                className="
                  mt-1.5
                  max-w-sm
                  text-xs
                  leading-5
                  text-text-secondary
                "
              >
                We couldn't find similar
                products for this item right
                now.
              </p>
            </div>
          )}

      </div>
    </section>
  );
}

// =============================================================
// RELATED PRODUCT SKELETON
// =============================================================

function RelatedProductSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
      "
    >
      {/* Image */}

      <div
        className="
          aspect-[4/5]
          w-full
          animate-pulse
          bg-surface-elevated
        "
      />

      {/* Content */}

      <div className="space-y-3 p-4">

        <div className="h-2.5 w-20 animate-pulse rounded-full bg-surface-elevated" />

        <div className="space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-surface-elevated" />
          <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-surface-elevated" />
        </div>

        <div className="h-5 w-24 animate-pulse rounded-full bg-surface-elevated" />

        <div className="h-10 w-full animate-pulse rounded-xl bg-surface-elevated" />

      </div>
    </div>
  );
}

export default RelatedProducts;