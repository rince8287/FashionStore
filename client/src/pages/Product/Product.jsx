import { useParams } from "react-router-dom";

import products from "../../data/products";

import ProductGallery from "../../components/product/ProductGallery/ProductGallery";
import ProductDetails from "../../components/product/ProductDetails/ProductDetails";
import ProductReviews from "../../components/product/ProductReviews/ProductReviews";
import RelatedProducts from "../../components/product/RelatedProducts/RelatedProducts";

function Product() {
  const { id } = useParams();

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">
            Product Not Found
          </h2>

          <p className="mt-3 text-text-secondary">
            The product you are looking for does not exist.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Product Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left */}
            <ProductGallery product={product} />

            {/* Right */}
            <ProductDetails product={product} />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ProductReviews product={product} />

      {/* Related Products */}
      <RelatedProducts currentProduct={product} />
    </main>
  );
}

export default Product;