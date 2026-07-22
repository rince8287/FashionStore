import { Link } from "react-router-dom";

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
        hover:-translate-y-2
        hover:border-accent
        hover:shadow-2xl
      "
    >
      {/* Clickable Product */}
      <Link to={`/product/${product.id}`}>
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </Link>

      {/* Product Actions */}
      <ProductActions product={product} />
    </article>
  );
}

export default ProductCard;