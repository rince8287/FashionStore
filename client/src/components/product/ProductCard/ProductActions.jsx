import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

function ProductActions({ product }) {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
    wishlistItems,
  } = useWishlist();

  const wishlisted = isWishlisted(product?.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleWishlist = () => {
    console.log("Wishlist Clicked");
    console.log("Product:", product);

    if (!product) {
      console.error("Product is undefined");
      return;
    }

    toggleWishlist(product);
  };

  console.log("Wishlist Items:", wishlistItems);

  return (
    <div className="space-y-3 px-4 pb-4">
      {product?.stock ? (
        <>
          <button
            type="button"
            onClick={handleWishlist}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              wishlisted
                ? "border-red-500 bg-red-500 text-white"
                : "border-border-subtle text-text-primary hover:border-red-500 hover:text-red-500"
            }`}
          >
            {wishlisted ? <FaHeart size={18} /> : <FiHeart size={18} />}
            {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-black"
          >
            Add To Cart
          </button>

          <Link
            to="/checkout"
            onClick={handleAddToCart}
            className="flex w-full items-center justify-center rounded-xl border border-accent px-4 py-3 text-sm font-semibold text-accent"
          >
            Buy Now
          </Link>
        </>
      ) : (
        <button
          disabled
          className="w-full cursor-not-allowed rounded-xl bg-gray-700 px-4 py-3 text-sm font-semibold text-gray-300"
        >
          Out of Stock
        </button>
      )}
    </div>
  );
}

export default ProductActions;