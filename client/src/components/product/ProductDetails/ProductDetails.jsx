import { useState } from "react";
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

function ProductDetails({ product }) {
  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  const sizes = ["S", "M", "L", "XL"];
  const colors = ["Black", "White", "Blue"];

  const wishlisted = isWishlisted(product.id);

  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) / product.oldPrice) * 100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        selectedSize,
        selectedColor,
      },
      quantity
    );
  };

  const handleWishlist = () => {
    toggleWishlist({
      ...product,
      selectedSize,
      selectedColor,
    });
  };

  return (
    <div className="w-full space-y-6 md:space-y-8">
      {/* Brand */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent sm:text-sm">
          {product.brand}
        </p>

        <h1 className="mt-2 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
          {product.name}
        </h1>
      </div>

      {/* Rating */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, index) => (
            <FaStar key={index} className="text-sm sm:text-base" />
          ))}
        </div>

        <span className="text-sm text-text-secondary sm:text-base">
          {product.rating} ({product.reviews} Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        <span className="text-3xl font-bold text-accent sm:text-4xl">
          ₹{product.price}
        </span>

        {product.oldPrice && (
          <span className="text-lg text-text-muted line-through sm:text-xl">
            ₹{product.oldPrice}
          </span>
        )}

        {discount > 0 && (
          <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white sm:text-sm">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="mb-2 text-lg font-semibold text-text-primary">
          Description
        </h2>

        <p className="text-sm leading-7 text-text-secondary sm:text-base">
          Premium quality {product.category.toLowerCase()} product from{" "}
          {product.brand}. Made with high-quality materials for comfort,
          durability and everyday use.
        </p>
      </div>

      {/* Size */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text-primary">
          Select Size
        </h3>

        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border font-medium transition-all duration-300 ${
                selectedSize === size
                  ? "border-accent bg-accent text-black"
                  : "border-border-subtle text-text-primary hover:border-accent"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text-primary">
          Select Color
        </h3>

        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`rounded-xl border px-5 py-3 text-sm font-medium transition-all duration-300 sm:text-base ${
                selectedColor === color
                  ? "border-accent bg-accent text-black"
                  : "border-border-subtle text-text-primary hover:border-accent"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-text-primary">
          Quantity
        </h3>

        <div className="flex w-fit items-center overflow-hidden rounded-xl border border-border-subtle">
          <button
            type="button"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            className="p-3 transition hover:bg-surface-elevated sm:p-4"
          >
            <FiMinus />
          </button>

          <span className="min-w-14 px-5 text-center text-lg font-semibold text-text-primary">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 transition hover:bg-surface-elevated sm:p-4"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
        >
          <FiShoppingCart size={20} />
          Add To Cart
        </button>

        <button
          type="button"
          onClick={handleWishlist}
          className={`flex h-14 w-full items-center justify-center rounded-xl border transition-all duration-300 sm:w-14 ${
            wishlisted
              ? "border-red-500 bg-red-500 text-white"
              : "border-accent text-accent hover:bg-accent hover:text-black"
          }`}
        >
          {wishlisted ? (
            <FaHeart size={20} />
          ) : (
            <FiHeart size={20} />
          )}
        </button>
      </div>

      {/* Buy Now */}
      <Link
        to="/checkout"
        onClick={handleAddToCart}
        className="flex w-full items-center justify-center rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:opacity-90"
      >
        Buy Now
      </Link>
    </div>
  );
}

export default ProductDetails;