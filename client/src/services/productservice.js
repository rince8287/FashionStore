import axios from "axios";

// ====================================================
// PRODUCT API
// ====================================================

const PRODUCT_API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL}/products`
      : "http://localhost:5000/api/v1/products",

  timeout: 30000,

  headers: {
    Accept: "application/json",
  },
});

// ====================================================
// REQUEST INTERCEPTOR
// ====================================================

PRODUCT_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "fashionstore-token"
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // IMPORTANT:
    // FormData ke case me browser ko
    // Content-Type automatically set karne do.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ====================================================
// RESPONSE INTERCEPTOR
// ====================================================

PRODUCT_API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    const status =
      error?.response?.status;

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong.";

    console.error(
      "Product API Error:",
      {
        status,
        message,
        data: error?.response?.data,
      }
    );

    return Promise.reject(error);
  }
);

// ====================================================
// GET ALL PRODUCTS
// ====================================================

export const getProducts = async (
  params = {}
) => {
  const { data } =
    await PRODUCT_API.get("/", {
      params,
    });

  return data;
};

// ====================================================
// GET FEATURED PRODUCTS
// ====================================================

export const getFeaturedProducts =
  async () => {
    const { data } =
      await PRODUCT_API.get(
        "/featured"
      );

    return data;
  };

// ====================================================
// GET TRENDING PRODUCTS
// ====================================================

export const getTrendingProducts =
  async () => {
    const { data } =
      await PRODUCT_API.get(
        "/trending"
      );

    return data;
  };

// ====================================================
// GET NEW ARRIVALS
// ====================================================

export const getNewArrivals =
  async () => {
    const { data } =
      await PRODUCT_API.get(
        "/new-arrivals"
      );

    return data;
  };

// ====================================================
// GET PRODUCT BY SLUG
// ====================================================

export const getProductBySlug =
  async (slug) => {
    if (!slug) {
      throw new Error(
        "Product slug is required."
      );
    }

    const { data } =
      await PRODUCT_API.get(
        `/slug/${encodeURIComponent(slug)}`
      );

    return data;
  };

// ====================================================
// GET PRODUCT BY ID
// ====================================================

export const getProductById =
  async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const { data } =
      await PRODUCT_API.get(
        `/${id}`
      );

    return data;
  };

// ====================================================
// GET RELATED PRODUCTS
// ====================================================

export const getRelatedProducts =
  async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const { data } =
      await PRODUCT_API.get(
        `/${id}/related`
      );

    return data;
  };

// ====================================================
// ADMIN - GET ALL PRODUCTS
// ====================================================

export const getAdminProducts =
  async (params = {}) => {
    const { data } =
      await PRODUCT_API.get(
        "/admin/all",
        {
          params,
        }
      );

    return data;
  };

// ====================================================
// CREATE PRODUCT
// ====================================================

export const createProduct =
  async (productData) => {
    if (!productData) {
      throw new Error(
        "Product data is required."
      );
    }

    const { data } =
      await PRODUCT_API.post(
        "/",
        productData
      );

    return data;
  };

// ====================================================
// UPDATE PRODUCT
// ====================================================

export const updateProduct =
  async (
    id,
    productData
  ) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    if (!productData) {
      throw new Error(
        "Product data is required."
      );
    }

    const { data } =
      await PRODUCT_API.put(
        `/${id}`,
        productData
      );

    return data;
  };

// ====================================================
// DELETE PRODUCT
// ====================================================

export const deleteProduct =
  async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const { data } =
      await PRODUCT_API.delete(
        `/${id}`
      );

    return data;
  };

// ====================================================
// RESTORE PRODUCT
// ====================================================

export const restoreProduct =
  async (id) => {
    if (!id) {
      throw new Error(
        "Product ID is required."
      );
    }

    const { data } =
      await PRODUCT_API.patch(
        `/${id}/restore`
      );

    return data;
  };

// ====================================================
// SEARCH PRODUCTS
// ====================================================

export const searchProducts =
  async (
    search,
    extraParams = {}
  ) => {
    const params = {
      ...extraParams,
    };

    if (search?.trim()) {
      params.search =
        search.trim();
    }

    return getProducts(params);
  };

// ====================================================
// PRODUCTS BY GENDER
// ====================================================

export const getProductsByGender =
  async (
    gender,
    extraParams = {}
  ) => {
    if (!gender) {
      throw new Error(
        "Gender is required."
      );
    }

    return getProducts({
      ...extraParams,
      gender,
    });
  };

// ====================================================
// PRODUCTS BY PRICE RANGE
// ====================================================

export const getProductsByPriceRange =
  async (
    minPrice,
    maxPrice,
    extraParams = {}
  ) => {
    const params = {
      ...extraParams,
    };

    if (
      minPrice !== undefined &&
      minPrice !== null &&
      minPrice !== ""
    ) {
      params.minPrice =
        minPrice;
    }

    if (
      maxPrice !== undefined &&
      maxPrice !== null &&
      maxPrice !== ""
    ) {
      params.maxPrice =
        maxPrice;
    }

    return getProducts(params);
  };

// ====================================================
// DEFAULT EXPORT
// ====================================================

const productService = {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getProductBySlug,
  getProductById,
  getRelatedProducts,

  searchProducts,
  getProductsByGender,
  getProductsByPriceRange,

  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
};

export default productService;