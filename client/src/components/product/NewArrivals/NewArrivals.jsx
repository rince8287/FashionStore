import products from "../../../data/products";
import ProductCard from "../ProductCard/ProductCard";

function NewArrivals() {
  return (
    <section className="bg-brand-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">
              New Collection
            </p>

            <h2 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
              New Arrivals
            </h2>

            <p className="mt-3 max-w-2xl text-text-secondary">
              Discover our latest premium fashion collection, crafted with
              modern trends and timeless elegance.
            </p>
          </div>

          <button className="rounded-xl border border-accent px-6 py-3 font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-black">
            View All
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default NewArrivals;