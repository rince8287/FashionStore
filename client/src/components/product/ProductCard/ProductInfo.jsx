import { FiStar } from "react-icons/fi";

function ProductInfo({ product }) {
  return (
    <div className="space-y-3 p-4">
      {/* Brand */}
      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
        {product.brand}
      </p>

      {/* Product Name */}
      <h3 className="line-clamp-2 text-lg font-semibold leading-7 text-text-primary">
        {product.name}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-yellow-400">
          <FiStar size={16} className="fill-current" />
          <span className="text-sm font-medium text-text-primary">
            {product.rating}
          </span>
        </div>

        <span className="text-sm text-text-muted">
          ({product.reviews} Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-accent">
          ₹{product.price}
        </span>

        <span className="text-sm line-through text-text-muted">
          ₹{product.oldPrice}
        </span>
      </div>
    </div>
  );
}

export default ProductInfo;