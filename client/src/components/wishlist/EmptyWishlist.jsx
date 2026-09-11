import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

function EmptyWishlist() {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-accent">
        <FiHeart size={30} />
      </div>

      <h2 className="mt-6 font-display text-3xl font-semibold text-text-primary">
        Your Wishlist is Empty
      </h2>

      <p className="mt-3 max-w-md text-text-secondary">
        Save your favourite products and they'll appear here.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-xl bg-accent px-6 py-3 font-semibold text-black transition hover:scale-105"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default EmptyWishlist;   