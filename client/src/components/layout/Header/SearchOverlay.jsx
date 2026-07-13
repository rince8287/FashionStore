import { useEffect, useRef, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

const trendingSearches = [
  "Summer Dresses",
  "Linen Shirts",
  "Co-ords",
  "Evening Wear",
  "Accessories",
];

function SearchOverlay({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  function handleTrendingSearch(searchTerm) {
    setSearchQuery(searchTerm);
    searchInputRef.current?.focus();
  }

  function handleClose() {
    setSearchQuery("");
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
        aria-label="Close search"
      />

      <section
        className="relative max-h-[100dvh] overflow-y-auto border-b border-border-subtle bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex min-h-12 flex-1 items-center rounded-xl border border-border-subtle bg-brand-bg px-4 transition-colors duration-300 focus-within:border-accent sm:min-h-14 sm:px-5">
              <FiSearch
                className="shrink-0 text-text-muted"
                size={21}
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search dresses, shirts, styles..."
                className="min-w-0 flex-1 bg-transparent px-3 text-sm text-text-primary outline-none placeholder:text-text-muted sm:text-base"
                aria-label="Search products"
              />
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors duration-300 hover:bg-surface-elevated hover:text-text-primary sm:h-14 sm:w-14"
              aria-label="Close search"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="pt-8 sm:pt-10">
            {searchQuery.trim() ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                  Search
                </p>

                <p className="mt-4 text-sm text-text-secondary sm:text-base">
                  Searching for{" "}
                  <span className="font-medium text-text-primary">
                    “{searchQuery}”
                  </span>
                </p>

                <p className="mt-2 text-sm leading-6 text-text-muted">
                  Product search results will appear here when the catalogue API
                  is connected.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                  Trending Searches
                </p>

                <div className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
                  {trendingSearches.map((searchTerm) => (
                    <button
                      key={searchTerm}
                      type="button"
                      onClick={() => handleTrendingSearch(searchTerm)}
                      className="min-h-11 rounded-full border border-border-subtle bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:border-accent hover:text-text-primary sm:px-5"
                    >
                      {searchTerm}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default SearchOverlay;