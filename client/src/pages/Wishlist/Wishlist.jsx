import { useWishlist } from "../../context/WishlistContext";

import EmptyWishlist from "../../components/wishlist/EmptyWishlist";
import WishlistItem from "../../components/wishlist/WishlistItem";

function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <main className="min-h-screen bg-brand-bg py-12">
      <div className="mx-auto max-w-7xl px-4">

        <p className="text-sm uppercase tracking-[0.3em] text-accent">
          Saved Pieces
        </p>

        <h1 className="mt-2 mb-10 font-display text-4xl font-bold text-text-primary">
          Wishlist ({wishlistItems.length})
        </h1>

        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <WishlistItem
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Wishlist;