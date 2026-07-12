import { FiHeart } from "react-icons/fi";

function Wishlist() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
          Saved Pieces
        </p>

        <h1 className="mt-3 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
          Wishlist
        </h1>

        <div className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-border-subtle bg-surface px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated text-accent">
            <FiHeart size={24} />
          </div>

          <h2 className="mt-5 font-display text-2xl font-semibold text-text-primary">
            Your wishlist is empty
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary sm:text-base">
            Save the pieces you love and return to them whenever you are ready.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Wishlist;