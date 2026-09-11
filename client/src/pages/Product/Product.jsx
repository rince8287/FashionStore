import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import ProductGallery from "../../components/product/ProductGallery/ProductGallery";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import ProductReviews from "../../components/product/ProductReviews/ProductReviews";
import RelatedProducts from "../../components/product/RelatedProducts/RelatedProducts";

import {
  getProductById,
} from "../../services/productservice";

function Product() {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!id) {
        if (isMounted) {
          setProduct(null);
          setError(
            "Product ID is missing."
          );
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getProductById(id);

        if (!isMounted) {
          return;
        }

        const productData =
          response?.product ||
          response?.data ||
          null;

        if (!productData) {
          throw new Error(
            "Product not found."
          );
        }

        setProduct(productData);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Fetch Product Error:",
          err
        );

        setProduct(null);

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load product."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-brand-bg
          text-text-primary
        "
      >
        <ProductPageSkeleton />
      </main>
    );
  }

  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (error || !product) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-brand-bg
          px-4
          py-16
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            px-6
            py-10
            text-center
            shadow-[0_20px_60px_rgba(0,0,0,0.18)]
            sm:px-8
          "
        >
          {/* ICON */}

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-accent-soft
              text-accent
            "
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>

          <p
            className="
              mt-5
              text-[10px]
              font-bold
              uppercase
              tracking-[0.25em]
              text-accent
            "
          >
            FashionStore
          </p>

          <h1
            className="
              mt-2
              text-2xl
              font-bold
              tracking-tight
              text-text-primary
            "
          >
            Product Not Found
          </h1>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-text-secondary
            "
          >
            {error ||
              "The product you're looking for does not exist or may have been removed."}
          </p>

          <Link
            to="/products"
            className="
              mt-6
              inline-flex
              h-11
              items-center
              justify-center
              rounded-xl
              bg-accent
              px-6
              text-sm
              font-bold
              text-black
              transition-all
              duration-300
              hover:bg-accent-hover
              hover:shadow-[0_10px_25px_rgba(212,175,55,0.15)]
              active:scale-95
            "
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================
  // PRODUCT PAGE
  // =========================================================

  return (
    <main
      className="
        min-h-screen
        overflow-x-hidden
        bg-brand-bg
        text-text-primary
      "
    >
      {/* =====================================================
          PRODUCT HERO
      ===================================================== */}

      <section
        className="
          relative
          bg-brand-bg
          pb-10
          pt-5
          sm:pb-14
          sm:pt-7
          lg:pb-16
          lg:pt-8
        "
      >
        {/* Soft background glow */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-[300px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-accent/[0.025]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1280px]
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <nav
            aria-label="Breadcrumb"
            className="
              mb-5
              flex
              items-center
              gap-2
              overflow-hidden
              whitespace-nowrap
              text-[10px]
              font-medium
              text-text-muted
              sm:mb-7
              sm:text-xs
            "
          >
            <Link
              to="/"
              className="
                shrink-0
                transition-colors
                hover:text-accent
              "
            >
              Home
            </Link>

            <span className="text-text-muted/40">
              /
            </span>

            <Link
              to="/products"
              className="
                shrink-0
                transition-colors
                hover:text-accent
              "
            >
              Products
            </Link>

            <span className="text-text-muted/40">
              /
            </span>

            <span className="truncate text-text-secondary">
              {product?.name ||
                "Product"}
            </span>
          </nav>

          {/* =================================================
              PRODUCT LAYOUT
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-7
              md:gap-9
              lg:grid-cols-[minmax(0,1.05fr)_minmax(400px,0.95fr)]
              lg:gap-10
              xl:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)]
              xl:gap-14
            "
          >
            {/* =================================================
                GALLERY
            ================================================= */}

            <div
              className="
                min-w-0
                w-full
                lg:flex
                lg:justify-end
              "
            >
              <div
                className="
                  w-full
                  max-w-[560px]
                  lg:w-full
                "
              >
                <ProductGallery
                  product={product}
                />
              </div>
            </div>

            {/* =================================================
                DETAILS
            ================================================= */}

            <div
              className="
                min-w-0
                w-full
                lg:sticky
                lg:top-24
              "
            >
              <div
                className="
                  w-full
                  max-w-[560px]
                  lg:max-w-none
                "
              >
                <ProductDetails
                  product={product}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <ProductReviews
        product={product}
      />

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}

      <RelatedProducts
        currentProduct={product}
      />
    </main>
  );
}

// =============================================================
// PRODUCT PAGE SKELETON
// =============================================================

function ProductPageSkeleton() {
  return (
    <main
      className="
        min-h-screen
        bg-brand-bg
      "
    >
      <section
        className="
          pb-12
          pt-6
          sm:pb-16
          sm:pt-8
        "
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          {/* BREADCRUMB */}

          <div className="mb-7 flex gap-2">
            <div className="h-3 w-10 animate-pulse rounded-full bg-surface-elevated" />
            <div className="h-3 w-3 animate-pulse rounded-full bg-surface-elevated" />
            <div className="h-3 w-20 animate-pulse rounded-full bg-surface-elevated" />
          </div>

          {/* MAIN */}

          <div
            className="
              grid
              grid-cols-1
              gap-8
              lg:grid-cols-2
              lg:gap-12
            "
          >
            {/* GALLERY */}

            <div className="w-full">
              <div
                className="
                  mx-auto
                  aspect-[4/4.6]
                  w-full
                  max-w-[560px]
                  animate-pulse
                  rounded-2xl
                  bg-surface
                "
              />

              <div className="mt-3 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="
                        aspect-square
                        animate-pulse
                        rounded-xl
                        bg-surface
                      "
                    />
                  )
                )}
              </div>
            </div>

            {/* DETAILS */}

            <div
              className="
                w-full
                max-w-[560px]
                space-y-5
                lg:pt-4
              "
            >
              <div className="h-3 w-24 animate-pulse rounded-full bg-surface" />

              <div className="h-10 w-3/4 animate-pulse rounded-lg bg-surface" />

              <div className="h-4 w-1/2 animate-pulse rounded-full bg-surface" />

              <div className="h-5 w-36 animate-pulse rounded-full bg-surface" />

              <div className="h-10 w-40 animate-pulse rounded-lg bg-surface" />

              <div className="h-px w-full bg-border-subtle" />

              <div className="space-y-3">
                <div className="h-3 w-24 animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-full animate-pulse rounded-full bg-surface" />
                <div className="h-4 w-5/6 animate-pulse rounded-full bg-surface" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="h-12 animate-pulse rounded-xl bg-surface" />
                <div className="h-12 animate-pulse rounded-xl bg-surface" />
              </div>

              <div className="h-12 animate-pulse rounded-xl bg-surface" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Product;