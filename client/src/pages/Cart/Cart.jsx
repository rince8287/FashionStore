import EmptyCart from "../../components/cart/EmptyCart";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { useCart } from "../../context/CartContext";

function Cart() {
  const { cartItems } = useCart();

  // Empty Cart
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <section className="bg-brand-bg py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Your Shopping Bag
          </p>

          <h1 className="mt-3 text-4xl font-bold text-text-primary">
            Cart
          </h1>

          <p className="mt-3 text-text-secondary">
            Review your selected products before checkout.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left Side - Cart Items */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
              />
            ))}
          </div>

          {/* Right Side - Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;