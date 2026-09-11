// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

// ======================================================
// GET AUTH TOKEN
// ======================================================

const getToken = () => {
  return localStorage.getItem(
    "fashionstore-token"
  );
};

// ======================================================
// REQUEST HELPER
// ======================================================

const request = async (
  endpoint,
  options = {}
) => {
  const token = getToken();

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        }),

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),

    ...(options.headers || {}),
  };

  let response;

  // ====================================================
  // REQUEST
  // ====================================================

  try {
    response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    console.error(
      "Network Error:",
      error
    );

    throw new Error(
      "Unable to connect to server. Please check your backend server."
    );
  }

  // ====================================================
  // RESPONSE
  // ====================================================

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (!response.ok) {
    console.error(
      `API Error [${response.status}] ${endpoint}:`,
      data
    );

    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
};

// ======================================================
// PRODUCT SERVICE
// ======================================================

const productService = {

  // ====================================================
  // ADMIN - GET ALL PRODUCTS
  // ====================================================

  async getAdminProducts(
    query = ""
  ) {
    return request(
      `/products/admin/all${query}`
    );
  },

  // ====================================================
  // GET ALL PRODUCTS
  // ====================================================

  async getProducts(
    query = ""
  ) {
    return request(
      `/products${query}`
    );
  },

  // ====================================================
  // GET SINGLE PRODUCT
  // ====================================================

  async getProductById(
    productId
  ) {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    return request(
      `/products/${productId}`
    );
  },

  // ====================================================
  // CREATE PRODUCT
  // ====================================================

  async createProduct(
    productData
  ) {
    if (!productData) {
      throw new Error(
        "Product data is required."
      );
    }

    return request(
      "/products",
      {
        method: "POST",

        body:
          productData instanceof FormData
            ? productData
            : JSON.stringify(
                productData
              ),
      }
    );
  },

  // ====================================================
  // UPDATE PRODUCT
  // ====================================================

  async updateProduct(
    productId,
    productData
  ) {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    if (!productData) {
      throw new Error(
        "Product data is required."
      );
    }

    return request(
      `/products/${productId}`,
      {
        method: "PUT",

        body:
          productData instanceof FormData
            ? productData
            : JSON.stringify(
                productData
              ),
      }
    );
  },

  // ====================================================
  // DELETE PRODUCT
  // ====================================================

  async deleteProduct(
    productId
  ) {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    return request(
      `/products/${productId}`,
      {
        method: "DELETE",
      }
    );
  },

  // ====================================================
  // RESTORE PRODUCT
  // ====================================================

  async restoreProduct(
    productId
  ) {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    return request(
      `/products/${productId}/restore`,
      {
        method: "PATCH",
      }
    );
  },

  // ====================================================
  // FEATURED PRODUCTS
  // ====================================================

  async getFeaturedProducts() {
    return request(
      "/products/featured"
    );
  },

  // ====================================================
  // TRENDING PRODUCTS
  // ====================================================

  async getTrendingProducts() {
    return request(
      "/products/trending"
    );
  },

  // ====================================================
  // NEW ARRIVALS
  // ====================================================

  async getNewArrivals() {
    return request(
      "/products/new-arrivals"
    );
  },

  // ====================================================
  // RELATED PRODUCTS
  // ====================================================

  async getRelatedProducts(
    productId
  ) {
    if (!productId) {
      throw new Error(
        "Product ID is required."
      );
    }

    return request(
      `/products/${productId}/related`
    );
  },
};

// ======================================================
// EXPORT
// ======================================================

export default productService;