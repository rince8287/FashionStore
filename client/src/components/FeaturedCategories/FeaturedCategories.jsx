import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiLayers,
  FiRefreshCw,
} from "react-icons/fi";

import CategoryCard from "./CategoryCard";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/categories`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch categories."
          );
        }

        const categoryList = Array.isArray(data)
          ? data
          : Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data?.data)
              ? data.data
              : [];

        if (isMounted) {
          setCategories(categoryList);
        }
      } catch (err) {
        console.error(
          "Fetch Categories Error:",
          err
        );

        if (isMounted) {
          setError(
            err?.message ||
              "Failed to load categories."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section className="bg-brand-bg py-10 sm:py-12 lg:py-14">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto h-3 w-28 animate-pulse rounded-full bg-surface-elevated" />

            <div className="mx-auto mt-4 h-8 w-64 animate-pulse rounded-lg bg-surface-elevated sm:h-9 sm:w-80" />

            <div className="mx-auto mt-3 h-3 w-full max-w-md animate-pulse rounded-full bg-surface-elevated" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
              >
                <div className="aspect-[1/1.08] animate-pulse bg-surface-elevated" />

                <div className="space-y-2 p-4">
                  <div className="h-3 w-2/3 animate-pulse rounded-full bg-surface-elevated" />

                  <div className="h-2 w-full animate-pulse rounded-full bg-surface-elevated" />

                  <div className="h-2 w-1/2 animate-pulse rounded-full bg-surface-elevated" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <section className="bg-brand-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[220px] w-full max-w-[1280px] items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-surface p-6 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <FiRefreshCw size={18} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-text-primary">
              Unable to load categories
            </h3>

            <p className="mt-2 text-xs leading-5 text-text-secondary">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN COMPONENT
  // =========================================================

  return (
    <section className="relative overflow-hidden bg-brand-bg py-11 sm:py-13 lg:py-15">

      {/* SUBTLE BACKGROUND GLOW */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-52
          w-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-accent/5
          blur-3xl
        "
      />

      {/* CONTAINER */}

      <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mx-auto max-w-[680px] text-center">

          {/* EYEBROW */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-accent/15
              bg-accent-soft
              px-3
              py-1.5
            "
          >
            <FiLayers
              size={11}
              className="text-accent"
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-accent
                sm:text-[10px]
              "
            >
              Shop by Category
            </span>
          </div>

          {/* HEADING */}

          <h2
            className="
              mt-3
              font-display
              text-2xl
              font-semibold
              tracking-tight
              text-text-primary
              sm:text-3xl
              lg:text-4xl
            "
          >
            Find Your Perfect Style
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mt-2.5
              max-w-[570px]
              text-xs
              leading-5
              text-text-secondary
              sm:text-sm
              sm:leading-6
            "
          >
            Explore carefully curated collections designed
            for every occasion, from timeless essentials to
            modern trends.
          </p>
        </div>

        {/* CATEGORY GRID */}

        {categories.length > 0 ? (
          <div
            className="
              mt-8
              grid
              grid-cols-2
              gap-3
              sm:mt-9
              sm:grid-cols-3
              sm:gap-4
              lg:mt-10
              lg:grid-cols-4
              xl:grid-cols-5
              xl:gap-5
            "
          >
            {categories.map((category, index) => (
              <div
                key={
                  category?._id ||
                  category?.id ||
                  category?.slug ||
                  index
                }
                className="category-card-animation"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-dashed border-border-subtle bg-surface px-6 py-10 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <FiLayers size={19} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-text-primary">
              No categories available
            </h3>

            <p className="mt-1.5 text-xs text-text-secondary">
              New collections will appear here soon.
            </p>
          </div>
        )}

        {/* BOTTOM CTA */}

        {categories.length > 0 && (
          <div className="mt-7 flex justify-center sm:mt-8">
            <Link
              to="/products"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-text-muted
                transition-all
                duration-300
                hover:text-accent
                sm:text-[11px]
              "
            >
              <span>
                Explore all collections
              </span>

              <FiArrowRight
                size={13}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}
      </div>

      {/* LOCAL ANIMATION */}

      <style>{`
        @keyframes categoryFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-card-animation {
          opacity: 0;
          animation: categoryFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .category-card-animation {
            opacity: 1;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

export default FeaturedCategories;