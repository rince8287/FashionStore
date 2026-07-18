import { FiHeart } from "react-icons/fi";

function ProductImage({ product }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface">
      {/* Badge */}
      <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
        {product.badge}
      </span>

      {/* Wishlist */}
      <button className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black transition hover:scale-110">
        <FiHeart size={18} />
      </button>

      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

export default ProductImage;