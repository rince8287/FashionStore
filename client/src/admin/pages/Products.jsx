import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiRotateCcw,
  FiEdit,
  FiEye,
  FiSearch,
} from "react-icons/fi";

import productService from "../services/productService";

// ======================================================
// ADMIN PRODUCTS
// ======================================================

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [totalProducts, setTotalProducts] = useState(0);

  const [error, setError] = useState("");

  // ======================================================
  // IMAGE
  // ======================================================

  const getImage = (product) => {
    const image = product?.images?.[0];

    if (!image) {
      return "";
    }

    if (typeof image === "string") {
      return image;
    }

    if (typeof image === "object") {
      return (
        image.url ||
        image.secure_url ||
        image.path ||
        ""
      );
    }

    return "";
  };

  // ======================================================
  // PRICE
  // ======================================================

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  // ======================================================
  // LOAD ADMIN PRODUCTS
  // ======================================================

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "20");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (status !== "all") {
        params.set("status", status);
      }

      const query = `?${params.toString()}`;

      console.log(
        "======================================"
      );

      console.log(
        "ADMIN PRODUCTS REQUEST"
      );

      console.log(
        "Endpoint:",
        `/products/admin/all${query}`
      );

      // IMPORTANT:
      // Ye ADMIN endpoint hai.
      // Public /products endpoint nahi.
      const response =
        await productService.getAdminProducts(
          query
        );

      console.log(
        "ADMIN PRODUCTS RESPONSE:",
        response
      );

      // ==================================================
      // EXTRACT PRODUCTS
      // ==================================================

      let productList = [];

      if (
        Array.isArray(response?.products)
      ) {
        productList = response.products;
      } else if (
        Array.isArray(
          response?.data?.products
        )
      ) {
        productList =
          response.data.products;
      } else if (
        Array.isArray(response?.data)
      ) {
        productList = response.data;
      } else if (
        Array.isArray(response)
      ) {
        productList = response;
      }

      setProducts(productList);

      // ==================================================
      // PAGINATION
      // ==================================================

      const paginationData =
        response?.pagination ||
        response?.data?.pagination ||
        {};

      setPagination({
        currentPage:
          Number(
            paginationData.currentPage
          ) || page,

        totalPages:
          Number(
            paginationData.totalPages
          ) || 1,

        hasNextPage:
          Boolean(
            paginationData.hasNextPage
          ),

        hasPrevPage:
          Boolean(
            paginationData.hasPrevPage
          ),
      });

      // ==================================================
      // TOTAL PRODUCTS
      // ==================================================

      const total =
        response?.totalProducts ??
        response?.data?.totalProducts ??
        response?.total ??
        response?.data?.total ??
        productList.length;

      setTotalProducts(
        Number(total) || 0
      );
    } catch (err) {
      console.error(
        "ADMIN PRODUCT LOAD ERROR:",
        err
      );

      setProducts([]);

      setError(
        err?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    status,
  ]);

  // ======================================================
  // LOAD ON PAGE / FILTER CHANGE
  // ======================================================

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (
    productId
  ) => {
    if (!productId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await productService.deleteProduct(
        productId
      );

      await loadProducts();
    } catch (err) {
      console.error(
        "DELETE PRODUCT ERROR:",
        err
      );

      alert(
        err?.message ||
          "Failed to delete product."
      );

      setLoading(false);
    }
  };

  // ======================================================
  // RESTORE
  // ======================================================

  const handleRestore = async (
    productId
  ) => {
    if (!productId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Restore this product?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await productService.restoreProduct(
        productId
      );

      await loadProducts();
    } catch (err) {
      console.error(
        "RESTORE PRODUCT ERROR:",
        err
      );

      alert(
        err?.message ||
          "Failed to restore product."
      );

      setLoading(false);
    }
  };

  // ======================================================
  // SEARCH
  // ======================================================

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);

    // useEffect will load the data
  };

  // ======================================================
  // CLEAR SEARCH
  // ======================================================

  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="space-y-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>

          <div
            className="
              mb-3
              text-sm
              text-text-muted
            "
          >
            Admin
            <span className="mx-2">
              /
            </span>
            Products
          </div>

          <h1
            className="
              text-3xl
              font-bold
              text-text-primary
            "
          >
            Products
          </h1>

          <p
            className="
              mt-3
              text-text-secondary
            "
          >
            Manage all products available
            in your FashionStore.
          </p>

        </div>

        <Link
          to="/admin/products/add"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-accent
            px-5
            py-3
            font-semibold
            text-brand-bg
            transition
            hover:bg-accent-hover
          "
        >
          <FiPlus size={18} />

          Add Product
        </Link>

      </div>

      {/* ==================================================
          SEARCH / FILTER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* SEARCH */}

        <form
          onSubmit={handleSearch}
          className="
            flex
            w-full
            max-w-xl
            items-center
            gap-3
            rounded-xl
            border
            border-border-subtle
            bg-brand-bg
            px-4
            py-3
          "
        >

          <FiSearch
            size={20}
            className="text-text-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );

              setPage(1);
            }}
            placeholder="Search products..."
            className="
              flex-1
              bg-transparent
              text-text-primary
              outline-none
              placeholder:text-text-muted
            "
          />

          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="
                text-sm
                text-text-muted
                hover:text-text-primary
              "
            >
              Clear
            </button>
          )}

          <button
            type="submit"
            className="
              rounded-lg
              bg-accent
              px-4
              py-2
              text-sm
              font-semibold
              text-brand-bg
              hover:bg-accent-hover
            "
          >
            Search
          </button>

        </form>

        {/* FILTER */}

        <div className="flex gap-3">

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value
              );

              setPage(1);
            }}
            className="
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-4
              py-3
              text-text-primary
              outline-none
              focus:border-accent
            "
          >
            <option value="all">
              All Products
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button
            type="button"
            onClick={loadProducts}
            disabled={loading}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-border-subtle
              bg-brand-bg
              px-5
              py-3
              text-text-primary
              hover:border-accent
              disabled:opacity-50
            "
          >
            <FiRefreshCw
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>

      </div>

      {/* ==================================================
          TOTAL
      ================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-border-subtle
          bg-surface
          p-6
        "
      >
        <p
          className="
            text-sm
            text-text-secondary
          "
        >
          Total Products
        </p>

        <p
          className="
            mt-2
            text-3xl
            font-bold
            text-text-primary
          "
        >
          {totalProducts}
        </p>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            p-5
            text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* ==================================================
          LOADING
      ================================================== */}

      {loading && (
        <div
          className="
            rounded-2xl
            border
            border-border-subtle
            bg-surface
            p-16
            text-center
          "
        >
          <FiRefreshCw
            size={32}
            className="
              mx-auto
              animate-spin
              text-accent
            "
          />

          <p
            className="
              mt-4
              text-text-secondary
            "
          >
            Loading products...
          </p>
        </div>
      )}

      {/* ==================================================
          EMPTY
      ================================================== */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div
            className="
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-16
              text-center
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                text-text-primary
              "
            >
              No Products Found
            </h2>

            <p
              className="
                mt-3
                text-text-secondary
              "
            >
              There are currently no
              products matching your
              search.
            </p>
          </div>
        )}

      {/* ==================================================
          TABLE
      ================================================== */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-border-subtle
              bg-surface
            "
          >

            <div
              className="
                border-b
                border-border-subtle
                p-6
              "
            >
              <h2
                className="
                  text-xl
                  font-bold
                  text-text-primary
                "
              >
                All Products
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-text-secondary
                "
              >
                {products.length}
                {" "}
                products on this page
              </p>
            </div>

            <div className="overflow-x-auto">

              <table
                className="
                  min-w-[1100px]
                  w-full
                "
              >

                <thead
                  className="
                    bg-brand-bg
                  "
                >
                  <tr>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Image
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Brand
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm text-text-secondary">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => {

                      const image =
                        getImage(
                          product
                        );

                      const stock =
                        Number(
                          product.stock ||
                            0
                        );

                      return (
                        <tr
                          key={
                            product._id
                          }
                          className="
                            border-t
                            border-border-subtle
                            hover:bg-brand-bg
                          "
                        >

                          {/* IMAGE */}

                          <td className="px-6 py-5">

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product.name ||
                                  "Product"
                                }
                                className="
                                  h-14
                                  w-14
                                  rounded-xl
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-14
                                  w-14
                                  items-center
                                  justify-center
                                  rounded-xl
                                  bg-brand-bg
                                  text-xs
                                  text-text-muted
                                "
                              >
                                No Image
                              </div>
                            )}

                          </td>

                          {/* PRODUCT */}

                          <td className="px-6 py-5">

                            <p
                              className="
                                font-semibold
                                text-text-primary
                              "
                            >
                              {product.name ||
                                "Unnamed Product"}
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-text-muted
                              "
                            >
                              {product.slug ||
                                ""}
                            </p>

                          </td>

                          {/* CATEGORY */}

                          <td
                            className="
                              px-6
                              py-5
                              text-text-secondary
                            "
                          >
                            {product.category?.name ||
                              product.category ||
                              "-"}
                          </td>

                          {/* BRAND */}

                          <td
                            className="
                              px-6
                              py-5
                              text-text-secondary
                            "
                          >
                            {product.brand ||
                              "-"}
                          </td>

                          {/* PRICE */}

                          <td className="px-6 py-5">

                            <span
                              className="
                                font-semibold
                                text-text-primary
                              "
                            >
                              {formatPrice(
                                product.salePrice ??
                                  product.price ??
                                  0
                              )}
                            </span>

                          </td>

                          {/* STOCK */}

                          <td className="px-6 py-5">

                            <span
                              className={
                                stock === 0
                                  ? "font-semibold text-red-400"
                                  : stock <= 5
                                  ? "font-semibold text-orange-400"
                                  : "font-semibold text-green-400"
                              }
                            >
                              {stock}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            <span
                              className={`
                                inline-flex
                                rounded-full
                                border
                                px-3
                                py-1
                                text-xs
                                font-semibold
                                ${
                                  product.isActive
                                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                                    : "border-red-500/30 bg-red-500/10 text-red-400"
                                }
                              `}
                            >
                              {product.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              {/* VIEW */}

                              <Link
                                to={`/product/${product._id}`}
                                className="
                                  rounded-lg
                                  bg-brand-bg
                                  p-2
                                  text-blue-400
                                  hover:bg-blue-500/10
                                "
                                title="View"
                              >
                                <FiEye
                                  size={17}
                                />
                              </Link>

                              {/* EDIT */}

                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="
                                  rounded-lg
                                  bg-brand-bg
                                  p-2
                                  text-yellow-400
                                  hover:bg-yellow-500/10
                                "
                                title="Edit"
                              >
                                <FiEdit
                                  size={17}
                                />
                              </Link>

                              {/* DELETE / RESTORE */}

                              {product.isActive ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDelete(
                                      product._id
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    bg-brand-bg
                                    p-2
                                    text-red-400
                                    hover:bg-red-500/10
                                  "
                                  title="Delete"
                                >
                                  <FiTrash2
                                    size={17}
                                  />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRestore(
                                      product._id
                                    )
                                  }
                                  className="
                                    rounded-lg
                                    bg-brand-bg
                                    p-2
                                    text-green-400
                                    hover:bg-green-500/10
                                  "
                                  title="Restore"
                                >
                                  <FiRotateCcw
                                    size={17}
                                  />
                                </button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* ==================================================
          PAGINATION
      ================================================== */}

      {!loading &&
        pagination.totalPages > 1 && (
          <div
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-border-subtle
              bg-surface
              p-5
            "
          >

            <button
              type="button"
              disabled={
                !pagination.hasPrevPage
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 1
                    )
                )
              }
              className="
                rounded-xl
                border
                border-border-subtle
                px-5
                py-3
                text-text-primary
                disabled:opacity-50
              "
            >
              Previous
            </button>

            <span
              className="
                text-sm
                text-text-secondary
              "
            >
              Page{" "}
              <b className="text-accent">
                {pagination.currentPage}
              </b>{" "}
              of{" "}
              <b className="text-accent">
                {pagination.totalPages}
              </b>
            </span>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage
              }
              onClick={() =>
                setPage(
                  (prev) =>
                    prev + 1
                )
              }
              className="
                rounded-xl
                border
                border-border-subtle
                px-5
                py-3
                text-text-primary
                disabled:opacity-50
              "
            >
              Next
            </button>

          </div>
        )}

    </div>
  );
}

export default Products;