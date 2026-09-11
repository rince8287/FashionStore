import { useFilter } from "../../context/FilterContext";

function SortDropdown() {
  const { sortBy, setSortBy } = useFilter();

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort"
        className="text-sm font-medium text-text-secondary"
      >
        Sort By
      </label>

      <select
        id="sort"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm text-text-primary outline-none transition focus:border-accent"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}

export default SortDropdown;