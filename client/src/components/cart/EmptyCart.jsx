import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

function EmptyCart() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-brand-bg px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-8 text-center shadow-xl">
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-surface-elevated">
          <FiShoppingBag
            size={48}
            className="text-accent"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-3xl font-bold text-text-primary">
          Your Cart is Empty
        </h1>

        {/* Description */}
        <p className="mt-4 leading-7 text-text-secondary">
          Looks like you haven't added anything to your cart yet.
          Explore our latest collections and find something you'll
          love.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-accent px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default EmptyCart;