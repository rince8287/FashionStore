import products from "../../../data/products";
import ProductCard from "../ProductCard/ProductCard";

function RelatedProducts({ currentProduct }) {
  // Same category ke products (current product ko chhodkar)
  let relatedProducts = products.filter(
    (product) =>
      product.category === currentProduct.category &&
      product.id !== currentProduct.id
  );

  // Agar 4 se kam products mile to baaki products add kar do
  if (relatedProducts.length < 4) {
    const extraProducts = products.filter(
      (product) =>
        product.id !== currentProduct.id &&
        !relatedProducts.some((item) => item.id === product.id)
    );

    relatedProducts = [...relatedProducts, ...extraProducts];
  }

  // Maximum 4 products
  relatedProducts = relatedProducts.slice(0, 4);

  return (
    <section className="bg-brand-bg py-12 md:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
            You May Also Like
          </p>

          <h2 className="mt-3 text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
            Related Products
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
            Discover similar premium fashion products selected just for you.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {relatedProducts.map((product) => (
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

export default RelatedProducts;