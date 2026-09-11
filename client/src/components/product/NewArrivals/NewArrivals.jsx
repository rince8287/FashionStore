import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import ProductCard from "../ProductCard/ProductCard";

import {
  getNewArrivals,
} from "../../../services/productservice";

function NewArrivals() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH NEW ARRIVALS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchNewArrivals =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getNewArrivals(8);

          if (!isMounted) {
            return;
          }

          const productList =
            Array.isArray(
              response?.products
            )
              ? response.products
              : [];

          // Keep only valid products
          const validProducts =
            productList.filter(
              (product) =>
                product?._id ||
                product?.id
            );

          setProducts(
            validProducts
          );
        } catch (error) {
          if (!isMounted) {
            return;
          }

          console.error(
            "New Arrivals Error:",
            error
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to load new arrivals.";

          setError(message);
          setProducts([]);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchNewArrivals();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // VIEW ALL
  // =========================================================

  const handleViewAll = () => {
    navigate(
      "/products?newArrival=true"
    );
  };

  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <section
      className="
        border-t
        border-border-subtle
        bg-brand-bg
        py-12
        sm:py-14
        lg:py-16
      "
    >
      {/* =====================================================
          COMPACT CONTAINER
      ===================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1180px]
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div
          className="
            mb-7
            flex
            items-end
            justify-between
            gap-5
            sm:mb-8
            lg:mb-9
          "
        >

          {/* LEFT CONTENT */}

          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-accent
                  shadow-[0_0_10px_rgba(212,175,55,0.45)]
                "
              />

              <p
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-accent
                  sm:text-xs
                "
              >
                New Collection
              </p>

            </div>

            <h2
              className="
                mt-2
                text-2xl
                font-bold
                tracking-tight
                text-text-primary
                sm:text-3xl
              "
            >
              New Arrivals
            </h2>

            <p
              className="
                mt-1.5
                max-w-lg
                text-xs
                leading-5
                text-text-secondary
                sm:text-sm
              "
            >
              Fresh styles and the latest
              additions to our collection.
            </p>

          </div>

          {/* =================================================
              VIEW ALL
          ================================================= */}

          <button
            type="button"
            onClick={handleViewAll}
            className="
              group
              flex
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-border-subtle
              bg-surface
              px-3
              py-2
              text-[10px]
              font-semibold
              text-text-secondary
              transition-all
              duration-300
              hover:border-accent
              hover:bg-accent
              hover:text-black
              active:scale-95
              sm:px-4
              sm:py-2.5
              sm:text-xs
            "
          >
            View All

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            >
              →
            </span>
          </button>

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
              gap-y-6
              sm:grid-cols-3
              sm:gap-x-4
              sm:gap-y-7
              lg:grid-cols-4
              lg:gap-x-5
              lg:gap-y-8
            "
          >
            {[
              1,
              2,
              3,
              4,
            ].map((item) => (
              <NewArrivalSkeleton
                key={item}
              />
            ))}
          </div>
        )}

        {/* ===================================================
            ERROR
        =================================================== */}

        {!loading && error && (
          <div
            className="
              flex
              min-h-[190px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-red-500/15
              bg-surface
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-sm
                font-bold
                text-red-400
              "
            >
              !
            </div>

            <h3
              className="
                mt-3
                text-sm
                font-semibold
                text-text-primary
              "
            >
              Unable to load new arrivals
            </h3>

            <p
              className="
                mt-1
                max-w-sm
                text-xs
                leading-5
                text-text-muted
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* ===================================================
            PRODUCTS
        =================================================== */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div
              className="
                grid
                grid-cols-2
                gap-x-3
                gap-y-6
                sm:grid-cols-3
                sm:gap-x-4
                sm:gap-y-7
                lg:grid-cols-4
                lg:gap-x-5
                lg:gap-y-8
              "
            >
              {products.map(
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
                        animate-[newArrivalReveal_.45s_ease-out_both]
                      "
                      style={{
                        animationDelay: `${Math.min(
                          index * 45,
                          315
                        )}ms`,
                      }}
                    >
                      <ProductCard
                        product={
                          product
                        }
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
          products.length === 0 && (
            <div
              className="
                flex
                min-h-[190px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-border-subtle
                bg-surface
                px-6
                text-center
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-accent-soft
                  text-accent
                "
              >
                <span className="text-lg">
                  ✦
                </span>
              </div>

              <h3
                className="
                  mt-3
                  text-sm
                  font-semibold
                  text-text-primary
                "
              >
                No new arrivals yet
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-text-muted
                "
              >
                New styles will appear here
                soon.
              </p>
            </div>
          )}

      </div>
    </section>
  );
}

// =============================================================
// SKELETON
// =============================================================

function NewArrivalSkeleton() {
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
      {/* IMAGE */}

      <div
        className="
          aspect-[4/5]
          w-full
          animate-pulse
          bg-surface-elevated
        "
      />

      {/* CONTENT */}

      <div className="space-y-3 p-3.5 sm:p-4">

        <div
          className="
            h-2.5
            w-16
            animate-pulse
            rounded-full
            bg-surface-elevated
          "
        />

        <div className="space-y-2">

          <div
            className="
              h-3.5
              w-full
              animate-pulse
              rounded-full
              bg-surface-elevated
            "
          />

          <div
            className="
              h-3.5
              w-3/5
              animate-pulse
              rounded-full
              bg-surface-elevated
            "
          />

        </div>

        <div
          className="
            h-5
            w-20
            animate-pulse
            rounded-full
            bg-surface-elevated
          "
        />

        <div
          className="
            h-9
            w-full
            animate-pulse
            rounded-lg
            bg-surface-elevated
          "
        />

      </div>
    </div>
  );
}

export default NewArrivals;