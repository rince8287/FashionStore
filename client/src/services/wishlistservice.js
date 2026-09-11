import axios from "axios";

// ======================================================
// WISHLIST API
// ======================================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/wishlist`
      : "http://localhost:5000/api/v1/wishlist",

  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// HELPER — GET AUTH TOKEN
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
// GET COMPLETE WISHLIST
//
// GET /api/v1/wishlist
// ======================================================

export const getWishlist = async () => {
  const { data } = await API.get(
    "/",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// GET WISHLIST COUNT
//
// GET /api/v1/wishlist/count
// ======================================================

export const getWishlistCount = async () => {
  const { data } = await API.get(
    "/count",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// CHECK PRODUCT IN WISHLIST
//
// GET /api/v1/wishlist/check/:productId
// ======================================================

export const checkWishlist = async (
  productId
) => {
  const { data } = await API.get(
    `/check/${productId}`,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// ADD PRODUCT TO WISHLIST
//
// POST /api/v1/wishlist/:productId
// ======================================================

export const addToWishlist = async (
  productId
) => {
  const { data } = await API.post(
    `/${productId}`,
    {},
    getAuthConfig()
  );

  return data;
};

// ======================================================
// TOGGLE WISHLIST
//
// POST /api/v1/wishlist/:productId/toggle
// ======================================================

export const toggleWishlist = async (
  productId
) => {
  const { data } = await API.post(
    `/${productId}/toggle`,
    {},
    getAuthConfig()
  );

  return data;
};

// ======================================================
// MOVE PRODUCT TO CART
//
// POST /api/v1/wishlist/:productId/move-to-cart
//
// Body:
// {
//   quantity,
//   size,
//   color
// }
// ======================================================

export const moveToCart = async (
  productId,
  cartData = {}
) => {
  const { data } = await API.post(
    `/${productId}/move-to-cart`,
    cartData,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// REMOVE PRODUCT FROM WISHLIST
//
// DELETE /api/v1/wishlist/:productId
// ======================================================

export const removeFromWishlist = async (
  productId
) => {
  const { data } = await API.delete(
    `/${productId}`,
    getAuthConfig()
  );

  return data;
};

// ======================================================
// CLEAR COMPLETE WISHLIST
//
// DELETE /api/v1/wishlist
// ======================================================

export const clearWishlist = async () => {
  const { data } = await API.delete(
    "/",
    getAuthConfig()
  );

  return data;
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

const wishlistService = {
  getWishlist,
  getWishlistCount,
  checkWishlist,
  addToWishlist,
  toggleWishlist,
  moveToCart,
  removeFromWishlist,
  clearWishlist,
};

export default wishlistService;