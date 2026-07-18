function ProductActions({ product }) {
  return (
    <div className="space-y-3 px-4 pb-4">
      {product.stock ? (
        <>
          {/* Add to Cart Button */}
          <button
            className="
              w-full
              rounded-xl
              bg-accent
              px-4
              py-3
              text-sm
              font-semibold
              text-black
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-lg
              active:scale-95
            "
          >
            Add To Cart
          </button>

          {/* Buy Now Button */}
          <button
            className="
              w-full
              rounded-xl
              border
              border-accent
              bg-transparent
              px-4
              py-3
              text-sm
              font-semibold
              text-accent
              transition-all
              duration-300
              hover:bg-accent
              hover:text-black
              active:scale-95
            "
          >
            Buy Now
          </button>
        </>
      ) : (
        <button
          disabled
          className="
            w-full
            cursor-not-allowed
            rounded-xl
            bg-gray-700
            px-4
            py-3
            text-sm
            font-semibold
            text-gray-300
          "
        >
          Out of Stock
        </button>
      )}
    </div>
  );
}

export default ProductActions;