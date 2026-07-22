import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  // Load Wishlist from LocalStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem("wishlist");

      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      return [];
    }
  });

  // Save Wishlist to LocalStorage
  useEffect(() => {
    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);

  // Add Product
  const addToWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const alreadyExists = prevItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) return prevItems;

      return [...prevItems, product];
    });
  };

  // Remove Product
  const removeFromWishlist = (id) => {
    setWishlistItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // Toggle Wishlist
  const toggleWishlist = (product) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return prevItems.filter(
          (item) => item.id !== product.id
        );
      }

      return [...prevItems, product];
    });
  };

  // Check if Product is Wishlisted
  const isWishlisted = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // Clear Wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  // Total Wishlist Items
  const totalWishlistItems = useMemo(() => {
    return wishlistItems.length;
  }, [wishlistItems]);

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    totalWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}