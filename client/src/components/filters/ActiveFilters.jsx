import { useFilter } from "../../context/FilterContext";

function ActiveFilters() {
  const {
    selectedCategories,
    selectedBrands,
    selectedRating,
    searchQuery,
    clearFilters,
    toggleCategory,
    toggleBrand,
    setSelectedRating,
    setSearchQuery,
  } = useFilter();

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedRating !== null ||
    searchQuery.trim() !== "";

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-border-subtle bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Active Filters
        </h3>

        <button
          onClick={clearFilters}
          className="text-sm font-medium text-red-500 transition hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Categories */}
        {selectedCategories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:opacity-90"
          >
            {category}
            <span className="text-base">&times;</span>
          </button>
        ))}

        {/* Brands */}
        {selectedBrands.map((brand) => (
          <button
            key={brand}
            onClick={() => toggleBrand(brand)}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:opacity-90"
          >
            {brand}
            <span className="text-base">&times;</span>
          </button>
        ))}

        {/* Rating */}
        {selectedRating !== null && (
          <button
            onClick={() => setSelectedRating(null)}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:opacity-90"
          >
            {selectedRating}+ Stars
            <span className="text-base">&times;</span>
          </button>
        )}

        {/* Search */}
        {searchQuery.trim() !== "" && (
          <button
            onClick={() => setSearchQuery("")}
            className="flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-medium text-accent transition hover:opacity-90"
          >
            "{searchQuery}"
            <span className="text-base">&times;</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ActiveFilters;