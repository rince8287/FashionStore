import axios from "axios";

// ====================================================
// CATEGORY API
// ====================================================

// Vite environment variable
// Local:  http://localhost:5000/api/v1
// Vercel: https://fashionstore-g2az.onrender.com/api/v1
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

const CATEGORY_API = axios.create({
  baseURL: `${API_URL}/categories`,

  headers: {
    "Content-Type": "application/json",
  },
});

// ====================================================
// REQUEST INTERCEPTOR
// Auth token automatically attach karega
// Public routes par token na ho tab bhi request chalegi
// ====================================================

CATEGORY_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "fashionstore-token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ====================================================
// GET ALL CATEGORIES
// GET /api/v1/categories
// PUBLIC
// ====================================================

export const getCategories = async () => {
  const { data } = await CATEGORY_API.get("/");

  return data;
};

// ====================================================
// GET CATEGORY TREE
// GET /api/v1/categories/tree
// PUBLIC
// ====================================================

export const getCategoryTree = async () => {
  const { data } =
    await CATEGORY_API.get("/tree");

  return data;
};

// ====================================================
// GET CATEGORY BY SLUG
// GET /api/v1/categories/slug/:slug
// PUBLIC
// ====================================================

export const getCategoryBySlug = async (
  slug
) => {
  if (!slug) {
    throw new Error(
      "Category slug is required."
    );
  }

  const { data } =
    await CATEGORY_API.get(
      `/slug/${encodeURIComponent(slug)}`
    );

  return data;
};

// ====================================================
// GET SUBCATEGORIES
// GET /api/v1/categories/:id/subcategories
// PUBLIC
// ====================================================

export const getSubcategories = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Category ID is required."
    );
  }

  const { data } =
    await CATEGORY_API.get(
      `/${id}/subcategories`
    );

  return data;
};

// ====================================================
// GET CATEGORY BY ID
// GET /api/v1/categories/:id
// PUBLIC
// ====================================================

export const getCategoryById = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Category ID is required."
    );
  }

  const { data } =
    await CATEGORY_API.get(`/${id}`);

  return data;
};

// ====================================================
// CREATE CATEGORY
// POST /api/v1/categories
// ADMIN ONLY
// ====================================================

export const createCategory = async (
  categoryData
) => {
  if (!categoryData) {
    throw new Error(
      "Category data is required."
    );
  }

  const { data } =
    await CATEGORY_API.post(
      "/",
      categoryData
    );

  return data;
};

// ====================================================
// UPDATE CATEGORY
// PUT /api/v1/categories/:id
// ADMIN ONLY
// ====================================================

export const updateCategory = async (
  id,
  categoryData
) => {
  if (!id) {
    throw new Error(
      "Category ID is required."
    );
  }

  if (!categoryData) {
    throw new Error(
      "Category data is required."
    );
  }

  const { data } =
    await CATEGORY_API.put(
      `/${id}`,
      categoryData
    );

  return data;
};

// ====================================================
// DELETE CATEGORY
// DELETE /api/v1/categories/:id
// ADMIN ONLY
// ====================================================

export const deleteCategory = async (
  id
) => {
  if (!id) {
    throw new Error(
      "Category ID is required."
    );
  }

  const { data } =
    await CATEGORY_API.delete(
      `/${id}`
    );

  return data;
};

// ====================================================
// DEFAULT EXPORT
// ====================================================

const categoryService = {
  getCategories,
  getCategoryTree,
  getCategoryBySlug,
  getSubcategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;