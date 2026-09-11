// src/services/cartservice.js

import axios from "axios";

// ======================================================
// CART API
// ======================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/cart`
      : "http://localhost:5000/api/v1/cart",

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// GET AUTH TOKEN
// ======================================================

const getAuthConfig = () => {
  const token = localStorage.getItem(
    "fashionstore-token"
  );

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// GET CART
//
// GET /api/v1/cart
// ======================================================

export const getCart = async () => {
  const { data } = await API.get(
    "/",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// GET CART COUNT
//
// GET /api/v1/cart/count
// ======================================================

export const getCartCount = async () => {
  const { data } = await API.get(
    "/count",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// ADD PRODUCT TO CART
//
// POST /api/v1/cart
//
// cartData example:
//
// {
//   productId: "...",
//   quantity: 1,
//   size: "M",
//   color: "Black"
// }
// ======================================================

export const addToCart = async (
  cartData
) => {
  const { data } = await API.post(
    "/",
    cartData,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// UPDATE CART ITEM QUANTITY
//
// PUT /api/v1/cart/:itemId
//
// Example:
// updateCartItem(itemId, 3)
// ======================================================

export const updateCartItem = async (
  itemId,
  quantity
) => {
  const { data } = await API.put(
    `/${itemId}`,
    {
      quantity,
    },
    getAuthConfig()
  );

  return data;
};

// ======================================================
// UPDATE CART ITEM VARIANT
//
// PATCH /api/v1/cart/:itemId/variant
//
// variantData example:
//
// {
//   size: "XL",
//   color: "Black"
// }
// ======================================================

export const updateCartItemVariant =
  async (
    itemId,
    variantData
  ) => {
    const { data } = await API.patch(
      `/${itemId}/variant`,
      variantData,
      getAuthConfig()
    );

    return data;
  };

// ======================================================
// REMOVE SINGLE CART ITEM
//
// DELETE /api/v1/cart/:itemId
// ======================================================

export const removeCartItem = async (
  itemId
) => {
  const { data } = await API.delete(
    `/${itemId}`,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// CLEAR COMPLETE CART
//
// DELETE /api/v1/cart
// ======================================================

export const clearCart = async () => {
  const { data } = await API.delete(
    "/",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const cartService = {
  getCart,
  getCartCount,
  addToCart,
  updateCartItem,
  updateCartItemVariant,
  removeCartItem,
  clearCart,
};

export default cartService;