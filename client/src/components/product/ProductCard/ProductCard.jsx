import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";

function ProductCard({ product }) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        hover:-translate-y-2S
        hover:border-accent
        hover:shadow-2xl
      "
    >
      {/* Product Image */}
      <ProductImage product={product} />

      {/* Product Information */}
      <ProductInfo product={product} />

      {/* Product Buttons */}
      <ProductActions product={product} />
    </article>
  );
}

export default ProductCard;