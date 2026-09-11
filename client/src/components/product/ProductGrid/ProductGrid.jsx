import { useFilter } from "../../../context/FilterContext";

import ProductCard from "../ProductCard/ProductCard";

function ProductGrid() {
  const {
    filteredProducts = [],
  } = useFilter();

  // =========================================================
  // EMPTY
  // =========================================================

  if (!filteredProducts.length) {
    return (
      <section className="w-full">
        <div
          className="
            flex
            min-h-[280px]
            w-full
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
          <div>
            <div
              className="
                mx-auto
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
                width="20"
                height="20"
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

            <h2
              className="
                mt-4
                text-lg
                font-bold
                text-text-primary
              "
            >
              No Products Found
            </h2>

            <p
              className="
                mt-1.5
                text-xs
                text-text-secondary
              "
            >
              Try changing your filters
              or search.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // GRID
  // =========================================================

  return (
    <section
      className="
        w-full
        min-w-0
      "
      aria-label="Product listing"
    >
      <div
        className="
          grid
          w-full
          grid-cols-2
          gap-3
          sm:grid-cols-3
          sm:gap-4
          lg:grid-cols-4
          lg:gap-5
          2xl:grid-cols-5
        "
      >
        {filteredProducts.map(
          (product, index) => {
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
                  animate-[cardReveal_.4s_ease-out_both]
                "
                style={{
                  animationDelay: `${Math.min(
                    index * 35,
                    280
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
    </section>
  );
}

export default ProductGrid;