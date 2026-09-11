import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";

import { useFilter } from "../../context/FilterContext";

function FilterSidebar() {
  // ====================================================
  // FILTER CONTEXT
  // ====================================================

  const {
    clearFilters,
    selectedCategories,
    selectedRating,
    priceRange,
  } = useFilter();

  // ====================================================
  // CHECK IF ANY FILTER IS ACTIVE
  // ====================================================

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedRating !== null ||
    priceRange[0] !== 0 ||
    priceRange[1] !== 100000;

  // ====================================================
  // CLEAR ALL
  // ====================================================

  const handleClearAll = () => {
    clearFilters();
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <aside className="sticky top-24 rounded-2xl border border-border-subtle bg-surface p-6">
      {/* ===============================================
          HEADING
      =============================================== */}

      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-text-primary">
          Filters
        </h2>

        <button
          type="button"
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
          className="text-sm font-medium text-accent transition hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
        >
          Clear All
        </button>
      </div>

      {/* ===============================================
          CATEGORY FILTER
      =============================================== */}

      <div className="border-b border-border-subtle pb-6">
        <CategoryFilter />
      </div>

      {/* ===============================================
          PRICE FILTER
      =============================================== */}

      <div className="border-b border-border-subtle py-6">
        <PriceFilter />
      </div>

      {/* ===============================================
          RATING FILTER
      =============================================== */}

      <div className="pt-6">
        <RatingFilter />
      </div>
    </aside>
  );
}

export default FilterSidebar;