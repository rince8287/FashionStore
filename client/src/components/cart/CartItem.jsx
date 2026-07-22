import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-all duration-300 md:flex-row">
      {/* Product Image */}
      <div className="h-40 w-full overflow-hidden rounded-xl bg-surface-elevated md:h-36 md:w-32">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {item.brand}
          </p>

          <h2 className="mt-2 text-xl font-bold text-text-primary">
            {item.name}
          </h2>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-secondary">
            <span>
              Size:
              <span className="ml-1 font-medium text-text-primary">
                {item.selectedSize}
              </span>
            </span>

            <span>
              Color:
              <span className="ml-1 font-medium text-text-primary">
                {item.selectedColor}
              </span>
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold text-accent">
            ₹{item.price}
          </p>
        </div>

        {/* Bottom Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {/* Quantity */}
          <div className="flex items-center overflow-hidden rounded-xl border border-border-subtle">
            <button
              type="button"
              onClick={() => decreaseQuantity(item.id)}
              className="p-3 transition hover:bg-surface-elevated"
            >
              <FiMinus />
            </button>

            <span className="min-w-12 text-center font-semibold text-text-primary">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => increaseQuantity(item.id)}
              className="p-3 transition hover:bg-surface-elevated"
            >
              <FiPlus />
            </button>
          </div>

          {/* Item Total */}
          <div className="text-lg font-bold text-text-primary">
            ₹{item.price * item.quantity}
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <FiTrash2 />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;