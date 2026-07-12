import { Link } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

function Cart() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Your Selection
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Shopping Bag
        </h1>

        <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated text-accent">
            <FiShoppingBag size={24} />
          </div>

          <h2 className="mt-5 font-display text-2xl font-semibold text-text-primary">
            Your bag is empty
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
            Explore our latest collection and add your favourite pieces to your
            bag.
          </p>

          <Link
            to="/new-in"
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-brand-bg transition-colors duration-300 hover:bg-accent-hover"
          >
            Explore New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Cart;