import { Link } from "react-router-dom";

import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductActions from "./ProductActions";

function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  const productId =
    product?._id || product?.id;

  if (!productId) {
    return null;
  }

  const productUrl =
    `/product/${productId}`;

  return (
    <article
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-border-subtle
        bg-surface
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-accent/40
        hover:shadow-[0_14px_35px_rgba(0,0,0,0.22)]
      "
    >
      {/* IMAGE + INFO */}

      <Link
        to={productUrl}
        className="
          block
          min-w-0
          outline-none
          focus-visible:ring-2
          focus-visible:ring-accent
          focus-visible:ring-inset
        "
        aria-label={`View ${
          product?.name || "product"
        }`}
      >
        <ProductImage
          product={product}
        />

        <ProductInfo
          product={product}
        />
      </Link>

      {/* ACTIONS */}

      <ProductActions
        product={product}
      />
    </article>
  );
}

export default ProductCard;