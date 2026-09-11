import {
  useEffect,
  useState,
} from "react";

import {
  useFilter,
} from "../../context/FilterContext";

import {
  getCategories,
} from "../../services/categoryservice";

function CategoryFilter() {
  // ====================================================
  // FILTER CONTEXT
  // ====================================================

  const {
    selectedCategories,
    toggleCategory,
  } = useFilter();

  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // FETCH CATEGORIES
  // ====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchCategories =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getCategories();

          if (!isMounted) return;

          // ============================================
          // Backend response safety
          // ============================================

          const categoryData =
            Array.isArray(response)
              ? response
              : Array.isArray(
                  response?.categories
                )
              ? response.categories
              : Array.isArray(
                  response?.data
                )
              ? response.data
              : [];

          /*
            Product controller category filter
            MongoDB category _id expect karta hai.

            Invalid categories ko UI me nahi
            dikhayenge.
          */

          const validCategories =
            categoryData.filter(
              (category) =>
                category?._id &&
                category?.name
            );

          setCategories(
            validCategories
          );
        } catch (error) {
          if (!isMounted) return;

          console.error(
            "Category Filter Error:",
            error
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to load categories.";

          setError(message);

          setCategories([]);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchCategories();

    // ================================================
    // CLEANUP
    // ================================================

    return () => {
      isMounted = false;
    };
  }, []);

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div>
        <h3 className="mb-5 text-lg font-semibold text-text-primary">
          Categories
        </h3>

        <div className="space-y-3">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-9 animate-pulse rounded-lg bg-surface-elevated"
              />
            )
          )}
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <div>
        <h3 className="mb-5 text-lg font-semibold text-text-primary">
          Categories
        </h3>

        <p className="text-sm text-red-400">
          {error}
        </p>
      </div>
    );
  }

  // ====================================================
  // EMPTY
  // ====================================================

  if (categories.length === 0) {
    return (
      <div>
        <h3 className="mb-5 text-lg font-semibold text-text-primary">
          Categories
        </h3>

        <p className="text-sm text-text-muted">
          No categories available.
        </p>
      </div>
    );
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold text-text-primary">
        Categories
      </h3>

      <div className="space-y-3">
        {categories.map(
          (category) => {
            // ==========================================
            // IMPORTANT:
            // Backend product filter expects MongoDB ID
            // ==========================================

            const categoryId =
              String(category._id);

            const isChecked =
              selectedCategories.includes(
                categoryId
              );

            return (
              <label
                key={categoryId}
                className="group flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 transition hover:bg-surface-elevated"
              >
                <div className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      toggleCategory(
                        categoryId
                      )
                    }
                    className="h-4 w-4 cursor-pointer rounded border border-border-subtle accent-accent"
                  />

                  <span className="text-sm font-medium text-text-secondary transition group-hover:text-text-primary">
                    {category.name}
                  </span>

                </div>

                {category.slug && (
                  <span className="ml-3 text-xs capitalize text-text-muted">
                    {category.slug}
                  </span>
                )}

              </label>
            );
          }
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;