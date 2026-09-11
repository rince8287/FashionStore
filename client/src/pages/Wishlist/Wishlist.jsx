import { useWishlist } from "../../context/WishlistContext";

import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";

function Wishlist() {
  const {
    wishlistItems,
    loading,
    error,
    totalWishlistItems,
    refreshWishlist,
  } = useWishlist();

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg py-12">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Saved Pieces
          </p>

          <h1 className="mb-10 mt-2 font-display text-4xl font-bold text-text-primary">
            Wishlist
          </h1>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-2xl border border-border-subtle bg-surface"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error) {
    return (
      <main className="min-h-screen bg-brand-bg py-12">
        <div className="mx-auto max-w-7xl px-4">

          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Saved Pieces
          </p>

          <h1 className="mb-8 mt-2 font-display text-4xl font-bold text-text-primary">
            Wishlist
          </h1>

          <div className="rounded-2xl border border-red-500/30 bg-surface p-8 text-center">
            <p className="text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={refreshWishlist}
              className="mt-5 rounded-xl bg-accent px-6 py-3 font-semibold text-black transition hover:bg-accent-hover"
            >
              Try Again
            </button>
          </div>

        </div>
      </main>
    );
  }

  // ====================================================
  // WISHLIST
  // ====================================================

  return (
    <main className="min-h-screen bg-brand-bg py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">
            Saved Pieces
          </p>

          <h1 className="mt-2 font-display text-4xl font-bold text-text-primary">
            Wishlist ({totalWishlistItems})
          </h1>

          <p className="mt-3 text-text-secondary">
            Your favourite fashion products saved in one place.
          </p>
        </div>

        {/* Empty Wishlist */}

        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          /* Wishlist Products */

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => {
              const productId =
                product._id || product.id;

              return (
                <WishlistItem
                  key={productId}
                  product={product}
                />
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}

export default Wishlist;