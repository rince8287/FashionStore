// src/context/CartContext.jsx

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
  getCart as getCartService,
  addToCart as addToCartService,
  updateCartItem as updateCartItemService,
  updateCartItemVariant as updateCartItemVariantService,
  removeCartItem as removeCartItemService,
  clearCart as clearCartService,
} from "../services/cartservice";

// ======================================================
// CART CONTEXT
// ======================================================

const CartContext = createContext(null);

// ======================================================
// HELPER — GET PRODUCT ID
// ======================================================

const getProductId = (product) => {
  if (!product) {
    return null;
  }

  return (
    product._id ||
    product.id ||
    product.product?._id ||
    product.product?.id ||
    null
  );
};

// ======================================================
// HELPER — GET CART ITEMS FROM RESPONSE
// ======================================================

const getCartItemsFromResponse = (response) => {
  if (!response) {
    return [];
  }

  // Backend:
  // {
  //   cart: {
  //     items: [...]
  //   }
  // }

  if (Array.isArray(response?.cart?.items)) {
    return response.cart.items;
  }

  // Possible:
  // {
  //   items: [...]
  // }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  // Possible:
  // {
  //   data: {
  //     items: [...]
  //   }
  // }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  // Possible:
  // {
  //   data: [...]
  // }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  // Possible direct array

  if (Array.isArray(response)) {
    return response;
  }

  return [];
};

// ======================================================
// CART PROVIDER
// ======================================================

export function CartProvider({ children }) {
  // ====================================================
  // AUTH
  // ====================================================

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  // ====================================================
  // STATE
  // ====================================================

  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ====================================================
  // REFRESH / LOAD CART
  // ====================================================

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setError("");

      return [];
    }

    try {
      setLoading(true);
      setError("");

      const response = await getCartService();

      const items =
        getCartItemsFromResponse(response);

      setCartItems(items);

      return items;
    } catch (error) {
      console.error(
        "Get Cart Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load cart.";

      setError(message);
      setCartItems([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ====================================================
  // LOAD CART AFTER LOGIN
  // ====================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
      setError("");
      setLoading(false);
    }
  }, [
    authLoading,
    isAuthenticated,
    refreshCart,
  ]);

  // ====================================================
  // ADD TO CART
  //
  // Usage:
  //
  // addToCart(
  //   product,
  //   quantity,
  //   selectedSize,
  //   selectedColor
  // )
  // ====================================================

  const addToCart = useCallback(
    async (
      product,
      quantity = 1,
      selectedSize = "",
      selectedColor = ""
    ) => {
      // ================================================
      // AUTH CHECK
      // ================================================

      if (!isAuthenticated) {
        throw new Error(
          "Please login to add products to cart."
        );
      }

      // ================================================
      // PRODUCT ID
      // ================================================

      const productId =
        getProductId(product);

      if (!productId) {
        throw new Error(
          "Product ID is required."
        );
      }

      // ================================================
      // QUANTITY
      // ================================================

      const finalQuantity = Math.max(
        1,
        Number(quantity) || 1
      );

      // ================================================
      // SIZE
      // ================================================

      const finalSize =
        selectedSize ||
        product?.selectedSize ||
        product?.size ||
        "";

      // ================================================
      // COLOR
      // ================================================

      const finalColor =
        selectedColor ||
        product?.selectedColor ||
        product?.color ||
        "";

      try {
        setError("");

        // ==============================================
        // REQUEST BODY
        // ==============================================

        const cartData = {
          productId,
          quantity: finalQuantity,

          ...(finalSize
            ? {
                size: finalSize,
              }
            : {}),

          ...(finalColor
            ? {
                color: finalColor,
              }
            : {}),
        };

        console.log(
          "Add To Cart Request:",
          cartData
        );

        // ==============================================
        // BACKEND API
        // ==============================================

        const response =
          await addToCartService(
            cartData
          );

        // ==============================================
        // REFRESH CART
        // ==============================================

        await refreshCart();

        return response;
      } catch (error) {
        console.error(
          "Add To Cart Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add product to cart.";

        setError(message);

        throw error;
      }
    },
    [
      isAuthenticated,
      refreshCart,
    ]
  );

  // ====================================================
  // UPDATE QUANTITY
  // ====================================================

  const updateQuantity = useCallback(
    async (
      itemId,
      quantity
    ) => {
      if (!itemId) {
        throw new Error(
          "Cart item ID is required."
        );
      }

      const finalQuantity =
        Number(quantity);

      if (
        Number.isNaN(finalQuantity) ||
        finalQuantity < 1
      ) {
        return;
      }

      try {
        setError("");

        const response =
          await updateCartItemService(
            itemId,
            finalQuantity
          );

        await refreshCart();

        return response;
      } catch (error) {
        console.error(
          "Update Cart Error:",
          error
        );

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update cart.";

        setError(message);

        throw error;
      }
    },
    [refreshCart]
  );

  // ====================================================
  // INCREASE QUANTITY
  // ====================================================

  const increaseQuantity = useCallback(
    async (itemId) => {
      const item =
        cartItems.find(
          (cartItem) =>
            (
              cartItem._id ||
              cartItem.id
            ) === itemId
        );

      if (!item) {
        return;
      }

      const currentQuantity =
        Number(item.quantity) || 1;

      return updateQuantity(
        itemId,
        currentQuantity + 1
      );
    },
    [
      cartItems,
      updateQuantity,
    ]
  );

  // ====================================================
  // DECREASE QUANTITY
  // ====================================================

  const decreaseQuantity = useCallback(
    async (itemId) => {
      const item =
        cartItems.find(
          (cartItem) =>
            (
              cartItem._id ||
              cartItem.id
            ) === itemId
        );

      if (!item) {
        return;
      }

      const currentQuantity =
        Number(item.quantity) || 1;

      if (currentQuantity <= 1) {
        return;
      }

      return updateQuantity(
        itemId,
        currentQuantity - 1
      );
    },
    [
      cartItems,
      updateQuantity,
    ]
  );

  // ====================================================
  // UPDATE CART ITEM VARIANT
  //
  // Example:
  //
  // updateCartItemVariant(
  //   itemId,
  //   {
  //     size: "XL",
  //     color: "Black"
  //   }
  // )
  // ====================================================

  const updateCartItemVariant =
    useCallback(
      async (
        itemId,
        variantData
      ) => {
        if (!itemId) {
          throw new Error(
            "Cart item ID is required."
          );
        }

        if (
          !variantData ||
          typeof variantData !==
            "object"
        ) {
          throw new Error(
            "Variant data is required."
          );
        }

        try {
          setError("");

          const response =
            await updateCartItemVariantService(
              itemId,
              variantData
            );

          await refreshCart();

          return response;
        } catch (error) {
          console.error(
            "Update Variant Error:",
            error
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to update product variant.";

          setError(message);

          throw error;
        }
      },
      [refreshCart]
    );

  // ====================================================
  // REMOVE FROM CART
  // ====================================================

  const removeFromCart =
    useCallback(
      async (itemId) => {
        if (!itemId) {
          throw new Error(
            "Cart item ID is required."
          );
        }

        try {
          setError("");

          const response =
            await removeCartItemService(
              itemId
            );

          // Immediately remove from UI

          setCartItems(
            (prevItems) =>
              prevItems.filter(
                (item) =>
                  (
                    item._id ||
                    item.id
                  ) !== itemId
              )
          );

          return response;
        } catch (error) {
          console.error(
            "Remove Cart Error:",
            error
          );

          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to remove cart item.";

          setError(message);

          throw error;
        }
      },
      []
    );

  // ====================================================
  // CLEAR COMPLETE CART
  // ====================================================

  const clearCart =
    useCallback(async () => {
      if (!isAuthenticated) {
        setCartItems([]);
        setError("");

        return;
      }

      try {
        setError("");

        const response =
          await clearCartService();

        setCartItems([]);

        return response;
      } catch (error) {
        console.error(
          "Clear Cart Error:",
          error
        );

        const message =
          error?.response?.data
            ?.message ||
          error?.message ||
          "Failed to clear cart.";

        setError(message);

        throw error;
      }
    }, [isAuthenticated]);

  // ====================================================
  // TOTAL ITEMS
  // ====================================================

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (
        total,
        item
      ) => {
        return (
          total +
          (Number(item.quantity) || 0)
        );
      },
      0
    );
  }, [cartItems]);

  // ====================================================
  // TOTAL PRICE
  // ====================================================

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (
        total,
        item
      ) => {
        // Backend cart item:
        //
        // {
        //   product: {
        //     price,
        //     discountPrice
        //   },
        //   quantity
        // }

        const product =
          item?.product ||
          item;

        const originalPrice =
          Number(
            product?.price ??
              item?.price ??
              0
          );

        const discountPrice =
          product?.discountPrice;

        const hasDiscount =
          discountPrice !== null &&
          discountPrice !== undefined &&
          !Number.isNaN(
            Number(discountPrice)
          ) &&
          Number(discountPrice) <
            originalPrice;

        const finalPrice =
          hasDiscount
            ? Number(discountPrice)
            : originalPrice;

        const quantity =
          Number(item?.quantity) || 0;

        return (
          total +
          finalPrice * quantity
        );
      },
      0
    );
  }, [cartItems]);

  // ====================================================
  // CONTEXT VALUE
  // ====================================================

  const value = useMemo(
    () => ({
      // Data
      cartItems,

      // Status
      loading,
      error,

      // Totals
      totalItems,
      totalPrice,

      // Actions
      addToCart,

      updateQuantity,
      increaseQuantity,
      decreaseQuantity,

      updateCartItemVariant,

      removeFromCart,
      clearCart,

      refreshCart,
    }),
    [
      cartItems,
      loading,
      error,
      totalItems,
      totalPrice,
      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      updateCartItemVariant,
      removeFromCart,
      clearCart,
      refreshCart,
    ]
  );

  // ====================================================
  // PROVIDER
  // ====================================================

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

// ======================================================
// USE CART HOOK
// ======================================================

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}