import FilterSidebar from "../../components/filters/FilterSidebar";
import SortDropdown from "../../components/filters/SortDropdown";
import ActiveFilters from "../../components/filters/ActiveFilters";
import ProductGrid from "../../components/product/ProductGrid/ProductGrid";
import { useFilter } from "../../context/FilterContext";

function Shop() {
  const { filteredProducts } = useFilter();

  return (
    <main className="min-h-screen bg-brand-bg py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-text-primary">
            Shop
          </h1>

          <p className="mt-2 text-text-secondary">
            Discover premium fashion for every occasion.
          </p>
        </div>

        {/* Top Bar */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border-subtle bg-surface p-4 md:flex-row md:items-center">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-semibold text-text-primary">
              {filteredProducts.length}
            </span>{" "}
            Products
          </p>

          <SortDropdown />
        </div>

        {/* Active Filters */}
        <ActiveFilters />

        {/* Shop Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <FilterSidebar />
          </aside>

          {/* Products */}
          <section className="lg:col-span-3">
            <ProductGrid />
          </section>
        </div>
      </div>
    </main>
  );
}

export default Shop;