import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function WishlistItem({ product }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = () => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-border-subtle bg-surface transition hover:border-accent hover:shadow-xl">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      </Link>

      <div className="space-y-3 p-5">
        <p className="text-sm text-text-secondary">
          {product.brand}
        </p>

        <Link
          to={`/product/${product.id}`}
          className="block text-lg font-semibold text-text-primary hover:text-accent"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-accent">
            ₹{product.price}
          </span>

          <span className="text-sm text-text-muted line-through">
            ₹{product.oldPrice}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-yellow-400">
            ⭐ {product.rating}
          </span>

          <span className="text-text-secondary">
            ({product.reviews})
          </span>
        </div>

        <button
          onClick={handleMoveToCart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 font-semibold text-black transition hover:scale-[1.02]"
        >
          <FiShoppingCart />
          Move to Cart
        </button>

        <button
          onClick={() => removeFromWishlist(product.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500 py-3 font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
        >
          <FiTrash2 />
          Remove
        </button>
      </div>
    </article>
  );
}

export default WishlistItem;