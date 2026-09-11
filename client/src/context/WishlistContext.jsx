import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getWishlist,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  toggleWishlist as toggleWishlistService,
  clearWishlist as clearWishlistService,
  moveToCart as moveToCartService,
  checkWishlist as checkWishlistService,
} from "../services/wishlistservice";

const WishlistContext = createContext(null);

// ======================================================
// HELPER — GET PRODUCT ID
// ======================================================

const getProductId = (product) => {
  if (!product) return null;

  if (typeof product === "string") {
    return product;
  }

  return product._id || product.id || null;
};

// ======================================================
// HELPER — EXTRACT WISHLIST ITEMS
// ======================================================

const extractWishlistItems = (response) => {
  if (!response) return [];

  // Response:
  // { wishlist: { items: [...] } }
  if (Array.isArray(response.wishlist?.items)) {
    return response.wishlist.items;
  }

  // Response:
  // { wishlist: [...] }
  if (Array.isArray(response.wishlist)) {
    return response.wishlist;
  }

  // Response:
  // { items: [...] }
  if (Array.isArray(response.items)) {
    return response.items;
  }

  // Response:
  // { data: [...] }
  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

// ======================================================
// HELPER — NORMALIZE WISHLIST ITEMS
// ======================================================

const normalizeWishlistItems = (items = []) => {
  return items
    .map((item) => {
      /*
        Backend wishlist item can look like:

        {
          _id: "...",
          product: {
            _id: "...",
            name: "...",
            ...
          }
        }

        OR directly:

        {
          _id: "...",
          name: "...",
          ...
        }
      */

      if (item?.product) {
        return {
          ...item.product,

          wishlistItemId:
            item._id || null,
        };
      }

      return item;
    })
    .filter(Boolean);
};

// ======================================================
// PROVIDER
// ======================================================

export function WishlistProvider({
  children,
}) {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  // ====================================================
  // STATE
  // ====================================================

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ====================================================
  // LOAD WISHLIST
  // ====================================================

  const fetchWishlist =
    useCallback(async () => {
      if (!isAuthenticated) {
        setWishlistItems([]);
        setLoading(false);
        setError("");

        return [];
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getWishlist();

        const items =
          extractWishlistItems(
            response
          );

        const normalizedItems =
          normalizeWishlistItems(
            items
          );

        setWishlistItems(
          normalizedItems
        );

        return normalizedItems;
      } catch (error) {
        console.error(
          "Fetch Wishlist Error:",
          error
        );

        const message =
          error.response?.data
            ?.message ||
          "Failed to load wishlist.";

        setError(message);

        return [];
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated]);

  // ====================================================
  // LOAD AFTER LOGIN
  // ====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setWishlistItems([]);
      setLoading(false);
      setError("");

      return;
    }

    fetchWishlist();
  }, [
    authLoading,
    isAuthenticated,
    fetchWishlist,
  ]);

  // ====================================================
  // ADD TO WISHLIST
  // ====================================================

  const addToWishlist =
    useCallback(
      async (product) => {
        const productId =
          getProductId(product);

        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

        if (!isAuthenticated) {
          throw new Error(
            "Please login to use wishlist."
          );
        }

        try {
          setError("");

          const response =
            await addToWishlistService(
              productId
            );

          await fetchWishlist();

          return response;
        } catch (error) {
          console.error(
            "Add Wishlist Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.message ||
            "Failed to add product to wishlist.";

          setError(message);

          throw error;
        }
      },
      [
        isAuthenticated,
        fetchWishlist,
      ]
    );

  // ====================================================
  // REMOVE FROM WISHLIST
  // ====================================================

  const removeFromWishlist =
    useCallback(
      async (productId) => {
        const id =
          getProductId(productId);

        if (!id) {
          throw new Error(
            "Product ID is required."
          );
        }

        if (!isAuthenticated) {
          throw new Error(
            "Please login to use wishlist."
          );
        }

        try {
          setError("");

          const response =
            await removeFromWishlistService(
              id
            );

          setWishlistItems(
            (prevItems) =>
              prevItems.filter(
                (item) =>
                  getProductId(
                    item
                  ) !== id
              )
          );

          return response;
        } catch (error) {
          console.error(
            "Remove Wishlist Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.message ||
            "Failed to remove product from wishlist.";

          setError(message);

          throw error;
        }
      },
      [isAuthenticated]
    );

  // ====================================================
  // TOGGLE WISHLIST
  // ====================================================

  const toggleWishlist =
    useCallback(
      async (product) => {
        const productId =
          getProductId(product);

        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

        if (!isAuthenticated) {
          throw new Error(
            "Please login to use wishlist."
          );
        }

        try {
          setError("");

          const response =
            await toggleWishlistService(
              productId
            );

          /*
            Refresh kar rahe hain because backend
            final source of truth hai.
          */

          await fetchWishlist();

          return response;
        } catch (error) {
          console.error(
            "Toggle Wishlist Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.message ||
            "Failed to update wishlist.";

          setError(message);

          throw error;
        }
      },
      [
        isAuthenticated,
        fetchWishlist,
      ]
    );

  // ====================================================
  // CHECK IF PRODUCT IS WISHLISTED
  //
  // Synchronous function rakha hai because
  // ProductDetails currently:
  //
  // const wishlisted = isWishlisted(product.id)
  //
  // use karta hai.
  // ====================================================

  const isWishlisted =
    useCallback(
      (productId) => {
        const id =
          getProductId(productId);

        if (!id) {
          return false;
        }

        return wishlistItems.some(
          (item) =>
            getProductId(item) ===
            id
        );
      },
      [wishlistItems]
    );

  // ====================================================
  // CHECK WISHLIST FROM BACKEND
  // ====================================================

  const checkWishlist =
    useCallback(
      async (productId) => {
        const id =
          getProductId(productId);

        if (
          !id ||
          !isAuthenticated
        ) {
          return false;
        }

        try {
          const response =
            await checkWishlistService(
              id
            );

          return Boolean(
            response.inWishlist
          );
        } catch (error) {
          console.error(
            "Check Wishlist Error:",
            error
          );

          return false;
        }
      },
      [isAuthenticated]
    );

  // ====================================================
  // CLEAR WISHLIST
  // ====================================================

  const clearWishlist =
    useCallback(async () => {
      if (!isAuthenticated) {
        setWishlistItems([]);
        return;
      }

      try {
        setError("");

        const response =
          await clearWishlistService();

        setWishlistItems([]);

        return response;
      } catch (error) {
        console.error(
          "Clear Wishlist Error:",
          error
        );

        const message =
          error.response?.data
            ?.message ||
          "Failed to clear wishlist.";

        setError(message);

        throw error;
      }
    }, [isAuthenticated]);

  // ====================================================
  // MOVE WISHLIST PRODUCT TO CART
  // ====================================================

  const moveToCart =
    useCallback(
      async (
        productId,
        cartData = {}
      ) => {
        const id =
          getProductId(productId);

        if (!id) {
          throw new Error(
            "Product ID is required."
          );
        }

        if (!isAuthenticated) {
          throw new Error(
            "Please login first."
          );
        }

        try {
          setError("");

          const response =
            await moveToCartService(
              id,
              {
                quantity:
                  cartData.quantity ??
                  1,

                ...(cartData.size
                  ? {
                      size:
                        cartData.size,
                    }
                  : {}),

                ...(cartData.color
                  ? {
                      color:
                        cartData.color,
                    }
                  : {}),
              }
            );

          // Product wishlist se remove ho gaya
          setWishlistItems(
            (prevItems) =>
              prevItems.filter(
                (item) =>
                  getProductId(
                    item
                  ) !== id
              )
          );

          return response;
        } catch (error) {
          console.error(
            "Move To Cart Error:",
            error
          );

          const message =
            error.response?.data
              ?.message ||
            error.message ||
            "Failed to move product to cart.";

          setError(message);

          throw error;
        }
      },
      [isAuthenticated]
    );

  // ====================================================
  // TOTAL ITEMS
  // ====================================================

  const totalWishlistItems =
    useMemo(() => {
      return wishlistItems.length;
    }, [wishlistItems]);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = useMemo(
    () => ({
      wishlistItems,

      loading,
      error,

      totalWishlistItems,

      addToWishlist,
      removeFromWishlist,
      toggleWishlist,

      isWishlisted,
      checkWishlist,

      clearWishlist,
      moveToCart,

      refreshWishlist:
        fetchWishlist,
    }),
    [
      wishlistItems,
      loading,
      error,
      totalWishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      checkWishlist,
      clearWishlist,
      moveToCart,
      fetchWishlist,
    ]
  );

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================

export function useWishlist() {
  const context = useContext(
    WishlistContext
  );

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}