import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartSummary() {
  const { totalPrice } = useCart();

  // Shipping
  const shipping = totalPrice > 999 ? 0 : 99;

  // GST (18%)
  const gst = Math.round(totalPrice * 0.18);

  // Final Total
  const grandTotal = totalPrice + shipping + gst;

  return (
    <div className="sticky top-24 rounded-2xl border border-border-subtle bg-surface p-6 shadow-sm">
      {/* Heading */}
      <h2 className="mb-6 text-2xl font-bold text-text-primary">
        Order Summary
      </h2>

      {/* Price Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold text-text-primary">
            ₹{totalPrice}
          </span>
        </div>

        <div className="flex items-center justify-between text-text-secondary">
          <span>Shipping</span>

          {shipping === 0 ? (
            <span className="font-semibold text-green-500">
              Free
            </span>
          ) : (
            <span className="font-semibold text-text-primary">
              ₹{shipping}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-text-secondary">
          <span>GST (18%)</span>

          <span className="font-semibold text-text-primary">
            ₹{gst}
          </span>
        </div>

        <hr className="border-border-subtle" />

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-text-primary">
            Total
          </span>

          <span className="text-2xl font-bold text-accent">
            ₹{grandTotal}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="mt-8 flex w-full items-center justify-center rounded-xl bg-accent px-6 py-4 text-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
      >
        Proceed To Checkout
      </Link>

      {/* Continue Shopping */}
      <Link
        to="/"
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-border-subtle px-6 py-4 font-medium text-text-primary transition-all duration-300 hover:border-accent hover:text-accent"
      >
        Continue Shopping
      </Link>

      {/* Secure Checkout */}
      <div className="mt-8 rounded-xl bg-surface-elevated p-4 text-center">
        <p className="text-sm text-text-secondary">
          🔒 Secure Checkout
        </p>

        <p className="mt-2 text-xs leading-6 text-text-muted">
          Your payment information is encrypted and processed
          securely.
        </p>
      </div>
    </div>
  );
}

export default CartSummary;